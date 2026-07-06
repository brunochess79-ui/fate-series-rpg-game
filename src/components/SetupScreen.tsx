import { useMemo, useState } from 'react';
import { SERVANT_LIST } from '../data/servants';
import type { GameMode, SetupResult } from '../game';
import type { ServantClass, ServantDefinition } from '../types';
import { estimateNpDamage } from '../utils/npPreview';

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
  'Ruler',
  'Avenger',
  'Shielder',
  'Alter Ego',
  'Foreigner',
  'Beast',
  'Pretender',
];

interface ServantCardProps {
  servant: ServantDefinition;
  selected: boolean;
  onSelect: () => void;
}

function ServantCard({ servant, selected, onSelect }: ServantCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const npEstimate = useMemo(() => estimateNpDamage(servant), [servant]);

  const toggleDetails = () => setDetailsOpen((v) => !v);

  return (
    <div
      className={`servant-card ${selected ? 'selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="servant-card-header">
        <div className="servant-card-class">{servant.className}</div>
        <div className="servant-card-rank" title="Servant Rank">
          {servant.rank} Rank
        </div>
      </div>
      <div className="servant-card-name">{servant.name}</div>
      <div className="servant-card-title">{servant.title}</div>
      <div className="servant-card-traits">
        <div className="trait-line strengths">
          <span className="trait-label">Strengths</span> {servant.strengths.join(', ')}
        </div>
        <div className="trait-line weaknesses">
          <span className="trait-label">Weaknesses</span> {servant.weaknesses.join(', ')}
        </div>
      </div>
      <button
        type="button"
        className="servant-card-details-toggle"
        aria-expanded={detailsOpen}
        onClick={(e) => {
          e.stopPropagation();
          toggleDetails();
        }}
      >
        {detailsOpen ? '▴ Hide Stats & Abilities' : '▾ Stats, Abilities & Noble Phantasm'}
      </button>
      {detailsOpen && (
        <div className="servant-card-details">
          <div className="servant-card-details-section">
            <div className="servant-card-details-label">Stats</div>
            <div className="servant-card-details-stats">
              <span>HP {servant.maxHp}</span>
              <span>ATK {servant.atk}</span>
              <span>DEF {servant.def}</span>
              <span>AGI {servant.agility}</span>
              <span>CRIT {Math.round(servant.critChance * 100)}%</span>
            </div>
          </div>
          <div className="servant-card-details-section">
            <div className="servant-card-details-label">Abilities</div>
            {servant.skills.map((skill) => (
              <div className="servant-card-details-line" key={skill.id}>
                <span className="servant-card-details-name">{skill.name}:</span> {skill.description}
              </div>
            ))}
          </div>
          <div className="servant-card-details-section">
            <div className="servant-card-details-label">Rank</div>
            <div className="servant-card-details-line">
              Servant Rank: {servant.rank} &nbsp;·&nbsp; Noble Phantasm Rank: {servant.noblePhantasm.rank}
            </div>
          </div>
          <div className="servant-card-details-section">
            <div className="servant-card-details-label">Noble Phantasm Damage</div>
            <div className="servant-card-details-line">
              <span className="servant-card-details-name">{servant.noblePhantasm.name}:</span>{' '}
              {npEstimate
                ? `~${npEstimate.low}-${npEstimate.high} damage vs a baseline Defense of 65`
                : 'Support/utility Noble Phantasm — no direct damage'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const handleRandomServant = () => {
    if (visibleServants.length === 0) return;
    const pick = visibleServants[Math.floor(Math.random() * visibleServants.length)];
    setCurrentServant(pick.id);
  };

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
        <button className="class-filter-btn random-servant-btn" onClick={handleRandomServant}>
          Random Servant
        </button>
      </div>
      <div className="servant-grid">
        {visibleServants.map((s) => (
          <ServantCard
            key={s.id}
            servant={s}
            selected={currentServant === s.id}
            onSelect={() => setCurrentServant(s.id)}
          />
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
