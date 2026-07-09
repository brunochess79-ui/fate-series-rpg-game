import { getServantDef } from '../data/servants';
import type { BattleAction, BattleState, ServantInstance, TeamOrders } from '../types';

/** Pick the enemy Servant to aim at: the living one with the lowest HP,
 * to finish off wounded targets first. */
function pickTarget(enemies: ServantInstance[]): number {
  let best = -1;
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].hp <= 0) continue;
    if (best === -1 || enemies[i].hp < enemies[best].hp) best = i;
  }
  return Math.max(0, best);
}

/** Choose a full set of orders for an AI-controlled team: one action per
 * living Servant (null for the fallen), each aimed at a chosen enemy. */
export function chooseAiOrders(
  state: BattleState,
  aiIndex: 0 | 1,
  rng: () => number = Math.random,
): TeamOrders {
  const player = state.players[aiIndex];
  const enemy = state.players[1 - aiIndex];
  // Command Spells are a shared Master resource: only let one Servant per
  // round spend one, so a desperate team doesn't burn two at once.
  let spellsPlanned = 0;

  return player.servants.map((servant) => {
    if (servant.hp <= 0) return null;
    const target = pickTarget(enemy.servants);
    const action = chooseServantAction(state, aiIndex, servant, spellsPlanned, rng);
    if (action.type === 'commandSpell') spellsPlanned += 1;
    return { action, target };
  });
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
