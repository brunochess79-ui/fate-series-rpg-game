import type { ServantDefinition } from '../../types';
import { ARCHER_SERVANTS } from './archer';
import { ASSASSIN_SERVANTS } from './assassin';
import { BERSERKER_SERVANTS } from './berserker';
import { CASTER_SERVANTS } from './caster';
import { LANCER_SERVANTS } from './lancer';
import { RIDER_SERVANTS } from './rider';
import { SABER_SERVANTS } from './saber';
import { RULER_SERVANTS } from './ruler';
import { SHIELDER_SERVANTS } from './shielder';
import { PRETENDER_SERVANTS } from './pretender';
import { AVENGER_SERVANTS } from './avenger';
import { ALTER_EGO_SERVANTS } from './alterego';
import { FOREIGNER_SERVANTS } from './foreigner';

export const SERVANT_LIST: ServantDefinition[] = [
  ...SABER_SERVANTS,
  ...ARCHER_SERVANTS,
  ...LANCER_SERVANTS,
  ...RIDER_SERVANTS,
  ...CASTER_SERVANTS,
  ...ASSASSIN_SERVANTS,
  ...BERSERKER_SERVANTS,
  ...RULER_SERVANTS,
  ...SHIELDER_SERVANTS,
  ...PRETENDER_SERVANTS,
  ...AVENGER_SERVANTS,
  ...ALTER_EGO_SERVANTS,
  ...FOREIGNER_SERVANTS,
];

export const SERVANTS: Record<string, ServantDefinition> = Object.fromEntries(
  SERVANT_LIST.map((servant) => [servant.id, servant]),
);

export function getServantDef(id: string): ServantDefinition {
  const def = SERVANTS[id];
  if (!def) throw new Error(`Unknown servant id: ${id}`);
  return def;
}
