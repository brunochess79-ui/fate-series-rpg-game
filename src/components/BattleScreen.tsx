import { useEffect, useRef } from 'react';
import { chooseAiAction } from '../engine/ai';
import type { BattleAction, BattleState } from '../types';
import { ActionPanel } from './ActionPanel';
import { BattleLog } from './BattleLog';
import { ServantPanel } from './ServantPanel';

interface Props {
  battle: BattleState;
  onAction: (action: BattleAction) => void;
}

export function BattleScreen({ battle, onAction }: Props) {
  const activePlayer = battle.players[battle.activePlayerIndex];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (battle.phase === 'gameover') return;
    if (activePlayer.kind !== 'ai') return;

    timeoutRef.current = setTimeout(() => {
      const action = chooseAiAction(battle);
      onAction(action);
    }, 900);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [battle, activePlayer.kind, onAction]);

  return (
    <div className="battle-screen">
      <div className="battle-turn-banner">
        Round {battle.round} — {activePlayer.master.name}'s turn
        {activePlayer.kind === 'ai' ? ' (thinking...)' : ''}
      </div>
      <div className="battle-panels">
        <ServantPanel
          master={battle.players[0].master}
          servant={battle.players[0].servant}
          isActive={battle.activePlayerIndex === 0}
          side="left"
        />
        <div className="vs-divider">VS</div>
        <ServantPanel
          master={battle.players[1].master}
          servant={battle.players[1].servant}
          isActive={battle.activePlayerIndex === 1}
          side="right"
        />
      </div>
      <BattleLog log={battle.log} />
      <ActionPanel
        player={activePlayer}
        disabled={activePlayer.kind === 'ai' || battle.phase === 'gameover'}
        onAction={onAction}
      />
    </div>
  );
}
