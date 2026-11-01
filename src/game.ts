import { SERVANT_LIST } from './data/servants';

export type GameMode = 'hotseat' | 'ai' | 'training';

export type TeamSize = 1 | 2;

/** How hard the AI Master plays. Normal is the simple rule set; Hard plays each
 * Servant's best-known line; Easy deliberately plays the weakest options. */
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface SetupResult {
  teamSize: TeamSize;
  p1Name: string;
  p1ServantIds: string[];
  p2Name: string;
  p2ServantIds: string[];
  /** Only meaningful against the AI. */
  difficulty?: Difficulty;
  /** Against the AI: whether each side's Servants were drawn at random, so a rematch re-rolls them. */
  p1Random?: boolean;
  p2Random?: boolean;
}

/** Draw `count` distinct random Servant ids that are not in `exclude`. */
export function drawRandomServants(count: number, exclude: string[] = []): string[] {
  const pool = SERVANT_LIST.filter((s) => !exclude.includes(s.id));
  const picks: string[] = [];
  while (picks.length < count && picks.length < pool.length) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!picks.includes(candidate.id)) picks.push(candidate.id);
  }
  return picks;
}

/**
 * The setup for a rematch: anything that was drawn at random is drawn again
 * (the two sides never share a Servant); anything that was chosen is kept.
 */
export function rerollSetup(setup: SetupResult): SetupResult {
  const { teamSize } = setup;
  let p1 = setup.p1ServantIds;
  let p2 = setup.p2ServantIds;
  if (setup.p2Random) {
    if (setup.p1Random) p1 = drawRandomServants(teamSize);
    p2 = drawRandomServants(teamSize, p1);
  } else if (setup.p1Random) {
    p1 = drawRandomServants(teamSize, p2);
  }
  return { ...setup, p1ServantIds: p1, p2ServantIds: p2 };
}
