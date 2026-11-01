import { getServantDef } from '../data/servants';
import type { CoachRound } from '../engine/coach';
import { lineTips } from '../engine/coach';
import type { BattleState, PlayerState } from '../types';
import { BattleLog } from './BattleLog';

interface Props {
  battle: BattleState;
  training?: boolean;
  coachRounds?: CoachRound[];
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

function TrainingSummary({ battle, rounds }: { battle: BattleState; rounds: CoachRound[] }) {
  const defId = battle.players[0].servants[0].defId;
  const matched = rounds.filter((r) => r.matched).length;
  const misses = rounds.filter((r) => !r.matched);
  const pct = rounds.length ? Math.round((matched / rounds.length) * 100) : 0;
  return (
    <div className="training-summary">
      <h2>Training Summary</h2>
      <p className="training-score">
        You matched the best line in <strong>{matched}</strong> of <strong>{rounds.length}</strong> rounds ({pct}%).
      </p>
      {misses.length > 0 && (
        <>
          <h3>Where you differed</h3>
          <ul>
            {misses.slice(0, 8).map((r) => (
              <li key={r.round}>
                Round {r.round}: you chose {r.chosen}; the best line was {r.advised} — {r.reason}
              </li>
            ))}
          </ul>
          {misses.length > 8 && <p>…and {misses.length - 8} more.</p>}
        </>
      )}
      <h3>The line to remember</h3>
      <ul>
        {lineTips(defId).map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export function GameOverScreen({ battle, training = false, coachRounds = [], onRematch, onMainMenu }: Props) {
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
        {training && <TrainingSummary battle={battle} rounds={coachRounds} />}
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
      {training && <TrainingSummary battle={battle} rounds={coachRounds} />}
      <div className="gameover-history">
        <h2>Full Match History</h2>
        <BattleLog log={battle.log} autoScroll={false} />
      </div>
    </div>
  );
}
