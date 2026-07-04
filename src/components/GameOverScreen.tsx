import { getServantDef } from '../data/servants';
import type { BattleState } from '../types';
import { BattleLog } from './BattleLog';

interface Props {
  battle: BattleState;
  onRematch: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({ battle, onRematch, onMainMenu }: Props) {
  const winner = battle.players.find((p) => p.id === battle.winner)!;
  const loser = battle.players.find((p) => p.id !== battle.winner)!;
  const winnerDef = getServantDef(winner.servant.defId);
  const loserDef = getServantDef(loser.servant.defId);

  return (
    <div className="gameover-screen">
      <h1>Victory for {winner.master.name}!</h1>
      <p className="gameover-summary">
        {winnerDef.name} ({winnerDef.title}) has defeated {loserDef.name} ({loserDef.title}) after{' '}
        {battle.round} rounds.
      </p>
      {battle.winReason === 'overkillTiebreak' && (
        <p className="gameover-tiebreak">
          Both Servants fell in the same round — {winnerDef.name} took the lesser blow ({winner.servant.hp} HP vs{' '}
          {loser.servant.hp} HP) and outlasted {loserDef.name} for the Grail's favor.
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
