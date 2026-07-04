import type { ServantDefinition } from '../../types';
import { applyStatus, dispelBuffs } from '../../engine/status';

const cuChulainn: ServantDefinition = {
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
        ctx.log(`Cú Chulainn is shielded by the Protection of the Wolf, healing ${healed} HP.`);
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
        ctx.log('Cú Chulainn grits through the pain — DEF rises!');
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
        ctx.log('Cú Chulainn is uplifted by battle-fury!');
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

const diarmuid: ServantDefinition = {
  id: 'diarmuid',
  name: 'Diarmuid',
  title: 'The Knight of the Love Spot',
  className: 'Lancer',
  trueName: 'Diarmuid Ua Duibhne',
  maxHp: 860,
  atk: 108,
  def: 62,
  agility: 95,
  luck: 45,
  critChance: 0.12,
  passiveDescription: 'Cursed with an irresistible charm, and blessed with peerless spearplay.',
  skills: [
    {
      id: 'gae-dearg',
      name: "Gáe Dearg's Focus",
      description: 'The red spear unravels magecraft. Dispels the enemy\'s buffs.',
      cooldown: 4,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { pierceDef: true, label: 'Twin Lances' });
    },
  },
};

const achilles: ServantDefinition = {
  id: 'achilles',
  name: 'Achilles',
  title: 'The Hero of the Trojan War',
  className: 'Lancer',
  trueName: 'Achilles',
  maxHp: 1000,
  atk: 120,
  def: 70,
  agility: 85,
  luck: 40,
  critChance: 0.15,
  passiveDescription: 'Nigh invulnerable but for a single, fatal spot upon his heel.',
  skills: [
    {
      id: 'rage-of-achilles',
      name: 'Rage of Achilles',
      description: 'A wrath that shakes the battlefield. Raises own Attack by 30% for 2 turns.',
      cooldown: 4,
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
      description: 'The river Styx tends his wounds once more. Heals self for 18% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Achilles recalls the Divine Bath, healing ${healed} HP.`);
      },
    },
    {
      id: 'phalanx-break',
      name: 'Phalanx Break',
      description: 'A charge that shatters formations. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'phalanx-break-crit',
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
  maxHp: 1050,
  atk: 110,
  def: 90,
  agility: 60,
  luck: 35,
  critChance: 0.1,
  passiveDescription: 'Born wearing radiant armor and earrings that ward off death itself.',
  skills: [
    {
      id: 'kavacha-kundala',
      name: 'Kavacha and Kundala',
      description: 'His divine armor turns aside harm. Raises own Defense by 35% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kavacha-kundala',
          name: 'Kavacha and Kundala',
          kind: 'buff',
          stat: 'def',
          amount: 0.35,
          turnsRemaining: 2,
          description: '+35% DEF',
        });
        ctx.log("Karna's Kavacha and Kundala shine with protection!");
      },
    },
    {
      id: 'solar-blessing',
      name: 'Solar Blessing',
      description: "The sun god's warmth mends his wounds. Heals self for 15% max HP.",
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Karna basks in a Solar Blessing, healing ${healed} HP.`);
      },
    },
    {
      id: 'karnas-resolve',
      name: "Karna's Resolve",
      description: 'A hero who never abandons a duel. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'karnas-resolve-crit',
          name: "Karna's Resolve",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Karna's Resolve hardens for the killing blow.");
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
      ctx.dealDamage(ctx.self, ctx.enemy, 4.2, { guaranteedCrit: true, pierceDef: true, label: 'Vasavi Shakti' });
    },
  },
};

export const LANCER_SERVANTS: ServantDefinition[] = [cuChulainn, diarmuid, achilles, karna];
