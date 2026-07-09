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
  ServantOrder,
  TeamOrders,
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

export function createPlayer(
  id: 'p1' | 'p2',
  kind: PlayerKind,
  masterName: string,
  servantDefIds: string[],
): PlayerState {
  return {
    id,
    kind,
    master: createMasterState(masterName),
    servants: servantDefIds.map(createServantInstance),
    commandSpellLastRound: false,
  };
}

function teamNames(player: PlayerState): string {
  return player.servants.map((s) => getServantDef(s.defId).name).join(' & ');
}

export function createBattle(p1: PlayerState, p2: PlayerState): BattleState {
  return {
    players: [p1, p2],
    round: 1,
    log: [`The Holy Grail War begins. ${p1.master.name}'s ${teamNames(p1)} face${p1.servants.length === 1 ? 's' : ''} ${p2.master.name}'s ${teamNames(p2)}!`],
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
      ? 0.02
      : Math.min(0.1, Math.max(0.02, 0.02 + (defenderDef.agility - attackerDef.agility) * 0.003));
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
 * this round regardless of which combatant is processed first. */
function actionPhase(def: ServantDefinition, action: BattleAction): 'setup' | 'damage' {
  if (action.type === 'attack' || action.type === 'np') return 'damage';
  if (action.type === 'skill') {
    const skill = def.skills[action.skillIndex];
    return skill?.dealsDamage ? 'damage' : 'setup';
  }
  return 'setup';
}

/** One acting Servant this round: who they are, whose team, and their order. */
interface Combatant {
  player: PlayerState;
  enemyPlayer: PlayerState;
  servant: ServantInstance;
  def: ServantDefinition;
  order: ServantOrder;
  /** Resolved target instance on the enemy team (retargeted if the chosen
   * target died to a start-of-round tick). */
  target: ServantInstance;
  stunned: boolean;
  intendsNp: boolean;
  enemyHpFraction: number;
}

function livingServants(player: PlayerState): ServantInstance[] {
  return player.servants.filter((s) => s.hp > 0);
}

/**
 * Both Masters commit every Servant's move without seeing the other side's
 * choices, so a round always resolves all actions in full — nobody wins
 * simply by having gone "first". Orders are arrays aligned with each team's
 * servants (null for defeated Servants). A round that fells both teams at
 * once is decided by whichever team took the lesser total overkill.
 */
export function resolveRound(
  state: BattleState,
  p1Orders: TeamOrders,
  p2Orders: TeamOrders,
  rng: () => number = Math.random,
): BattleState {
  const next: BattleState = structuredClone(state);
  const [p1, p2] = next.players;
  const log = (msg: string) => next.log.push(msg);
  const dealDamage = makeDealDamage(log, rng);
  const teams: [PlayerState, PlayerState] = [p1, p2];
  const allOrders: [TeamOrders, TeamOrders] = [p1Orders, p2Orders];

  const makeCtx = (
    c: Combatant,
    enemyHpFraction?: number,
  ): BattleContext => ({
    self: c.servant,
    enemy: c.target,
    selfMaster: c.player.master,
    enemyMaster: c.enemyPlayer.master,
    log,
    rng,
    dealDamage,
    enemyHpFraction: enemyHpFraction ?? c.target.hp / c.target.maxHp,
  });

  // Who was standing when the round began (start-of-round ticks and this
  // round's actions can change that, but the roster of actors is fixed now).
  const aliveAtStart = teams.map((t) => t.servants.map((s) => s.hp > 0));

  // Start-of-round ticks (dot/regen) for every living Servant.
  teams.forEach((team, ti) => {
    team.servants.forEach((servant, slot) => {
      if (!aliveAtStart[ti][slot]) return;
      const def = getServantDef(servant.defId);
      servant.turnsSurvived += 1;
      if (def.onTurnStart) {
        const order = allOrders[ti][slot];
        const actedOffensively =
          !isStunned(servant) && order !== null && actionPhase(def, order.action) === 'damage';
        def.onTurnStart(
          {
            self: servant,
            enemy: livingServants(teams[1 - ti])[0] ?? teams[1 - ti].servants[0],
            selfMaster: team.master,
            enemyMaster: teams[1 - ti].master,
            log,
            rng,
            dealDamage,
            enemyHpFraction: 1,
          },
          actedOffensively,
        );
      }
      for (const dot of servant.statuses.filter((s) => s.kind === 'dot')) {
        const dmg = dot.potency ?? 0;
        servant.hp = servant.hp - dmg;
        log(`${def.name} suffers ${dmg} damage from ${dot.name}.`);
      }
      for (const regen of servant.statuses.filter((s) => s.kind === 'regen')) {
        const healed = regen.potency ?? 0;
        // Not clamped to maxHp here - see clampHp below for why.
        servant.hp = servant.hp + healed;
        log(`${def.name} recovers ${healed} HP from ${regen.name}.`);
      }
    });
  });

  // A heal is never clamped to maxHp at the moment it's applied - only once,
  // at the very end of the round, after everything queued this round (the
  // start-of-round regen/dot tick, Pass 1 setup heals, and Pass 2 damage)
  // has landed. Otherwise a heal resolved before this round's damage could
  // get wasted by overflowing at full HP, while the same heal would land in
  // full if it happened to be processed after the damage - an order-
  // dependent outcome for things meant to happen at the same time. The
  // lower bound is intentionally left uncapped so a lethal blow still shows
  // as overkill.
  const clampHp = (instance: ServantInstance) => {
    instance.hp = Math.min(instance.hp, instance.maxHp);
  };

  // A dot tick alone can kill a Servant (or a whole team) outright before
  // any action resolves. A Servant killed by the tick loses their action.
  logNewlyFallen(next, aliveAtStart, log);
  if (finalizeIfDefeated(next, log)) return next;

  // Build the acting roster: every Servant alive right now with an order.
  const combatants: Combatant[] = [];
  teams.forEach((team, ti) => {
    team.servants.forEach((servant, slot) => {
      if (servant.hp <= 0) return;
      const order = allOrders[ti][slot];
      if (!order) return;
      const enemyPlayer = teams[1 - ti];
      // Retarget if the chosen target is already down (e.g. died to a tick).
      const requested = enemyPlayer.servants[order.target];
      const target = requested && requested.hp > 0 ? requested : livingServants(enemyPlayer)[0] ?? enemyPlayer.servants[0];
      const stunned = isStunned(servant);
      combatants.push({
        player: team,
        enemyPlayer,
        servant,
        def: getServantDef(servant.defId),
        order,
        target,
        stunned,
        // Snapshot NP intent before any Pass 1 skill can touch the gauge:
        // an NP-drain used the same round the NP fires takes nothing.
        intendsNp: !stunned && order.action.type === 'np' && servant.npGauge >= 100,
        enemyHpFraction: 1, // set right before Pass 2
      });
    });
  });

  const protectNpIntent = () => {
    for (const c of combatants) {
      if (c.intendsNp && c.servant.npGauge < 100) {
        c.servant.npGauge = 100;
        log(`${c.def.name}'s Noble Phantasm is already invoked — the gauge drain takes nothing!`);
      }
    }
  };

  // Statuses applied this round shouldn't be ticked down until each
  // Servant's *next* round, or a "1 turn" buff would expire before use.
  const preExisting = teams.map((t) => t.servants.map((s) => new Set(s.statuses.map((st) => st.id))));

  // Snapshot every Servant's NP gauge before anything this round changes it,
  // so an NP-denial effect (Heracles's Monstrous Strength) can measure
  // exactly how much each enemy gained this round, independent of order.
  const npGaugeAtRoundStart = teams.map((t) => t.servants.map((s) => s.npGauge));

  // One Command Spell per Master per round, shared across the whole team.
  const spellsThisRound = new Map<PlayerState, number>([[p1, 0], [p2, 0]]);

  const performAction = (c: Combatant, enemyHpFraction?: number) => {
    const ctx = makeCtx(c, enemyHpFraction);
    const action = c.order.action;
    const self = c.player;

    switch (action.type) {
      case 'attack': {
        const critOverride = self.master.critNextAttack;
        dealDamage(c.servant, c.target, 1.0, { guaranteedCrit: critOverride });
        if (critOverride) self.master.critNextAttack = false;
        break;
      }
      case 'skill': {
        const skill = c.def.skills[action.skillIndex];
        if (!skill) {
          log('Invalid skill selected.');
          break;
        }
        if (c.servant.skillCooldowns[action.skillIndex] > 0) {
          log(`${skill.name} is still on cooldown.`);
          break;
        }
        skill.effect(ctx);
        if (skill.npGainSelf) {
          c.servant.npGauge = Math.min(100, c.servant.npGauge + skill.npGainSelf);
        }
        c.servant.skillCooldowns[action.skillIndex] = skill.cooldown;
        break;
      }
      case 'np': {
        if (c.servant.npGauge < 100) {
          log('Noble Phantasm is not ready yet.');
          break;
        }
        const npCtx: BattleContext = {
          ...ctx,
          dealDamage: (a, d, m, opts) => dealDamage(a, d, m, { ...opts, isNP: true }),
        };
        c.def.noblePhantasm.effect(npCtx);
        c.servant.npGauge = 0;
        break;
      }
      case 'commandSpell': {
        if (self.master.commandSpells <= 0) {
          log('No Command Spells remaining!');
          break;
        }
        // A Master may never invoke Command Spells in two consecutive
        // rounds, no matter which Servant or effect is involved...
        if (self.commandSpellLastRound) {
          log(`${self.master.name} cannot invoke a Command Spell two rounds in a row!`);
          break;
        }
        // ...and never more than one in the same round across the team.
        if ((spellsThisRound.get(self) ?? 0) >= 1) {
          log(`${self.master.name} can only invoke one Command Spell per round!`);
          break;
        }
        if (action.effect === 'heal') {
          self.master.commandSpells -= 1;
          spellsThisRound.set(self, 1);
          const healed = Math.round(c.servant.maxHp * 0.25);
          c.servant.hp = c.servant.hp + healed; // clamped once at end of round, see clampHp
          log(`${self.master.name} burns a Command Spell to heal ${c.def.name} for ${healed} HP!`);
        } else if (action.effect === 'crit') {
          self.master.commandSpells -= 1;
          spellsThisRound.set(self, 1);
          self.master.critNextAttack = true;
          log(`${self.master.name} burns a Command Spell — the next attack is guaranteed to land true!`);
        }
        break;
      }
    }
  };

  // Pass 1: buffs/debuffs/heals, and other non-damaging actions for
  // every combatant, so any defense set up this round is in place first.
  for (const c of combatants) {
    if (c.stunned) {
      log(`${c.def.name} is stunned and cannot act!`);
      continue;
    }
    if (actionPhase(c.def, c.order.action) === 'setup') performAction(c);
  }

  // Undo any Pass 1 gauge drain against a Servant whose NP fires this round.
  protectNpIntent();

  // Pass 2: attacks, Noble Phantasms, and damaging skills. NP intent was
  // snapshotted *before* Pass 1 resolved and every combatant's target HP
  // fraction is snapshotted before either side's damage lands, so the
  // outcome doesn't depend on processing order: simultaneous NPs both fire,
  // and an execute-threshold skill reads the same value for everyone.
  for (const c of combatants) {
    c.enemyHpFraction = c.target.hp / c.target.maxHp;
  }
  for (const c of combatants) {
    if (c.stunned) continue;
    if (actionPhase(c.def, c.order.action) === 'damage') performAction(c, c.enemyHpFraction);
  }

  // Force each NP user's gauge back to 0 regardless of what the other
  // side's simultaneous actions granted them afterward.
  for (const c of combatants) {
    if (c.intendsNp) c.servant.npGauge = 0;
  }

  // Monstrous Strength (Heracles) denies whatever NP gauge the enemy team
  // gained this round - it doesn't hand that gauge to the holder, just
  // wipes it out. Both sides' gains are computed up front, before either
  // denial happens, so a mirror match resolves the same regardless of
  // which side is processed first.
  const npGains = teams.map((t, ti) => t.servants.map((s, si) => Math.max(0, s.npGauge - npGaugeAtRoundStart[ti][si])));
  const denies = teams.map((t) => t.servants.some((s) => s.statuses.some((st) => st.id === 'monstrous-strength__npDeny')));
  teams.forEach((team, ti) => {
    if (!denies[ti]) return;
    const enemyTi = 1 - ti;
    teams[enemyTi].servants.forEach((enemyServant, si) => {
      if (enemyServant.hp <= 0 || npGains[enemyTi][si] <= 0) return;
      enemyServant.npGauge = Math.max(0, enemyServant.npGauge - npGains[enemyTi][si]);
      log(`${team.master.name}'s team denies ${getServantDef(enemyServant.defId).name} any Noble Phantasm gauge gained this round!`);
    });
  });
  teams.forEach((team) => {
    team.servants.forEach((s) => {
      s.statuses = s.statuses.filter((st) => st.id !== 'monstrous-strength__npDeny');
    });
  });

  teams.forEach((team, ti) => {
    team.servants.forEach((servant, slot) => {
      if (!aliveAtStart[ti][slot]) return;
      tickStatuses(servant, preExisting[ti][slot]);
      servant.skillCooldowns = servant.skillCooldowns.map((cd) => Math.max(0, cd - 1));
    });
  });

  // Whether each Master spent a Command Spell this round gates next round.
  teams.forEach((team) => {
    team.commandSpellLastRound = (spellsThisRound.get(team) ?? 0) > 0;
  });

  teams.forEach((team) => team.servants.forEach(clampHp));

  logNewlyFallen(next, aliveAtStart, log);
  if (finalizeIfDefeated(next, log)) return next;

  next.round += 1;
  return next;
}

/** Log individual Servants who fell this round while their team fights on.
 * Full team defeats get their own message in finalizeIfDefeated. */
function logNewlyFallen(state: BattleState, aliveAtStart: boolean[][], log: (msg: string) => void) {
  state.players.forEach((team, ti) => {
    const teamWiped = team.servants.every((s) => s.hp <= 0);
    if (teamWiped) return; // the finalize message covers the team's fall
    team.servants.forEach((servant, slot) => {
      if (aliveAtStart[ti][slot] && servant.hp <= 0) {
        log(`${getServantDef(servant.defId).name} has fallen! ${team.master.name} fights on with their remaining Servant.`);
      }
    });
  });
}

function teamTotalHp(player: PlayerState): number {
  return player.servants.reduce((sum, s) => sum + s.hp, 0);
}

function finalizeIfDefeated(state: BattleState, log: (msg: string) => void): boolean {
  const [p1, p2] = state.players;
  const p1Down = p1.servants.every((s) => s.hp <= 0);
  const p2Down = p2.servants.every((s) => s.hp <= 0);

  if (!p1Down && !p2Down) return false;

  if (p1Down && p2Down) {
    const p1Total = teamTotalHp(p1);
    const p2Total = teamTotalHp(p2);
    if (p1Total === p2Total) {
      log(
        `${teamNames(p1)} and ${teamNames(p2)} all fall in the same instant, ` +
          `taking the exact same total blow (${p1Total} HP each side) — the Grail declares no victor.`,
      );
      state.winner = null;
      state.winReason = 'draw';
      state.phase = 'gameover';
      return true;
    }
    // Whichever team was overkilled less (higher, less-negative HP) wins.
    const winner = p1Total > p2Total ? p1 : p2;
    const loser = winner === p1 ? p2 : p1;
    log(
      `Both sides fall in the same instant! ${winner.master.name}'s ${teamNames(winner)} ` +
        `(${teamTotalHp(winner)} total HP) outlast ${loser.master.name}'s ${teamNames(loser)} ` +
        `(${teamTotalHp(loser)} total HP) — the lesser blow leaves them standing a moment longer!`,
    );
    state.winner = winner.id;
    state.winReason = 'overkillTiebreak';
    state.phase = 'gameover';
    return true;
  }

  const winner = p1Down ? p2 : p1;
  const loser = p1Down ? p1 : p2;
  log(`${loser.master.name}'s ${teamNames(loser)} ${loser.servants.length === 1 ? 'has' : 'have all'} fallen. ${winner.master.name}'s ${teamNames(winner)} ${winner.servants.length === 1 ? 'is' : 'are'} victorious!`);
  state.winner = winner.id;
  state.winReason = 'defeat';
  state.phase = 'gameover';
  return true;
}
