import { getServantDef } from '../data/servants';
import { EASY_LINES, HARD_LINES } from '../data/aiLines';
import type { BattleAction, BattleState, ServantInstance } from '../types';

/**
 * Options that change how a Servant is played. The Hard AI uses the best
 * combination found for each Servant; the Easy AI uses the options that
 * measurably lose that Servant the most matchups.
 */
export interface AiLineFlags {
  /** 'low' heals later (at ~50% HP), 'high' heals earlier (at ~85-90%). */
  heal?: 'low' | 'high';
  /** Never spend a turn on a stat-lowering or damage-over-time debuff skill. */
  noDebuff?: boolean;
  /** Never spend a turn on a self ATK buff. */
  noBuff?: boolean;
  /** Cast a "next hit is a guaranteed crit" skill just before the NP is ready. */
  critSetup?: boolean;
  /** Never cast the shield skill. */
  noShield?: boolean;
  /** Cast a DEF buff when below 60% HP. */
  defBuff?: boolean;
}

interface SkillInfo {
  selfAtkBuff: boolean;
  selfDefBuff: boolean;
  critReady: boolean;
  shield: boolean;
  heal: boolean;
  enemyDebuff: boolean;
  stun: boolean;
  dmg: boolean;
  selfIds: string[];
  enemyIds: string[];
}

const infoCache = new Map<string, SkillInfo[]>();

/** Work out what each skill does by firing it once at a dummy target. */
function probe(defId: string, idx: number): SkillInfo {
  const skill = getServantDef(defId).skills[idx];
  const mk = (id: string, hp: number): ServantInstance => ({
    defId: id,
    hp,
    maxHp: 1200,
    npGauge: 50,
    statuses: [],
    skillCooldowns: [0, 0, 0],
    turnsSurvived: 0,
  });
  const self = mk(defId, 600);
  const enemy = mk('__dummy__', 1200);
  const master = { name: '', commandSpells: 0, critNextAttack: false };
  skill.effect({
    self,
    enemy,
    selfMaster: master,
    enemyMaster: { ...master },
    log: () => {},
    rng: () => 0.5,
    enemyHpFraction: 1,
    dealDamage: () => 0,
  } as Parameters<typeof skill.effect>[0]);
  const s = self.statuses;
  const e = enemy.statuses;
  return {
    selfAtkBuff: s.some((x) => x.kind === 'buff' && (x.stat === 'atk' || x.stat === 'damage') && (x.amount ?? 0) > 0),
    selfDefBuff: s.some((x) => x.kind === 'buff' && x.stat === 'def' && (x.amount ?? 0) > 0),
    critReady: s.some((x) => x.id.endsWith('__critReady')),
    shield: s.some((x) => x.kind === 'shield'),
    heal: self.hp > 600 || s.some((x) => x.kind === 'regen'),
    enemyDebuff: e.some((x) => (x.kind === 'debuff' && (x.stat === 'atk' || x.stat === 'def')) || x.kind === 'dot'),
    stun: e.some((x) => x.kind === 'stun'),
    dmg: !!skill.dealsDamage,
    selfIds: s.map((x) => x.id),
    enemyIds: e.map((x) => x.id),
  };
}

function skillInfo(defId: string): SkillInfo[] {
  let info = infoCache.get(defId);
  if (!info) {
    info = getServantDef(defId).skills.map((_, i) => probe(defId, i));
    infoCache.set(defId, info);
  }
  return info;
}

/**
 * Choose one Servant's action with the "playbook": heal when hurt, shield
 * when the foe's NP is ready, fire the NP when charged, stun, buff, debuff,
 * use damaging skills on cooldown, otherwise attack.
 *
 * `easy` adds deliberate blunders: never using Command Spells, spending heals
 * at high HP instead of when they are needed, and sometimes sitting on a
 * fully charged Noble Phantasm for a round.
 */
export function choosePlaybookAction(
  state: BattleState,
  aiIndex: 0 | 1,
  self: ServantInstance,
  foe: ServantInstance,
  spellsPlanned: number,
  flags: AiLineFlags,
  easy: boolean,
  rng: () => number = Math.random,
): BattleAction {
  const player = state.players[aiIndex];
  const info = skillInfo(self.defId);
  const spellHeal = flags.heal === 'low' ? 0.5 : flags.heal === 'high' ? 0.85 : 0.7;
  const skillHeal = flags.heal === 'low' ? 0.5 : flags.heal === 'high' ? 0.9 : 0.75;
  const ready = (i: number) => self.skillCooldowns[i] === 0;
  const hpRatio = self.hp / self.maxHp;
  const skill = (i: number): BattleAction => ({ type: 'skill', skillIndex: i });
  const hasCrit = self.statuses.some((s) => s.id.endsWith('__critReady'));
  const canSpell =
    !easy && player.master.commandSpells > 0 && spellsPlanned === 0 && !player.commandSpellLastRound;

  if (easy) {
    // Blunder: burn the heal while healthy so it is on cooldown when it matters.
    const wasteHeal = info.findIndex((x, i) => ready(i) && x.heal && !x.dmg);
    if (wasteHeal >= 0 && hpRatio > 0.8) return skill(wasteHeal);
  } else {
    if (hpRatio < spellHeal && canSpell) return { type: 'commandSpell', effect: 'heal' };
    const heal = info.findIndex((x, i) => ready(i) && x.heal && !x.dmg);
    if (heal >= 0 && hpRatio < skillHeal) return skill(heal);
  }

  if (!flags.noShield && foe.npGauge >= 100) {
    const sh = info.findIndex((x, i) => ready(i) && x.shield);
    if (sh >= 0) return skill(sh);
  }

  if (flags.critSetup && !hasCrit && self.npGauge >= 70 && self.npGauge < 100) {
    const c = info.findIndex((x, i) => ready(i) && x.critReady);
    if (c >= 0) return skill(c);
  }

  if (self.npGauge >= 100 && !(easy && rng() < 0.4)) return { type: 'np' };

  const stun = info.findIndex((x, i) => ready(i) && x.stun);
  if (stun >= 0) return skill(stun);

  if (flags.defBuff && hpRatio < 0.6) {
    const d = info.findIndex(
      (x, i) => ready(i) && x.selfDefBuff && !x.dmg && !x.selfIds.some((id) => self.statuses.some((s) => s.id === id)),
    );
    if (d >= 0) return skill(d);
  }

  const buff = info.findIndex(
    (x, i) => ready(i) && x.selfAtkBuff && !x.dmg && !x.selfIds.some((id) => self.statuses.some((s) => s.id === id)),
  );
  if (!flags.noBuff && buff >= 0 && self.npGauge >= 55) return skill(buff);

  const debuff = info.findIndex(
    (x, i) => ready(i) && x.enemyDebuff && !x.dmg && !x.enemyIds.some((id) => foe.statuses.some((s) => s.id === id)),
  );
  if (!flags.noDebuff && debuff >= 0) return skill(debuff);

  const dmg = info.findIndex((x, i) => ready(i) && x.dmg);
  if (dmg >= 0) return skill(dmg);

  return { type: 'attack' };
}

export function linesFor(defId: string, easy: boolean): AiLineFlags {
  return (easy ? EASY_LINES : HARD_LINES)[defId] ?? {};
}
