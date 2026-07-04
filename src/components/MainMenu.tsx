import type { GameMode } from '../game';

interface Props {
  onSelectMode: (mode: GameMode) => void;
}

export function MainMenu({ onSelectMode }: Props) {
  return (
    <div className="main-menu">
      <h1 className="game-title">Holy Grail War</h1>
      <p className="game-subtitle">A Fate-inspired turn-based Servant battle</p>
      <div className="menu-buttons">
        <button className="primary-btn" onClick={() => onSelectMode('hotseat')}>
          Local Battle (2 Players)
        </button>
        <button className="primary-btn" onClick={() => onSelectMode('ai')}>
          Battle a Rival Master (vs AI)
        </button>
      </div>
      <p className="menu-hint">
        Choose a Master and Servant, then fight in a battle of Attacks, Skills, and Noble
        Phantasms. Spend your Master's three Command Spells wisely — they can turn the tide of
        the war.
      </p>
    </div>
  );
}
