import { getServantDef } from '../data/servants';
import type { BattleAction, BattleState } from '../types';

export function chooseAiAction(state: BattleState, rng: () => number = Math.random): BattleAction {
  const idx = state.activePlayerIndex;
  const player = state.players[idx];
  const def = getServantDef(player.servant.defId);
  const hpRatio = player.servant.hp / player.servant.maxHp;

  if (player.servant.npGauge >= 100) {
    return { type: 'np' };
  }

  if (hpRatio < 0.35) {
    const healIdx = def.skills.findIndex((s, i) => s.tag === 'heal' && player.servant.skillCooldowns[i] === 0);
    if (healIdx >= 0) return { type: 'skill', skillIndex: healIdx };
    if (player.master.commandSpells > 0) return { type: 'commandSpell', effect: 'heal' };
  }

  if (hpRatio < 0.2 && player.master.commandSpells > 0 && rng() < 0.5) {
    return { type: 'commandSpell', effect: 'heal' };
  }

  const buffIdx = def.skills.findIndex(
    (s, i) => (s.tag === 'buff' || s.tag === 'crit' || s.tag === 'utility') && player.servant.skillCooldowns[i] === 0,
  );
  const debuffIdx = def.skills.findIndex((s, i) => s.tag === 'debuff' && player.servant.skillCooldowns[i] === 0);

  if (player.servant.npGauge >= 65 && player.master.commandSpells > 0 && rng() < 0.35) {
    return { type: 'commandSpell', effect: 'chargeNP' };
  }

  if (buffIdx >= 0 && rng() < 0.55) {
    return { type: 'skill', skillIndex: buffIdx };
  }

  if (debuffIdx >= 0 && rng() < 0.4) {
    return { type: 'skill', skillIndex: debuffIdx };
  }

  if (hpRatio < 0.5 && rng() < 0.15) {
    return { type: 'guard' };
  }

  return { type: 'attack' };
}
