export type GameMode = 'hotseat' | 'ai';

export type TeamSize = 1 | 2;

export interface SetupResult {
  teamSize: TeamSize;
  p1Name: string;
  p1ServantIds: string[];
  p2Name: string;
  p2ServantIds: string[];
}
