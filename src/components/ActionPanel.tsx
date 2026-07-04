import { useState } from 'react';
import { getServantDef } from '../data/servants';
import type { BattleAction, PlayerState } from '../types';

interface Props {
  player: PlayerState;
  disabled: boolean;
  onAction: (action: BattleAction) => void;
}

interface ActionItemProps {
  id: string;
  label: string;
  description: string;
  disabled: boolean;
  className: string;
  onClick: () => void;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

function ActionItem({ id, label, description, disabled, className, onClick, openId, setOpenId }: ActionItemProps) {
  const isOpen = openId === id;
  return (
    <div className="action-item">
      <div className="action-item-row">
        <button className={className} disabled={disabled} onClick={onClick}>
          {label}
        </button>
        <button
          type="button"
          className="info-toggle"
          aria-label={`${isOpen ? 'Hide' : 'Show'} description for ${label}`}
          aria-expanded={isOpen}
          onClick={() => setOpenId(isOpen ? null : id)}
        >
          {isOpen ? '▴' : 'ⓘ'}
        </button>
      </div>
      {isOpen && <div className="action-description">{description}</div>}
    </div>
  );
}

export function ActionPanel({ player, disabled, onAction }: Props) {
  const [showCommandSpells, setShowCommandSpells] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const def = getServantDef(player.servant.defId);
  const npReady = player.servant.npGauge >= 100;

  const act = (action: BattleAction) => {
    setShowCommandSpells(false);
    onAction(action);
  };

  return (
    <div className={`action-panel ${disabled ? 'disabled' : ''}`}>
      <div className="action-row">
        <ActionItem
          id="attack"
          label="Attack"
          description="A basic strike using your Servant's Attack stat. Builds your Noble Phantasm gauge, and charges the enemy's a little too."
          className="action-btn attack"
          disabled={disabled}
          onClick={() => act({ type: 'attack' })}
          openId={openId}
          setOpenId={setOpenId}
        />
        <ActionItem
          id="np"
          label={def.noblePhantasm.name}
          description={`${def.noblePhantasm.description} (Rank ${def.noblePhantasm.rank}). Unlocks at 100% NP gauge, then resets it to 0.`}
          className={`action-btn np ${npReady ? 'ready' : ''}`}
          disabled={disabled || !npReady}
          onClick={() => act({ type: 'np' })}
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>
      <div className="action-row skills">
        {def.skills.map((skill, i) => {
          const cd = player.servant.skillCooldowns[i];
          return (
            <ActionItem
              key={skill.id}
              id={skill.id}
              label={cd > 0 ? `${skill.name} (${cd})` : skill.name}
              description={`${skill.description} Cooldown: ${skill.cooldown} turns.`}
              className="action-btn skill"
              disabled={disabled || cd > 0}
              onClick={() => act({ type: 'skill', skillIndex: i })}
              openId={openId}
              setOpenId={setOpenId}
            />
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
            <button
              disabled={player.lastRestrictedAction === 'heal'}
              onClick={() => act({ type: 'commandSpell', effect: 'heal' })}
            >
              {player.lastRestrictedAction === 'heal' ? "Emergency Heal (can't repeat)" : 'Emergency Heal (+25% HP)'}
            </button>
            <button onClick={() => act({ type: 'commandSpell', effect: 'crit' })}>
              Guarantee Critical Hit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
