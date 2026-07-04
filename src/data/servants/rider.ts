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
  luck: 60,
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
      description: 'Blood of the divine wards his body. Grants a shield that absorbs damage equal to 22% of his max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'divinity-shield',
          name: 'Divinity',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.22),
          turnsRemaining: 2,
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
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
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
  maxHp: 1140,
  atk: 100,
  def: 68,
  agility: 95,
  luck: 55,
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
  maxHp: 1280,
  atk: 98,
  def: 78,
  agility: 58,
  luck: 55,
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
      description: 'Her tribe stands with her still. Grants a shield that absorbs damage equal to 20% of her max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'icenis-shield',
          name: "Iceni's Shield",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 2,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.2, { label: 'Vengeance Ride' });
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
  luck: 65,
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
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
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
        const executeBonus = ctx.enemy.hp / ctx.enemy.maxHp < 0.3 ? 1.8 : 1.0;
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
      ctx.dealDamage(ctx.self, ctx.enemy, 2.7, { label: 'Il Milione' });
    },
  },
};

export const RIDER_SERVANTS: ServantDefinition[] = [iskandar, bellerophon, boudica, marcoPolo];
