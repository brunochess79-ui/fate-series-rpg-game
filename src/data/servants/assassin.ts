import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const hassan: ServantDefinition = {
  id: 'assassin',
  name: 'Hassan-i Sabbah',
  title: 'Old Man of the Mountain',
  className: 'Assassin',
  trueName: 'Hassan-i Sabbah',
  maxHp: 945,
  atk: 110,
  def: 54,
  agility: 90,
  critChance: 0.15,
  rank: 'B+',
  strengths: ['Critical Hits', 'Evasion'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: 'A killer who strikes from the shadows with unmatched precision.',
  skills: [
    {
      id: 'presence-concealment',
      name: 'Presence Concealment',
      description: 'Melts into the shadows. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'presence-concealment-evade',
          name: 'Presence Concealment',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Hassan-i Sabbah melts into Presence Concealment!');
      },
    },
    {
      id: 'zabaniya-setup',
      name: 'Zabaniya',
      description: 'A killing technique passed through the ages. Next attack is a guaranteed crit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'zabaniya-setup__critReady',
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
      npGainSelf: 20,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.35, {
        guaranteedCrit: true,
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
  maxHp: 915,
  atk: 120,
  def: 49,
  agility: 95,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Critical Hits', 'Finishing Blows'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: "An identity lost to history — the legend of a killer who vanished into fog, never caught.",
  skills: [
    {
      id: 'vanish-in-fog',
      name: 'Vanish in Fog',
      description:
        'The fog itself seems to blunt every blow. Grants a shield that absorbs damage equal to 15% of his max HP, lasting this turn and the next.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'vanish-in-fog-shield',
          name: 'Vanish in Fog',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.15),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('The Ripper vanishes into the fog, half-real and untouchable.');
      },
    },
    {
      id: 'silent-approach',
      name: 'Silent Approach',
      description:
        'An unseen approach in the dark. Deals 1.2x damage, more than doubled if the enemy is below 25% HP.',
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const executeBonus = ctx.enemyHpFraction < 0.25 ? 2.2 : 1.0;
        ctx.log(
          executeBonus > 1
            ? 'The Ripper closes in without a sound, ending it there!'
            : 'The Ripper closes in without a sound.',
        );
        ctx.dealDamage(ctx.self, ctx.enemy, 1.2 * executeBonus, { label: 'Silent Approach' });
      },
    },
    {
      id: 'whispers-of-dread',
      name: 'Whispers of Dread',
      description: "Rumor alone unsettles the enemy's resolve. Lowers enemy Attack by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'From Hell' });
    },
  },
};

