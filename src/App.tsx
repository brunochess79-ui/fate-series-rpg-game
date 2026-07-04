import { useCallback, useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { MainMenu } from './components/MainMenu';
import { SetupScreen } from './components/SetupScreen';
import { createBattle, createPlayer, resolveRound } from './engine/battle';
import type { GameMode, SetupResult } from './game';
import type { BattleAction, BattleState } from './types';

type Screen = 'menu' | 'setup' | 'battle';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameMode>('hotseat');
  const [setup, setSetup] = useState<SetupResult | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);

  const startBattle = useCallback((result: SetupResult, gameMode: GameMode) => {
    const p1 = createPlayer('p1', 'human', result.p1Name, result.p1ServantId);
    const p2 = createPlayer('p2', gameMode === 'ai' ? 'ai' : 'human', result.p2Name, result.p2ServantId);
    setSetup(result);
    setBattle(createBattle(p1, p2));
    setScreen('battle');
  }, []);

  const handleResolveRound = useCallback((p1Action: BattleAction, p2Action: BattleAction) => {
    setBattle((prev) => (prev ? resolveRound(prev, p1Action, p2Action) : prev));
  }, []);

  const handleRematch = useCallback(() => {
    if (setup) startBattle(setup, mode);
  }, [setup, mode, startBattle]);

  const handleMainMenu = useCallback(() => {
    setScreen('menu');
    setBattle(null);
    setSetup(null);
  }, []);

  return (
    <div className="app-shell">
      {screen === 'menu' && (
        <MainMenu
          onSelectMode={(m) => {
            setMode(m);
            setScreen('setup');
          }}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen mode={mode} onBack={() => setScreen('menu')} onComplete={(r) => startBattle(r, mode)} />
      )}
      {screen === 'battle' && battle && battle.phase === 'battle' && (
        <BattleScreen battle={battle} onResolveRound={handleResolveRound} />
      )}
      {screen === 'battle' && battle && battle.phase === 'gameover' && (
        <GameOverScreen battle={battle} onRematch={handleRematch} onMainMenu={handleMainMenu} />
      )}
    </div>
  );
}

export default App;
