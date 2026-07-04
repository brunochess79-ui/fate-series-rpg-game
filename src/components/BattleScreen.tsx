import { useEffect, useRef, useState } from 'react';
import { chooseAiAction } from '../engine/ai';
import type { BattleAction, BattleState } from '../types';
import { ActionPanel } from './ActionPanel';
import { BattleLog } from './BattleLog';
import { ServantPanel } from './ServantPanel';

interface Props {
  battle: BattleState;
  onResolveRound: (p1Action: BattleAction, p2Action: BattleAction) => void;
}

type RoundPhase =
  | { step: 'handoff'; forIndex: 0 | 1 }
  | { step: 'picking'; forIndex: 0 | 1 }
  | { step: 'reveal-ready' };

export function BattleScreen({ battle, onResolveRound }: Props) {
  const isVsAi = battle.players[1].kind === 'ai';
  const [phase, setPhase] = useState<RoundPhase>(
    isVsAi ? { step: 'picking', forIndex: 0 } : { step: 'handoff', forIndex: 0 },
  );
  const [pendingActions, setPendingActions] = useState<[BattleAction | null, BattleAction | null]>([null, null]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Every new round starts fresh: Player 1 picks first (hidden from Player 2 in hot-seat).
  useEffect(() => {
    setPendingActions([null, null]);
    setPhase(isVsAi ? { step: 'picking', forIndex: 0 } : { step: 'handoff', forIndex: 0 });
  }, [battle.round, isVsAi]);

  useEffect(() => {
    if (battle.phase === 'gameover') return;
    if (!isVsAi) return;
    if (phase.step !== 'picking' || phase.forIndex !== 0) return;
    if (pendingActions[0] === null) return;

    timeoutRef.current = setTimeout(() => {
      const aiAction = chooseAiAction(battle, 1);
      onResolveRound(pendingActions[0]!, aiAction);
    }, 900);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pendingActions, isVsAi, phase, battle, onResolveRound]);

  const handlePick = (index: 0 | 1, action: BattleAction) => {
    const next: [BattleAction | null, BattleAction | null] = [...pendingActions];
    next[index] = action;
    setPendingActions(next);

    if (isVsAi) return; // resolution handled by the effect above once AI responds

    if (index === 0) {
      setPhase({ step: 'handoff', forIndex: 1 });
    } else {
      setPhase({ step: 'reveal-ready' });
    }
  };

  const handleReveal = () => {
    if (!pendingActions[0] || !pendingActions[1]) return;
    onResolveRound(pendingActions[0], pendingActions[1]);
  };

  const bannerText = () => {
    if (isVsAi) {
      return pendingActions[0] ? `Round ${battle.round} — ${battle.players[1].master.name} is thinking...` : `Round ${battle.round} — ${battle.players[0].master.name}'s turn`;
    }
    if (phase.step === 'handoff') return `Round ${battle.round} — pass the device to ${battle.players[phase.forIndex].master.name}`;
    if (phase.step === 'picking') return `Round ${battle.round} — ${battle.players[phase.forIndex].master.name}'s turn`;
    return `Round ${battle.round} — both Masters have committed`;
  };

  const activeIndex = phase.step === 'reveal-ready' ? null : phase.forIndex;

  return (
    <div className="battle-screen">
      <div className="battle-turn-banner">{bannerText()}</div>
      <div className="battle-panels">
        <ServantPanel master={battle.players[0].master} servant={battle.players[0].servant} isActive={activeIndex === 0} side="left" />
        <div className="vs-divider">VS</div>
        <ServantPanel master={battle.players[1].master} servant={battle.players[1].servant} isActive={activeIndex === 1} side="right" />
      </div>
      <BattleLog log={battle.log} />

      {!isVsAi && phase.step === 'handoff' && (
        <div className="handoff-screen">
          <p className="handoff-title">Pass the device to</p>
          <p className="handoff-name">{battle.players[phase.forIndex].master.name}</p>
          <p className="handoff-hint">Your opponent's move stays hidden until both are locked in.</p>
          <button className="primary-btn" onClick={() => setPhase({ step: 'picking', forIndex: phase.forIndex })}>
            I'm Ready
          </button>
        </div>
      )}

      {!isVsAi && phase.step === 'reveal-ready' && (
        <div className="handoff-screen">
          <p className="handoff-title">Both Masters have chosen their move.</p>
          <button className="primary-btn" onClick={handleReveal}>
            Reveal Results
          </button>
        </div>
      )}

      {phase.step === 'picking' && (
        <ActionPanel
          player={battle.players[phase.forIndex]}
          disabled={battle.phase === 'gameover' || pendingActions[phase.forIndex] !== null}
          onAction={(action) => handlePick(phase.forIndex, action)}
        />
      )}
    </div>
  );
}
