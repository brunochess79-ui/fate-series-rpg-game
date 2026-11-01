import type { ServantDefinition } from '../../types';
import { applyStatus, dispelBuffs } from '../../engine/status';

const cuChulainn: ServantDefinition = {
  id: 'lancer',
  name: 'Cú Chulainn',
  title: 'Hound of Culann',
  className: 'Lancer',
  trueName: 'Cú Chulainn',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Cú_Chulainn",
  maxHp: 1106,
  atk: 112,
  def: 65,
  agility: 100,
  critChance: 0.1,
  rank: 'B',
  strengths: ['Speed', 'Sustained Regeneration', 'Evasion'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The fastest Servant on the battlefield.',
  skills: [
    {
      id: 'protection-of-the-wolf',
      name: 'Protection of the Wolf',
      description: 'An old protection charm. Recovers 5% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'protection-of-the-wolf-regen',
          name: 'Protection of the Wolf',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Recovers 5% max HP per turn',
        });
        ctx.log("Cú Chulainn's Protection of the Wolf mends their wounds.");
      },
    },
    {
      id: 'battle-continuation',
      name: 'Battle Continuation',
      description: 'Refuses to fall. Raises own Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
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
      description: 'A burst of battle-fury too fast to follow. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Uplift' });
        ctx.log('Cú Chulainn strikes with Uplift!');
      },
    },
  ],
  noblePhantasm: {
    name: "Cursed Spear of the Barbed Thorn",
    japaneseName: 'Gáe Bolg',
    description: "A spear that reverses causality: the thrust always finds the enemy's heart.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Cú Chulainn hurls the Cursed Spear of the Barbed Thorn!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Gáe Bolg' });
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Diarmuid_Ua_Duibhne",
  maxHp: 1181,
  atk: 122,
  def: 72,
  agility: 95,
  critChance: 0.12,
  rank: 'B',
  strengths: ['Speed', 'Debuffs'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'Cursed with an irresistible charm, and blessed with peerless spearplay.',
  skills: [
    {
      id: 'gae-dearg',
      name: "Gáe Dearg's Focus",
      description: 'The red spear unravels magecraft. Dispels the enemy\'s buffs.',
      cooldown: 4,
      npGainSelf: 20,
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
      description: 'A wound that refuses to heal. Deals 1.3x damage.',
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: "Gáe Buidhe's Edge" });
        ctx.log("Diarmuid strikes with Gáe Buidhe's Edge!");
      },
    },
    {
      id: 'loyal-heart',
      name: 'Loyal Heart',
      description: "A knight's devotion sharpens his spear. Raises own Attack by 20% for 2 turns.",
      cooldown: 3,
      npGainSelf: 20,
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
    name: "Twin Lances of Sorrow",
    japaneseName: 'Gáe Dearg and Gáe Buidhe',
    description: 'Both cursed lances strike as one, red and yellow crossing in a single thrust.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Diarmuid crosses the Twin Lances of Sorrow!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Twin Lances' });
    },
  },
};

