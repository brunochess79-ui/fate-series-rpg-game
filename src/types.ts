export type ServantClass =
  | 'Saber'
  | 'Archer'
  | 'Lancer'
  | 'Rider'
  | 'Caster'
  | 'Assassin'
  | 'Berserker';

export type StatKey = 'atk' | 'def' | 'luck' | 'agility';

export interface StatusEffect {
  id: string;
  name: string;
  kind: 'buff' | 'debuff' | 'dot' | 'stun' | 'guard' | 'shield' | 'evade' | 'regen';
  stat?: StatKey;
  amount?: number;
  potency?: number;
  turnsRemaining: number;
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
    options?: { pierceDef?: boolean; guaranteedCrit?: boolean; label?: string },
  ) => number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  npGainSelf?: number;
  tag: 'heal' | 'buff' | 'debuff' | 'crit' | 'utility';
  /** True if this skill deals damage to the enemy. Used to resolve defense
   * (guard/shield/evade) before any damage in a simultaneous round, so it
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
  maxHp: number;
  atk: number;
  def: number;
  agility: number;
  luck: number;
  critChance: number;
  rank: string;
  strengths: string[];
  weaknesses: string[];
  passiveDescription: string;
  onTurnStart?: (ctx: BattleContext) => void;
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
  guarding: boolean;
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
  servant: ServantInstance;
}

export type BattleAction =
  | { type: 'attack' }
  | { type: 'skill'; skillIndex: number }
  | { type: 'np' }
  | { type: 'guard' }
  | { type: 'commandSpell'; effect: 'heal' | 'crit' };

export interface BattleState {
  players: [PlayerState, PlayerState];
  round: number;
  log: string[];
  winner: 'p1' | 'p2' | null;
  winReason: 'defeat' | 'luckTiebreak' | null;
  phase: 'battle' | 'gameover';
}
