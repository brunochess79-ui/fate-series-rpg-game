import type { ServantDefinition } from '../../types';
import { applyStatus, dispelBuffs } from '../../engine/status';

const cuChulainn: ServantDefinition = {
  id: 'lancer',
  name: 'Cú Chulainn',
  title: 'Hound of Culann',
  className: 'Lancer',
  trueName: 'Cú Chulainn',
  maxHp: 970,
  atk: 109,
  def: 63,
  agility: 100,
  luck: 44,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Speed', 'Sustained Regeneration', 'Evasion'],
  weaknesses: ['Low Luck'],
  passiveDescription: 'The fastest Servant on the battlefield.',
  skills: [
    {
      id: 'protection-of-the-wolf',
      name: 'Protection of the Wolf',
      description: 'An old protection charm. Recovers 5% max HP at the start of each of his next 2 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'protection-of-the-wolf-regen',
          name: 'Protection of the Wolf',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.05),
          turnsRemaining: 2,
          description: 'Recovers 5% max HP per turn',
        });
        ctx.log('Cú Chulainn is shielded by the Protection of the Wolf.');
      },
    },
    {
      id: 'battle-continuation',
      name: 'Battle Continuation',
      description: 'Refuses to fall. Raises own Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
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
        ctx.log('Cú Chulainn grits through the pain — DEF rises!');
      },
    },
    {
      id: 'uplift',
      name: 'Uplift',
      description: 'A burst of battle-fury too fast to follow. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'uplift-evade',
          name: 'Uplift',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Cú Chulainn is uplifted by battle-fury, faster than any strike!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Cursed Spear of the Barbed Thorn',
    japaneseName: 'Gáe Bolg',
    description: "A spear that reverses causality: the thrust always finds the enemy's heart.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Cú Chulainn hurls the Cursed Spear of the Barbed Thorn!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.8, { label: 'Gáe Bolg' });
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

const diarmuid: ServantDefinition = {
  id: 'diarmuid',
  name: 'Diarmuid',
  title: 'The Knight of the Love Spot',
  className: 'Lancer',
  trueName: 'Diarmuid Ua Duibhne',
  maxHp: 980,
  atk: 112,
  def: 65,
  agility: 95,
  luck: 48,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Speed', 'Debuffs'],
  weaknesses: ['Low Luck'],
  passiveDescription: 'Cursed with an irresistible charm, and blessed with peerless spearplay.',
  skills: [
    {
      id: 'gae-dearg',
      name: "Gáe Dearg's Focus",
      description: 'The red spear unravels magecraft. Dispels the enemy\'s buffs.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        const removed = dispelBuffs(ctx.enemy);
        ctx.log(
          removed > 0
            ? "Diarmuid's Gáe Dearg unravels the enemy's magic!"
            : 'Diarmuid readies Gáe Dearg, but finds nothing to unravel.',
        );
      },
    },
    {
      id: 'gae-buidhe',
      name: "Gáe Buidhe's Edge",
      description: 'A wound that refuses to heal. Lowers enemy Defense by 15% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'gae-buidhe',
          name: "Gáe Buidhe's Wound",
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 2,
          description: '-15% DEF',
        });
        ctx.log('Diarmuid opens an unhealing wound with Gáe Buidhe!');
      },
    },
    {
      id: 'loyal-heart',
      name: 'Loyal Heart',
      description: "A knight's devotion sharpens his spear. Raises own Attack by 20% for 2 turns.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'loyal-heart',
          name: 'Loyal Heart',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log("Diarmuid's Loyal Heart steels his resolve!");
      },
    },
  ],
  noblePhantasm: {
    name: 'Twin Lances of Sorrow',
    japaneseName: 'Gáe Dearg and Gáe Buidhe',
    description: 'Both cursed lances strike as one, red and yellow crossing in a single thrust.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Diarmuid crosses the Twin Lances of Sorrow!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.9, { label: 'Twin Lances' });
    },
  },
};