const semiramis: ServantDefinition = {
  id: 'semiramis',
  name: 'Semiramis',
  title: 'The Queen of Babylon',
  className: 'Assassin',
  trueName: 'Semiramis',
  maxHp: 1025,
  atk: 95,
  def: 59,
  agility: 70,
  critChance: 0.12,
  rank: 'B',
  strengths: ['Damage over Time', 'Shielding'],
  weaknesses: ['Low Damage'],
  passiveDescription: 'Ruler of the Hanging Gardens, she strikes with serpents and poison.',
  skills: [
    {
      id: 'serpents-kiss',
      name: "Serpent's Kiss",
      description: 'A venomous bite hidden in silk. Afflicts the enemy with poison.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'serpents-kiss',
          name: 'Poison',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log("Semiramis strikes with the Serpent's Kiss!");
      },
    },
    {
      id: 'hanging-gardens',
      name: "Hanging Gardens' Bounty",
      description:
        'Refuge among her legendary gardens. Grants a shield that absorbs damage equal to 16% of her max HP, lasting this turn and the next.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'hanging-gardens-shield',
          name: "Hanging Gardens' Bounty",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.16),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Semiramis takes refuge in the Hanging Gardens' Bounty.");
      },
    },
    {
      id: 'queens-guile',
      name: "Queen's Guile",
      description: "A queen's cunning finds every weakness. Lowers enemy Defense by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
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
    description: "The full might of Babylon's legendary walls, brought to bear as a weapon.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log("Semiramis invokes the Walls of Babylon — Ishtar's Judgment!");
      ctx.dealDamage(ctx.self, ctx.enemy, 2.95, { label: "Ishtar's Judgment" });
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
  maxHp: 1010,
  atk: 112,
  def: 58,
  agility: 100,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Speed', 'Critical Hits', 'Sustain via Lifesteal'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'His blade moves faster than the eye, striking thrice in the time of one swing.',
  skills: [
    {
      id: 'tsubame-gaeshi-ready',
      name: 'Tsubame Gaeshi Ready',
      description: 'A stance for the legendary counter. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'tsubame-gaeshi-ready__critReady',
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
      description: "A focus sharp as a blade's edge. Raises own Attack by 20% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
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
      id: 'probing-cut',
      name: 'Probing Cut',
      description: 'A testing strike before the true blow. Heals for 20% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.15, { label: 'Probing Cut' });
        const healed = Math.round(dmg * 0.2);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Sasaki Kojirō reads the exchange, recovering ${healed} HP.`);
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
      ctx.dealDamage(ctx.self, ctx.enemy, 1.35, { label: 'Swallow I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.35, { label: 'Swallow II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.35, { label: 'Swallow III' });
    },
  },
};

const kingHassan: ServantDefinition = {
  id: 'king-hassan',
  name: 'King Hassan',
  title: 'The Grand Assassin',
  className: 'Assassin',
  trueName: 'The First Hassan',
  maxHp: 950,
  atk: 130,
  def: 55,
  agility: 100,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Speed', 'Evasion'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: 'The first of the Hassan-i Sabbah, an embodiment of death itself that even gods cannot ignore.',
  skills: [
    {
      id: 'zabaniya-delusional-poison',
      name: 'Zabaniya: Delusional Poison',
      description: "A killing art that poisons flesh and spirit alike. Afflicts the enemy with poison.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'delusional-poison',
          name: 'Delusional Poison',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log('King Hassan strikes with Zabaniya: Delusional Poison!');
      },
    },
    {
      id: 'presence-concealment-perfected',
      name: 'Presence Concealment (Perfected)',
      description: "A death that cannot be sensed until it arrives. Guarantees the next enemy attack will miss entirely.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'presence-concealment-perfected-evade',
          name: 'Presence Concealment (Perfected)',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('King Hassan vanishes utterly from sight!');
      },
    },
    {
      id: 'blade-of-wisdom',
      name: 'Blade of Wisdom',
      description: 'A killing stroke honed over a hundred assassinations. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'blade-of-wisdom__critReady',
          name: 'Blade of Wisdom',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('King Hassan readies the Blade of Wisdom.');
      },
    },
  ],
  noblePhantasm: {
    name: 'The Old Man of the Mountain',
    japaneseName: 'Zabaniya',
    description: 'A death sentence imposed on even the divine and the immortal.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('King Hassan pronounces the judgment of the Old Man of the Mountain!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'The Old Man of the Mountain' });
    },
  },
};

const tezcatlipoca: ServantDefinition = {
  id: 'tezcatlipoca',
  name: 'Tezcatlipoca',
  title: 'The Smoking Mirror',
  className: 'Assassin',
  trueName: 'Tezcatlipoca',
  maxHp: 1000,
  atk: 119,
  def: 60,
  agility: 85,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Critical Hits', 'Speed'],
  weaknesses: ['Fragile'],
  passiveDescription: 'A ruthless Aztec god of night and discord, walking among mortals as a mercenary assassin.',
  skills: [
    {
      id: 'smoking-mirror',
      name: 'Smoking Mirror',
      description: "An obsidian mirror reveals the enemy's every weakness. Lowers enemy crit rate for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'smoking-mirror',
          name: 'Smoking Mirror',
          kind: 'debuff',
          stat: 'critChance',
          amount: -0.3,
          turnsRemaining: 3,
          description: '-30% crit chance scaling',
        });
        ctx.log("Tezcatlipoca's Smoking Mirror reveals the enemy's weakness!");
      },
    },
    {
      id: 'night-wind',
      name: 'Night Wind',
      description: "A god of night moves faster than sight. Guarantees the next enemy attack will miss entirely.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'night-wind-evade',
          name: 'Night Wind',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Tezcatlipoca vanishes on the Night Wind.');
      },
    },
    {
      id: 'obsidian-blade',
      name: 'Obsidian Blade',
      description: "A blade of black glass drawn from the smoking mirror. Raises own Attack by 20% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'obsidian-blade',
          name: 'Obsidian Blade',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log('Tezcatlipoca draws the Obsidian Blade!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Titlacauan: We Are His Slaves',
    japaneseName: 'Titlacauan',
    description: "The rival of all creation, striking without warning or mercy.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Tezcatlipoca invokes Titlacauan!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Titlacauan' });
    },
  },
};

const koyanskaya: ServantDefinition = {
  id: 'koyanskaya',
  name: 'Koyanskaya of Light',
  title: 'Golden Wolf of Chaldea',
  className: 'Assassin',
  trueName: 'Koyanskaya',
  maxHp: 1050,
  atk: 111,
  def: 55,
  agility: 75,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Crit Damage', 'Drains'],
  weaknesses: ['Fragile'],
  passiveDescription: 'A trickster wolf-spirit wearing the shape of a familiar ally.',
  skills: [
    {
      id: 'predation',
      name: 'Predation',
      description: 'The wolf feeds on the weak. Deals damage and heals self for half the damage dealt.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.log('Koyanskaya of Light preys upon the enemy!');
        const dealt = ctx.dealDamage(ctx.self, ctx.enemy, 1.4, { label: 'Predation' });
        const healed = Math.round(dealt * 0.5);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Koyanskaya of Light feeds, recovering ${healed} HP.`);
      },
    },
    {
      id: 'cheat-code',
      name: 'Video Game-esque Cheat',
      description: "A tilted rule of her own making. Raises own Crit Chance by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'cheat-code',
          name: 'Video Game-esque Cheat',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Crit Chance',
        });
        ctx.log('Koyanskaya of Light bends the rules with a Video Game-esque Cheat!');
      },
    },
    {
      id: 'for-rin-chans-sake',
      name: "For Rin-chan's Sake",
      description: 'A loyalty that outlasts any script. Heals self for 20% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Koyanskaya of Light presses on, healing ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Garden of Avalon: False',
    japaneseName: 'Garden of Avalon',
    description: 'A borrowed miracle, imitated to devastating effect.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Koyanskaya of Light invokes the Garden of Avalon!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Garden of Avalon' });
    },
  },
};

export const ASSASSIN_SERVANTS: ServantDefinition[] = [
  hassan,
  theRipper,
  semiramis,
  sasakiKojiro,
  kingHassan,
  tezcatlipoca,
  koyanskaya,
];
