import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const kama: ServantDefinition = {
  id: 'kama',
  name: 'Kama',
  title: 'The God of Love',
  className: 'Avenger',
  trueName: 'Kama',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Kama_(Avenger)",
  maxHp: 1100,
  atk: 113,
  def: 55,
  agility: 70,
  critChance: 0.15,
  rank: 'B+',
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

const nobunaga: ServantDefinition = {
  id: 'nobunaga',
  name: 'Oda Nobunaga',
  title: 'The Demon King of the Sixth Heaven',
  className: 'Avenger',
  trueName: 'Oda Nobunaga',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Demon_King_Nobunaga",
  maxHp: 1050,
  atk: 122,
  def: 58,
  agility: 62,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Highest Damage', 'Critical Hits'],
  weaknesses: ['Low HP'],
  passiveDescription: 'The self-proclaimed Demon King, who would burn down gods themselves to remake the world.',
  skills: [
    {
      id: 'demon-kings-decree',
      name: "Demon King's Decree",
      description: "A demon king's will brooks no refusal. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'demon-kings-decree',
          name: "Demon King's Decree",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Oda Nobunaga issues a Demon King's Decree!");
      },
    },
    {
      id: 'matchlock-volley',
      name: 'Matchlock Volley',
      description: 'A hail of gunfire ahead of its time. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Matchlock Volley' });
        ctx.log('Oda Nobunaga fires a Matchlock Volley!');
      },
    },
    {
      id: 'burn-mount-hiei',
      name: 'Burn Mount Hiei',
      description: 'A demon king who would burn even a mountain of gods. Lowers enemy Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'burn-mount-hiei',
          name: 'Burn Mount Hiei',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log('Oda Nobunaga threatens to Burn Mount Hiei!');
      },
    },
  ],
  noblePhantasm: {
    name: "Three Thousand Worlds: Total Purge of Evil",
    japaneseName: 'Sanzensekai',
    description: 'A demon king burning down heaven, earth, and every god between them.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Oda Nobunaga invokes the Total Purge of Evil!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Total Purge of Evil' });
    },
  },
};

const edmondDantes: ServantDefinition = {
  id: 'edmond-dantes',
  name: 'Edmond Dantès',
  title: 'The Count of Monte Cristo',
  className: 'Avenger',
  trueName: 'Edmond Dantès',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Edmond_Dantès",
  maxHp: 1100,
  atk: 120,
  def: 60,
  agility: 58,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Highest Damage', 'Debuffs'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A wrongfully imprisoned man reborn as pure vengeance, wreathed in shadow and green flame.',
  skills: [
    {
      id: 'the-counts-wrath',
      name: "The Count's Wrath",
      description: "Years of imprisoned fury unleashed at once. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'the-counts-wrath',
          name: "The Count's Wrath",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Edmond Dantès unleashes the Count's Wrath!");
      },
    },
    {
      id: 'shadow-of-vengeance',
      name: 'Shadow of Vengeance',
      description: "A vengeance that unravels the enemy's resolve. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'shadow-of-vengeance',
          name: 'Shadow of Vengeance',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log('Edmond Dantès casts the Shadow of Vengeance!');
      },
    },
    {
      id: 'green-flame',
      name: 'Green Flame',
      description: "A cold fire that never forgives. Afflicts the enemy with a curse.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'green-flame',
          name: 'Green Flame',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Burning with green flame',
        });
        ctx.log('Edmond Dantès wreathes the enemy in Green Flame!');
      },
    },
  ],
  noblePhantasm: {
    name: "The Count of Monte Cristo: Vengeance Everlasting",
    japaneseName: 'Le Comte de Monte-Cristo',
    description: "A vengeance fourteen years in the making, delivered without a shred of mercy.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Edmond Dantès delivers Vengeance Everlasting!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Vengeance Everlasting' });
    },
  },
};

