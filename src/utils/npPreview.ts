import type { BattleContext, MasterState, ServantDefinition, ServantInstance } from '../types';

// A representative defender used only to preview Noble Phantasm damage on the
// Servant-select screen, before either side's actual opponent is known.
const BASELINE_DEF = 65;
const BASELINE_ENEMY_HP = 1200;

function mockInstance(defId: string, maxHp: number): ServantInstance {
  return { defId, hp: maxHp, maxHp, npGauge: 100, statuses: [], skillCooldowns: [], turnsSurvived: 0 };
}

function mockMaster(): MasterState {
  return { name: '', commandSpells: 0, critNextAttack: false };
}

export interface NpDamageEstimate {
  low: number;
  high: number;
}

/** Runs a Servant's Noble Phantasm effect against a mocked baseline-Defense
 * opponent (no crit, no buffs) to estimate its damage range, mirroring the
 * variance formula in engine/battle.ts. Returns null for support/heal NPs
 * that never call dealDamage against the enemy. */
export function estimateNpDamage(def: ServantDefinition): NpDamageEstimate | null {
  const self = mockInstance(def.id, def.maxHp);
  const enemy = mockInstance('__baseline__', BASELINE_ENEMY_HP);

  let low = 0;
  let high = 0;
  let hits = 0;

  const ctx: BattleContext = {
    self,
    enemy,
    selfMaster: mockMaster(),
    enemyMaster: mockMaster(),
    log: () => {},
    rng: () => 0.5,
    enemyHpFraction: 1,
    dealDamage: (attacker, _defender, multiplier) => {
      if (attacker !== self) return 0;
      const lowHit = Math.max(1, def.atk * multiplier * 0.9 - BASELINE_DEF * 0.5);
      const highHit = Math.max(1, def.atk * multiplier * 1.1 - BASELINE_DEF * 0.5);
      low += lowHit;
      high += highHit;
      hits += 1;
      return Math.round((lowHit + highHit) / 2);
    },
  };

  def.noblePhantasm.effect(ctx);

  if (hits === 0) return null;
  return { low: Math.round(low), high: Math.round(high) };
}
