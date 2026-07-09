import type { GameMode, TeamSize } from '../game';

interface Props {
  onSelectMode: (mode: GameMode, teamSize: TeamSize) => void;
}

export function MainMenu({ onSelectMode }: Props) {
  return (
    <div className="main-menu">
      <h1 className="game-title">Holy Grail War</h1>
      <p className="game-subtitle">A Fate-inspired turn-based Servant battle</p>
      <div className="menu-buttons">
        <button className="primary-btn" onClick={() => onSelectMode('hotseat', 1)}>
          Local Battle (2 Players)
        </button>
        <button className="primary-btn" onClick={() => onSelectMode('ai', 1)}>
          Battle a Rival Master (vs AI)
        </button>
        <button className="primary-btn" onClick={() => onSelectMode('hotseat', 2)}>
          2v2 Team Battle (2 Players)
        </button>
        <button className="primary-btn" onClick={() => onSelectMode('ai', 2)}>
          2v2 Team Battle (vs AI)
        </button>
      </div>
      <p className="menu-hint">
        Choose a Master and Servant, then fight in a battle of Attacks, Skills, and Noble
        Phantasms. In a 2v2 Team Battle each Master commands two Servants at once — every round,
        both act. Spend your Master's three Command Spells wisely — they can turn the tide of
        the war.
      </p>
    </div>
  );
}
