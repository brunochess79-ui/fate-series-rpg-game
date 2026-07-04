import type { ServantDefinition } from '../../types';
import { ARCHER_SERVANTS } from './archer';
import { ASSASSIN_SERVANTS } from './assassin';
import { BERSERKER_SERVANTS } from './berserker';
import { CASTER_SERVANTS } from './caster';
import { LANCER_SERVANTS } from './lancer';
import { RIDER_SERVANTS } from './rider';
import { SABER_SERVANTS } from './saber';

export const SERVANT_LIST: ServantDefinition[] = [
  ...SABER_SERVANTS,
  ...ARCHER_SERVANTS,
  ...LANCER_SERVANTS,
  ...RIDER_SERVANTS,
  ...CASTER_SERVANTS,
  ...ASSASSIN_SERVANTS,
  ...BERSERKER_SERVANTS,
];

export const SERVANTS: Record<string, ServantDefinition> = Object.fromEntries(
  SERVANT_LIST.map((servant) => [servant.id, servant]),
);

export function getServantDef(id: string): ServantDefinition {
  const def = SERVANTS[id];
  if (!def) throw new Error(`Unknown servant id: ${id}`);
  return def;
}