const jeanneAlter: ServantDefinition = {
  id: 'jeanne-alter',
  name: "Jeanne d'Arc (Alter)",
  title: 'The Dragon Witch',
  className: 'Avenger',
  trueName: "Jeanne d'Arc",
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Jeanne_d'Arc_(Alter)",
  maxHp: 1250,
  atk: 125,
  def: 62,
  agility: 60,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Highest Damage', 'Debuffs'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A cynical, fire-wreathed corruption of the Holy Maiden, burning with resentment for the world that failed her.',
  skills: [
    {
      id: 'black-barrel-2',
      name: 'Black Barrel',
      description: "A dragon's fury sharpens every strike. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'jalter-black-barrel',
          name: 'Black Barrel',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Jeanne d'Arc (Alter) bares her Black Barrel!");
      },
    },
    {
      id: 'dragon-witchs-scorn',
      name: "Dragon Witch's Scorn",
      description: "A scorn for the world that betrayed her. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'dragon-witchs-scorn',
          name: "Dragon Witch's Scorn",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log("Jeanne d'Arc (Alter) unleashes her Scorn upon the enemy!");
      },
    },
    {
      id: 'flames-of-resentment',
      name: 'Flames of Resentment',
      description: 'A dragon-fire that never forgives. Afflicts the enemy with a curse.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'flames-of-resentment',
          name: 'Flames of Resentment',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Burning with resentment',
        });
        ctx.log("Jeanne d'Arc (Alter) wreathes the enemy in Flames of Resentment!");
      },
    },
  ],
  noblePhantasm: {
    name: "Ruler of the End: Formal Craft",
    japaneseName: 'Formal Craft',
    description: "A dragon's judgment, delivered in a single black-flame detonation.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log("Jeanne d'Arc (Alter) unleashes Formal Craft!");
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Formal Craft' });
    },
  },
};

const alcides: ServantDefinition = {
  id: 'alcides',
  name: 'Alcides',
  title: 'The Twelve Labors, Broken',
  className: 'Avenger',
  trueName: 'Heracles',
  fateWikiUrl: "https://typemoon.fandom.com/wiki/Alcides",
  maxHp: 1400,
  atk: 128,
  def: 58,
  agility: 55,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Raw Power', 'Sustain'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A hero robbed of his sanity and his glory alike, raging at the gods who did it.',
  skills: [
    {
      id: 'broken-fetters',
      name: 'Broken Fetters',
      description: 'Every chain meant to bind him has failed. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'broken-fetters',
          name: 'Broken Fetters',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% Attack',
        });
        ctx.log('Alcides shatters his Broken Fetters, raging with power!');
      },
    },
    {
      id: 'twelve-trials',
      name: 'Twelve Trials',
      description: 'A hero who has already survived every labor set before him. Deals a bonus strike.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'utility',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.log('Alcides recalls his Twelve Trials and strikes again!');
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Twelve Trials' });
      },
    },
    {
      id: 'undying-wrath',
      name: 'Undying Wrath',
      description: 'A berserker fury he can no longer fully restrain. Heals self for 20% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Alcides endures through Undying Wrath, healing ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "God Hand: Twelve Trials Bring Death",
    japaneseName: 'God Hand',
    description: "Nine lives are not enough to stop him. He simply gets back up and swings again.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Alcides unleashes the full weight of God Hand!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'God Hand' });
    },
  },
};

