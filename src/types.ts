export type ServantClass =
  | 'Saber'
  | 'Archer'
  | 'Lancer'
  | 'Rider'
  | 'Caster'
  | 'Assassin'
  | 'Berserker'
  | 'Ruler'
  | 'Avenger'
  | 'Shielder'
  | 'Alter Ego'
  | 'Foreigner'
  | 'Beast'
  | 'Pretender'
  | 'MoonCancer';

export type StatKey = 'atk' | 'def' | 'agility' | 'critChance' | 'damage';

export interface StatusEffect {
  id: string;
  name: string;
  kind: 'buff' | 'debuff' | 'dot' | 'stun' | 'shield' | 'evade' | 'regen';
  stat?: StatKey;
  amount?: number;
  potency?: number;
  turnsRemaining: number;
  /** If true, the status ticks down even at the end of the round it was
   * applied in (no grace round) — e.g. a shield that only protects the
   * turn it is cast. Evade statuses always behave this way. */
  noGraceRound?: boolean;
  description: string;
}

export interface BattleContext {
  self: ServantInstance;
  enemy: ServantInstance;
  selfMaster: MasterState;
  enemyMaster: MasterState;
  log: (msg: string) => void;
  rng: () => number;
  dealDamage: (
    attacker: ServantInstance,
    defender: ServantInstance,
    multiplier: number,
    options?: { guaranteedCrit?: boolean; label?: string },
  ) => number;
  /** The enemy's HP / maxHP as it stood before this round's damage pass, so an
   * execute-threshold check (e.g. "below 25% HP") gives the same answer no
   * matter whether this Servant or the enemy is processed first this round. */
  enemyHpFraction: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  npGainSelf?: number;
  tag: 'heal' | 'buff' | 'debuff' | 'crit' | 'utility';
  /** True if this skill deals damage to the enemy. Used to resolve defense
   * (shield/evade) before any damage in a simultaneous round, so it
   * doesn't matter which player is processed first. */
  dealsDamage?: boolean;
  effect: (ctx: BattleContext) => void;
}

export interface NoblePhantasmDefinition {
  name: string;
  japaneseName?: string;
  description: string;
  rank: string;
  effect: (ctx: BattleContext) => void;
}

export interface ServantDefinition {
  id: string;
  name: string;
  title: string;
  className: ServantClass;
  trueName: string;
  /** Link to this Servant's page on a Fate fan wiki, where their official
   * in-game/anime artwork is displayed by that site (not reproduced here). */
  fateWikiUrl?: string;
  maxHp: number;
  atk: number;
  def: number;
  agility: number;
  critChance: number;
  rank: string;
  strengths: string[];
  weaknesses: string[];
  passiveDescription: string;
  /** actedOffensively is true if this Servant's chosen action this round is
   * an attack, a Noble Phantasm, or a damage-dealing skill (whether or not
   * it actually connects), and false for a stunned Servant or one using a
   * purely defensive/support action. */
  onTurnStart?: (ctx: BattleContext, actedOffensively: boolean) => void;
  skills: SkillDefinition[];
  noblePhantasm: NoblePhantasmDefinition;
}

export interface ServantInstance {
  defId: string;
  hp: number;
  maxHp: number;
  npGauge: number;
  statuses: StatusEffect[];
  skillCooldowns: number[];
  turnsSurvived: number;
}

export interface MasterState {
  name: string;
  commandSpells: number;
  critNextAttack: boolean;
}

export type PlayerKind = 'human' | 'ai';

export interface PlayerState {
  id: 'p1' | 'p2';
  kind: PlayerKind;
  master: MasterState;
  /** The Master's team: one Servant in a classic duel, two in 2v2. */
  servants: ServantInstance[];
  /** True if this Master invoked any Command Spell last round. A Master
   * can only use one Command Spell per round (across the whole team) and
   * never in two consecutive rounds, no matter which Servant it's for. */
  commandSpellLastRound: boolean;
}

export type BattleAction =
  | { type: 'attack' }
  | { type: 'skill'; skillIndex: number }
  | { type: 'np' }
  | { type: 'commandSpell'; effect: 'heal' | 'crit' };

/** One Servant's committed move for a round: the action plus which enemy
 * Servant it is aimed at (an index into the enemy team's servants array;
 * ignored by self-only actions). Null entries mark defeated Servants. */
export interface ServantOrder {
  action: BattleAction;
  target: number;
}

export type TeamOrders = Array<ServantOrder | null>;

export interface BattleState {
  players: [PlayerState, PlayerState];
  round: number;
  log: string[];
  winner: 'p1' | 'p2' | null;
  winReason: 'defeat' | 'overkillTiebreak' | 'draw' | null;
  phase: 'battle' | 'gameover';
}
