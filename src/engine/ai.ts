import { getServantDef } from '../data/servants';
import type { Difficulty } from '../game';
import type { BattleAction, BattleState, ServantInstance, TeamOrders } from '../types';
import { resolveRound } from './battle';
import { decidePlaybook, linesFor } from './aiPolicy';
import { trainingLineFor } from './coach';

/** Pick the enemy Servant to aim at: the living one with the lowest HP,
 * to finish off wounded targets first. (Easy AI aims at the healthiest instead.) */
function pickTarget(enemies: ServantInstance[], healthiestFirst = false): number {
  let best = -1;
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].hp <= 0) continue;
    if (best === -1) best = i;
    else if (healthiestFirst ? enemies[i].hp > enemies[best].hp : enemies[i].hp < enemies[best].hp) best = i;
  }
  return Math.max(0, best);
}

/** Choose a full set of orders for an AI-controlled team: one action per
 * living Servant (null for the fallen), each aimed at a chosen enemy.
 *
 * - normal: the simple rules below.
 * - hard: each Servant plays the best line found for it.
 * - perfect: each Servant plays the best line found in the tournaments (used by Watch AI vs AI).
 * - easy: each Servant plays the options that lose it the most matchups.
 */
export function chooseAiOrders(
  state: BattleState,
  aiIndex: 0 | 1,
  rng: () => number = Math.random,
  difficulty: Difficulty = 'normal',
): TeamOrders {
  const orders = planAiOrders(state, aiIndex, rng, difficulty).orders;
  // Hard AI in a 2v2: don't just hit the weakest enemy, test the target choices.
  if (difficulty === 'hard' && state.players[aiIndex].servants.length > 1) {
    return refineTargetsBySimulation(state, aiIndex, orders);
  }
  return orders;
}

/** How many simulated playouts judge each target choice, and how much better
 * than the default (weakest-enemy) targets another choice must look to be used. */
const ROLLOUTS = 24;
const ROLLOUT_MARGIN = 0.1;
const ROLLOUT_MAX_ROUNDS = 80;

/** Both sides play their Hard-AI orders (always aiming at the lowest-HP enemy). */
function defaultRoundOrders(state: BattleState, index: 0 | 1): TeamOrders {
  return planAiOrders(state, index, Math.random, 'hard').orders;
}

/** Win fraction (draw = half) for `side` from `state` onward, after the AI side's
 * first-round targets are replaced by `firstTargets`. */
function playout(state: BattleState, side: 0 | 1, firstTargets: number[]): number {
  let s: BattleState = structuredClone(state);
  s.log = [];
  let first = true;
  for (let r = 0; r < ROLLOUT_MAX_ROUNDS && s.phase !== 'gameover'; r++) {
    const a = defaultRoundOrders(s, 0);
    const b = defaultRoundOrders(s, 1);
    if (first) {
      (side === 0 ? a : b).forEach((o, i) => {
        if (o) o.target = firstTargets[i];
      });
      first = false;
    }
    s = resolveRound(s, a, b);
    s.log = [];
  }
  if (s.winner === null) return 0.5;
  return s.winner === state.players[side].id ? 1 : 0;
}

/**
 * Keep each Servant's chosen action, but pick WHO each one attacks by simulating
 * the rest of the fight for every target combination and choosing the one that
 * wins most often. Falls back to the default targets unless another combination
 * is clearly better (so a lone Servant, or an even call, behaves as before).
 */
