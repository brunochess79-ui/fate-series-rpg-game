import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const hassan: ServantDefinition = {
  id: 'assassin',
  name: 'Hassan-i Sabbah',
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
        ctx.log('Hassan-i Sabbah melts into Presence Concealment!');
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
        ctx.log('Hassan-i Sabbah prepares a killing blow.');
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
        ctx.log('Hassan-i Sabbah strikes with a Poison Needle!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Delusional Illusion',
    japaneseName: 'Zabaniya',
    description: 'A perfect, unavoidable assassination.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log('Hassan-i Sabbah unleashes Delusional Illusion — there is no escape.');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.2, {
        guaranteedCrit: true,
        pierceDef: true,
        label: 'Zabaniya',
      });
    },
  },
};

const theRipper: ServantDefinition = {
  id: 'the-ripper',
  name: 'The Ripper',
  title: 'The Phantom of Whitechapel',
  className: 'Assassin',
  trueName: 'An unsolved urban legend',
  maxHp: 680,
  atk: 95,
  def: 40,
  agility: 95,
  luck: 25,
  critChance: 0.35,
  passiveDescription: "An identity lost to history — the legend of a killer who vanished into fog, never caught.",
  skills: [
    {
      id: 'vanish-in-fog',
      name: 'Vanish in Fog',
      description: 'Slips away into the London fog. Raises own Defense by 30% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'vanish-in-fog',
          name: 'Vanish in Fog',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log('The Ripper vanishes into the fog!');
      },
    },
    {
      id: 'silent-approach',
      name: 'Silent Approach',
      description: 'An unseen approach in the dark. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'silent-approach-crit',
          name: 'Silent Approach',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('The Ripper closes in without a sound.');
      },
    },
    {
      id: 'whispers-of-dread',
      name: 'Whispers of Dread',
      description: 'Rumor alone unsettles the enemy\'s resolve. Lowers enemy Attack by 15% for 3 turns.',
      cooldown: 4,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'whispers-of-dread',
          name: 'Whispers of Dread',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% ATK',
        });
        ctx.log('Whispers of Dread unsettle the enemy!');
      },
    },
  ],
  noblePhantasm: {
    name: 'From Hell: The Final Cut',
    japaneseName: 'From Hell',
    description: 'A legend given form for one final, unavoidable strike.',
    rank: 'D',
    effect: (ctx) => {
      ctx.log('The Ripper strikes with From Hell — the Final Cut!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { guaranteedCrit: true, pierceDef: true, label: 'From Hell' });
    },
  },
};

const semiramis: ServantDefinition = {
  id: 'semiramis',
  name: 'Semiramis',
  title: 'The Queen of Babylon',
  className: 'Assassin',
  trueName: 'Semiramis',
  maxHp: 780,
  atk: 85,
  def: 50,
  agility: 70,
  luck: 45,
  critChance: 0.12,
  passiveDescription: 'Ruler of the Hanging Gardens, she strikes with serpents and poison.',
  skills: [
    {
      id: 'serpents-kiss',
      name: "Serpent's Kiss",
      description: 'A venomous bite hidden in silk. Afflicts the enemy with poison.',
      cooldown: 3,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'serpents-kiss',
          name: 'Poison',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.04),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log("Semiramis strikes with the Serpent's Kiss!");
      },
    },
    {
      id: 'hanging-gardens',
      name: "Hanging Gardens' Bounty",
      description: 'Refuge among her legendary gardens. Heals self for 15% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Semiramis draws on the Hanging Gardens' Bounty, healing ${healed} HP.`);
      },
    },
    {
      id: 'queens-guile',
      name: "Queen's Guile",
      description: "A queen's cunning finds every weakness. Lowers enemy Defense by 15% for 3 turns.",
      cooldown: 4,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'queens-guile',
          name: "Queen's Guile",
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% DEF',
        });
        ctx.log("Semiramis exposes a weakness with Queen's Guile!");
      },
    },
  ],
  noblePhantasm: {
    name: "Walls of Babylon: Ishtar's Judgment",
    japaneseName: "Ishtar's Judgment",
    description: 'The full might of Babylon\'s legendary walls, brought to bear as a weapon.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log("Semiramis invokes the Walls of Babylon — Ishtar's Judgment!");
      ctx.dealDamage(ctx.self, ctx.enemy, 2.8, { label: "Ishtar's Judgment" });
      applyStatus(ctx.enemy, {
        id: 'babylon-poison',
        name: 'Serpent Venom',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 2,
        description: 'Poisoned',
      });
    },
  },
};

const sasakiKojiro: ServantDefinition = {
  id: 'sasaki-kojiro',
  name: 'Sasaki Kojirō',
  title: 'The Demon of the Swallow Reversal',
  className: 'Assassin',
  trueName: 'Sasaki Kojirō',
  maxHp: 800,
  atk: 100,
  def: 55,
  agility: 100,
  luck: 40,
  critChance: 0.22,
  passiveDescription: 'His blade moves faster than the eye, striking thrice in the time of one swing.',
  skills: [
    {
      id: 'tsubame-gaeshi-ready',
      name: 'Tsubame Gaeshi Ready',
      description: 'A stance for the legendary counter. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'tsubame-gaeshi-crit',
          name: 'Tsubame Gaeshi Ready',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Sasaki Kojirō readies the Swallow Reversal.');
      },
    },
    {
      id: 'swallows-focus',
      name: "Swallow's Focus",
      description: 'A focus sharp as a blade\'s edge. Raises own Attack by 20% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'swallows-focus',
          name: "Swallow's Focus",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log("Sasaki Kojirō enters Swallow's Focus!");
      },
    },
    {
      id: 'long-sword-stance',
      name: 'Long Sword Stance',
      description: 'The long blade held steady. Raises own Defense by 15% for 2 turns.',
      cooldown: 3,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'long-sword-stance',
          name: 'Long Sword Stance',
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 2,
          description: '+15% DEF',
        });
        ctx.log('Sasaki Kojirō settles into the Long Sword Stance.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Tsubame Gaeshi: The Swallow Reversal',
    japaneseName: 'Tsubame Gaeshi',
    description: 'Three cuts thrown in the time it takes a swallow to turn in flight.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Sasaki Kojirō unleashes Tsubame Gaeshi — the Swallow Reversal!');
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { pierceDef: true, label: 'Swallow I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { pierceDef: true, label: 'Swallow II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { pierceDef: true, label: 'Swallow III' });
    },
  },
};

export const ASSASSIN_SERVANTS: ServantDefinition[] = [hassan, theRipper, semiramis, sasakiKojiro];
