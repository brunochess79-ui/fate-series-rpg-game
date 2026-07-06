import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const kama: ServantDefinition = {
  id: 'kama',
  name: 'Kama',
  title: 'The God of Love',
  className: 'Avenger',
  trueName: 'Kama',
  maxHp: 1100,
  atk: 108,
  def: 55,
  agility: 70,
  critChance: 0.2,
  rank: 'A',
  strengths: ['Critical Hits', 'Regeneration'],
  weaknesses: ['Fragile'],
  passiveDescription: 'The god of love and desire, whose devotion curdles into Mara when spurned.',
  skills: [
    {
      id: 'arrow-of-love',
      name: 'Arrow of Love',
      description: "A flower-tipped arrow blunts the enemy's resolve. Lowers enemy Attack by 18% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'arrow-of-love',
          name: 'Arrow of Love',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% ATK',
        });
        ctx.log('Kama looses an Arrow of Love!');
      },
    },
    {
      id: 'maras-malice',
      name: "Mara's Malice",
      description: 'A curdled devotion turns to venom. Afflicts the enemy with poison.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'maras-malice',
          name: "Mara's Malice",
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log("Kama's devotion curdles into Mara's Malice!");
      },
    },
    {
      id: 'boundless-compassion',
      name: 'Boundless Compassion',
      description: 'A god of love heals even in wrath. Heals self for 20% max HP.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Kama's Boundless Compassion heals ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "Mara's Fury: The Burning World",
    japaneseName: 'Kama Sutra',
    description: 'A god of love and a god of destruction, unleashed as one and the same.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log("Kama unleashes Mara's Fury: The Burning World!");
      ctx.dealDamage(ctx.self, ctx.enemy, 3.3, { label: "Mara's Fury" });
      applyStatus(ctx.enemy, {
        id: 'burning-world-dot',
        name: 'Burning Desire',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 2,
        description: 'Afflicted by burning desire',
      });
    },
  },
};

export const AVENGER_SERVANTS: ServantDefinition[] = [kama];
