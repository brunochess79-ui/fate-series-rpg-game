import type { ServantDefinition, ServantInstance } from '../types';
import { applyStatus, dispelBuffs } from '../engine/status';

function label(instance: ServantInstance): string {
  return SERVANTS[instance.defId]?.name ?? instance.defId;
}

const saber: ServantDefinition = {
  id: 'saber',
  name: 'Saber',
  title: 'The Once and Future King',
  className: 'Saber',
  trueName: 'Arthur, King of Britain',
  maxHp: 950,
  atk: 110,
  def: 85,
  agility: 70,
  luck: 70,
  critChance: 0.12,
  passiveDescription: 'A king born to lead: steady stats with no glaring weakness.',
  skills: [
    {
      id: 'charisma',
      name: 'Charisma',
      description: 'The bearing of a king. Raises own Attack by 20% for 3 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'charisma',
          name: 'Charisma',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% ATK',
        });
        ctx.log(`${label(ctx.self)} radiates Charisma — ATK rises!`);
      },
    },
    {
      id: 'mana-burst',
      name: 'Mana Burst',
      description: 'Converts magical energy into raw power for the next attack.',
      cooldown: 3,
      npGainSelf: 10,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mana-burst',
          name: 'Mana Burst',
          kind: 'buff',
          stat: 'atk',
          amount: 0.4,
          turnsRemaining: 1,
          description: '+40% ATK (1 turn)',
        });
        ctx.log(`${label(ctx.self)} channels Mana Burst!`);
      },
    },
    {
      id: 'instinct',
      name: 'Instinct',
      description: 'A sixth sense for danger. Raises own Defense by 25% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'instinct',
          name: 'Instinct',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% DEF',
        });
        ctx.log(`${label(ctx.self)} heightens Instinct — DEF rises!`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Sword of Promised Victory',
    japaneseName: 'Excalibur',
    description: 'A blade of light that cuts down all before it.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} unsheathes the Sword of Promised Victory!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { pierceDef: true, label: 'Excalibur' });
    },
  },
};

