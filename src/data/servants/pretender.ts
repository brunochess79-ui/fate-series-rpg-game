import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const oberon: ServantDefinition = {
  id: 'oberon',
  name: 'Oberon',
  title: 'The King of Stories',
  className: 'Pretender',
  trueName: 'Oberon',
  maxHp: 1150,
  atk: 95,
  def: 60,
  agility: 70,
  critChance: 0.12,
  rank: 'B+',
  strengths: ['Debuffs', 'Evasion'],
  weaknesses: ['Low Damage'],
  passiveDescription: "The King of Fairies and Stories, who rewrites the tale of any battle to suit his ending.",
  skills: [
    {
      id: 'cheshire-cats-grin',
      name: "Cheshire Cat's Grin",
      description: "A grin that unravels the enemy's fortune. Lowers enemy crit rate for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'cheshire-cats-grin',
          name: "Cheshire Cat's Grin",
          kind: 'debuff',
          stat: 'critChance',
          amount: -0.3,
          turnsRemaining: 3,
          description: '-30% crit chance scaling',
        });
        ctx.log("Oberon's Cheshire Cat's Grin unsettles the enemy!");
      },
    },
    {
      id: 'fairy-ring',
      name: 'Fairy Ring',
      description: 'A story that writes him out of harm entirely. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fairy-ring-evade',
          name: 'Fairy Ring',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Oberon steps through a Fairy Ring, vanishing from the tale!');
      },
    },
    {
      id: 'tale-as-old-as-time',
      name: 'Tale as Old as Time',
      description: "A rewritten legend saps the enemy's will. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'tale-as-old-as-time',
          name: 'Tale as Old as Time',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log('Oberon rewrites the enemy into a Tale as Old as Time!');
      },
    },
  ],
  noblePhantasm: {
    name: 'This Is My Story',
    japaneseName: 'Zone of the Absolute Territory',
    description: "A fantasy space where Oberon's story is the only ending that can happen.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Oberon declares: This Is My Story!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.9, { label: 'This Is My Story' });
      applyStatus(ctx.enemy, {
        id: 'my-story-stun',
        name: 'Written Out',
        kind: 'stun',
        turnsRemaining: 1,
        description: 'Cannot act next turn',
      });
    },
  },
};

export const PRETENDER_SERVANTS: ServantDefinition[] = [oberon];