const achilles: ServantDefinition = {
  id: 'achilles',
  name: 'Achilles',
  title: 'The Hero of the Trojan War',
  className: 'Lancer',
  trueName: 'Achilles',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Achilles",
  maxHp: 1276,
  atk: 122,
  def: 75,
  agility: 75,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Burst Damage', 'Shielding'],
  weaknesses: ['No Self-Heal'],
  passiveDescription: 'Nigh invulnerable but for a single, fatal spot upon his heel.',
  skills: [
    {
      id: 'rage-of-achilles',
      name: 'Rage of Achilles',
      description: 'A wrath that shakes the battlefield. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rage-of-achilles',
          name: 'Rage of Achilles',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Achilles is consumed by the Rage of Achilles!');
      },
    },
    {
      id: 'divine-bath',
      name: 'Divine Bath',
      description:
        'The river Styx wards his body once more. Grants a shield that absorbs damage equal to 15% of his max HP, lasting only this turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divine-bath-shield',
          name: 'Divine Bath',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.15),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Achilles recalls the Divine Bath — his skin turns aside harm.');
      },
    },
    {
      id: 'phalanx-break',
      name: 'Phalanx Break',
      description: 'A charge that shatters formations. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'phalanx-break__critReady',
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
    name: "Rage Beyond the Styx",
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Karna",
  maxHp: 1253,
  atk: 116,
  def: 100,
  agility: 60,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Durability', 'Shielding'],
  weaknesses: ['Slow'],
  passiveDescription: 'Born wearing radiant armor and earrings that ward off death itself.',
  skills: [
    {
      id: 'kavacha-kundala',
      name: 'Kavacha and Kundala',
      description:
        'His divine armor turns aside harm. Grants a shield that absorbs damage equal to 15% of his max HP, lasting only this turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kavacha-kundala-shield',
          name: 'Kavacha and Kundala',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.15),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Karna's Kavacha and Kundala shine with protection!");
      },
    },
    {
      id: 'solar-blessing',
      name: 'Solar Blessing',
      description: "The sun god's power surges through his strike. Deals 1.3x damage.",
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Solar Blessing' });
        ctx.log('Karna strikes with Solar Blessing!');
      },
    },
    {
      id: 'karnas-resolve',
      name: "Karna's Resolve",
      description: 'A hero who never abandons a duel. Raises own Attack by 25% but lowers own Defense by 30% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'karnas-resolve-atk',
          name: "Karna's Resolve",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        applyStatus(ctx.self, {
          id: 'karnas-resolve-def',
          name: "Karna's Resolve",
          kind: 'debuff',
          stat: 'def',
          amount: -0.3,
          turnsRemaining: 2,
          description: '-30% DEF',
        });
        ctx.log("Karna's Resolve hardens - all offense, no retreat!");
      },
    },
  ],
  noblePhantasm: {
    name: "Vasavi Shakti: Spear of the Sun God",
    japaneseName: 'Vasavi Shakti',
    description: 'A single-use divine spear said to guarantee the death of whatever it strikes.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Karna hurls the Vasavi Shakti, the Spear of the Sun God!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Vasavi Shakti' });
    },
  },
};

const romulusQuirinus: ServantDefinition = {
  id: 'romulus-quirinus',
  name: 'Romulus-Quirinus',
  title: 'The Grand Lancer',
  className: 'Lancer',
  trueName: 'Romulus',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Romulus-Quirinus",
  maxHp: 1297,
  atk: 123,
  def: 71,
  agility: 60,
  critChance: 0.1,
  rank: 'B+',
  strengths: ['Highest Damage', 'Sustain via Lifesteal'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The founder of Rome, apotheosized into a god who carries the light of civilization itself.',
  skills: [
    {
      id: 'romes-glory',
      name: "Rome's Glory",
      description: "A founder-king's pride. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'romes-glory',
          name: "Rome's Glory",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Romulus-Quirinus invokes Rome's Glory!");
      },
    },
    {
      id: 'she-wolfs-blessing',
      name: "She-Wolf's Blessing",
      description: 'The wolf that raised him lends her strength. Recovers 7% max HP at the start of each of his next 2 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'she-wolfs-blessing-regen',
          name: "She-Wolf's Blessing",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 2,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log('Romulus-Quirinus calls upon the She-Wolf\'s Blessing.');
      },
    },
    {
      id: 'civilizations-light',
      name: "Civilization's Light",
      description: "A founder's light exposes every flaw. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'civilizations-light',
          name: "Civilization's Light",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Romulus-Quirinus casts Civilization's Light upon the enemy!");
      },
    },
  ],
  noblePhantasm: {
    name: "Trecento Anni: 300 Years of Roman History",
    japaneseName: 'Trecento Anni',
    description: 'Three centuries of a founding empire, poured into a single divine spear-thrust.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Romulus-Quirinus unleashes Trecento Anni!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Trecento Anni' });
    },
  },
};

