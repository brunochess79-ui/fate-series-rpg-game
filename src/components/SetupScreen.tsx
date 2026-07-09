import { useMemo, useState } from 'react';
import { SERVANT_LIST } from '../data/servants';
import type { GameMode, SetupResult, TeamSize } from '../game';
import type { ServantClass, ServantDefinition } from '../types';
import { estimateNpDamage } from '../utils/npPreview';
import { formatStanding, getStatRankings } from '../utils/statRanking';

interface Props {
  mode: GameMode;
  teamSize: TeamSize;
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
  'MoonCancer',
];

interface ServantCardProps {
  servant: ServantDefinition;
  selected: boolean;
  onSelect: () => void;
}

function ServantCard({ servant, selected, onSelect }: ServantCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const npEstimate = useMemo(() => estimateNpDamage(servant), [servant]);
  const rankings = useMemo(() => getStatRankings(SERVANT_LIST), []);
  const standing = rankings.get(servant.id)!;

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
            <div className="servant-card-details-stat-grid">
              <div className="servant-card-stat-row">
                <span className="servant-card-details-name">HP {servant.maxHp}</span>
                <span className="servant-card-standing">{formatStanding(standing.maxHp)}</span>
              </div>
              <div className="servant-card-stat-row">
                <span className="servant-card-details-name">ATK {servant.atk}</span>
                <span className="servant-card-standing">{formatStanding(standing.atk)}</span>
              </div>
              <div className="servant-card-stat-row">
                <span className="servant-card-details-name">DEF {servant.def}</span>
                <span className="servant-card-standing">{formatStanding(standing.def)}</span>
              </div>
              <div className="servant-card-stat-row">
                <span className="servant-card-details-name">AGI {servant.agility}</span>
                <span className="servant-card-standing">{formatStanding(standing.agility)}</span>
              </div>
              <div className="servant-card-stat-row">
                <span className="servant-card-details-name">CRIT {Math.round(servant.critChance * 100)}%</span>
                <span className="servant-card-standing">{formatStanding(standing.critChance)}</span>
              </div>
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
              {standing.npDamage && (
                <span className="servant-card-standing"> ({formatStanding(standing.npDamage)} for NP damage)</span>
              )}
            </div>
          </div>
          {servant.fateWikiUrl && (
            <div className="servant-card-details-section">
              <div className="servant-card-details-label">Learn More</div>
              <div className="servant-card-details-line">
                <a
                  href={servant.fateWikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="servant-wiki-link"
                >
                  {servant.name} on the Fate Wiki (character art & lore) ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SetupScreen({ mode, teamSize, onComplete, onBack }: Props) {
  const [step, setStep] = useState<0 | 1>(0);
  const [p1Name, setP1Name] = useState('Master 1');
  const [p1Servants, setP1Servants] = useState<string[]>([]);
  const [p2Name, setP2Name] = useState('Master 2');
  const [p2Servants, setP2Servants] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<ServantClass | 'All'>('All');
  const [search, setSearch] = useState('');

  const isFirstStep = step === 0;
  const currentName = isFirstStep ? p1Name : p2Name;
  const currentPicks = isFirstStep ? p1Servants : p2Servants;
  const setCurrentName = isFirstStep ? setP1Name : setP2Name;
  const setCurrentPicks = isFirstStep ? setP1Servants : setP2Servants;
  // Player 2 can't field a Servant Player 1 already picked.
  const excludeIds = isFirstStep ? [] : p1Servants;

  const togglePick = (id: string) => {
    setCurrentPicks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= teamSize) {
        // Team already full: swap the earliest pick out for the new one.
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const visibleServants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return SERVANT_LIST.filter((s) => !excludeIds.includes(s.id))
      .filter((s) => classFilter === 'All' || s.className === classFilter)
      .filter(
        (s) =>
          query === '' ||
          s.name.toLowerCase().includes(query) ||
          s.title.toLowerCase().includes(query) ||
          s.trueName.toLowerCase().includes(query),
      );
  }, [excludeIds, classFilter, search]);

  const handleRandomServant = () => {
    const pool = visibleServants.filter((s) => !currentPicks.includes(s.id));
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    togglePick(pick.id);
  };

  const teamReady = currentPicks.length === teamSize;

  const handleConfirm = () => {
    if (!teamReady) return;
    if (isFirstStep) {
      if (mode === 'ai') {
        const pool = SERVANT_LIST.filter((s) => !currentPicks.includes(s.id));
        const aiPicks: string[] = [];
        while (aiPicks.length < teamSize) {
          const candidate = pool[Math.floor(Math.random() * pool.length)];
          if (!aiPicks.includes(candidate.id)) aiPicks.push(candidate.id);
        }
        onComplete({
          teamSize,
          p1Name,
          p1ServantIds: currentPicks,
          p2Name: 'Rival Master',
          p2ServantIds: aiPicks,
        });
      } else {
        setStep(1);
      }
    } else {
      onComplete({ teamSize, p1Name, p1ServantIds: p1Servants, p2Name, p2ServantIds: currentPicks });
    }
  };

  const servantWord = teamSize === 2 ? 'Servants' : 'Servant';
  return (
    <div className="setup-screen">
      <h2>
        {mode === 'hotseat' ? `Player ${step + 1}, choose your ${servantWord}` : `Choose your ${servantWord}`}
        {teamSize === 2 && ` — ${currentPicks.length}/${teamSize} picked`}
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
      <div className="servant-search-row">
        <input
          type="search"
          className="servant-search-input"
          placeholder="Search Servants by name or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search Servants"
        />
        {search !== '' && (
          <button
            type="button"
            className="servant-search-clear"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
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
      {visibleServants.length === 0 ? (
        <p className="servant-search-empty">No Servants match "{search}".</p>
      ) : (
        <div className="servant-grid">
          {visibleServants.map((s) => (
            <ServantCard
              key={s.id}
              servant={s}
              selected={currentPicks.includes(s.id)}
              onSelect={() => togglePick(s.id)}
            />
          ))}
        </div>
      )}
      <div className="setup-actions">
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
        <button className="primary-btn" disabled={!teamReady} onClick={handleConfirm}>
          {mode === 'hotseat' && isFirstStep ? 'Next Player' : 'Begin Battle'}
        </button>
      </div>
    </div>
  );
}
