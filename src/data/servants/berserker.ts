import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const heracles: ServantDefinition = {
  id: 'berserker',
  name: 'Berserker',
  title: 'The Twelve Labors',
  className: 'Berserker',
  trueName: 'Heracles',
  maxHp: 1200,
  atk: 130,
  def: 35,
  agility: 50,
  luck: 20,
  critChance: 0.05,
  passiveDescription:
    'Mad Enhancement: sanity is traded for power. Attack rises 8% every turn, permanently.',
  onTurnStart: (ctx) => {
    const existing = ctx.self.statuses.find((s) => s.id === 'mad-enhancement');
    const amount = (existing?.amount ?? 0) + 0.08;
    applyStatus(ctx.self, {
      id: 'mad-enhancement',
      name: 'Mad Enhancement',
      kind: 'buff',
      stat: 'atk',
      amount,
      turnsRemaining: Infinity,
      description: `+${Math.round(amount * 100)}% ATK (permanent)`,
    });
  },
  skills: [
    {
      id: 'god-hand',
      name: 'God Hand',
      description: 'Even fatal wounds can be shrugged off. Heals self for 25% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.25);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Heracles shrugs off death itself with God Hand, healing ${healed} HP.`);
      },
    },
    {
      id: 'reckless-assault',
      name: 'Reckless Assault',
      description: 'Throws caution to the wind. +30% ATK but -20% DEF for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'reckless-assault-atk',
          name: 'Reckless Assault',
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        applyStatus(ctx.self, {
          id: 'reckless-assault-def',
          name: 'Reckless Assault',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 2,
          description: '-20% DEF',
        });
        ctx.log('Heracles attacks with reckless abandon!');
      },
    },
    {
      id: 'monstrous-strength',
      name: 'Monstrous Strength',
      description: 'Overwhelming physical power. Next attack is a guaranteed crit.',
      cooldown: 4,
      npGainSelf: 15,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-strength-crit',
          name: 'Monstrous Strength',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Heracles bristles with Monstrous Strength.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Nine Lives',
    japaneseName: 'Nine Lives',
    description: "A reckless, world-ending smash that spends the wielder's own vitality.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Heracles unleashes Nine Lives in a berserk frenzy!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Nine Lives' });
      const recoil = Math.round(ctx.self.maxHp * 0.1);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`Heracles takes ${recoil} recoil damage from their own fury.`);
    },
  },
};

const lancelot: ServantDefinition = {
  id: 'lancelot',
  name: 'Lancelot',
  title: 'The Knight of the Lake, Mad',
  className: 'Berserker',
  trueName: 'Sir Lancelot',
  maxHp: 1150,
  atk: 122,
  def: 45,
  agility: 65,
  luck: 30,
  critChance: 0.08,
  passiveDescription: 'Grief and madness have stolen his mind, leaving only unstoppable strength.',
  skills: [
    {
      id: 'mad-charge',
      name: 'Mad Charge',
      description: 'A charge with no thought for his own safety. +30% ATK but -15% DEF for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mad-charge-atk',
          name: 'Mad Charge',
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        applyStatus(ctx.self, {
          id: 'mad-charge-def',
          name: 'Mad Charge',
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 2,
          description: '-15% DEF',
        });
        ctx.log('Lancelot surges forward in a Mad Charge!');
      },
    },
    {
      id: 'knights-devotion',
      name: "Knight's Devotion",
      description: 'A fragment of loyalty remains beneath the madness. Heals self for 20% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Lancelot's Knight's Devotion endures, healing ${healed} HP.`);
      },
    },
    {
      id: 'berserk-fury',
      name: 'Berserk Fury',
      description: 'A mindless, overwhelming blow. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'berserk-fury-crit',
          name: 'Berserk Fury',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Lancelot is consumed by Berserk Fury.');
      },
    },
  ],
  noblePhantasm: {
    name: "Arondight: The Betrayer's Blade",
    japaneseName: 'Arondight',
    description: 'The blade of a knight who broke his own oath, swung with mad, grieving force.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log("Lancelot swings Arondight, the Betrayer's Blade!");
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Arondight' });
      const recoil = Math.round(ctx.self.maxHp * 0.08);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`Lancelot takes ${recoil} damage, wracked by his own grief.`);
    },
  },
};

