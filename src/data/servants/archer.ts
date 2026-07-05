import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const arash: ServantDefinition = {
  id: 'archer',
  name: 'Arash',
  title: 'The Farthest Shot',
  className: 'Archer',
  trueName: 'Arash',
  maxHp: 980,
  atk: 100,
  def: 58,
  agility: 85,
  critChance: 0.15,
  rank: 'B+',
  strengths: ['Burst Damage', 'Speed'],
  weaknesses: ['Fragile', 'Low HP'],
  passiveDescription: 'A master marksman who trades durability for precision.',
  skills: [
    {
      id: 'eye-of-the-mind',
      name: 'Eye of the Mind',
      description: 'Calm focus in the face of danger. Heals self for 14% max HP.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.14);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Arash steadies their Eye of the Mind, recovering ${healed} HP.`);
      },
    },
    {
      id: 'clairvoyance',
      name: 'Clairvoyance',
      description: "Sees the enemy's weak point. Raises own crit rate for 2 turns.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'clairvoyance',
          name: 'Clairvoyance',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.5,
          turnsRemaining: 2,
          description: '+50% crit chance scaling',
        });
        ctx.log('Arash activates Clairvoyance!');
      },
    },
    {
      id: 'sharpshooter',
      name: 'Sharpshooter',
      description: 'The next attack is guaranteed to be a critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sharpshooter__critReady',
          name: 'Sharpshooter',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Arash takes aim — the next shot will not miss.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Stella, the Farthest Arrow',
    japaneseName: 'Hayagrahana Stella',
    description: 'A single arrow loosed with every last drop of life force.',
    rank: 'A++',
    effect: (ctx) => {
      ctx.log('Arash draws their bow to the very limit — Stella, the Farthest Arrow!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.5, { guaranteedCrit: true, label: 'Stella' });
      const recoil = Math.round(ctx.self.maxHp * 0.05);
      ctx.self.hp = ctx.self.hp - recoil;
      ctx.log(`Arash spends their own life force, taking ${recoil} recoil damage.`);
    },
  },
};

const robinHood: ServantDefinition = {
  id: 'robin-hood',
  name: 'Robin Hood',
  title: 'The Hood of Sherwood',
  className: 'Archer',
  trueName: 'Robin Hood',
  maxHp: 950,
  atk: 97,
  def: 53,
  agility: 88,
  critChance: 0.18,
  rank: 'B+',
  strengths: ['Finishing Blows', 'Evasion'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: "An unerring aim, said to split another's arrow mid-flight.",
  skills: [
    {
      id: 'golden-arrow',
      name: 'Golden Arrow',
      description:
        "A shot aimed at the enemy's most exposed moment. Deals 1.3x damage, doubled if the enemy is below 30% HP.",
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const executeBonus = ctx.enemyHpFraction < 0.3 ? 2.0 : 1.0;
        ctx.log(
          executeBonus > 1
            ? 'Robin Hood spots an opening and looses a Golden Arrow for the kill!'
            : 'Robin Hood looses a Golden Arrow!',
        );
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3 * executeBonus, { label: 'Golden Arrow' });
      },
    },
    {
      id: 'robins-wit',
      name: "Robin's Wit",
      description: "A trickster's read on the enemy's guard. Lowers enemy Defense by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'robins-wit',
          name: "Robin's Wit",
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% DEF',
        });
        ctx.log("Robin Hood finds a gap in the enemy's guard!");
      },
    },
    {
      id: 'woodland-cover',
      name: 'Woodland Cover',
      description: 'Melts into the green. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'woodland-cover-evade',
          name: 'Woodland Cover',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Robin Hood vanishes into Woodland Cover.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Yew Bow of Sherwood: Piercing Shot',
    japaneseName: 'Yew Bow',
    description: 'A single shot loosed with unerring, guaranteed precision.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log('Robin Hood looses the Yew Bow of Sherwood!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { guaranteedCrit: true, label: 'Piercing Shot' });
    },
  },
};

