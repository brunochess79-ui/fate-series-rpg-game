import { useState } from 'react';
import { getServantDef } from '../data/servants';
import type { BattleAction, PlayerState, ServantInstance, ServantOrder } from '../types';

interface Props {
  player: PlayerState;
  servant: ServantInstance;
  /** The opposing team, used for target selection on offensive actions. */
  enemyServants: ServantInstance[];
  disabled: boolean;
  onOrder: (order: ServantOrder) => void;
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

/** Whether this action is aimed at an enemy, so the Master must pick which
 * one while the enemy team still has two Servants standing. */
function needsTarget(action: BattleAction, servant: ServantInstance): boolean {
  if (action.type === 'attack' || action.type === 'np') return true;
  if (action.type === 'skill') {
    const def = getServantDef(servant.defId);
    const skill = def.skills[action.skillIndex];
    return !!skill && (!!skill.dealsDamage || skill.tag === 'debuff');
  }
  return false;
}

export function ActionPanel({ player, servant, enemyServants, disabled, onOrder }: Props) {
  const [showCommandSpells, setShowCommandSpells] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingTargetAction, setPendingTargetAction] = useState<BattleAction | null>(null);
  const def = getServantDef(servant.defId);
  const npReady = servant.npGauge >= 100;

  const livingEnemies = enemyServants
    .map((s, index) => ({ servant: s, index }))
    .filter((e) => e.servant.hp > 0);

  const act = (action: BattleAction) => {
    setShowCommandSpells(false);
    if (needsTarget(action, servant) && livingEnemies.length > 1) {
      setPendingTargetAction(action);
      return;
    }
    setPendingTargetAction(null);
    onOrder({ action, target: livingEnemies[0]?.index ?? 0 });
  };

  const commitTarget = (targetIndex: number) => {
    if (!pendingTargetAction) return;
    const action = pendingTargetAction;
    setPendingTargetAction(null);
    onOrder({ action, target: targetIndex });
  };

  return (
    <div className={`action-panel ${disabled ? 'disabled' : ''}`}>
      {enemyServants.length > 1 || player.servants.length > 1 ? (
        <div className="action-panel-servant-name">{def.name} — choose an action</div>
      ) : null}
      {pendingTargetAction ? (
        <div className="action-row target-menu">
          <span className="target-menu-label">Choose a target:</span>
          {livingEnemies.map((e) => {
            const eDef = getServantDef(e.servant.defId);
            return (
              <button
                key={e.index}
                className="action-btn target"
                disabled={disabled}
                onClick={() => commitTarget(e.index)}
              >
                {eDef.name} ({Math.max(0, e.servant.hp)} HP)
              </button>
            );
          })}
          <button className="action-btn target-cancel" onClick={() => setPendingTargetAction(null)}>
            Back
          </button>
        </div>
      ) : (
        <>
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
              const cd = servant.skillCooldowns[i];
              const label = cd > 0 ? `${skill.name} (${cd})` : skill.name;
              const description = `${skill.description} Cooldown: ${skill.cooldown} turns.`;
              return (
                <ActionItem
                  key={skill.id}
                  id={skill.id}
                  label={label}
                  description={description}
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
        </>
      )}
    </div>
  );
}
