import { getServantDef } from '../data/servants';
import type { BattleAction, PlayerState, ServantInstance, ServantOrder } from '../types';

interface Props {
  label: string;
  player: PlayerState;
  servant: ServantInstance;
  /** What this AI has locked in for the round, and why. */
  order: ServantOrder | null;
  reason?: string;
}

function isChosen(chosen: BattleAction | undefined, test: BattleAction): boolean {
  if (!chosen || chosen.type !== test.type) return false;
  if (chosen.type === 'skill' && test.type === 'skill') return chosen.skillIndex === test.skillIndex;
  if (chosen.type === 'commandSpell' && test.type === 'commandSpell') return chosen.effect === test.effect;
  return true;
}

/** A read-only action menu: everything the player would see when choosing, with the AI's pick marked. */
export function SpectatorPanel({ label, player, servant, order, reason }: Props) {
  const def = getServantDef(servant.defId);
  const chosen = order?.action;
  const npReady = servant.npGauge >= 100;
  const cls = (picked: boolean, extra = '') => `spectator-option ${extra} ${picked ? 'chosen' : ''}`;
  return (
    <div className="spectator-panel">
      <div className="spectator-header">
        <strong>{label}</strong> — {def.name}
        <span className="spectator-meta">
          {' '}
          HP {Math.max(0, servant.hp)}/{servant.maxHp} · NP {Math.floor(servant.npGauge)}% · Command Spells{' '}
          {player.master.commandSpells}
          {player.commandSpellLastRound ? ' (recharging)' : ''}
        </span>
      </div>
      {reason && chosen && (
        <p className="spectator-reason">
          <strong>Chose:</strong> {chosen.type === 'attack' ? 'Attack' : chosen.type === 'np' ? def.noblePhantasm.name : chosen.type === 'skill' ? def.skills[chosen.skillIndex]?.name : chosen.effect === 'heal' ? 'Command Spell: Heal' : 'Command Spell: Crit'} — {reason}
        </p>
      )}
      <div className={cls(isChosen(chosen, { type: 'attack' }))}>
        <div className="spectator-option-title">Attack</div>
        <div className="spectator-option-desc">
          A basic strike using the Servant's Attack stat. Builds the Noble Phantasm gauge.
        </div>
      </div>
      <div className={cls(isChosen(chosen, { type: 'np' }), npReady ? 'ready' : 'unavailable')}>
        <div className="spectator-option-title">
          {def.noblePhantasm.name} (NP, Rank {def.noblePhantasm.rank}){' '}
          <span className="spectator-cd">{npReady ? 'READY' : `charging ${Math.floor(servant.npGauge)}%`}</span>
        </div>
        <div className="spectator-option-desc">{def.noblePhantasm.description}</div>
      </div>
      {def.skills.map((skill, i) => {
        const cd = servant.skillCooldowns[i];
        return (
          <div
            key={skill.id}
            className={cls(isChosen(chosen, { type: 'skill', skillIndex: i }), cd > 0 ? 'unavailable' : '')}
          >
            <div className="spectator-option-title">
              {skill.name}{' '}
              <span className="spectator-cd">
                {cd > 0 ? `on cooldown: ${cd} turn${cd === 1 ? '' : 's'} left` : 'ready'} · cooldown {skill.cooldown} turns
              </span>
            </div>
            <div className="spectator-option-desc">{skill.description}</div>
          </div>
        );
      })}
      <div className={cls(isChosen(chosen, { type: 'commandSpell', effect: 'heal' }) || isChosen(chosen, { type: 'commandSpell', effect: 'crit' }), 'cs')}>
        <div className="spectator-option-title">Command Spell ({player.master.commandSpells} left)</div>
        <div className="spectator-option-desc">
          Emergency Heal (+25% HP) or Guaranteed Critical Hit. One per round, never two rounds in a row.
        </div>
      </div>
    </div>
  );
}