const archer: ServantDefinition = {
  id: 'archer',
  name: 'Archer',
  title: 'The Farthest Shot',
  className: 'Archer',
  trueName: 'Arash',
  maxHp: 780,
  atk: 95,
  def: 55,
  agility: 85,
  luck: 55,
  critChance: 0.15,
  passiveDescription: 'A master marksman who trades durability for precision.',
  skills: [
    {
      id: 'eye-of-the-mind',
      name: 'Eye of the Mind',
      description: 'Calm focus in the face of danger. Heals self for 12% max HP.',
      cooldown: 4,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.12);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`${label(ctx.self)} steadies their Eye of the Mind, recovering ${healed} HP.`);
      },
    },
    {
      id: 'clairvoyance',
      name: 'Clairvoyance',
      description: "Sees the enemy's weak point. Raises own crit rate for 2 turns.",
      cooldown: 3,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'clairvoyance',
          name: 'Clairvoyance',
          kind: 'buff',
          stat: 'luck',
          amount: 0.5,
          turnsRemaining: 2,
          description: '+50% crit chance scaling',
        });
        ctx.log(`${label(ctx.self)} activates Clairvoyance!`);
      },
    },
    {
      id: 'sharpshooter',
      name: 'Sharpshooter',
      description: 'The next attack is guaranteed to be a critical hit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sharpshooter-crit',
          name: 'Sharpshooter',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log(`${label(ctx.self)} takes aim — the next shot will not miss.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Stella, the Farthest Arrow',
    japaneseName: 'Hayagrahana Stella',
    description: 'A single arrow loosed with every last drop of life force.',
    rank: 'A++',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} draws their bow to the very limit — Stella, the Farthest Arrow!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 4.5, { guaranteedCrit: true, label: 'Stella' });
      const recoil = Math.round(ctx.self.maxHp * 0.1);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`${label(ctx.self)} spends their own life force, taking ${recoil} recoil damage.`);
    },
  },
};

const lancer: ServantDefinition = {
  id: 'lancer',
  name: 'Lancer',
  title: 'Hound of Culann',
  className: 'Lancer',
  trueName: 'Cú Chulainn',
  maxHp: 850,
  atk: 105,
  def: 60,
  agility: 100,
  luck: 40,
  critChance: 0.1,
  passiveDescription: 'The fastest Servant on the battlefield.',
  skills: [
    {
      id: 'protection-of-the-wolf',
      name: 'Protection of the Wolf',
      description: 'An old protection charm. Heals self for 15% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`${label(ctx.self)} is shielded by the Protection of the Wolf, healing ${healed} HP.`);
      },
    },
    {
      id: 'battle-continuation',
      name: 'Battle Continuation',
      description: 'Refuses to fall. Raises own Defense by 20% for 3 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'battle-continuation',
          name: 'Battle Continuation',
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% DEF',
        });
        ctx.log(`${label(ctx.self)} grits through the pain — DEF rises!`);
      },
    },
    {
      id: 'uplift',
      name: 'Uplift',
      description: 'A burst of battle-fury. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log(`${label(ctx.self)} is uplifted by battle-fury!`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Cursed Spear of the Barbed Thorn',
    japaneseName: 'Gáe Bolg',
    description: "A spear that reverses causality: the thrust always finds the enemy's heart.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} hurls the Cursed Spear of the Barbed Thorn!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 2.8, { pierceDef: true, label: 'Gáe Bolg' });
      applyStatus(ctx.enemy, {
        id: 'barbed-curse',
        name: 'Barbed Curse',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.05),
        turnsRemaining: 2,
        description: 'Bleeding from a cursed wound',
      });
    },
  },
};

const rider: ServantDefinition = {
  id: 'rider',
  name: 'Rider',
  title: 'King of Conquerors',
  className: 'Rider',
  trueName: 'Iskandar',
  maxHp: 1100,
  atk: 100,
  def: 75,
  agility: 60,
  luck: 60,
  critChance: 0.1,
  passiveDescription: 'A king of unmatched vitality, the toughest Servant on the field.',
  skills: [
    {
      id: 'charisma-king',
      name: "King's Charisma",
      description: "A conqueror's presence. Raises own Attack and Defense by 15% for 3 turns.",
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kings-charisma-atk',
          name: "King's Charisma",
          kind: 'buff',
          stat: 'atk',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% ATK',
        });
        applyStatus(ctx.self, {
          id: 'kings-charisma-def',
          name: "King's Charisma",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% DEF',
        });
        ctx.log(`${label(ctx.self)} rallies with a King's Charisma!`);
      },
    },
    {
      id: 'divinity',
      name: 'Divinity',
      description: 'Blood of the divine. Reduces incoming damage by 30% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divinity',
          name: 'Divinity',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log(`${label(ctx.self)} calls upon Divinity — damage will be lessened.`);
      },
    },
    {
      id: 'uplift-rider',
      name: 'Uplift',
      description: 'Rouses the army. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log(`${label(ctx.self)} rouses for the charge ahead!`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Army of Bonds',
    japaneseName: 'Ionioi Hetairoi',
    description: 'The king calls forth the full might of his army in one earth-shaking charge.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} summons the Army of Bonds!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { label: 'Ionioi Hetairoi' });
      applyStatus(ctx.self, {
        id: 'conquerors-momentum',
        name: "Conqueror's Momentum",
        kind: 'buff',
        stat: 'atk',
        amount: 0.2,
        turnsRemaining: 2,
        description: '+20% ATK',
      });
    },
  },
};

const caster: ServantDefinition = {
  id: 'caster',
  name: 'Caster',
  title: 'Witch of Colchis',
  className: 'Caster',
  trueName: 'Medea',
  maxHp: 750,
  atk: 85,
  def: 50,
  agility: 55,
  luck: 45,
  critChance: 0.08,
  passiveDescription: 'A sorceress who unravels enemies with curses rather than steel.',
  skills: [
    {
      id: 'rule-breaker',
      name: 'Rule Breaker',
      description: "A dagger that severs magecraft. Dispels the enemy's buffs.",
      cooldown: 4,
      tag: 'debuff',
      effect: (ctx) => {
        const removed = dispelBuffs(ctx.enemy);
        ctx.log(
          removed > 0
            ? `${label(ctx.self)} uses Rule Breaker, dispelling the enemy's buffs!`
            : `${label(ctx.self)} uses Rule Breaker, but there was nothing to dispel.`,
        );
      },
    },
    {
      id: 'territory-creation',
      name: 'Territory Creation',
      description: "A witch's workshop. Heals self for 18% max HP.",
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`${label(ctx.self)} draws on their Territory Creation, healing ${healed} HP.`);
      },
    },
    {
      id: 'item-construction',
      name: 'Item Construction',
      description: 'A cursed talisman weakens the enemy. Lowers enemy Attack by 20% for 3 turns.',
      cooldown: 4,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'cursed-talisman',
          name: 'Cursed Talisman',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log(`${label(ctx.self)} curses the enemy with a Cursed Talisman!`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Rule of the Jeweled Sword',
    japaneseName: 'Rule of the Jeweled Sword',
    description: 'A barrage of magical blades that rains down over three strikes.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} invokes the Rule of the Jeweled Sword!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 1.1, { label: 'Jeweled Sword I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.1, { label: 'Jeweled Sword II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.1, { label: 'Jeweled Sword III' });
      applyStatus(ctx.enemy, {
        id: 'jeweled-curse',
        name: 'Lingering Curse',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 2,
        description: 'Afflicted by a lingering curse',
      });
    },
  },
};