const enkidu: ServantDefinition = {
  id: 'enkidu',
  name: 'Enkidu',
  title: "Heaven's Chains",
  className: 'Lancer',
  trueName: 'Enkidu',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Enkidu",
  maxHp: 1063,
  atk: 94,
  def: 57,
  agility: 55,
  critChance: 0.1,
  rank: 'C+',
  strengths: ['Crowd Control', 'Durability'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A being of clay shaped by the gods to oppose Gilgamesh, and bound to him ever since.',
  skills: [
    {
      id: 'heavens-restraint',
      name: "Heaven's Restraint",
      description: 'Chains woven from the will of the gods. Stuns the enemy for 1 turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'heavens-restraint-stun',
          name: 'Bound in Chains',
          kind: 'stun',
          turnsRemaining: 1,
          description: 'Cannot act next turn',
        });
        ctx.log("Enkidu binds the enemy in Heaven's Restraint!");
      },
    },
    {
      id: 'clay-of-the-beginning',
      name: 'Clay of the Beginning',
      description: 'A body shaped from the raw clay of creation. Raises own Defense by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'clay-of-the-beginning',
          name: 'Clay of the Beginning',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% DEF',
        });
        ctx.log('Enkidu reshapes into the Clay of the Beginning!');
      },
    },
    {
      id: 'enkidus-bond',
      name: "Enkidu's Bond",
      description: 'A friendship that outlasted the gods themselves. Heals self for 18% max HP.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Enkidu's Bond heals ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "Enkidu's Grasp: The Binding Chains",
    japaneseName: 'Enkidu',
    description: "Chains without beginning or end, wrapping around the enemy's every escape.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log("Enkidu unleashes the Binding Chains!");
      ctx.dealDamage(ctx.self, ctx.enemy, 4.53, { label: 'The Binding Chains' });
      applyStatus(ctx.enemy, {
        id: 'binding-chains-stun',
        name: 'Bound Without End',
        kind: 'stun',
        turnsRemaining: 1,
        description: 'Cannot act next turn',
      });
    },
  },
};

const scathach: ServantDefinition = {
  id: 'scathach',
  name: 'Scáthach',
  title: 'The Queen of the Land of Shadows',
  className: 'Lancer',
  trueName: 'Scáthach',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Scáthach",
  maxHp: 1256,
  atk: 116,
  def: 65,
  agility: 70,
  critChance: 0.12,
  rank: 'B+',
  strengths: ['Highest Damage', 'Durability'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'An immortal warrior queen who trained Cú Chulainn and has slain gods with her own hands.',
  skills: [
    {
      id: 'gods-slayer',
      name: "God-Slayer's Focus",
      description: 'A warrior who has cut down gods before. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'gods-slayer',
          name: "God-Slayer's Focus",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Scáthach's God-Slayer's Focus sharpens!");
      },
    },
    {
      id: 'land-of-shadows',
      name: 'Land of Shadows',
      description: 'Her own domain answers her call. Grants a shield that absorbs damage equal to 20% of her max HP, lasting only this turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'land-of-shadows-shield',
          name: 'Land of Shadows',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Scáthach calls upon the Land of Shadows!');
      },
    },
    {
      id: 'immortal-resolve',
      name: 'Immortal Resolve',
      description: "An immortal warrior's unbreakable will. Recovers 8% max HP at the start of each of her next 2 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'immortal-resolve-regen',
          name: 'Immortal Resolve',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 2,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log("Scáthach's Immortal Resolve steadies her.");
      },
    },
  ],
  noblePhantasm: {
    name: "Gáe Bolg Alternate: The Piercing Death Spear",
    japaneseName: 'Gáe Bolg Alternate',
    description: "A spear whose curse guarantees the wound's fatality, cast down from the Land of Shadows.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Scáthach hurls Gáe Bolg Alternate!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Gáe Bolg Alternate' });
    },
  },
};

