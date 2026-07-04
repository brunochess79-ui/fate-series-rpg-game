import { useMemo, useState } from 'react';
import { SERVANT_LIST } from '../data/servants';
import type { GameMode, SetupResult } from '../game';
import type { ServantClass } from '../types';

interface Props {
  mode: GameMode;
  onComplete: (result: SetupResult) => void;
  onBack: () => void;
}

const CLASS_FILTERS: Array<ServantClass | 'All'> = [
  'All',
  'Saber',
  'Archer',
  'Lancer',
  'Rider',
  'Caster',
  'Assassin',
  'Berserker',
];

export function SetupScreen({ mode, onComplete, onBack }: Props) {
  const [step, setStep] = useState<0 | 1>(0);
  const [p1Name, setP1Name] = useState('Master 1');
  const [p1Servant, setP1Servant] = useState<string | null>(null);
  const [p2Name, setP2Name] = useState('Master 2');
  const [p2Servant, setP2Servant] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<ServantClass | 'All'>('All');

  const isFirstStep = step === 0;
  const currentName = isFirstStep ? p1Name : p2Name;
  const currentServant = isFirstStep ? p1Servant : p2Servant;
  const setCurrentName = isFirstStep ? setP1Name : setP2Name;
  const setCurrentServant = isFirstStep ? setP1Servant : setP2Servant;
  const excludeId = isFirstStep ? null : p1Servant;

  const visibleServants = useMemo(
    () =>
      SERVANT_LIST.filter((s) => s.id !== excludeId).filter(
        (s) => classFilter === 'All' || s.className === classFilter,
      ),
    [excludeId, classFilter],
  );

  const handleConfirm = () => {
    if (!currentServant) return;
    if (isFirstStep) {
      if (mode === 'ai') {
        const pool = SERVANT_LIST.filter((s) => s.id !== currentServant);
        const aiServant = pool[Math.floor(Math.random() * pool.length)];
        onComplete({
          p1Name,
          p1ServantId: currentServant,
          p2Name: 'Rival Master',
          p2ServantId: aiServant.id,
        });
      } else {
        setStep(1);
      }
    } else {
      onComplete({ p1Name, p1ServantId: p1Servant!, p2Name, p2ServantId: currentServant });
    }
  };

  return (
    <div className="setup-screen">
      <h2>
        {mode === 'hotseat' ? `Player ${step + 1}, choose your Servant` : 'Choose your Servant'}
      </h2>
      <div className="master-name-input">
        <label>
          Master Name
          <input
            value={currentName}
            maxLength={20}
            onChange={(e) => setCurrentName(e.target.value)}
          />
        </label>
      </div>
      <div className="class-filter-row">
        {CLASS_FILTERS.map((c) => (
          <button
            key={c}
            className={`class-filter-btn ${classFilter === c ? 'active' : ''}`}
            onClick={() => setClassFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="servant-grid">
        {visibleServants.map((s) => (
          <button
            key={s.id}
            className={`servant-card ${currentServant === s.id ? 'selected' : ''}`}
            onClick={() => setCurrentServant(s.id)}
          >
            <div className="servant-card-class">{s.className}</div>
            <div className="servant-card-name">{s.name}</div>
            <div className="servant-card-title">{s.title}</div>
            <div className="servant-card-stats">
              <span>HP {s.maxHp}</span>
              <span>ATK {s.atk}</span>
              <span>DEF {s.def}</span>
            </div>
            <div className="servant-card-passive">{s.passiveDescription}</div>
            <div className="servant-card-np">
              NP: {s.noblePhantasm.name} — {s.noblePhantasm.description}
            </div>
          </button>
        ))}
      </div>
      <div className="setup-actions">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
        <button className="primary-btn" disabled={!currentServant} onClick={handleConfirm}>
          {mode === 'hotseat' && isFirstStep ? 'Next Player' : 'Begin Battle'}
        </button>
      </div>
    </div>
  );
}
