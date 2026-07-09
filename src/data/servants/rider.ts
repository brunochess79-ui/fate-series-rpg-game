import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const iskandar: ServantDefinition = {
  id: 'rider',
  name: 'Iskandar',
  title: 'King of Conquerors',
  className: 'Rider',
  trueName: 'Iskandar',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Iskandar",
  maxHp: 1330,
  atk: 100,
  def: 75,
  agility: 60,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Durability', 'High HP', 'Sustain via Lifesteal'],
  weaknesses: ['Slow', 'Low Crit Rate'],
  passiveDescription: 'A king of unmatched vitality, the toughest Servant on the field.',
  skills: [
    {
      id: 'charisma-king',
      name: "King's Charisma",
      description: "A conqueror's presence. Raises own Attack and Defense by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kings-charisma-atk',
          name: "King's Charisma",
          kind: 'buff',
          stat: 'atk',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% ATK',
        });
        applyStatus(ctx.self, {
          id: 'kings-charisma-def',
          name: "King's Charisma",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% DEF',
        });
        ctx.log("Iskandar rallies with a King's Charisma!");
      },
    },
    {
      id: 'divinity',
      name: 'Divinity',
      description:
        'Blood of the divine wards his body. Grants a shield that absorbs damage equal to 22% of his max HP, lasting this turn and the next.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divinity-shield',
          name: 'Divinity',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.22),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Iskandar calls upon Divinity — a ward surrounds him.');
      },
    },
    {
      id: 'uplift-rider',
      name: 'Uplift',
      description: 'Rouses the army, drawing strength from the fight itself. Heals for 25% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.0, { label: 'Rousing Blow' });
        const healed = Math.round(dmg * 0.25);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Iskandar rouses for the charge, recovering ${healed} HP!`);
      },
    },
  ],
  noblePhantasm: {
    name: "Army of Bonds",
    japaneseName: 'Ionioi Hetairoi',
    description: 'The king calls forth the full might of his army in one earth-shaking charge.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Iskandar summons the Army of Bonds!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.25, { label: 'Ionioi Hetairoi' });
      applyStatus(ctx.self, {
        id: 'conquerors-momentum',
        name: "Conqueror's Momentum",
        kind: 'buff',
        stat: 'atk',
        amount: 0.2,
        turnsRemaining: 2,
        description: '+20% ATK',
      });
    },
  },
};


const boudica: ServantDefinition = {
  id: 'boudica',
  name: 'Boudica',
  title: 'The Warrior Queen',
  className: 'Rider',
  trueName: 'Boudica',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Boudica",
  maxHp: 1280,
  atk: 98,
  def: 78,
  agility: 58,
  critChance: 0.08,
  rank: 'A',
  strengths: ['Durability', 'Shielding', 'Regeneration'],
  weaknesses: ['Slow', 'Low Crit Rate'],
  passiveDescription: "A queen's fury drives her chariot through the ranks of her enemies.",
  skills: [
    {
      id: 'queens-wrath',
      name: "Queen's Wrath",
      description: 'A fury born of injustice. Raises own Attack by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'queens-wrath',
          name: "Queen's Wrath",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% ATK',
        });
        ctx.log("Boudica's Wrath as Queen burns bright!");
      },
    },
    {
      id: 'icenis-shield',
      name: "Iceni's Shield",
      description:
        "Her tribe stands with her still. Grants a shield that absorbs damage equal to 20% of her max HP, lasting this turn and the next.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'icenis-shield',
          name: "Iceni's Shield",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Boudica raises the Iceni's Shield!");
      },
    },
    {
      id: 'rallying-cry',
      name: 'Rallying Cry',
      description: 'A cry that steels the wounded. Recovers 5% max HP at the start of each of her next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rallying-cry-regen',
          name: 'Rallying Cry',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Recovers 5% max HP per turn',
        });
        ctx.log("Boudica's Rallying Cry steadies her allies and herself.");
      },
    },
  ],
  noblePhantasm: {
    name: "Chariot of the Iceni: Vengeance Ride",
    japaneseName: 'Chariot of the Iceni',
    description: "A queen's chariot thunders forward, trampling all who wronged her people.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Boudica rides the Chariot of the Iceni to vengeance!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.34, { label: 'Vengeance Ride' });
      applyStatus(ctx.self, {
        id: 'vengeance-fury',
        name: 'Vengeance Fury',
        kind: 'buff',
        stat: 'atk',
        amount: 0.15,
        turnsRemaining: 2,
        description: '+15% ATK',
      });
    },
  },
};


const medusa: ServantDefinition = {
  id: 'medusa',
  name: 'Medusa',
  title: 'The Gorgon',
  className: 'Rider',
  trueName: 'Medusa',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Medusa",
  maxHp: 1050,
  atk: 105,
  def: 58,
  agility: 78,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Critical Hits', 'Crowd Control'],
  weaknesses: ['Fragile'],
  passiveDescription: 'A gorgon who once was a gentle priestess, now cursed with a gaze that turns flesh to stone.',
  skills: [
    {
      id: 'serpents-gaze',
      name: "Serpent's Gaze",
      description: "A predator's focus sharpens her aim. Raises own crit rate for 2 turns.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'serpents-gaze',
          name: "Serpent's Gaze",
          kind: 'buff',
          stat: 'critChance',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
        });
        ctx.log("Medusa's Serpent's Gaze sharpens!");
      },
    },
    {
      id: 'broken-phantasm-bow',
      name: 'Broken Phantasm: Bow',
      description: 'A snapped bow loosed as a final gambit. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Broken Phantasm' });
        ctx.log('Medusa breaks her bow in a desperate Broken Phantasm!');
      },
    },
    {
      id: 'mystic-eyes',
      name: 'Mystic Eyes',
      description: 'A glance that turns the enemy to stone. Stuns the enemy for 1 turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'mystic-eyes-stun',
          name: 'Petrified',
          kind: 'stun',
          turnsRemaining: 1,
          description: 'Cannot act next turn',
        });
        ctx.log("Medusa's Mystic Eyes turn the enemy to stone!");
      },
    },
  ],
  noblePhantasm: {
    name: "Blood Fort Andromeda",
    japaneseName: 'Blood Fort Andromeda',
    description: 'A crumbling fortress of chains and stone, binding the enemy before the killing blow.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Medusa unleashes Blood Fort Andromeda!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.05, { label: 'Blood Fort Andromeda' });
      applyStatus(ctx.enemy, {
        id: 'blood-fort-stun',
        name: 'Bound in Stone',
        kind: 'stun',
        turnsRemaining: 1,
        description: 'Cannot act next turn',
      });
    },
  },
};

const noah: ServantDefinition = {
  id: 'noah',
  name: 'Noah',
  title: 'The Grand Rider',
  className: 'Rider',
  trueName: 'Noah',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Nemo/Noah",
  maxHp: 1450,
  atk: 91,
  def: 80,
  agility: 40,
  critChance: 0.05,
  rank: 'A',
  strengths: ['Highest HP', 'Shielding'],
  weaknesses: ['Slowest'],
  passiveDescription: "The captain of the Ark, who stood against a flood that erased the world.",
  skills: [
    {
      id: 'ark-of-salvation',
      name: 'Ark of Salvation',
      description: "A vessel that outlasted the end of the world. Grants a shield that absorbs damage equal to 24% of his max HP, lasting this turn and the next.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'ark-of-salvation-shield',
          name: 'Ark of Salvation',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.24),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Noah is sheltered within the Ark of Salvation!');
      },
    },
    {
      id: 'rainbow-covenant',
      name: 'Rainbow Covenant',
      description: "A promise that the flood will not come again. Recovers 7% max HP at the start of each of his next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rainbow-covenant-regen',
          name: 'Rainbow Covenant',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log('Noah invokes the Rainbow Covenant.');
      },
    },
    {
      id: 'voyage-of-the-faithful',
      name: 'Voyage of the Faithful',
      description: "Steady resolve through the endless deluge. Raises own Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'voyage-of-the-faithful',
          name: 'Voyage of the Faithful',
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% DEF',
        });
        ctx.log('Noah steadies himself for the Voyage of the Faithful!');
      },
    },
  ],
  noblePhantasm: {
    name: "Noah's Ark: The Great Flood",
    japaneseName: 'Noah',
    description: 'A deluge that erased the old world, called down once more upon the enemy.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log("Noah calls down the Great Flood!");
      ctx.dealDamage(ctx.self, ctx.enemy, 4.73, { label: 'The Great Flood' });
      applyStatus(ctx.enemy, {
        id: 'great-flood-debuff',
        name: 'Erosion',
        kind: 'debuff',
        stat: 'def',
        amount: -0.15,
        turnsRemaining: 3,
        description: '-15% DEF',
      });
    },
  },
};

const ozymandias: ServantDefinition = {
  id: 'ozymandias',
  name: 'Ozymandias',
  title: 'The Sun King of Egypt',
  className: 'Rider',
  trueName: 'Rameses II',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Ozymandias",
  maxHp: 1300,
  atk: 133,
  def: 68,
  agility: 55,
  critChance: 0.12,
  rank: 'A+',
  strengths: ['Highest Damage'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The radiant Sun King of Egypt, endlessly arrogant and endlessly certain of his own divinity.',
  skills: [
    {
      id: 'ramesseum-tentyris',
      name: 'Ramesseum Tentyris',
      description: "A pharaoh's authority radiates outward. Raises own Attack by 25% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'ramesseum-tentyris',
          name: 'Ramesseum Tentyris',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% ATK',
        });
        ctx.log('Ozymandias invokes Ramesseum Tentyris!');
      },
    },
    {
      id: 'pharaohs-decree',
      name: "Pharaoh's Decree",
      description: "A living god's decree cannot be refused. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'pharaohs-decree',
          name: "Pharaoh's Decree",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Ozymandias issues a Pharaoh's Decree!");
      },
    },
    {
      id: 'sunlights-authority',
      name: "Sunlight's Authority",
      description: 'The sun itself answers to him. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sunlights-authority__critReady',
          name: "Sunlight's Authority",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Ozymandias calls upon Sunlight's Authority.");
      },
    },
  ],
  noblePhantasm: {
    name: "Ramesseum Tentyris: The Pyramids Descend",
    japaneseName: 'Ramesseum Tentyris',
    description: "Monuments to his own divinity, dropped from the sky upon anyone who doubts him.",
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Ozymandias calls down the Pyramids!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.1, { label: 'The Pyramids Descend' });
    },
  },
};

const quetzalcoatl: ServantDefinition = {
  id: 'quetzalcoatl',
  name: 'Quetzalcoatl',
  title: 'The Feathered Serpent',
  className: 'Rider',
  trueName: 'Quetzalcoatl',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Quetzalcoatl",
  maxHp: 1300,
  atk: 115,
  def: 65,
  agility: 65,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Highest Damage', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A cheerful Aztec goddess who crashes down from the sky like a living, luchadora meteor.',
  skills: [
    {
      id: 'luchadoras-spirit',
      name: "Luchadora's Spirit",
      description: "A wrestler's boundless cheer. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'luchadoras-spirit',
          name: "Luchadora's Spirit",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Quetzalcoatl's Luchadora's Spirit soars!");
      },
    },
    {
      id: 'feathered-blessing',
      name: 'Feathered Blessing',
      description: "A goddess's grace mends the flesh. Recovers 8% max HP at the start of each of her next 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'feathered-blessing-regen',
          name: 'Feathered Blessing',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 2,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log('Quetzalcoatl grants a Feathered Blessing.');
      },
    },
    {
      id: 'meteor-drop',
      name: 'Meteor Drop',
      description: 'A wrestling move to end all wrestling moves. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'meteor-drop__critReady',
          name: 'Meteor Drop',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Quetzalcoatl winds up for a Meteor Drop!');
      },
    },
  ],
  noblePhantasm: {
    name: "Xiuhcoatl: The Crash of the Turquoise Serpent",
    japaneseName: 'Xiuhcoatl',
    description: 'A goddess crashing down from the heavens like a living, extinction-level meteor.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Quetzalcoatl crashes down as Xiuhcoatl!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Xiuhcoatl' });
    },
  },
};

const astolfo: ServantDefinition = {
  id: 'astolfo',
  name: 'Astolfo',
  title: 'The Paladin of Charlemagne',
  className: 'Rider',
  trueName: 'Astolfo',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Astolfo",
  maxHp: 1150,
  atk: 95,
  def: 55,
  agility: 90,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Speed', 'Evasion'],
  weaknesses: ['Low Damage'],
  passiveDescription: "A carefree Paladin of Charlemagne, riding a hippogriff and beloved across the fandom.",
  skills: [
    {
      id: 'hippogriff-charge',
      name: 'Hippogriff Charge',
      description: 'A carefree charge on hippogriff-back. Raises own Attack by 20% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'hippogriff-charge',
          name: 'Hippogriff Charge',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log('Astolfo charges in on Hippogriff-back!');
      },
    },
    {
      id: 'evasive-loop',
      name: 'Evasive Loop',
      description: 'A carefree dodge, laughing the whole way. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'evasive-loop-evade',
          name: 'Evasive Loop',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Astolfo loops out of harm\'s way!');
      },
    },
    {
      id: 'paladins-cheer',
      name: "Paladin's Cheer",
      description: "A cheerful resolve mends every wound. Heals self for 16% max HP.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.16);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Astolfo's Paladin's Cheer heals ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: "Hippogriff: La Black Luna",
    japaneseName: 'La Black Luna',
    description: "A hippogriff's carefree charge, ending the fight before anyone realizes it started.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Astolfo charges in with La Black Luna!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.48, { label: 'La Black Luna' });
    },
  },
};

const drake: ServantDefinition = {
  id: 'drake',
  name: 'Francis Drake',
  title: 'The Pirate Queen',
  className: 'Rider',
  trueName: 'Francis Drake',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Francis_Drake",
  maxHp: 1150,
  atk: 112,
  def: 58,
  agility: 68,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Buffs', 'Debuffs'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A privateer queen who claims the seas belong to whoever is bold enough to take them.',
  skills: [
    {
      id: 'pioneer-of-the-stars',
      name: 'Pioneer of the Stars',
      description: 'A course charted by starlight alone. Raises own Agility by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'pioneer-of-the-stars',
          name: 'Pioneer of the Stars',
          kind: 'buff',
          stat: 'agility',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Agility',
        });
        ctx.log('Francis Drake charts a course as Pioneer of the Stars!');
      },
    },
    {
      id: 'golden-hind',
      name: 'The Golden Hind',
      description: "Her ship's hull, reinforced beyond reason. Raises own Defense by 22% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'golden-hind',
          name: 'The Golden Hind',
          kind: 'buff',
          stat: 'def',
          amount: 0.22,
          turnsRemaining: 3,
          description: '+22% Defense',
        });
        ctx.log('Francis Drake braces behind the Golden Hind!');
      },
    },
    {
      id: 'privateer-flag',
      name: "Privateer's Flag",
      description: 'A flag raised that grants license to plunder. Lowers enemy Defense by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'privateer-flag',
          name: "Privateer's Flag",
          kind: 'debuff',
          stat: 'def',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% Defense',
        });
        ctx.log("Francis Drake raises her Privateer's Flag!");
      },
    },
  ],
  noblePhantasm: {
    name: "Golden Hind: Sunny Day, Fair Wind, Following Sea",
    japaneseName: 'Golden Hind',
    description: 'A broadside from the Golden Hind, guns roaring in unison.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Francis Drake fires a full broadside from the Golden Hind!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Golden Hind' });
    },
  },
};

const odysseus: ServantDefinition = {
  id: 'odysseus',
  name: 'Odysseus',
  title: 'The Hero of the Long Voyage',
  className: 'Rider',
  trueName: 'Odysseus',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Odysseus",
  maxHp: 1300,
  atk: 127,
  def: 66,
  agility: 72,
  critChance: 0.13,
  rank: 'A+',
  strengths: ['Burst Damage', 'Tempo Control'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The cunning strategist of Troy, whose schemes end wars that swords cannot.',
  skills: [
    {
      id: 'strategist-of-the-voyage',
      name: 'Strategist of the Voyage',
      description: 'Ten years of scheming compressed into a single plan. Charges his Noble Phantasm gauge by 30%.',
      cooldown: 5,
      npGainSelf: 30,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Odysseus lays out the next stage of his grand design.');
      },
    },
    {
      id: 'trojan-stratagem',
      name: 'Trojan Stratagem',
      description: 'The walls always open from the inside. Lowers enemy Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'trojan-stratagem',
          name: 'Trojan Stratagem',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Odysseus's Trojan Stratagem opens the enemy's guard from within!");
      },
    },
    {
      id: 'veil-of-deceit',
      name: 'Veil of Deceit',
      description: 'Nobody is here. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'veil-of-deceit-evade',
          name: 'Veil of Deceit',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Odysseus slips behind a Veil of Deceit.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Troya Hippos: Great Wooden Horse of Demise',
    japaneseName: 'Troya Hippos',
    description: 'The great engine of Troy\'s fall, crashing through every wall between him and victory.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('The gates open — Troya Hippos thunders forth!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Troya Hippos' });
    },
  },
};

const ivanTheTerrible: ServantDefinition = {
  id: 'ivan-the-terrible',
  name: 'Ivan the Terrible',
  title: 'The Tsar of the Frozen Empire',
  className: 'Rider',
  trueName: 'Ivan IV Vasilyevich',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Ivan_the_Terrible",
  maxHp: 1530,
  atk: 129,
  def: 68,
  agility: 46,
  critChance: 0.08,
  rank: 'A+',
  strengths: ['Highest HP', 'Raw Power', 'Crowd Control'],
  weaknesses: ['Slowest', 'Low Crit Rate'],
  passiveDescription: 'A tsar fused with a colossal beast, dreaming and dreadful, ruler of a frozen land.',
  skills: [
    {
      id: 'absolutism',
      name: 'Absolutism',
      description: 'The tsar\'s word is the only law. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'absolutism',
          name: 'Absolutism',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Ivan the Terrible asserts his Absolutism!');
      },
    },
    {
      id: 'terror-of-the-frozen-tsardom',
      name: 'Terror of the Frozen Tsardom',
      description: 'A glare that freezes courage itself. Stuns the enemy for 1 turn.',
      cooldown: 6,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'frozen-terror-stun',
          name: 'Frozen in Terror',
          kind: 'stun',
          turnsRemaining: 1,
          description: 'Cannot act next turn',
        });
        ctx.log('The Terror of the Frozen Tsardom roots the enemy where they stand!');
      },
    },
    {
      id: 'contradictory-soul',
      name: 'Contradictory Soul',
      description: 'The pious monk and the tyrant share one body, and one endures the other\'s wounds. Heals self for 15% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Ivan's Contradictory Soul knits his wounds for ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Zveri — Krestnyy Khod: Beast of the Crossing',
    japaneseName: 'Zveri Krestnyy Khod',
    description: 'The mammoth-beast of the tsar advances, and everything before it is trampled flat.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Ivan the Terrible advances — Zveri, Krestnyy Khod!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.75, { label: 'Zveri Krestnyy Khod' });
    },
  },
};

export const RIDER_SERVANTS: ServantDefinition[] = [
  iskandar,
  boudica,
  medusa,
  noah,
  ozymandias,
  quetzalcoatl,
  astolfo,
  drake,
  odysseus,
  ivanTheTerrible,
];
