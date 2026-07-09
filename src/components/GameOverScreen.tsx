import { getServantDef } from '../data/servants';
import type { BattleState, PlayerState } from '../types';
import { BattleLog } from './BattleLog';

interface Props {
  battle: BattleState;
  onRematch: () => void;
  onMainMenu: () => void;
}

function teamNames(player: PlayerState): string {
  return player.servants.map((s) => getServantDef(s.defId).name).join(' & ');
}

function teamHpSummary(player: PlayerState): string {
  return player.servants
    .map((s) => `${getServantDef(s.defId).name}: ${s.hp} / ${s.maxHp}`)
    .join(' · ');
}

function teamTotalHp(player: PlayerState): number {
  return player.servants.reduce((sum, s) => sum + s.hp, 0);
}

export function GameOverScreen({ battle, onRematch, onMainMenu }: Props) {
  const [p1, p2] = battle.players;

  if (battle.winReason === 'draw') {
    return (
      <div className="gameover-screen">
        <h1>A Draw!</h1>
        <p className="gameover-summary">
          {teamNames(p1)} ({p1.master.name}) and {teamNames(p2)} ({p2.master.name}) fell in the same round,
          taking the exact same total blow ({teamTotalHp(p1)} HP each side) after {battle.round} rounds. The
          Grail declares no victor.
        </p>
        <div className="gameover-actions">
          <button className="primary-btn" onClick={onRematch}>
            Rematch
          </button>
          <button className="secondary-btn" onClick={onMainMenu}>
            Main Menu
          </button>
        </div>
        <div className="gameover-history">
          <h2>Full Match History</h2>
          <BattleLog log={battle.log} autoScroll={false} />
        </div>
      </div>
    );
  }

  const winner = battle.players.find((p) => p.id === battle.winner)!;
  const loser = battle.players.find((p) => p.id !== battle.winner)!;

  return (
    <div className="gameover-screen">
      <h1>Victory for {winner.master.name}!</h1>
      <p className="gameover-summary">
        {teamNames(winner)} {winner.servants.length === 1 ? 'has' : 'have'} defeated {teamNames(loser)} after{' '}
        {battle.round} rounds.
      </p>
      <p className="gameover-hp-summary">
        Final HP — {teamHpSummary(winner)} &nbsp;·&nbsp; {teamHpSummary(loser)}
      </p>
      {battle.winReason === 'overkillTiebreak' && (
        <p className="gameover-tiebreak">
          Both sides fell in the same round — {winner.master.name}'s team took the lesser total blow (
          {teamTotalHp(winner)} HP vs {teamTotalHp(loser)} HP) and outlasted their rivals for the Grail's favor.
        </p>
      )}
      <div className="gameover-actions">
        <button className="primary-btn" onClick={onRematch}>
          Rematch
        </button>
        <button className="secondary-btn" onClick={onMainMenu}>
          Main Menu
        </button>
      </div>
      <div className="gameover-history">
        <h2>Full Match History</h2>
        <BattleLog log={battle.log} autoScroll={false} />
      </div>
    </div>
  );
}
