import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const mash: ServantDefinition = {
  id: 'mash',
  name: 'Mash Kyrielight',
  title: 'The Shielder of Chaldea',
  className: 'Shielder',
  trueName: 'Galahad',
  maxHp: 1400,
  atk: 70,
  def: 92,
  agility: 50,
  critChance: 0.05,
  rank: 'B',
  strengths: ['Highest Defense', 'Shielding'],
  weaknesses: ['Low Damage', 'Low Crit Rate'],
  passiveDescription: 'A demi-servant whose devotion to protecting others outweighs any fear for herself.',
  skills: [
    {
      id: 'shield-of-rousing-resolution',
      name: 'Shield of Rousing Resolution',
      description:
        "Her cross-shaped shield turns aside any harm. Grants a shield that absorbs damage equal to 22% of her max HP, lasting this turn and the next.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'shield-of-rousing-resolution',
          name: 'Shield of Rousing Resolution',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.22),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Mash raises her Shield of Rousing Resolution!');
      },
    },
    {
      id: 'heros-resolve',
      name: "Hero's Resolve",
      description: "A demi-servant's borrowed courage. Raises own Defense by 25% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'heros-resolve',
          name: "Hero's Resolve",
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% DEF',
        });
        ctx.log("Mash steels herself with a Hero's Resolve!");
      },
    },
    {
      id: 'the-white-lion',
      name: 'The White Lion',
      description: 'A cross-shield thrown like a blade. Deals 1.2x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'The White Lion' });
        ctx.log('Mash hurls her shield like the White Lion!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Lord Camelot',
    japaneseName: 'Lord Camelot',
    description: "A vision of Camelot's golden age, sheltering her from any harm.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Mash calls forth the vision of Lord Camelot!');
      applyStatus(ctx.self, {
        id: 'lord-camelot-shield',
        name: 'Lord Camelot',
        kind: 'shield',
        potency: Math.round(ctx.self.maxHp * 0.55),
        turnsRemaining: 2,
        description: 'Absorbs damage until depleted',
      });
      ctx.self.statuses = ctx.self.statuses.filter((s) => s.kind !== 'debuff' && s.kind !== 'dot');
      ctx.log('Mash is shielded by the golden age of Camelot, her afflictions cleared.');
    },
  },
};

export const SHIELDER_SERVANTS: ServantDefinition[] = [mash];