function refineTargetsBySimulation(state: BattleState, aiIndex: 0 | 1, orders: TeamOrders): TeamOrders {
  const foes = state.players[1 - aiIndex].servants;
  const alive = foes.map((f, i) => (f.hp > 0 ? i : -1)).filter((i) => i >= 0);
  if (alive.length < 2) return orders;

  const base = orders.map((o) => (o ? o.target : 0));
  let combos: number[][] = [[]];
  for (let k = 0; k < orders.length; k++) {
    const next: number[][] = [];
    for (const c of combos) {
      if (!orders[k]) next.push([...c, 0]);
      else for (const t of alive) next.push([...c, t]);
    }
    combos = next;
  }
  const score = (c: number[]) => {
    let w = 0;
    for (let n = 0; n < ROLLOUTS; n++) w += playout(state, aiIndex, c);
    return w / ROLLOUTS;
  };
  let best = base;
  let bestValue = score(base);
  for (const c of combos) {
    if (c.every((t, i) => t === base[i])) continue;
    const v = score(c);
    if (v > bestValue + ROLLOUT_MARGIN) {
      best = c;
      bestValue = v;
    }
  }
  return orders.map((o, i) => (o ? { ...o, target: best[i] } : o));
}

/** Like chooseAiOrders, but also says why each Servant's move was picked (for the Watch view). */
export function planAiOrders(
  state: BattleState,
  aiIndex: 0 | 1,
  rng: () => number = Math.random,
  difficulty: Difficulty = 'normal',
): { orders: TeamOrders; reasons: string[] } {
  const player = state.players[aiIndex];
  const enemy = state.players[1 - aiIndex];
  // Command Spells are a shared Master resource: only let one Servant per
  // round spend one, so a desperate team doesn't burn two at once.
  let spellsPlanned = 0;

  const reasons: string[] = [];
  const orders = player.servants.map((servant, slot) => {
    if (servant.hp <= 0) return null;
    const target = pickTarget(enemy.servants, difficulty === 'easy');
    let action: BattleAction;
    if (difficulty === 'normal') {
      action = chooseServantAction(state, aiIndex, servant, spellsPlanned, rng);
      reasons[slot] = 'Follows the simple rules: heal when hurt, then buff, debuff or attack.';
    } else {
      const decision = decidePlaybook(
        state,
        aiIndex,
        servant,
        enemy.servants[target],
        spellsPlanned,
        difficulty === 'perfect' ? trainingLineFor(servant.defId).flags : linesFor(servant.defId, difficulty === 'easy'),
        difficulty === 'easy',
        rng,
      );
      action = decision.action;
      reasons[slot] = decision.reason;
    }
    if (action.type === 'commandSpell') spellsPlanned += 1;
    return { action, target };
  });
  return { orders, reasons };
}

function chooseServantAction(
  state: BattleState,
  aiIndex: 0 | 1,
  servant: ServantInstance,
  spellsPlanned: number,
  rng: () => number,
): BattleAction {
  const player = state.players[aiIndex];
  const def = getServantDef(servant.defId);
  const hpRatio = servant.hp / servant.maxHp;

  if (servant.npGauge >= 100) {
    return { type: 'np' };
  }

  // One spell per round (spellsPlanned) and never two rounds in a row.
  const canHealSpell =
    player.master.commandSpells > 0 && spellsPlanned === 0 && !player.commandSpellLastRound;

  if (hpRatio < 0.35) {
    const healIdx = def.skills.findIndex((s, i) => s.tag === 'heal' && servant.skillCooldowns[i] === 0);
    if (healIdx >= 0) return { type: 'skill', skillIndex: healIdx };
    if (canHealSpell) return { type: 'commandSpell', effect: 'heal' };
  }

  if (hpRatio < 0.2 && canHealSpell && rng() < 0.5) {
    return { type: 'commandSpell', effect: 'heal' };
  }

  const buffIdx = def.skills.findIndex(
    (s, i) => (s.tag === 'buff' || s.tag === 'crit' || s.tag === 'utility') && servant.skillCooldowns[i] === 0,
  );
  const debuffIdx = def.skills.findIndex((s, i) => s.tag === 'debuff' && servant.skillCooldowns[i] === 0);

  if (buffIdx >= 0 && rng() < 0.55) {
    return { type: 'skill', skillIndex: buffIdx };
  }

  if (debuffIdx >= 0 && rng() < 0.4) {
    return { type: 'skill', skillIndex: debuffIdx };
  }

  return { type: 'attack' };
}
