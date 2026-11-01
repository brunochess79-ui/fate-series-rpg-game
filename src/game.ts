export type GameMode = 'hotseat' | 'ai';

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
}
