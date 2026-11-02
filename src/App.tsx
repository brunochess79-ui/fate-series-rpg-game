import { useCallback, useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { MainMenu } from './components/MainMenu';
import { SetupScreen } from './components/SetupScreen';
import { createBattle, createPlayer, resolveRound } from './engine/battle';
import { rerollSetup } from './game';
import type { CoachRound } from './engine/coach';
import type { GameMode, SetupResult, TeamSize } from './game';
import type { BattleState, TeamOrders } from './types';

type Screen = 'menu' | 'setup' | 'battle';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameMode>('hotseat');
  const [teamSize, setTeamSize] = useState<TeamSize>(1);
  const [setup, setSetup] = useState<SetupResult | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);
  // Training mode: how each round compared with the coach's recommendation.
  const [coachRounds, setCoachRounds] = useState<CoachRound[]>([]);

  const startBattle = useCallback((result: SetupResult, gameMode: GameMode) => {
    const p1 = createPlayer('p1', gameMode === 'spectate' ? 'ai' : 'human', result.p1Name, result.p1ServantIds);
    const p2 = createPlayer('p2', gameMode === 'hotseat' ? 'human' : 'ai', result.p2Name, result.p2ServantIds);
    setSetup(result);
    setCoachRounds([]);
    setBattle(createBattle(p1, p2));
    setScreen('battle');
  }, []);

  const handleResolveRound = useCallback((p1Orders: TeamOrders, p2Orders: TeamOrders) => {
    setBattle((prev) => (prev ? resolveRound(prev, p1Orders, p2Orders) : prev));
  }, []);

  const handleCoachRound = useCallback((round: CoachRound) => {
    setCoachRounds((prev) => [...prev.filter((r) => r.round !== round.round), round]);
  }, []);

  const handleRematch = useCallback(() => {
    // Random picks (yours and/or the rival's) are drawn again for the rematch.
    if (setup) startBattle(rerollSetup(setup), mode);
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
          onSelectMode={(m, size) => {
            setMode(m);
            setTeamSize(size);
            setScreen('setup');
          }}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen
          mode={mode}
          teamSize={teamSize}
          onBack={() => setScreen('menu')}
          onComplete={(r) => startBattle(r, mode)}
        />
      )}
      {screen === 'battle' && battle && battle.phase === 'battle' && (
        <BattleScreen
          battle={battle}
          difficulty={setup?.difficulty ?? 'normal'}
          training={mode === 'training'}
          spectate={mode === 'spectate'}
          onCoachRound={handleCoachRound}
          onResolveRound={handleResolveRound}
        />
      )}
      {screen === 'battle' && battle && battle.phase === 'gameover' && (
        <GameOverScreen
          battle={battle}
          training={mode === 'training'}
          spectate={mode === 'spectate'}
          coachRounds={coachRounds}
          onRematch={handleRematch}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}

export default App;