const melusine: ServantDefinition = {
  id: 'melusine',
  name: 'Melusine',
  title: 'The Albino Fairy Knight',
  className: 'Lancer',
  trueName: 'Lancelot',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Mélusine",
  maxHp: 1288,
  atk: 109,
  def: 67,
  agility: 60,
  critChance: 0.1,
  rank: 'B',
  strengths: ['Durability', 'Sustain via Lifesteal'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A fairy knight who bears the name of Lancelot, able to become a sleek, supersonic dragon.',
  skills: [
    {
      id: 'dragon-transformation',
      name: 'Dragon Transformation',
      description: "A fairy knight becomes a jet-swift dragon. Raises own Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'dragon-transformation',
          name: 'Dragon Transformation',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% ATK',
        });
        ctx.log('Melusine takes her Dragon Transformation!');
      },
    },
    {
      id: 'fairy-knights-devotion',
      name: "Fairy Knight's Devotion",
      description: "A knight's devotion mends every wound. Recovers 7% max HP at the start of each of her next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fairy-knights-devotion-regen',
          name: "Fairy Knight's Devotion",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log("Melusine's Fairy Knight's Devotion mends her wounds.");
      },
    },
    {
      id: 'supersonic-dive',
      name: 'Supersonic Dive',
      description: 'A dragon strike faster than sound. Deals 1.2x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Supersonic Dive' });
        ctx.log('Melusine strikes with a Supersonic Dive!');
      },
    },
  ],
  noblePhantasm: {
    name: "Almace: The Dragon Descends",
    japaneseName: 'Almace',
    description: 'A dragon-knight descending at supersonic speed, blade first.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Melusine descends with Almace!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Almace' });
    },
  },
};

const ereshkigal: ServantDefinition = {
  id: 'ereshkigal',
  name: 'Ereshkigal',
  title: 'The Goddess of the Underworld',
  className: 'Lancer',
  trueName: 'Ereshkigal',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Ereshkigal",
  maxHp: 1296,
  atk: 121,
  def: 70,
  agility: 55,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Debuffs', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The tsundere Goddess of the Underworld, ruling the dead alone with a heart she refuses to admit is kind.',
  skills: [
    {
      id: 'nins-authority',
      name: "Nin's Authority",
      description: "An underworld queen's authority saps the enemy's strength. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'nins-authority',
          name: "Nin's Authority",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log("Ereshkigal invokes Nin's Authority!");
      },
    },
    {
      id: 'irkallas-embrace',
      name: "Irkalla's Embrace",
      description: "The land of no return sustains its queen. Recovers 8% max HP at the start of each of her next 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'irkallas-embrace-regen',
          name: "Irkalla's Embrace",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 2,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log("Ereshkigal calls upon Irkalla's Embrace.");
      },
    },
    {
      id: 'seven-gates-decree',
      name: 'Seven Gates Decree',
      description: "A decree that strips the enemy bare, gate by gate. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'seven-gates-decree',
          name: 'Seven Gates Decree',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log('Ereshkigal issues the Seven Gates Decree!');
      },
    },
  ],
  noblePhantasm: {
    name: "Kur: Beyond the Realm of Death",
    japaneseName: 'Kur',
    description: 'A judgment cast from the underworld itself, dragging the enemy toward the land of no return.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Ereshkigal casts Kur: Beyond the Realm of Death!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Kur' });
    },
  },
};

