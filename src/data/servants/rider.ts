import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const iskandar: ServantDefinition = {
  id: 'rider',
  name: 'Iskandar',
  title: 'King of Conquerors',
  className: 'Rider',
  trueName: 'Iskandar',
  maxHp: 1100,
  atk: 100,
  def: 75,
  agility: 60,
  luck: 60,
  critChance: 0.1,
  passiveDescription: 'A king of unmatched vitality, the toughest Servant on the field.',
  skills: [
    {
      id: 'charisma-king',
      name: "King's Charisma",
      description: "A conqueror's presence. Raises own Attack and Defense by 15% for 3 turns.",
      cooldown: 4,
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
      description: 'Blood of the divine. Reduces incoming damage by 30% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divinity',
          name: 'Divinity',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log('Iskandar calls upon Divinity — damage will be lessened.');
      },
    },
    {
      id: 'uplift-rider',
      name: 'Uplift',
      description: 'Rouses the army. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Iskandar rouses for the charge ahead!');
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { label: 'Ionioi Hetairoi' });
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
  maxHp: 950,
  atk: 100,
  def: 68,
  agility: 95,
  luck: 55,
  critChance: 0.1,
  passiveDescription: 'Astride the winged Pegasus, he strikes from where no blade can follow.',
  skills: [
    {
      id: 'wings-of-pegasus',
      name: 'Wings of Pegasus',
      description: 'Rising beyond the enemy\'s reach. Raises own Attack by 20% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'wings-of-pegasus',
          name: 'Wings of Pegasus',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log('Bellerophon takes to the sky on the Wings of Pegasus!');
      },
    },
    {
      id: 'chimeras-bane',
      name: "Chimera's Bane",
      description: 'A lesson learned slaying monsters. Lowers enemy Defense by 20% for 3 turns.',
      cooldown: 4,
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
        ctx.log('Bellerophon strikes true with Chimera\'s Bane!');
      },
    },
    {
      id: 'skybound-charge',
      name: 'Skybound Charge',
      description: 'A diving charge from above. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Bellerophon circles for a Skybound Charge!');
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.4, { label: 'Pegasus Dive' });
    },
  },
};

const boudica: ServantDefinition = {
  id: 'boudica',
  name: 'Boudica',
  title: 'The Warrior Queen',
  className: 'Rider',
  trueName: 'Boudica',
  maxHp: 1050,
  atk: 98,
  def: 78,
  agility: 58,
  luck: 55,
  critChance: 0.08,
  passiveDescription: "A queen's fury drives her chariot through the ranks of her enemies.",
  skills: [
    {
      id: 'queens-wrath',
      name: "Queen's Wrath",
      description: 'A fury born of injustice. Raises own Attack by 25% for 3 turns.',
      cooldown: 4,
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
      description: 'Her tribe stands with her still. Raises own Defense by 25% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'icenis-shield',
          name: "Iceni's Shield",
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% DEF',
        });
        ctx.log("Boudica raises the Iceni's Shield!");
      },
    },
    {
      id: 'rallying-cry',
      name: 'Rallying Cry',
      description: 'A cry that steels the wounded. Heals self for 15% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Boudica's Rallying Cry steadies her, healing ${healed} HP.`);
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.3, { label: 'Vengeance Ride' });
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
  maxHp: 900,
  atk: 90,
  def: 65,
  agility: 70,
  luck: 65,
  critChance: 0.1,
  passiveDescription: 'Having crossed the Silk Road, he commands a caravan that overwhelms with numbers, not strength.',
  skills: [
    {
      id: 'caravans-bounty',
      name: "Caravan's Bounty",
      description: 'Supplies drawn from a well-stocked caravan. Heals self for 20% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Marco Polo draws on the Caravan's Bounty, healing ${healed} HP.`);
      },
    },
    {
      id: 'merchants-bargain',
      name: "Merchant's Bargain",
      description: "A deal the enemy can't refuse — to their detriment. Lowers enemy Attack by 15% for 3 turns.",
      cooldown: 4,
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
      description: 'Momentum built over a thousand miles of travel. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Marco Polo gathers Silk Road Momentum!');
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { label: 'Il Milione' });
    },
  },
};

export const RIDER_SERVANTS: ServantDefinition[] = [iskandar, bellerophon, boudica, marcoPolo];
