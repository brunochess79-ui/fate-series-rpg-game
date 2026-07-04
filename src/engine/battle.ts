import { getServantDef } from '../data/servants';
import type {
  BattleAction,
  BattleContext,
  BattleState,
  MasterState,
  PlayerKind,
  PlayerState,
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
    guarding: false,
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
  };
}

export function createBattle(p1: PlayerState, p2: PlayerState): BattleState {
  return {
    players: [p1, p2],
    activePlayerIndex: 0,
    round: 1,
    log: [`The Holy Grail War begins. ${p1.master.name}'s ${getServantDef(p1.servant.defId).name} faces ${p2.master.name}'s ${getServantDef(p2.servant.defId).name}!`],
    winner: null,
    phase: 'battle',
  };
}

function makeDealDamage(log: (msg: string) => void, rng: () => number) {
  return (
    attacker: ServantInstance,
    defender: ServantInstance,
    multiplier: number,
    options: { pierceDef?: boolean; guaranteedCrit?: boolean; label?: string } = {},
  ): number => {
    const attackerDef = getServantDef(attacker.defId);
    const defenderDef = getServantDef(defender.defId);

    const evadeStatus = defender.statuses.find((s) => s.kind === 'evade' && s.turnsRemaining > 0);
    if (evadeStatus && !options.pierceDef) {
      defender.statuses = defender.statuses.filter((s) => s !== evadeStatus);
      log(`${defenderDef.name} evades the attack entirely!`);
      return 0;
    }

    const hasCritBuff = attacker.statuses.some((s) => s.id.endsWith('__critReady'));

    const atkStat = attackerDef.atk * statMultiplier(attacker, 'atk');
    const defStat = options.pierceDef
      ? defenderDef.def * 0.3
      : defenderDef.def * statMultiplier(defender, 'def');

    const variance = 0.9 + rng() * 0.2;
    let dmg = Math.max(1, atkStat * multiplier * variance - defStat * 0.5);

    const critChance = attackerDef.critChance * statMultiplier(attacker, 'luck');
    const isCrit = options.guaranteedCrit || hasCritBuff || rng() < critChance;
    if (isCrit) dmg *= 1.6;

    if (defender.guarding && !options.pierceDef) dmg *= 0.45;

    dmg = Math.round(dmg);

    const shieldStatus = defender.statuses.find((s) => s.kind === 'shield' && (s.potency ?? 0) > 0);
    let absorbed = 0;
    if (shieldStatus && !options.pierceDef) {
      absorbed = Math.min(dmg, shieldStatus.potency ?? 0);
      shieldStatus.potency = (shieldStatus.potency ?? 0) - absorbed;
      dmg -= absorbed;
      if (shieldStatus.potency <= 0) {
        defender.statuses = defender.statuses.filter((s) => s !== shieldStatus);
      }
    }

    defender.hp = Math.max(0, defender.hp - dmg);

    const label = options.label ? `${options.label}: ` : '';
    log(
      `${label}${attackerDef.name} hits ${defenderDef.name} for ${dmg} damage${isCrit ? ' (CRITICAL!)' : ''}${defender.guarding ? ' (guarded)' : ''}${absorbed > 0 ? ` (${absorbed} absorbed by shield)` : ''}.`,
    );

    if (hasCritBuff) {
      attacker.statuses = attacker.statuses.filter((s) => !s.id.endsWith('__critReady'));
    }

    attacker.npGauge = Math.min(100, attacker.npGauge + Math.min(30, 15 + dmg / 20));
    defender.npGauge = Math.min(100, defender.npGauge + Math.min(15, dmg / 25));

    return dmg;
  };
}