const romulus: ServantDefinition = {
  id: 'romulus',
  name: 'Romulus',
  title: 'The Founder of Rome',
  className: 'Lancer',
  trueName: 'Romulus',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Romulus",
  maxHp: 1158,
  atk: 112,
  def: 59,
  agility: 66,
  critChance: 0.12,
  rank: 'A+',
  strengths: ['Durability', 'Buffs'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The first king, whose spear took root and became a sacred tree on the Palatine.',
  skills: [
    {
      id: 'imperial-privilege',
      name: 'Imperial Privilege',
      description: "An emperor's authority heals every wound. Heals self for 20% max HP.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Nero's Imperial Privilege heals ${healed} HP.`);
      },
    },
    {
      id: 'seven-hills',
      name: 'Seven Hills of Rome',
      description: 'The city itself shields its founder. Grants a shield that absorbs damage equal to 20% of his max HP, lasting only this turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'seven-hills-shield',
          name: 'Seven Hills of Rome',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('The Seven Hills of Rome rise around their founder!');
      },
    },
    {
      id: 'founders-roar',
      name: "Founder's Roar",
      description: 'All roads lead to Rome, and all courage bends before its founder. Lowers enemy Attack by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'founders-roar',
          name: "Founder's Roar",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% ATK',
        });
        ctx.log("Romulus's Founder's Roar shakes the enemy's resolve!");
      },
    },
  ],
  noblePhantasm: {
    name: 'Magna Voluisse Magnum: All Things Lead to My Spear',
    japaneseName: 'Magna Voluisse Magnum',
    description: 'The divine spear that founded a city, driven home with the weight of all Rome.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Romulus levels his spear — Magna Voluisse Magnum!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Magna Voluisse Magnum' });
    },
  },
};

const percival: ServantDefinition = {
  id: 'percival',
  name: 'Percival',
  title: 'The Knight of the Grail',
  className: 'Lancer',
  trueName: 'Percival',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Percival",
  maxHp: 1087,
  atk: 99,
  def: 58,
  agility: 68,
  critChance: 0.12,
  rank: 'A+',
  strengths: ['Stun', 'NP Denial', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The purest knight of the Round Table, who beheld the Grail and was found worthy.',
  skills: [
    {
      id: 'grails-grace',
      name: "Grail's Grace",
      description: 'The blessing of the cup he once beheld. Recovers 8% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'grails-grace-regen',
          name: "Grail's Grace",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 3,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log("The Grail's Grace settles over Percival.");
      },
    },
    {
      id: 'silence-of-the-grail',
      name: 'Silence of the Grail',
      description: "The cup's light stills the enemy where they stand. Stuns the enemy for 1 turn.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'silence-of-the-grail-stun',
          name: 'Stilled',
          kind: 'stun',
          turnsRemaining: 1,
          description: 'Cannot act next turn',
        });
        ctx.log('Percival\'s Silence of the Grail stills the enemy!');
      },
    },
    {
      id: 'seal-of-the-grail',
      name: 'Seal of the Grail',
      description: "The cup's light locks the enemy's power away. Drains 60% from the enemy's Noble Phantasm gauge. Takes nothing on a turn the enemy unleashes their Noble Phantasm.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        ctx.enemy.npGauge = Math.max(0, ctx.enemy.npGauge - 60);
        ctx.log("Percival's Seal of the Grail locks away the enemy's power!");
      },
    },
  ],
  noblePhantasm: {
    name: 'Longinus Count Zero: The Holy Lance, Unsealed',
    japaneseName: 'Longinus Count Zero',
    description: "The holy lance answers the purest of knights, tearing through armor and shield alike with force equal to 34% of the enemy's max HP plus 40.",
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Percival unseals the holy lance — Longinus Count Zero!');
      // Scales off the enemy's vitality rather than Percival's Attack; as an
      // equivalent multiplier the whole damage pipeline still applies on top.
      const multiplier = (0.34 * ctx.enemy.maxHp + 40) / percival.atk;
      ctx.dealDamage(ctx.self, ctx.enemy, multiplier, { label: 'Longinus Count Zero' });
    },
  },
};

