import { useState } from 'react';
import { getServantDef } from '../data/servants';
import type { BattleAction, PlayerState } from '../types';

interface Props {
  player: PlayerState;
  disabled: boolean;
  onAction: (action: BattleAction) => void;
}

export function ActionPanel({ player, disabled, onAction }: Props) {
  const [showCommandSpells, setShowCommandSpells] = useState(false);
  const def = getServantDef(player.servant.defId);
  const npReady = player.servant.npGauge >= 100;

  const act = (action: BattleAction) => {
    setShowCommandSpells(false);
    onAction(action);
  };

  return (
    <div className={`action-panel ${disabled ? 'disabled' : ''}`}>
      <div className="action-row">
        <button className="action-btn attack" disabled={disabled} onClick={() => act({ type: 'attack' })}>
          Attack
        </button>
        <button
          className={`action-btn np ${npReady ? 'ready' : ''}`}
          disabled={disabled || !npReady}
          onClick={() => act({ type: 'np' })}
          title={def.noblePhantasm.description}
        >
          {def.noblePhantasm.name}
        </button>
        <button className="action-btn guard" disabled={disabled} onClick={() => act({ type: 'guard' })}>
          Guard
        </button>
      </div>
      <div className="action-row skills">
        {def.skills.map((skill, i) => {
          const cd = player.servant.skillCooldowns[i];
          return (
            <button
              key={skill.id}
              className="action-btn skill"
              disabled={disabled || cd > 0}
              title={skill.description}
              onClick={() => act({ type: 'skill', skillIndex: i })}
            >
              {skill.name}
              {cd > 0 ? ` (${cd})` : ''}
            </button>
          );
        })}
      </div>
      <div className="action-row command-spell-row">
        <button
          className="action-btn command-spell-toggle"
          disabled={disabled || player.master.commandSpells <= 0}
          onClick={() => setShowCommandSpells((v) => !v)}
        >
          Command Spell ({player.master.commandSpells})
        </button>
        {showCommandSpells && (
          <div className="command-spell-menu">
            <button onClick={() => act({ type: 'commandSpell', effect: 'heal' })}>
              Emergency Heal (+30% HP)
            </button>
            <button onClick={() => act({ type: 'commandSpell', effect: 'crit' })}>
              Guarantee Critical Hit
            </button>
            <button onClick={() => act({ type: 'commandSpell', effect: 'chargeNP' })}>
              Instantly Charge NP Gauge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
