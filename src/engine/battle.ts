import { getServantDef } from '../data/servants';
import type {
  BattleAction,
  BattleContext,
  BattleState,
  MasterState,
  PlayerKind,
  PlayerState,
  ServantDefinition,
  ServantInstance,
} from '../types';
import { isStunned, statMultiplier, tickStatuses } from './status';

export function createServantInstance(defId: string): ServantInstance {
  const def = getServantDef(defId);
  return {
    defId,
    hp: def.maxHp,
    maxHp: def.maxHp,
    npGauge: 0,
    statuses: [],
    skillCooldowns: def.skills.map(() => 0),
    turnsSurvived: 0,
  };
}

export function createMasterState(name: string): MasterState {
  return { name, commandSpells: 3, critNextAttack: false };
}

export function createPlayer(id: 'p1' | 'p2', kind: PlayerKind, masterName: string, servantDefId: string): PlayerState {
  return {
    id,
    kind,
    master: createMasterState(masterName),
    servant: createServantInstance(servantDefId),
    lastRestrictedAction: null,
  };
}

export function createBattle(p1: PlayerState, p2: PlayerState): BattleState {
  return {
    players: [p1, p2],
    round: 1,
    log: [`The Holy Grail War begins. ${p1.master.name}'s ${getServantDef(p1.servant.defId).name} faces ${p2.master.name}'s ${getServantDef(p2.servant.defId).name}!`],
    winner: null,
    winReason: null,
    phase: 'battle',
  };
}

function makeDealDamage(log: (msg: string) => void, rng: () => number) {
  return (
    attacker: ServantInstance,
    defender: ServantInstance,
    multiplier: number,
    options: { guaranteedCrit?: boolean; label?: string; isNP?: boolean } = {},
  ): number => {
    const attackerDef = getServantDef(attacker.defId);
    const defenderDef = getServantDef(defender.defId);

    const evadeStatus = defender.statuses.find((s) => s.kind === 'evade' && s.turnsRemaining > 0);
    if (evadeStatus) {
      defender.statuses = defender.statuses.filter((s) => s !== evadeStatus);
      if (!options.isNP) {
        log(`${defenderDef.name} evades the attack entirely!`);
        return 0;
      }
      log(`${defenderDef.name}'s guaranteed evasion can't fully answer a Noble Phantasm — it comes down to speed alone!`);
    }

    // A small baseline dodge chance for everyone, nudged up or down by the
    // Agility gap between the two Servants. Clamped so a huge Agility edge
    // is a real advantage, not a guaranteed dodge. A Noble Phantasm is hard
    // to react to no matter how fast the defender is, so it pins the chance
    // down to the flat baseline instead of letting Agility raise it - unless
    // a guaranteed-evade status was just spent trying to answer it, in which
    // case Agility still gets to influence the roll.
    const dodgeChance = options.isNP && !evadeStatus
      ? 0.05
      : Math.min(0.15, Math.max(0.05, 0.05 + (defenderDef.agility - attackerDef.agility) * 0.003));
    if (rng() < dodgeChance) {
      log(`${defenderDef.name} is too quick — the attack whiffs entirely!`);
      return 0;
    }

    const hasCritBuff = attacker.statuses.some((s) => s.id.endsWith('__critReady'));

    const atkStat = attackerDef.atk * statMultiplier(attacker, 'atk');
    const defStat = defenderDef.def * statMultiplier(defender, 'def');

    const variance = 0.9 + rng() * 0.2;
    let dmg = Math.max(1, atkStat * multiplier * variance - defStat * 0.5);

    const critChance = attackerDef.critChance * statMultiplier(attacker, 'critChance');
    const isCrit = options.guaranteedCrit || hasCritBuff || rng() < critChance;
    if (isCrit) dmg *= 1.6;

    // Unlike an ATK buff (applied above, before Defense is subtracted), a
    // "damage" buff multiplies the already-mitigated hit, so it's a smaller
    // final bump at the same percentage.
    dmg *= statMultiplier(attacker, 'damage');

    dmg = Math.round(dmg);

    const shieldStatus = defender.statuses.find((s) => s.kind === 'shield' && (s.potency ?? 0) > 0);
    let absorbed = 0;
    if (shieldStatus) {
      absorbed = Math.min(dmg, shieldStatus.potency ?? 0);
      shieldStatus.potency = (shieldStatus.potency ?? 0) - absorbed;
      dmg -= absorbed;
      if (shieldStatus.potency <= 0) {
        defender.statuses = defender.statuses.filter((s) => s !== shieldStatus);
      }
    }

    defender.hp = defender.hp - dmg;

    const label = options.label ? `${options.label}: ` : '';
    log(
      `${label}${attackerDef.name} hits ${defenderDef.name} for ${dmg} damage${isCrit ? ' (CRITICAL!)' : ''}${absorbed > 0 ? ` (${absorbed} absorbed by shield)` : ''}.`,
    );

    if (hasCritBuff) {
      attacker.statuses = attacker.statuses.filter((s) => !s.id.endsWith('__critReady'));
    }

    if (dmg > 0) {
      attacker.npGauge = Math.min(100, attacker.npGauge + Math.min(40, 20 + dmg / 15));
      defender.npGauge = Math.min(100, defender.npGauge + Math.min(25, dmg / 15));
    } else {
      log(`${defenderDef.name} fully withstands the blow — no gauge is gained.`);
    }

    return dmg;
  };
}

