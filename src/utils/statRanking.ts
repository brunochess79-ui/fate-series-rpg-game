import type { ServantDefinition } from '../types';
import { estimateNpDamage } from './npPreview';

export interface Standing {
  /** 1-indexed placement, best value = 1st. */
  place: number;
  /** Total Servants competing for this ranking (excludes N/A entries, e.g. support NPs). */
  total: number;
}

interface ServantRankings {
  maxHp: Standing;
  atk: Standing;
  def: Standing;
  agility: Standing;
  critChance: Standing;
  npDamage: Standing | null;
}

function rankBy<T>(items: T[], value: (item: T) => number): Map<T, Standing> {
  const total = items.length;
  const sorted = [...items].sort((a, b) => value(b) - value(a));
  const standings = new Map<T, Standing>();
  sorted.forEach((item, index) => {
    // Standard competition ranking: ties share the same place, and the next
    // distinct value resumes counting from how many Servants rank above it.
    const place = index === 0 || value(sorted[index - 1]) !== value(item) ? index + 1 : standings.get(sorted[index - 1])!.place;
    standings.set(item, { place, total });
  });
  return standings;
}

let cache: Map<string, ServantRankings> | null = null;

/** Computes, once per roster, where every Servant stands (1st, 2nd, ...) for
 * each raw stat and for estimated Noble Phantasm damage. Support/heal-only
 * NPs are excluded from the NP damage ranking entirely (npDamage: null). */
export function getStatRankings(roster: ServantDefinition[]): Map<string, ServantRankings> {
  if (cache) return cache;

  const hpRank = rankBy(roster, (s) => s.maxHp);
  const atkRank = rankBy(roster, (s) => s.atk);
  const defRank = rankBy(roster, (s) => s.def);
  const agiRank = rankBy(roster, (s) => s.agility);
  const critRank = rankBy(roster, (s) => s.critChance);

  const npDamageById = new Map<string, number>();
  for (const s of roster) {
    const estimate = estimateNpDamage(s);
    if (estimate) npDamageById.set(s.id, (estimate.low + estimate.high) / 2);
  }
  const npEligible = roster.filter((s) => npDamageById.has(s.id));
  const npRank = rankBy(npEligible, (s) => npDamageById.get(s.id)!);

  const result = new Map<string, ServantRankings>();
  for (const s of roster) {
    result.set(s.id, {
      maxHp: hpRank.get(s)!,
      atk: atkRank.get(s)!,
      def: defRank.get(s)!,
      agility: agiRank.get(s)!,
      critChance: critRank.get(s)!,
      npDamage: npRank.get(s) ?? null,
    });
  }
  cache = result;
  return result;
}

export function formatStanding(standing: Standing): string {
  const { place, total } = standing;
  const suffix =
    place % 100 >= 11 && place % 100 <= 13
      ? 'th'
      : place % 10 === 1
        ? 'st'
        : place % 10 === 2
          ? 'nd'
          : place % 10 === 3
            ? 'rd'
            : 'th';
  return `${place}${suffix} of ${total}`;
}
