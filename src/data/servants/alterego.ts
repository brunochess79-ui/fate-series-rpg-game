import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const kiara: ServantDefinition = {
  id: 'kiara',
  name: 'Sessyoin Kiara',
  title: 'The Beast of Bliss',
  className: 'Alter Ego',
  trueName: 'Kiara Sessyoin',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Sesshōin_Kiara",
  maxHp: 1201,
  atk: 102,
  def: 52,
  agility: 65,
  critChance: 0.15,
  rank: 'B+',
  strengths: ['Highest Damage', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A Buddhist saint whose boundless compassion, twisted by despair, birthed a Beast of humanity.',
  skills: [
    {
      id: 'contemplative-bliss',
      name: 'Contemplative Bliss',
      description: 'A saint at perfect peace. Recovers 7% max HP at the start of each of her next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'contemplative-bliss-regen',
          name: 'Contemplative Bliss',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log("Kiara's Contemplative Bliss soothes her wounds.");
      },
    },
    {
      id: 'black-barrel',
      name: 'Black Barrel',
      description: "A beast's hunger sharpens every strike. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'black-barrel',
          name: 'Black Barrel',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Kiara bares the Black Barrel of her hunger!');
      },
    },
    {
      id: 'beasts-hunger',
      name: "Beast's Hunger",
      description: 'A predator senses weakness. Deals 1.5x damage, doubled if the enemy is below 30% HP, and heals for 18% of the damage dealt.',
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const executeBonus = ctx.enemyHpFraction < 0.3 ? 2.0 : 1.0;
        ctx.log(
          executeBonus > 1
            ? "Kiara's Hunger senses weakness and devours it whole!"
            : "Kiara's Hunger gnaws at the enemy!",
        );
        const dealt = ctx.dealDamage(ctx.self, ctx.enemy, 1.5 * executeBonus, { label: "Beast's Hunger" });
        const healed = Math.round(dealt * 0.18);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Kiara devours the wound, recovering ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "Kishimojin: Feast of the Void",
    japaneseName: 'Kishimojin',
    description: 'A void-hungry Beast, feasting on all that remains of a fading world.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Kiara unleashes Kishimojin: Feast of the Void!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.17, { label: 'Feast of the Void' });
    },
  },
};

const tiamat: ServantDefinition = {
  id: 'tiamat',
  name: 'Tiamat',
  title: 'The Primordial Mother',
  className: 'Alter Ego',
  trueName: 'Tiamat',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Larva/Tiamat",
  maxHp: 1362,
  atk: 85,
  def: 55,
  agility: 45,
  critChance: 0.08,
  rank: 'B',
  strengths: ['Highest HP', 'Shielding', 'Regeneration'],
  weaknesses: ['Slow'],
  passiveDescription: 'The primordial mother goddess of creation, tragic and endlessly protective of all life.',
  skills: [
    {
      id: 'mothers-embrace',
      name: "Mother's Embrace",
      description: "A womb that birthed all things shelters her still. Recovers 8% max HP at the start of each of her next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mothers-embrace-regen',
          name: "Mother's Embrace",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 3,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log("Tiamat calls upon Mother's Embrace.");
      },
    },
    {
      id: 'primordial-wrath',
      name: 'Primordial Wrath',
      description: "A mother's grief made manifest. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'primordial-wrath',
          name: 'Primordial Wrath',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log('Tiamat unleashes her Primordial Wrath!');
      },
    },
    {
      id: 'sea-of-origin',
      name: 'Sea of Origin',
      description: "The primeval sea shelters her still. Grants a shield that absorbs damage equal to 15% of her max HP, lasting only this turn.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sea-of-origin-shield',
          name: 'Sea of Origin',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.15),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Tiamat draws upon the Sea of Origin!');
      },
    },
  ],
  noblePhantasm: {
    name: "Kur: The Womb of Creation",
    japaneseName: 'Kur',
    description: 'The dark womb from which all creation was born, opened once more to reclaim it.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Tiamat opens Kur: The Womb of Creation!');
      const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 5.13, { label: 'The Womb of Creation' });
      const healed = Math.round(dmg * 0.25);
      ctx.self.hp = ctx.self.hp + healed;
      ctx.log(`Tiamat draws ${healed} HP back into herself.`);
    },
  },
};

export const ALTER_EGO_SERVANTS: ServantDefinition[] = [kiara, tiamat];