const williamTell: ServantDefinition = {
  id: 'william-tell',
  name: 'William Tell',
  title: 'The Marksman of Uri',
  className: 'Archer',
  trueName: 'Wilhelm Tell',
  maxHp: 920,
  atk: 93,
  def: 48,
  agility: 75,
  critChance: 0.2,
  rank: 'B',
  strengths: ['Critical Hits', 'Sustain via Lifesteal'],
  weaknesses: ['Fragile', 'Low Damage'],
  passiveDescription: 'A single shot, however narrow the target, always finds its mark.',
  skills: [
    {
      id: 'steady-hand',
      name: 'Steady Hand',
      description: 'Nerves of iron. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'steady-hand',
          name: 'Steady Hand',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.4,
          turnsRemaining: 2,
          description: '+40% crit chance scaling',
        });
        ctx.log('William Tell steadies his hand.');
      },
    },
    {
      id: 'crossbow-reload',
      name: 'Crossbow Reload',
      description: 'A quick, precise shot that draws strength from the wound it deals. Heals for 30% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Precise Shot' });
        const healed = Math.round(dmg * 0.3);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`William Tell recovers ${healed} HP from the exchange.`);
      },
    },
    {
      id: 'apple-shot',
      name: 'Apple Shot',
      description: 'The legendary shot itself. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'apple-shot__critReady',
          name: 'Apple Shot',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('William Tell lines up the impossible shot.');
      },
    },
  ],
  noblePhantasm: {
    name: 'The Shot Heard Round the Cantons',
    japaneseName: 'Wilhelm Tell',
    description: 'A single bolt loosed with absolute, unerring certainty.',
    rank: 'C+',
    effect: (ctx) => {
      ctx.log('William Tell fires the Shot Heard Round the Cantons!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { guaranteedCrit: true, label: 'Round the Cantons' });
    },
  },
};

const atalanta: ServantDefinition = {
  id: 'atalanta',
  name: 'Atalanta',
  title: 'The Fleet-Footed Huntress',
  className: 'Archer',
  trueName: 'Atalanta',
  maxHp: 990,
  atk: 96,
  def: 55,
  agility: 105,
  critChance: 0.15,
  rank: 'B+',
  strengths: ['Speed', 'Evasion'],
  weaknesses: ['Fragile'],
  passiveDescription: 'None can outrun her, on two legs or four.',
  skills: [
    {
      id: 'fleeting-step',
      name: 'Fleeting Step',
      description: 'Faster than the eye can follow. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fleeting-step-evade',
          name: 'Fleeting Step',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Atalanta vanishes with a Fleeting Step.');
      },
    },
    {
      id: 'beast-companion',
      name: 'Beast Companion',
      description: 'A wild companion tends her wounds. Heals self for 16% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.16);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Atalanta's Beast Companion tends her wounds, healing ${healed} HP.`);
      },
    },
    {
      id: 'calydons-mark',
      name: "Calydon's Mark",
      description: 'Marks the enemy as prey. Lowers enemy Attack by 15% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'calydons-mark',
          name: "Calydon's Mark",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% ATK',
        });
        ctx.log('Atalanta marks her prey with the hunt of Calydon.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Phoebus Catastrophe',
    japaneseName: 'Phoebus Catastrophe',
    description: 'A hail of arrows loosed faster than the eye can track.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log('Atalanta unleashes the Phoebus Catastrophe!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.1, { label: 'Phoebus Catastrophe' });
    },
  },
};

const gilgamesh: ServantDefinition = {
  id: 'gilgamesh',
  name: 'Gilgamesh',
  title: 'The King of Heroes',
  className: 'Archer',
  trueName: 'Gilgamesh',
  maxHp: 1090,
  atk: 125,
  def: 60,
  agility: 65,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Burst Damage', 'Debuffs'],
  weaknesses: ['No Self-Heal'],
  passiveDescription:
    "Treasury of the world's first hero-king: an arsenal without equal, wielded with utter disdain for lesser beings.",
  skills: [
    {
      id: 'gate-of-babylon',
      name: 'Gate of Babylon',
      description: "A king's endless armory, unleashed all at once. Deals 1.5x damage.",
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.log('Gilgamesh opens the Gate of Babylon, loosing a hail of legendary weapons!');
        ctx.dealDamage(ctx.self, ctx.enemy, 1.5, { label: 'Gate of Babylon' });
      },
    },
    {
      id: 'kings-disdain',
      name: "King's Disdain",
      description: 'A king belittles the enemy, sapping their fighting spirit. Lowers enemy Attack by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'kings-disdain',
          name: "King's Disdain",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log("Gilgamesh regards the enemy with King's Disdain!");
      },
    },
    {
      id: 'golden-rule',
      name: 'Golden Rule',
      description: 'The confidence of a king who lacks for nothing. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'golden-rule',
          name: 'Golden Rule',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Gilgamesh invokes the Golden Rule!');
      },
    },
  ],
  noblePhantasm: {
    name: 'The Star of Creation That Split Heaven and Earth',
    japaneseName: 'Enuma Elish',
    description: "Every treasure in the King's vault, loosed at once to end the battle outright.",
    rank: 'A++',
    effect: (ctx) => {
      ctx.log('Gilgamesh unleashes Enuma Elish!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Enuma Elish' });
    },
  },
};

export const ARCHER_SERVANTS: ServantDefinition[] = [arash, robinHood, williamTell, atalanta, gilgamesh];