export function resolveAction(state: BattleState, action: BattleAction, rng: () => number = Math.random): BattleState {
  const next: BattleState = structuredClone(state);
  const activeIdx = next.activePlayerIndex;
  const otherIdx = activeIdx === 0 ? 1 : 0;
  const player = next.players[activeIdx];
  const opponent = next.players[otherIdx];
  const selfDef = getServantDef(player.servant.defId);

  const log = (msg: string) => next.log.push(msg);
  const dealDamage = makeDealDamage(log, rng);
  const ctx: BattleContext = {
    self: player.servant,
    enemy: opponent.servant,
    selfMaster: player.master,
    enemyMaster: opponent.master,
    log,
    rng,
    dealDamage,
  };

  player.servant.turnsSurvived += 1;
  player.servant.guarding = false;

  if (isStunned(player.servant)) {
    log(`${selfDef.name} is stunned and cannot act!`);
    tickStatuses(player.servant);
    player.servant.skillCooldowns = player.servant.skillCooldowns.map((cd) => Math.max(0, cd - 1));
    finishTurn(next, otherIdx);
    return next;
  }

  if (selfDef.onTurnStart) {
    selfDef.onTurnStart(ctx);
  }

  const dotStatuses = player.servant.statuses.filter((s) => s.kind === 'dot');
  for (const dot of dotStatuses) {
    const dmg = dot.potency ?? 0;
    player.servant.hp = Math.max(0, player.servant.hp - dmg);
    log(`${selfDef.name} suffers ${dmg} damage from ${dot.name}.`);
  }

  const regenStatuses = player.servant.statuses.filter((s) => s.kind === 'regen');
  for (const regen of regenStatuses) {
    const healed = regen.potency ?? 0;
    player.servant.hp = Math.min(player.servant.maxHp, player.servant.hp + healed);
    log(`${selfDef.name} recovers ${healed} HP from ${regen.name}.`);
  }

  if (player.servant.hp <= 0) {
    next.winner = opponent.id;
    next.phase = 'gameover';
    log(`${selfDef.name} has fallen. ${getServantDef(opponent.servant.defId).name} is victorious!`);
    return next;
  }

  // Statuses applied by this turn's own action shouldn't be ticked down until
  // the servant's *next* turn, or a "1 turn" buff would expire before ever being used.
  const preExistingStatusIds = new Set(player.servant.statuses.map((s) => s.id));

  switch (action.type) {
    case 'attack': {
      const critOverride = player.master.critNextAttack;
      dealDamage(player.servant, opponent.servant, 1.0, { guaranteedCrit: critOverride });
      if (critOverride) player.master.critNextAttack = false;
      break;
    }
    case 'skill': {
      const skill = selfDef.skills[action.skillIndex];
      if (!skill) {
        log('Invalid skill selected.');
        break;
      }
      if (player.servant.skillCooldowns[action.skillIndex] > 0) {
        log(`${skill.name} is still on cooldown.`);
        break;
      }
      skill.effect(ctx);
      if (skill.npGainSelf) {
        player.servant.npGauge = Math.min(100, player.servant.npGauge + skill.npGainSelf);
      }
      player.servant.skillCooldowns[action.skillIndex] = skill.cooldown;
      break;
    }
    case 'np': {
      if (player.servant.npGauge < 100) {
        log('Noble Phantasm is not ready yet.');
        break;
      }
      selfDef.noblePhantasm.effect(ctx);
      player.servant.npGauge = 0;
      break;
    }
    case 'guard': {
      player.servant.guarding = true;
      player.servant.npGauge = Math.min(100, player.servant.npGauge + 10);
      log(`${selfDef.name} takes a defensive stance.`);
      break;
    }
    case 'commandSpell': {
      if (player.master.commandSpells <= 0) {
        log('No Command Spells remaining!');
        break;
      }
      player.master.commandSpells -= 1;
      if (action.effect === 'heal') {
        const healed = Math.round(player.servant.maxHp * 0.3);
        player.servant.hp = Math.min(player.servant.maxHp, player.servant.hp + healed);
        log(`${player.master.name} burns a Command Spell to heal ${selfDef.name} for ${healed} HP!`);
      } else if (action.effect === 'crit') {
        player.master.critNextAttack = true;
        log(`${player.master.name} burns a Command Spell — the next attack is guaranteed to land true!`);
      } else if (action.effect === 'chargeNP') {
        player.servant.npGauge = 100;
        log(`${player.master.name} burns a Command Spell to instantly charge the Noble Phantasm!`);
      }
      break;
    }
  }

  if (opponent.servant.hp <= 0) {
    next.winner = player.id;
    next.phase = 'gameover';
    log(`${getServantDef(opponent.servant.defId).name} has fallen. ${selfDef.name} is victorious!`);
    return next;
  }

  tickStatuses(player.servant, preExistingStatusIds);
  player.servant.skillCooldowns = player.servant.skillCooldowns.map((cd) => Math.max(0, cd - 1));

  finishTurn(next, otherIdx);
  return next;
}

function finishTurn(state: BattleState, otherIdx: 0 | 1) {
  state.activePlayerIndex = otherIdx;
  if (otherIdx === 0) state.round += 1;
}
