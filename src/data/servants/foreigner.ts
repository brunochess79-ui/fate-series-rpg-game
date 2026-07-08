import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const kukulkan: ServantDefinition = {
  id: 'kukulkan',
  name: 'Kukulkan',
  title: 'The Radiant Sun Goddess',
  className: 'Foreigner',
  trueName: 'Kukulkan',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Kukulkan",
  maxHp: 1150,
  atk: 125,
  def: 55,
  agility: 60,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Highest Damage'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The feathered serpent sun goddess of the Lostbelt, radiant with cosmic, kinetic power.',
  skills: [
    {
      id: 'solar-flare',
      name: 'Solar Flare',
      description: "A burst of the sun's own fire. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'solar-flare',
          name: 'Solar Flare',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Kukulkan flares with solar radiance!');
      },
    },
    {
      id: 'feathered-serpents-blessing',
      name: "Feathered Serpent's Blessing",
      description: "A goddess's benediction mends the flesh. Heals self for 18% max HP.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Kukulkan's blessing heals ${healed} HP.`);
      },
    },
    {
      id: 'kinetic-strike',
      name: 'Kinetic Strike',
      description: 'A goddess descending at cosmic speed. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kinetic-strike__critReady',
          name: 'Kinetic Strike',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Kukulkan gathers cosmic speed for a Kinetic Strike.');
      },
    },
  ],
  noblePhantasm: {
    name: "Ehecatl: The Precious Radiance",
    japaneseName: 'Ehecatl',
    description: 'A goddess descending as a shooting star, radiant enough to end a world.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Kukulkan calls down Ehecatl: The Precious Radiance!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'The Precious Radiance' });
    },
  },
};

const uOlgaMarie: ServantDefinition = {
  id: 'u-olga-marie',
  name: 'U-Olga Marie',
  title: "The Alien God's Herald",
  className: 'Foreigner',
  trueName: 'Olga Marie Animusphere',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/U-Olga_Marie",
  maxHp: 1000,
  atk: 130,
  def: 50,
  agility: 55,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Highest Damage', 'Critical Hits'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: "A director consumed and remade as the herald of an Alien God, burning with cosmic corruption.",
  skills: [
    {
      id: 'corrupted-systems',
      name: 'Corrupted Systems',
      description: "A cosmic corruption unravels the enemy's guard. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'corrupted-systems',
          name: 'Corrupted Systems',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("U-Olga Marie's Corrupted Systems spread across the enemy!");
      },
    },
    {
      id: 'alien-static',
      name: 'Alien Static',
      description: 'An incomprehensible signal gnaws at the enemy. Afflicts the enemy with a curse.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'alien-static',
          name: 'Alien Static',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Cursed by alien static',
        });
        ctx.log('U-Olga Marie afflicts the enemy with Alien Static!');
      },
    },
    {
      id: 'overload',
      name: 'Overload',
      description: 'A system pushed past every limit. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'overload__critReady',
          name: 'Overload',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('U-Olga Marie pushes her Overload to the limit.');
      },
    },
  ],
  noblePhantasm: {
    name: "The Crawling Chaos: Final Grade",
    japaneseName: 'Final Grade',
    description: "An Alien God's herald, giving her final grade in a single cosmic detonation.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('U-Olga Marie delivers the Final Grade!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.1, { label: 'Final Grade' });
      const recoil = Math.round(ctx.self.maxHp * 0.06);
      ctx.self.hp = ctx.self.hp - recoil;
      ctx.log(`U-Olga Marie takes ${recoil} damage from her own overloaded core.`);
    },
  },
};

export const FOREIGNER_SERVANTS: ServantDefinition[] = [kukulkan, uOlgaMarie];