/** Whether an action deals damage to the enemy this round, or is a
 * defense/setup action (buff, debuff, heal, command spell, and
 * non-damaging skills). Used to resolve all setup actions before any
 * damage, so a shield/evade protects against the opponent's attack
 * this round regardless of which player is processed first. */
function actionPhase(def: ServantDefinition, action: BattleAction): 'setup' | 'damage' {
  if (action.type === 'attack' || action.type === 'np') return 'damage';
  if (action.type === 'skill') {
    const skill = def.skills[action.skillIndex];
    return skill?.dealsDamage ? 'damage' : 'setup';
  }
  return 'setup';
}

/**
 * Both Masters choose their move without seeing the other's choice, so a
 * round always resolves both actions in full — neither player can win
 * simply by having gone "first". A round that fells both Servants at once
 * is decided by whichever Servant took the lesser overkill (the higher,
 * less-negative HP total).
 */
export function resolveRound(
  state: BattleState,
  p1Action: BattleAction,
  p2Action: BattleAction,
  rng: () => number = Math.random,
): BattleState {
  const next: BattleState = structuredClone(state);
  const [p1, p2] = next.players;
  const log = (msg: string) => next.log.push(msg);
  const dealDamage = makeDealDamage(log, rng);

  const makeCtx = (self: PlayerState, enemy: PlayerState, enemyHpFraction?: number): BattleContext => ({
    self: self.servant,
    enemy: enemy.servant,
    selfMaster: self.master,
    enemyMaster: enemy.master,
    log,
    rng,
    dealDamage,
    enemyHpFraction: enemyHpFraction ?? enemy.servant.hp / enemy.servant.maxHp,
  });

  const startOfRound = (self: PlayerState, enemy: PlayerState) => {
    const def = getServantDef(self.servant.defId);
    self.servant.turnsSurvived += 1;
    if (def.onTurnStart) {
      def.onTurnStart(makeCtx(self, enemy));
    }
    for (const dot of self.servant.statuses.filter((s) => s.kind === 'dot')) {
      const dmg = dot.potency ?? 0;
      self.servant.hp = self.servant.hp - dmg;
      log(`${def.name} suffers ${dmg} damage from ${dot.name}.`);
    }
    for (const regen of self.servant.statuses.filter((s) => s.kind === 'regen')) {
      const healed = regen.potency ?? 0;
      self.servant.hp = Math.min(self.servant.maxHp, self.servant.hp + healed);
      log(`${def.name} recovers ${healed} HP from ${regen.name}.`);
    }
  };

  startOfRound(p1, p2);
  startOfRound(p2, p1);

  if (finalizeIfDefeated(next, log)) return next;

  const performAction = (self: PlayerState, enemy: PlayerState, action: BattleAction, enemyHpFraction?: number) => {
    const def = getServantDef(self.servant.defId);
    const ctx = makeCtx(self, enemy, enemyHpFraction);

    switch (action.type) {
      case 'attack': {
        self.lastRestrictedAction = null;
        const critOverride = self.master.critNextAttack;
        dealDamage(self.servant, enemy.servant, 1.0, { guaranteedCrit: critOverride });
        if (critOverride) self.master.critNextAttack = false;
        break;
      }
      case 'skill': {
        self.lastRestrictedAction = null;
        const skill = def.skills[action.skillIndex];
        if (!skill) {
          log('Invalid skill selected.');
          break;
        }
        if (self.servant.skillCooldowns[action.skillIndex] > 0) {
          log(`${skill.name} is still on cooldown.`);
          break;
        }
        skill.effect(ctx);
        if (skill.npGainSelf) {
          self.servant.npGauge = Math.min(100, self.servant.npGauge + skill.npGainSelf);
        }
        self.servant.skillCooldowns[action.skillIndex] = skill.cooldown;
        break;
      }
      case 'np': {
        self.lastRestrictedAction = null;
        if (self.servant.npGauge < 100) {
          log('Noble Phantasm is not ready yet.');
          break;
        }
        const npCtx: BattleContext = {
          ...ctx,
          dealDamage: (a, d, m, opts) => dealDamage(a, d, m, { ...opts, isNP: true }),
        };
        def.noblePhantasm.effect(npCtx);
        self.servant.npGauge = 0;
        break;
      }
      case 'commandSpell': {
        if (self.master.commandSpells <= 0) {
          log('No Command Spells remaining!');
          break;
        }
        if (action.effect === 'heal') {
          if (self.lastRestrictedAction === 'heal') {
            log(`${self.master.name} cannot use a healing Command Spell two rounds in a row!`);
            self.lastRestrictedAction = null;
            break;
          }
          self.master.commandSpells -= 1;
          const healed = Math.round(self.servant.maxHp * 0.25);
          self.servant.hp = Math.min(self.servant.maxHp, self.servant.hp + healed);
          log(`${self.master.name} burns a Command Spell to heal ${def.name} for ${healed} HP!`);
          self.lastRestrictedAction = 'heal';
        } else if (action.effect === 'crit') {
          self.master.commandSpells -= 1;
          self.master.critNextAttack = true;
          log(`${self.master.name} burns a Command Spell — the next attack is guaranteed to land true!`);
          self.lastRestrictedAction = null;
        }
        break;
      }
    }
  };

  const p1Def = getServantDef(p1.servant.defId);
  const p2Def = getServantDef(p2.servant.defId);
  const p1Stunned = isStunned(p1.servant);
  const p2Stunned = isStunned(p2.servant);

  // Statuses applied this round shouldn't be ticked down until each
  // servant's *next* round, or a "1 turn" buff would expire before use.
  const p1PreExisting = new Set(p1.servant.statuses.map((s) => s.id));
  const p2PreExisting = new Set(p2.servant.statuses.map((s) => s.id));

  // Pass 1: buffs/debuffs/heals, and other non-damaging actions for
  // both players, so any defense set up this round is in place first.
  if (p1Stunned) {
    log(`${p1Def.name} is stunned and cannot act!`);
    p1.lastRestrictedAction = null;
  } else if (actionPhase(p1Def, p1Action) === 'setup') performAction(p1, p2, p1Action);

  if (p2Stunned) {
    log(`${p2Def.name} is stunned and cannot act!`);
    p2.lastRestrictedAction = null;
  } else if (actionPhase(p2Def, p2Action) === 'setup') performAction(p2, p1, p2Action);

  // Pass 2: attacks, Noble Phantasms, and damaging skills for both players.
  // Snapshot who is actually about to fire their NP *before* either one
  // resolves, so the outcome doesn't depend on P1 vs P2 processing order:
  // if both fire NPs the same round, whichever is processed first empties
  // their gauge, then the second one's NP can hit them and grant defender-
  // side gauge back - an order-dependent asymmetry that shouldn't exist
  // when both moves are meant to happen at the same time.
  const p1FiringNp = !p1Stunned && p1Action.type === 'np' && p1.servant.npGauge >= 100;
  const p2FiringNp = !p2Stunned && p2Action.type === 'np' && p2.servant.npGauge >= 100;

  // Also snapshot each side's enemy HP fraction before either damage-pass
  // action runs, so an execute-threshold skill (e.g. "below 25% HP") reads
  // the same value regardless of processing order - otherwise whoever
  // resolves second would see the other's simultaneous hit already landed.
  const p1EnemyHpFraction = p2.servant.hp / p2.servant.maxHp;
  const p2EnemyHpFraction = p1.servant.hp / p1.servant.maxHp;

  if (!p1Stunned && actionPhase(p1Def, p1Action) === 'damage') performAction(p1, p2, p1Action, p1EnemyHpFraction);
  if (!p2Stunned && actionPhase(p2Def, p2Action) === 'damage') performAction(p2, p1, p2Action, p2EnemyHpFraction);

  // Force each NP user's gauge back to 0 regardless of what the other
  // player's simultaneous action granted them afterward.
  if (p1FiringNp) p1.servant.npGauge = 0;
  if (p2FiringNp) p2.servant.npGauge = 0;

  tickStatuses(p1.servant, p1PreExisting);
  tickStatuses(p2.servant, p2PreExisting);
  p1.servant.skillCooldowns = p1.servant.skillCooldowns.map((cd) => Math.max(0, cd - 1));
  p2.servant.skillCooldowns = p2.servant.skillCooldowns.map((cd) => Math.max(0, cd - 1));

  if (finalizeIfDefeated(next, log)) return next;

  next.round += 1;
  return next;
}