const kagekiyo: ServantDefinition = {
  id: 'kagekiyo',
  name: 'Taira no Kagekiyo',
  title: 'The Vengeful Spirit',
  className: 'Avenger',
  trueName: 'Taira no Kagekiyo',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Taira_no_Kagekiyo",
  maxHp: 1050,
  atk: 95,
  def: 58,
  agility: 55,
  critChance: 0.1,
  rank: 'C+',
  strengths: ['Sustain', 'Damage over Time'],
  weaknesses: ['Low Attack'],
  passiveDescription: 'A samurai spirit who tore out his own eyes rather than watch his enemies triumph.',
  skills: [
    {
      id: 'unyielding-hatred',
      name: 'Unyielding Hatred',
      description: 'A grudge that has outlived an era. Raises own Attack by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'unyielding-hatred',
          name: 'Unyielding Hatred',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Attack',
        });
        ctx.log('Taira no Kagekiyo burns with Unyielding Hatred!');
      },
    },
    {
      id: 'curse-of-the-genji',
      name: 'Curse of the Genji',
      description: 'A lingering grudge afflicts the enemy. Applies a damage-over-time effect.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'curse-of-the-genji',
          name: 'Curse of the Genji',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.045),
          turnsRemaining: 3,
          description: 'Afflicted by the Curse of the Genji',
        });
        ctx.log('Taira no Kagekiyo curses the enemy with the Curse of the Genji!');
      },
    },
    {
      id: 'blinded-resolve',
      name: 'Blinded Resolve',
      description: 'Having torn out his own eyes, only will remains. Heals self for 18% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Taira no Kagekiyo endures through Blinded Resolve, healing ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "Vengeful Blade of the Taira",
    japaneseName: 'Vengeful Blade of the Taira',
    description: 'A final grudge, cut loose in a single furious strike.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Taira no Kagekiyo swings the Vengeful Blade of the Taira!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.2, { label: 'Vengeful Blade of the Taira' });
    },
  },
};

const johnLackland: ServantDefinition = {
  id: 'john-lackland',
  name: 'John Lackland',
  title: 'The Landless King',
  className: 'Avenger',
  trueName: 'John, King of England',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/John_Lackland",
  maxHp: 1470,
  atk: 85,
  def: 68,
  agility: 48,
  critChance: 0.08,
  rank: 'B',
  strengths: ['Highest HP', 'Sustain', 'Debuffs'],
  weaknesses: ['Lowest Attack', 'Slow'],
  passiveDescription: 'The king who lost Normandy and was forced to sign away his own power, yet somehow still refuses to fall.',
  skills: [
    {
      id: 'kings-hollow-pride',
      name: "King Lackland's Pride",
      description: "A tyrant's hollow pride, sharpened into a weapon. Raises own Attack by 25% for 3 turns and floods his Noble Phantasm gauge.",
      cooldown: 4,
      npGainSelf: 35,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kings-hollow-pride',
          name: "King Lackland's Pride",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Attack',
        });
        ctx.log("John Lackland postures with King Lackland's Pride!");
      },
    },
    {
      id: 'loss-of-normandy',
      name: 'Loss of Normandy',
      description: "He lost his lands once; now he takes what little the enemy has left. Drains 15% from the enemy's Noble Phantasm gauge.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        ctx.enemy.npGauge = Math.max(0, ctx.enemy.npGauge - 15);
        ctx.log("John Lackland's Loss of Normandy drains the enemy's resolve!");
      },
    },
    {
      id: 'magna-cartas-burden',
      name: "Magna Carta's Burden",
      description: 'The document that once bound him becomes a shield instead. Recovers 6% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'magna-cartas-burden-regen',
          name: "Magna Carta's Burden",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.06),
          turnsRemaining: 3,
          description: 'Recovers 6% max HP per turn',
        });
        ctx.log("John Lackland turns Magna Carta's Burden into a shield.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Inversio Libertatis Oraculum',
    japaneseName: 'Inversio Libertatis Oraculum',
    description: 'The oath that once stripped him of power, turned inside out to become his shield and blade at once.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('John Lackland invokes Inversio Libertatis Oraculum!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.4, { label: 'Inversio Libertatis Oraculum' });
      const before = ctx.self.statuses.length;
      ctx.self.statuses = ctx.self.statuses.filter((s) => s.kind !== 'debuff' && s.kind !== 'dot');
      if (ctx.self.statuses.length < before) {
        ctx.log('The reversed oath cleanses every curse laid upon him!');
      }
      const healed = Math.round(ctx.self.maxHp * 0.1);
      ctx.self.hp = ctx.self.hp + healed;
      ctx.log(`John Lackland recovers ${healed} HP as the curse turns to blessing.`);
    },
  },
};

export const AVENGER_SERVANTS: ServantDefinition[] = [
  kama,
  nobunaga,
  edmondDantes,
  jeanneAlter,
  alcides,
  kagekiyo,
  johnLackland,
];