const assassin: ServantDefinition = {
  id: 'assassin',
  name: 'Assassin',
  title: 'Old Man of the Mountain',
  className: 'Assassin',
  trueName: 'Hassan-i Sabbah',
  maxHp: 700,
  atk: 90,
  def: 45,
  agility: 90,
  luck: 30,
  critChance: 0.3,
  passiveDescription: 'A killer who strikes from the shadows with unmatched precision.',
  skills: [
    {
      id: 'presence-concealment',
      name: 'Presence Concealment',
      description: 'Melts into the shadows. Raises own Defense by 30% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'presence-concealment',
          name: 'Presence Concealment',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log(`${label(ctx.self)} melts into Presence Concealment!`);
      },
    },
    {
      id: 'zabaniya-setup',
      name: 'Zabaniya',
      description: 'A killing technique passed through the ages. Next attack is a guaranteed crit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'zabaniya-crit',
          name: 'Zabaniya',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log(`${label(ctx.self)} prepares a killing blow.`);
      },
    },
    {
      id: 'poison-needle',
      name: 'Poison Needle',
      description: 'A hidden blade coated in poison. Afflicts the enemy with poison.',
      cooldown: 3,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'poison-needle',
          name: 'Poison',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.04),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log(`${label(ctx.self)} strikes with a Poison Needle!`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Delusional Illusion',
    japaneseName: 'Zabaniya',
    description: 'A perfect, unavoidable assassination.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} unleashes Delusional Illusion — there is no escape.`);
      ctx.dealDamage(ctx.self, ctx.enemy, 3.2, {
        guaranteedCrit: true,
        pierceDef: true,
        label: 'Zabaniya',
      });
    },
  },
};

const berserker: ServantDefinition = {
  id: 'berserker',
  name: 'Berserker',
  title: 'The Twelve Labors',
  className: 'Berserker',
  trueName: 'Heracles',
  maxHp: 1200,
  atk: 130,
  def: 35,
  agility: 50,
  luck: 20,
  critChance: 0.05,
  passiveDescription:
    'Mad Enhancement: sanity is traded for power. Attack rises 8% every turn, permanently.',
  onTurnStart: (ctx) => {
    const existing = ctx.self.statuses.find((s) => s.id === 'mad-enhancement');
    const amount = (existing?.amount ?? 0) + 0.08;
    applyStatus(ctx.self, {
      id: 'mad-enhancement',
      name: 'Mad Enhancement',
      kind: 'buff',
      stat: 'atk',
      amount,
      turnsRemaining: Infinity,
      description: `+${Math.round(amount * 100)}% ATK (permanent)`,
    });
  },
  skills: [
    {
      id: 'god-hand',
      name: 'God Hand',
      description: 'Even fatal wounds can be shrugged off. Heals self for 25% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.25);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`${label(ctx.self)} shrugs off death itself with God Hand, healing ${healed} HP.`);
      },
    },
    {
      id: 'reckless-assault',
      name: 'Reckless Assault',
      description: 'Throws caution to the wind. +30% ATK but -20% DEF for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'reckless-assault-atk',
          name: 'Reckless Assault',
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        applyStatus(ctx.self, {
          id: 'reckless-assault-def',
          name: 'Reckless Assault',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 2,
          description: '-20% DEF',
        });
        ctx.log(`${label(ctx.self)} attacks with reckless abandon!`);
      },
    },
    {
      id: 'monstrous-strength',
      name: 'Monstrous Strength',
      description: 'Overwhelming physical power. Next attack is a guaranteed crit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-strength-crit',
          name: 'Monstrous Strength',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log(`${label(ctx.self)} bristles with Monstrous Strength.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Nine Lives',
    japaneseName: 'Nine Lives',
    description: 'A reckless, world-ending smash that spends the wielder\'s own vitality.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log(`${label(ctx.self)} unleashes Nine Lives in a berserk frenzy!`);
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Nine Lives' });
      const recoil = Math.round(ctx.self.maxHp * 0.1);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`${label(ctx.self)} takes ${recoil} recoil damage from their own fury.`);
    },
  },
};

export const SERVANTS: Record<string, ServantDefinition> = {
  saber,
  archer,
  lancer,
  rider,
  caster,
  assassin,
  berserker,
};

export const SERVANT_LIST: ServantDefinition[] = Object.values(SERVANTS);

export function getServantDef(id: string): ServantDefinition {
  const def = SERVANTS[id];
  if (!def) throw new Error(`Unknown servant id: ${id}`);
  return def;
}
