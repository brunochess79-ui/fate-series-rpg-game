import { getServantDef } from '../data/servants';
import { TRAINING_LINES } from '../data/trainingLines';
import type { BattleAction, BattleState, ServantOrder } from '../types';
import { decidePlaybook, skillInfo, type AiLineFlags } from './aiPolicy';

export interface TrainingLine {
  /** The line the coach teaches for this Servant. */
  flags: AiLineFlags;
  /** True when testing found a line that beat the standard Hard-bot line. */
  discovered: boolean;
  /** Extra wins (out of 99 matchups) the discovered line earned in testing. */
  gain?: number;
}

export interface CoachAdvice {
  action: BattleAction;
  reason: string;
}

/** The line the coach teaches: the discovered better line if there is one, otherwise the standard best line. */
export function trainingLineFor(defId: string): TrainingLine {
  return TRAINING_LINES[defId] ?? { flags: {}, discovered: false };
}

/** What the coach recommends for the player's Servant right now (1v1). */
export function coachAdvice(state: BattleState, playerIndex: 0 | 1 = 0): CoachAdvice {
  const me = state.players[playerIndex].servants[0];
  const foe = state.players[1 - playerIndex].servants[0];
  const line = trainingLineFor(me.defId);
  return decidePlaybook(state, playerIndex, me, foe, 0, line.flags, false);
}

export function sameAction(a: BattleAction, b: BattleAction): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'skill' && b.type === 'skill') return a.skillIndex === b.skillIndex;
  if (a.type === 'commandSpell' && b.type === 'commandSpell') return a.effect === b.effect;
  return true;
}

export function describeAction(defId: string, action: BattleAction): string {
  switch (action.type) {
    case 'attack':
      return 'Attack';
    case 'np':
      return 'Noble Phantasm';
    case 'skill':
      return `Skill: ${getServantDef(defId).skills[action.skillIndex]?.name ?? 'Skill'}`;
    case 'commandSpell':
      return action.effect === 'heal' ? 'Command Spell: Heal' : 'Command Spell: Guaranteed Crit';
  }
}

export interface CoachRound {
  round: number;
  matched: boolean;
  chosen: string;
  advised: string;
  reason: string;
}

export function gradeRound(defId: string, round: number, order: ServantOrder, advice: CoachAdvice): CoachRound {
  return {
    round,
    matched: sameAction(order.action, advice.action),
    chosen: describeAction(defId, order.action),
    advised: describeAction(defId, advice.action),
    reason: advice.reason,
  };
}

/** The lesson card: a few plain sentences describing how to play this Servant. */
export function lineTips(defId: string): string[] {
  const line = trainingLineFor(defId);
  const def = getServantDef(defId);
  const info = skillInfo(defId);
  const names = (pick: (x: ReturnType<typeof skillInfo>[number]) => boolean) =>
    def.skills.filter((_, i) => pick(info[i])).map((s) => s.name);
  const f = line.flags;
  const tips: string[] = [];

  const crit = names((x) => x.critReady);
  if (f.critSetup && crit.length) {
    tips.push(`Cast ${crit[0]} once your NP gauge passes about 70%, so your Noble Phantasm lands as a guaranteed critical hit.`);
  }
  const debuffs = names((x) => x.enemyDebuff && !x.dmg);
  if (f.noDebuff && debuffs.length) {
    tips.push(`Skip ${debuffs.join(' and ')}: casting ${debuffs.length > 1 ? 'them' : 'it'} costs a whole turn for too little in return.`);
  } else if (debuffs.length) {
    tips.push(`Cast ${debuffs.join(' and ')} when ${debuffs.length > 1 ? 'they are' : 'it is'} ready and not already active — it weakens the enemy and pays off for this Servant.`);
  }
  const buffs = names((x) => x.selfAtkBuff && !x.dmg);
  if (f.noBuff && buffs.length) {
    tips.push(`Skip ${buffs.join(' and ')}: the turn spent buffing is worth more as an attack.`);
  } else if (buffs.length) {
    tips.push(`Cast ${buffs.join(' and ')} once your NP gauge is past about 55% (and the buff is not already active) — the buff pays for the turn.`);
  }
  const shields = names((x) => x.shield);
  if (f.noShield && shields.length) {
    tips.push(`Skip ${shields.join(' and ')}: the shield is too small to be worth a turn.`);
  } else if (shields.length) {
    tips.push(`Raise ${shields[0]} on the round the enemy's NP gauge is full to soften the hit.`);
  }
  if (f.heal === 'low') tips.push('Heal later: wait until you are below about half HP before healing, so the heal is not wasted.');
  if (f.heal === 'high') tips.push('Heal earlier: use your heals as soon as you drop below about 85% HP.');
  if (f.defBuff) tips.push('Raise your defense with your DEF skill once you are below 60% HP.');
  const drains = names((x) => x.drain);
  if (f.useDrain && drains.length) {
    tips.push(`Cast ${drains[0]} whenever the enemy's NP gauge is 40% or more. It lands first, so on a turn they are about to fire it drains the gauge below 100% and cancels their Noble Phantasm.`);
  }
  if (f.holdNpVsShield) tips.push("Hold your Noble Phantasm while the enemy's shield skill is ready, and attack until it is on cooldown.");

  const stuns = names((x) => x.stun);
  if (stuns.length) tips.push(`${stuns.join(' and ')} stuns the enemy — use it whenever it is ready.`);
  const dmgSkills = names((x) => x.dmg);
  if (dmgSkills.length) tips.push(`Use ${dmgSkills.join(' and ')} on cooldown: it out-damages a plain Attack.`);
  tips.push('Fire your Noble Phantasm the moment the gauge reaches 100%, and spend Command Spell heals when you fall low.');
  return tips;
}
