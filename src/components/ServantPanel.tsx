import { getServantDef } from '../data/servants';
import type { MasterState, ServantInstance } from '../types';

interface Props {
  master: MasterState;
  servant: ServantInstance;
  isActive: boolean;
  side: 'left' | 'right';
  /** Hide the Master's Command Spell pips (shown once per team in 2v2). */
  showCommandSpells?: boolean;
}

export function ServantPanel({ master, servant, isActive, side, showCommandSpells = true }: Props) {
  const def = getServantDef(servant.defId);
  const hpPct = Math.max(0, (servant.hp / servant.maxHp) * 100);
  const npPct = Math.min(100, servant.npGauge);
  const defeated = servant.hp <= 0;

  return (
    <div className={`servant-panel side-${side} ${isActive ? 'active' : ''} ${defeated ? 'defeated' : ''}`}>
      <div className="servant-panel-header">
        <span className="servant-class">{def.className}</span>
        <span className="master-name">{master.name}</span>
      </div>
      <div className="servant-name">{def.name}{defeated ? ' — Defeated' : ''}</div>
      <div className="servant-title">{def.title}</div>
      <div className="bar hp-bar">
        <div className={`bar-fill hp-fill ${hpPct < 30 ? 'low' : ''}`} style={{ width: `${hpPct}%` }} />
        <span className="bar-label">
          {Math.max(0, servant.hp)} / {servant.maxHp} HP
        </span>
      </div>
      <div className="bar np-bar">
        <div className="bar-fill np-fill" style={{ width: `${npPct}%` }} />
        <span className="bar-label">NP {Math.floor(npPct)}%</span>
      </div>
      <div className="status-row">
        {servant.statuses.map((s) => (
          <span
            key={s.id}
            className={`status-chip ${s.kind}`}
            title={s.description}
          >
            {s.name} ({Number.isFinite(s.turnsRemaining) ? s.turnsRemaining : '∞'})
          </span>
        ))}
      </div>
      {showCommandSpells && (
        <div className="command-spells" title="Command Spells remaining">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`spell-pip ${i < master.commandSpells ? 'lit' : ''}`} />
          ))}
        </div>
      )}
    </div>
  );
}