const spartacus: ServantDefinition = {
  id: 'spartacus',
  name: 'Spartacus',
  title: 'The Rebel Gladiator',
  className: 'Berserker',
  trueName: 'Spartacus',
  maxHp: 1100,
  atk: 115,
  def: 50,
  agility: 60,
  luck: 35,
  critChance: 0.1,
  passiveDescription: 'A slave who became legend, his fury fights for every unshackled soul.',
  skills: [
    {
      id: 'rebellions-roar',
      name: "Rebellion's Roar",
      description: 'A roar that rallies the downtrodden. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rebellions-roar',
          name: "Rebellion's Roar",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Spartacus lets out a Rebellion's Roar!");
      },
    },
    {
      id: 'gladiators-endurance',
      name: "Gladiator's Endurance",
      description: 'Forged in the arena, hardened to pain. Heals self for 20% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Spartacus draws on a Gladiator's Endurance, healing ${healed} HP.`);
      },
    },
    {
      id: 'chains-broken',
      name: 'Chains Broken',
      description: 'The chains fall away once more. Gains a surge of Noble Phantasm charge.',
      cooldown: 3,
      npGainSelf: 25,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Spartacus breaks his chains anew!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Roar of the Uprising',
    japaneseName: 'Roar of the Uprising',
    description: 'The full fury of a rebellion given a single, crushing form.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Spartacus unleashes the Roar of the Uprising!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: 'Roar of the Uprising' });
      const recoil = Math.round(ctx.self.maxHp * 0.08);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`Spartacus takes ${recoil} damage from the strain of the blow.`);
    },
  },
};

const frankenstein: ServantDefinition = {
  id: 'frankenstein',
  name: "Frankenstein's Monster",
  title: 'The Wretched Creation',
  className: 'Berserker',
  trueName: 'The Creature',
  maxHp: 1250,
  atk: 125,
  def: 40,
  agility: 40,
  luck: 15,
  critChance: 0.05,
  passiveDescription: 'Stitched from the dead and struck with lightning, its body shrugs off pain no living thing could bear.',
  skills: [
    {
      id: 'lightning-born-vigor',
      name: 'Lightning-Born Vigor',
      description: 'The spark that first gave it life surges anew. Heals self for 25% max HP.',
      cooldown: 5,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.25);
        ctx.self.hp = Math.min(ctx.self.maxHp, ctx.self.hp + healed);
        ctx.log(`Frankenstein's Monster surges with Lightning-Born Vigor, healing ${healed} HP.`);
      },
    },
    {
      id: 'wretched-resolve',
      name: 'Wretched Resolve',
      description: 'A creation that refuses to be destroyed. Raises own Defense by 30% for 2 turns.',
      cooldown: 4,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'wretched-resolve',
          name: 'Wretched Resolve',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log("Frankenstein's Monster steels itself with Wretched Resolve!");
      },
    },
    {
      id: 'monstrous-grip',
      name: 'Monstrous Grip',
      description: 'A crushing, unrelenting hold. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-grip-crit',
          name: 'Monstrous Grip',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Frankenstein's Monster tightens its Monstrous Grip.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Requiem for the Wretched',
    japaneseName: 'Requiem for the Wretched',
    description: "All the creature's sorrow and strength poured into one final, devastating blow.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log("Frankenstein's Monster unleashes the Requiem for the Wretched!");
      ctx.dealDamage(ctx.self, ctx.enemy, 4.2, { label: 'Requiem for the Wretched' });
      const recoil = Math.round(ctx.self.maxHp * 0.12);
      ctx.self.hp = Math.max(0, ctx.self.hp - recoil);
      ctx.log(`Frankenstein's Monster takes ${recoil} damage, its stitched body straining under the force.`);
    },
  },
};

export const BERSERKER_SERVANTS: ServantDefinition[] = [heracles, lancelot, spartacus, frankenstein];