const brynhildr: ServantDefinition = {
  id: 'brynhildr',
  name: 'Brynhildr',
  title: 'The Valkyrie of Tragic Love',
  className: 'Lancer',
  trueName: 'Brynhildr',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Brynhildr",
  maxHp: 1243,
  atk: 128,
  def: 59,
  agility: 76,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Critical Hits', 'Burst Damage'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A fallen valkyrie whose spear grows heavier and crueler the more she loves.',
  skills: [
    {
      id: 'primordial-rune-valkyrie',
      name: 'Primordial Rune (Valkyrie)',
      description: 'Runes of the battle-maidens guide her spearpoint. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'primordial-rune-valkyrie',
          name: 'Primordial Rune (Valkyrie)',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
        });
        ctx.log('Brynhildr traces a Primordial Rune in the air!');
      },
    },
    {
      id: 'heros-bride',
      name: "Hero's Bride",
      description: 'The better she knows a hero, the deeper her spear reaches. Lowers enemy Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'heros-bride',
          name: "Hero's Bride",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Brynhildr's gaze finds every flaw in the enemy's guard.");
      },
    },
    {
      id: 'mana-burst-flame',
      name: 'Mana Burst (Flame)',
      description: 'Her spear ignites with valkyrie fire. Raises own Attack by 25% for 1 turn.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mana-burst-flame',
          name: 'Mana Burst (Flame)',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 1,
          description: '+25% ATK (1 turn)',
        });
        ctx.log("Brynhildr's spear ignites with white flame!");
      },
    },
  ],
  noblePhantasm: {
    name: 'Brynhildr Romantia: Until Death Divide the Two',
    japaneseName: 'Brynhildr Romantia',
    description: 'A spear of love and death, heaviest against the one she holds dearest.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Brynhildr casts her whole heart with the spear — Brynhildr Romantia!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.95, { label: 'Brynhildr Romantia' });
    },
  },
};

const bhima: ServantDefinition = {
  id: 'bhima',
  name: 'Bhima',
  title: 'The Son of the Wind God',
  className: 'Lancer',
  trueName: 'Bhima',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Bhima",
  maxHp: 1257,
  atk: 119,
  def: 49,
  agility: 62,
  critChance: 0.1,
  rank: 'B',
  strengths: ['Raw Power', 'High HP'],
  weaknesses: ['Low Defense', 'Low Crit Rate'],
  passiveDescription: 'The mightiest of the five Pandava brothers, with the strength of ten thousand elephants.',
  skills: [
    {
      id: 'blessing-of-the-wind-god',
      name: 'Blessing of the Wind God',
      description: 'Vayu\'s gale fills his limbs. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'blessing-of-the-wind-god',
          name: 'Blessing of the Wind God',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('The wind rises — Bhima receives his father\'s blessing!');
      },
    },
    {
      id: 'gada-strike',
      name: 'Gada Strike',
      description: 'A blow of the great mace that shatters stone. Deals 1.528x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.528, { label: 'Gada Strike' });
        ctx.log('Bhima strikes with Gada Strike!');
      },
    },
    {
      id: 'adamantine-vow',
      name: 'Adamantine Vow',
      description: 'An oath sworn in blood knits his body back together. Recovers 4.37% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'adamantine-vow-regen',
          name: 'Adamantine Vow',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.0437),
          turnsRemaining: 3,
          description: 'Recovers 4.37% max HP per turn',
        });
        ctx.log("Bhima's Adamantine Vow mends their wounds.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Maruti Vayuputra: O Son of the Wind God',
    japaneseName: 'Maruti Vayuputra',
    description: 'The white banner lance of the wind god Vayu, awakening the divinity in his blood.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Bhima raises the wind god\'s white lance — Maruti Vayuputra!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.85, { label: 'Maruti Vayuputra' });
    },
  },
};
export const LANCER_SERVANTS: ServantDefinition[] = [
  cuChulainn,
  diarmuid,
  achilles,
  karna,
  romulusQuirinus,
  enkidu,
  scathach,
  melusine,
  ereshkigal,
  romulus,
  percival,
  brynhildr,
  bhima,
];
