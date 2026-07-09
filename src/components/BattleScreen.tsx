import { useEffect, useRef, useState } from 'react';
import { chooseAiOrders } from '../engine/ai';
import { getServantDef } from '../data/servants';
import type { BattleState, ServantOrder, TeamOrders } from '../types';
import { ActionPanel } from './ActionPanel';
import { BattleLog } from './BattleLog';
import { ServantPanel } from './ServantPanel';

interface Props {
  battle: BattleState;
  onResolveRound: (p1Orders: TeamOrders, p2Orders: TeamOrders) => void;
}

type RoundPhase =
  | { step: 'handoff'; forIndex: 0 | 1 }
  | { step: 'picking'; forIndex: 0 | 1 }
  | { step: 'reveal-ready' };

function emptyOrders(battle: BattleState): [TeamOrders, TeamOrders] {
  return [battle.players[0].servants.map(() => null), battle.players[1].servants.map(() => null)];
}

/** The first living Servant slot on this team that still needs an order. */
function nextSlot(battle: BattleState, teamIndex: 0 | 1, orders: TeamOrders): number {
  return battle.players[teamIndex].servants.findIndex((s, i) => s.hp > 0 && orders[i] === null);
}

function teamDone(battle: BattleState, teamIndex: 0 | 1, orders: TeamOrders): boolean {
  return nextSlot(battle, teamIndex, orders) === -1;
}

export function BattleScreen({ battle, onResolveRound }: Props) {
  const isVsAi = battle.players[1].kind === 'ai';
  const [phase, setPhase] = useState<RoundPhase>(
    isVsAi ? { step: 'picking', forIndex: 0 } : { step: 'handoff', forIndex: 0 },
  );
  const [pendingOrders, setPendingOrders] = useState<[TeamOrders, TeamOrders]>(() => emptyOrders(battle));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Every new round starts fresh: Player 1 picks first (hidden from Player 2 in hot-seat).
  useEffect(() => {
    setPendingOrders(emptyOrders(battle));
    setPhase(isVsAi ? { step: 'picking', forIndex: 0 } : { step: 'handoff', forIndex: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle.round, isVsAi]);

  useEffect(() => {
    if (battle.phase === 'gameover') return;
    if (!isVsAi) return;
    if (!teamDone(battle, 0, pendingOrders[0])) return;

    timeoutRef.current = setTimeout(() => {
      const aiOrders = chooseAiOrders(battle, 1);
      onResolveRound(pendingOrders[0], aiOrders);
    }, 900);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pendingOrders, isVsAi, battle, onResolveRound]);

  const handleOrder = (teamIndex: 0 | 1, slot: number, order: ServantOrder) => {
    const nextOrders: [TeamOrders, TeamOrders] = [
      [...pendingOrders[0]],
      [...pendingOrders[1]],
    ];
    nextOrders[teamIndex][slot] = order;
    setPendingOrders(nextOrders);

    if (!teamDone(battle, teamIndex, nextOrders[teamIndex])) return; // same team keeps picking

    if (isVsAi) return; // resolution handled by the effect above once AI responds

    if (teamIndex === 0) {
      setPhase({ step: 'handoff', forIndex: 1 });
    } else {
      setPhase({ step: 'reveal-ready' });
    }
  };

  const handleReveal = () => {
    if (!teamDone(battle, 0, pendingOrders[0]) || !teamDone(battle, 1, pendingOrders[1])) return;
    onResolveRound(pendingOrders[0], pendingOrders[1]);
  };

  const pickingIndex = phase.step === 'picking' ? phase.forIndex : null;
  const pickingSlot = pickingIndex !== null ? nextSlot(battle, pickingIndex, pendingOrders[pickingIndex]) : -1;

  const bannerText = () => {
    if (isVsAi) {
      return teamDone(battle, 0, pendingOrders[0])
        ? `Round ${battle.round} — ${battle.players[1].master.name} is thinking...`
        : `Round ${battle.round} — ${battle.players[0].master.name}'s turn`;
    }
    if (phase.step === 'handoff') return `Round ${battle.round} — pass the device to ${battle.players[phase.forIndex].master.name}`;
    if (phase.step === 'picking') return `Round ${battle.round} — ${battle.players[phase.forIndex].master.name}'s turn`;
    return `Round ${battle.round} — both Masters have committed`;
  };

  return (
    <div className="battle-screen">
      <div className="battle-turn-banner">{bannerText()}</div>
      <div className="battle-panels">
        <div className="team-column">
          {battle.players[0].servants.map((servant, slot) => (
            <ServantPanel
              key={slot}
              master={battle.players[0].master}
              servant={servant}
              isActive={pickingIndex === 0 && pickingSlot === slot}
              side="left"
              showCommandSpells={slot === 0}
            />
          ))}
        </div>
        <div className="vs-divider">VS</div>
        <div className="team-column">
          {battle.players[1].servants.map((servant, slot) => (
            <ServantPanel
              key={slot}
              master={battle.players[1].master}
              servant={servant}
              isActive={pickingIndex === 1 && pickingSlot === slot}
              side="right"
              showCommandSpells={slot === 0}
            />
          ))}
        </div>
      </div>
      <BattleLog log={battle.log} />

      {!isVsAi && phase.step === 'handoff' && (
        <div className="handoff-screen">
          <p className="handoff-title">Pass the device to</p>
          <p className="handoff-name">{battle.players[phase.forIndex].master.name}</p>
          <p className="handoff-hint">Your opponent's moves stay hidden until both are locked in.</p>
          <button className="primary-btn" onClick={() => setPhase({ step: 'picking', forIndex: phase.forIndex })}>
            I'm Ready
          </button>
        </div>
      )}

      {!isVsAi && phase.step === 'reveal-ready' && (
        <div className="handoff-screen">
          <p className="handoff-title">Both Masters have chosen their moves.</p>
          <button className="primary-btn" onClick={handleReveal}>
            Reveal Results
          </button>
        </div>
      )}

      {phase.step === 'picking' && pickingSlot >= 0 && (
        <ActionPanel
          key={`${battle.round}-${phase.forIndex}-${pickingSlot}`}
          player={battle.players[phase.forIndex]}
          servant={battle.players[phase.forIndex].servants[pickingSlot]}
          enemyServants={battle.players[1 - phase.forIndex].servants}
          commandSpellPlanned={pendingOrders[phase.forIndex].some(
            (o) => o !== null && o.action.type === 'commandSpell',
          )}
          disabled={battle.phase === 'gameover' || (isVsAi && teamDone(battle, 0, pendingOrders[0]))}
          onOrder={(order) => handleOrder(phase.forIndex, pickingSlot, order)}
        />
      )}
      {phase.step === 'picking' && pickingSlot > 0 && (
        <p className="order-progress-hint">
          {getServantDef(battle.players[phase.forIndex].servants[0].defId).name}'s order is locked in.
        </p>
      )}
    </div>
  );
}