function finalizeIfDefeated(state: BattleState, log: (msg: string) => void): boolean {
  const [p1, p2] = state.players;
  const p1Down = p1.servant.hp <= 0;
  const p2Down = p2.servant.hp <= 0;

  if (!p1Down && !p2Down) return false;

  if (p1Down && p2Down) {
    if (p1.servant.hp === p2.servant.hp) {
      log(
        `${getServantDef(p1.servant.defId).name} and ${getServantDef(p2.servant.defId).name} both fall in the same instant, ` +
          `taking the exact same blow (${p1.servant.hp} HP each) — the Grail declares no victor.`,
      );
      state.winner = null;
      state.winReason = 'draw';
      state.phase = 'gameover';
      return true;
    }
    // Whoever was overkilled less (higher, less-negative HP) wins.
    const winner = p1.servant.hp > p2.servant.hp ? p1 : p2;
    const loser = winner === p1 ? p2 : p1;
    log(
      `${getServantDef(p1.servant.defId).name} and ${getServantDef(p2.servant.defId).name} both fall in the same instant! ` +
        `${winner.master.name}'s ${getServantDef(winner.servant.defId).name} (${winner.servant.hp} HP) ` +
        `outlasts ${loser.master.name}'s ${getServantDef(loser.servant.defId).name} (${loser.servant.hp} HP) — the lesser blow leaves them standing a moment longer!`,
    );
    state.winner = winner.id;
    state.winReason = 'overkillTiebreak';
    state.phase = 'gameover';
    return true;
  }

  const winner = p1Down ? p2 : p1;
  const loser = p1Down ? p1 : p2;
  log(`${getServantDef(loser.servant.defId).name} has fallen. ${getServantDef(winner.servant.defId).name} is victorious!`);
  state.winner = winner.id;
  state.winReason = 'defeat';
  state.phase = 'gameover';
  return true;
}