const achilles: ServantDefinition = {
  id: 'achilles',
  name: 'Achilles',
  title: 'The Hero of the Trojan War',
  className: 'Lancer',
  trueName: 'Achilles',
  maxHp: 1130,
  atk: 124,
  def: 73,
  agility: 85,
  luck: 44,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Burst Damage', 'Shielding'],
  weaknesses: ['Low Luck'],
  passiveDescription: 'Nigh invulnerable but for a single, fatal spot upon his heel.',
  skills: [
    {
      id: 'rage-of-achilles',
      name: 'Rage of Achilles',
      description: 'A wrath that shakes the battlefield. Raises own Attack by 30% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rage-of-achilles',
          name: 'Rage of Achilles',
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        ctx.log('Achilles is consumed by the Rage of Achilles!');
      },
    },
    {
      id: 'divine-bath',
      name: 'Divine Bath',
      description: 'The river Styx wards his body once more. Grants a shield that absorbs damage equal to 18% of his max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divine-bath-shield',
          name: 'Divine Bath',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.18),
          turnsRemaining: 2,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Achilles recalls the Divine Bath — his skin turns aside harm.');
      },
    },
    {
      id: 'phalanx-break',
      name: 'Phalanx Break',
      description: 'A charge that shatters formations. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'phalanx-break__critReady',
          name: 'Phalanx Break',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Achilles readies a Phalanx Break!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Rage Beyond the Styx',
    japaneseName: 'Rage Beyond the Styx',
    description: 'The fury of the greatest hero of Troy, unleashed without restraint.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Achilles unleashes Rage Beyond the Styx!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Rage Beyond the Styx' });
    },
  },
};

const karna: ServantDefinition = {
  id: 'karna',
  name: 'Karna',
  title: 'The Son of the Sun',
  className: 'Lancer',
  trueName: 'Karna',
  maxHp: 1190,
  atk: 114,
  def: 93,
  agility: 60,
  luck: 39,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Durability', 'Shielding'],
  weaknesses: ['Slow', 'Low Luck'],
  passiveDescription: 'Born wearing radiant armor and earrings that ward off death itself.',
  skills: [
    {
      id: 'kavacha-kundala',
      name: 'Kavacha and Kundala',
      description:
        'His divine armor turns aside harm. Grants a shield that absorbs damage equal to 20% of his max HP, lasting this turn and the next.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kavacha-kundala-shield',
          name: 'Kavacha and Kundala',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Karna's Kavacha and Kundala shine with protection!");
      },
    },
    {
      id: 'solar-blessing',
      name: 'Solar Blessing',
      description: "The sun god's power surges within him. Raises own Attack by 15% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'solar-blessing',
          name: 'Solar Blessing',
          kind: 'buff',
          stat: 'atk',
          amount: 0.15,
          turnsRemaining: 2,
          description: '+15% ATK',
        });
        ctx.log('Karna basks in a Solar Blessing!');
      },
    },
    {
      id: 'karnas-resolve',
      name: "Karna's Resolve",
      description: 'A hero who never abandons a duel. Raises own Attack by 30% but lowers own Defense by 30% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'karnas-resolve-atk',
          name: "Karna's Resolve",
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        applyStatus(ctx.self, {
          id: 'karnas-resolve-def',
          name: "Karna's Resolve",
          kind: 'debuff',
          stat: 'def',
          amount: -0.3,
          turnsRemaining: 2,
          description: '-30% DEF',
        });
        ctx.log("Karna's Resolve hardens - all offense, no retreat!");
      },
    },
  ],
  noblePhantasm: {
    name: 'Vasavi Shakti: Spear of the Sun God',
    japaneseName: 'Vasavi Shakti',
    description: 'A single-use divine spear said to guarantee the death of whatever it strikes.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Karna hurls the Vasavi Shakti, the Spear of the Sun God!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.4, { guaranteedCrit: true, label: 'Vasavi Shakti' });
    },
  },
};

export const LANCER_SERVANTS: ServantDefinition[] = [cuChulainn, diarmuid, achilles, karna];
