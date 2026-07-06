import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const iskandar: ServantDefinition = {
  id: 'rider',
  name: 'Iskandar',
  title: 'King of Conquerors',
  className: 'Rider',
  trueName: 'Iskandar',
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
    name: 'Army of Bonds',
    japaneseName: 'Ionioi Hetairoi',
    description: 'The king calls forth the full might of his army in one earth-shaking charge.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Iskandar summons the Army of Bonds!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Ionioi Hetairoi' });
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

const bellerophon: ServantDefinition = {
  id: 'bellerophon',
  name: 'Bellerophon',
  title: 'The Tamer of Pegasus',
  className: 'Rider',
  trueName: 'Bellerophon',
  maxHp: 1140,
  atk: 100,
  def: 68,
  agility: 95,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Evasion', 'Tempo Control'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'Astride the winged Pegasus, he strikes from where no blade can follow.',
  skills: [
    {
      id: 'wings-of-pegasus',
      name: 'Wings of Pegasus',
      description: "Rising beyond the enemy's reach. Guarantees the next enemy attack will miss entirely.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'wings-of-pegasus-evade',
          name: 'Wings of Pegasus',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Bellerophon takes to the sky on the Wings of Pegasus!');
      },
    },
    {
      id: 'chimeras-bane',
      name: "Chimera's Bane",
      description: 'A lesson learned slaying monsters. Lowers enemy Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'chimeras-bane',
          name: "Chimera's Bane",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Bellerophon strikes true with Chimera's Bane!");
      },
    },
    {
      id: 'skybound-charge',
      name: 'Skybound Charge',
      description: "A diving charge that disrupts the enemy's rhythm. Drains 15% from the enemy's Noble Phantasm gauge.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        ctx.enemy.npGauge = Math.max(0, ctx.enemy.npGauge - 15);
        ctx.log("Bellerophon's Skybound Charge disrupts the enemy's focus!");
      },
    },
  ],
  noblePhantasm: {
    name: "Pegasus Dive: Chimera's End",
    japaneseName: 'Pegasus Dive',
    description: 'A lance-first dive from the heavens that ended even the Chimera.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log("Bellerophon dives from the sky — Chimera's End!");
      ctx.dealDamage(ctx.self, ctx.enemy, 3.55, { label: 'Pegasus Dive' });
    },
  },
};

const boudica: ServantDefinition = {
  id: 'boudica',
  name: 'Boudica',
  title: 'The Warrior Queen',
  className: 'Rider',
  trueName: 'Boudica',
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
    name: 'Chariot of the Iceni: Vengeance Ride',
    japaneseName: 'Chariot of the Iceni',
    description: "A queen's chariot thunders forward, trampling all who wronged her people.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Boudica rides the Chariot of the Iceni to vengeance!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.35, { label: 'Vengeance Ride' });
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

const marcoPolo: ServantDefinition = {
  id: 'marco-polo',
  name: 'Marco Polo',
  title: 'The Far-Traveled Caravan Master',
  className: 'Rider',
  trueName: 'Marco Polo',
  maxHp: 1090,
  atk: 90,
  def: 65,
  agility: 70,
  critChance: 0.1,
  rank: 'B',
  strengths: ['Regeneration', 'Finishing Blows'],
  weaknesses: ['Low Damage'],
  passiveDescription: 'Having crossed the Silk Road, he commands a caravan that overwhelms with numbers, not strength.',
  skills: [
    {
      id: 'caravans-bounty',
      name: "Caravan's Bounty",
      description: 'Supplies drawn from a well-stocked caravan. Heals self for 17% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.17);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Marco Polo draws on the Caravan's Bounty, healing ${healed} HP.`);
      },
    },
    {
      id: 'merchants-bargain',
      name: "Merchant's Bargain",
      description: "A deal the enemy can't refuse — to their detriment. Lowers enemy Attack by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'merchants-bargain',
          name: "Merchant's Bargain",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% ATK',
        });
        ctx.log("Marco Polo strikes a Merchant's Bargain, dulling the enemy's edge!");
      },
    },
    {
      id: 'silk-road-momentum',
      name: 'Silk Road Momentum',
      description:
        'The caravan closes in when prey is weak. Deals 1.1x damage, boosted by 80% if the enemy is below 30% HP.',
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const executeBonus = ctx.enemyHpFraction < 0.3 ? 1.8 : 1.0;
        ctx.log(
          executeBonus > 1
            ? 'Marco Polo senses weakness and drives the caravan in for the kill!'
            : 'Marco Polo presses forward with Silk Road Momentum!',
        );
        ctx.dealDamage(ctx.self, ctx.enemy, 1.1 * executeBonus, { label: 'Silk Road Momentum' });
      },
    },
  ],
  noblePhantasm: {
    name: 'Il Milione: The Great Caravan Charge',
    japaneseName: 'Il Milione',
    description: "An entire caravan's worth of might, thrown into a single overwhelming charge.",
    rank: 'C+',
    effect: (ctx) => {
      ctx.log('Marco Polo leads Il Milione — the Great Caravan Charge!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.85, { label: 'Il Milione' });
    },
  },
};

const medusa: ServantDefinition = {
  id: 'medusa',
  name: 'Medusa',
  title: 'The Gorgon',
  className: 'Rider',
  trueName: 'Medusa',
  maxHp: 1050,
  atk: 100,
  def: 58,
  agility: 78,
  critChance: 0.2,
  rank: 'B+',
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
          amount: 0.4,
          turnsRemaining: 2,
          description: '+40% crit chance scaling',
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
    name: 'Blood Fort Andromeda',
    japaneseName: 'Blood Fort Andromeda',
    description: 'A crumbling fortress of chains and stone, binding the enemy before the killing blow.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Medusa unleashes Blood Fort Andromeda!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.1, { label: 'Blood Fort Andromeda' });
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
  maxHp: 1450,
  atk: 90,
  def: 80,
  agility: 40,
  critChance: 0.05,
  rank: 'B+',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.3, { label: 'The Great Flood' });
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
  maxHp: 1150,
  atk: 120,
  def: 62,
  agility: 55,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Highest Damage'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The radiant Sun King of Egypt, endlessly arrogant and endlessly certain of his own divinity.',
  skills: [
    {
      id: 'ramesseum-tentyris',
      name: 'Ramesseum Tentyris',
      description: "A pharaoh's authority radiates outward. Raises own Attack by 25% for 2 turns.",
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
          turnsRemaining: 2,
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
    name: 'Ramesseum Tentyris: The Pyramids Descend',
    japaneseName: 'Ramesseum Tentyris',
    description: "Monuments to his own divinity, dropped from the sky upon anyone who doubts him.",
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Ozymandias calls down the Pyramids!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'The Pyramids Descend' });
    },
  },
};

const quetzalcoatl: ServantDefinition = {
  id: 'quetzalcoatl',
  name: 'Quetzalcoatl',
  title: 'The Feathered Serpent',
  className: 'Rider',
  trueName: 'Quetzalcoatl',
  maxHp: 1300,
  atk: 115,
  def: 65,
  agility: 65,
  critChance: 0.15,
  rank: 'A+',
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
    name: 'Xiuhcoatl: The Crash of the Turquoise Serpent',
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
  maxHp: 1150,
  atk: 95,
  def: 55,
  agility: 90,
  critChance: 0.15,
  rank: 'B+',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { label: 'La Black Luna' });
    },
  },
};

export const RIDER_SERVANTS: ServantDefinition[] = [
  iskandar,
  bellerophon,
  boudica,
  marcoPolo,
  medusa,
  noah,
  ozymandias,
  quetzalcoatl,
  astolfo,
];
