import type { ServantInstance, StatKey, StatusEffect } from '../types';

export function statMultiplier(instance: ServantInstance, stat: StatKey): number {
  let total = 1;
  for (const status of instance.statuses) {
    if ((status.kind === 'buff' || status.kind === 'debuff') && status.stat === stat) {
      total += status.amount ?? 0;
    }
  }
  return Math.max(0.1, total);
}

export function isStunned(instance: ServantInstance): boolean {
  return instance.statuses.some((s) => s.kind === 'stun' && s.turnsRemaining > 0);
}

export function applyStatus(instance: ServantInstance, status: StatusEffect): void {
  instance.statuses = instance.statuses.filter((s) => s.id !== status.id);
  instance.statuses.push({ ...status });
}

export function dispelBuffs(instance: ServantInstance): number {
  const before = instance.statuses.length;
  instance.statuses = instance.statuses.filter((s) => s.kind !== 'buff');
  return before - instance.statuses.length;
}

export function tickStatuses(instance: ServantInstance, onlyIds?: Set<string>): void {
  instance.statuses = instance.statuses
    .map((s) =>
      // Guaranteed dodges, shields, and any status flagged noGraceRound only
      // protect the round they're cast in, so they never get the "grace
      // round" other freshly-applied statuses get.
      s.kind === 'evade' || s.kind === 'shield' || s.noGraceRound || !onlyIds || onlyIds.has(s.id) ? { ...s, turnsRemaining: s.turnsRemaining - 1 } : s,
    )
    .filter((s) => s.turnsRemaining > 0);
}
