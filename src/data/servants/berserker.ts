import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const heracles: ServantDefinition = {
  id: 'berserker',
  name: 'Heracles',
  title: 'The Twelve Labors',
  className: 'Berserker',
  trueName: 'Heracles',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Heracles",
  maxHp: 1375,
  atk: 125,
  def: 40,
  agility: 48,
  critChance: 0.08,
  rank: 'A',
  strengths: ['Highest Damage', 'Regeneration'],
  weaknesses: ['Lowest Defense', 'Low Crit Rate', 'Slow'],
  passiveDescription:
    'Mad Enhancement: sanity is traded for raw, monstrous power. The mightiest of the Berserkers.',
  skills: [
    {
      id: 'god-hand',
      name: 'God Hand',
      description: 'Even fatal wounds can be shrugged off. Heals self for 25% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.25);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Heracles shrugs off death itself with God Hand, healing ${healed} HP.`);
      },
    },
    {
      id: 'reckless-assault',
      name: 'Reckless Assault',
      description: 'Throws caution to the wind. +25% ATK but -20% DEF for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'reckless-assault-atk',
          name: 'Reckless Assault',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
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
      description:
        "Overwhelming physical power. Heracles denies the enemy any Noble Phantasm gauge they'd gain this round.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-strength__npDeny',
          name: 'Monstrous Strength',
          kind: 'buff',
          turnsRemaining: 1,
          description: "Denies the enemy's Noble Phantasm gauge gained this round",
        });
        ctx.log('Heracles bristles with Monstrous Strength.');
      },
    },
  ],
  noblePhantasm: {
    name: "Nine Lives",
    japaneseName: 'Nine Lives',
    description: "A reckless, world-ending smash that spends the wielder's own vitality.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Heracles unleashes Nine Lives in a berserk frenzy!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Nine Lives' });
      const recoil = Math.round(ctx.self.maxHp * 0.01875);
      ctx.self.hp = ctx.self.hp - recoil;
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Lancelot",
  maxHp: 1430,
  atk: 116,
  def: 53,
  agility: 73,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Burst Damage', 'Regeneration', 'Finishing Blows'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'Grief and madness have stolen his mind, leaving only unstoppable strength.',
  skills: [
    {
      id: 'mad-charge',
      name: 'Mad Charge',
      description: 'A charge with no thought for his own safety. +25% ATK but -15% DEF for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mad-charge-atk',
          name: 'Mad Charge',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
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
      description:
        'A fragment of loyalty remains beneath the madness. Recovers 7% max HP at the start of each of his next 2 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'knights-devotion-regen',
          name: "Knight's Devotion",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 2,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log("Knight's Devotion endures beneath Lancelot's madness.");
      },
    },
    {
      id: 'berserk-fury',
      name: 'Berserk Fury',
      description: 'A mindless blow aimed at the weak. Deals 1.3x damage, doubled if the enemy is below 30% HP.',
      cooldown: 4,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const executeBonus = ctx.enemyHpFraction < 0.3 ? 2.0 : 1.0;
        ctx.log(
          executeBonus > 1
            ? 'Lancelot senses weakness and unleashes Berserk Fury to finish it!'
            : 'Lancelot is consumed by Berserk Fury.',
        );
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3 * executeBonus, { label: 'Berserk Fury' });
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.67, { label: 'Arondight' });
    },
  },
};

const spartacus: ServantDefinition = {
  id: 'spartacus',
  name: 'Spartacus',
  title: 'The Rebel Gladiator',
  className: 'Berserker',
  trueName: 'Spartacus',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Spartacus",
  maxHp: 1360,
  atk: 109,
  def: 58,
  agility: 68,
  critChance: 0.12,
  rank: 'B+',
  strengths: ['Durability', 'Shielding', 'Sustain via Lifesteal'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A slave who became legend, his fury fights for every unshackled soul.',
  skills: [
    {
      id: 'rebellions-roar',
      name: "Rebellion's Roar",
      description: 'A roar that rallies the downtrodden. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
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
      description:
        'Forged in the arena, hardened to pain. Grants a shield that absorbs damage equal to 20% of his max HP, lasting only this turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'gladiators-endurance-shield',
          name: "Gladiator's Endurance",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Spartacus braces with a Gladiator's Endurance!");
      },
    },
    {
      id: 'chains-broken',
      name: 'Chains Broken',
      description: 'Breaks free and strikes back all the harder. Heals for 25% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Chains Broken' });
        const healed = Math.round(dmg * 0.25);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Spartacus breaks his chains, recovering ${healed} HP!`);
      },
    },
  ],
  noblePhantasm: {
    name: "Roar of the Uprising",
    japaneseName: 'Roar of the Uprising',
    description: 'The full fury of a rebellion given a single, crushing form.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Spartacus unleashes the Roar of the Uprising!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Roar of the Uprising' });
      const recoil = Math.round(ctx.self.maxHp * 0.04);
      ctx.self.hp = ctx.self.hp - recoil;
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Frankenstein",
  maxHp: 1480,
  atk: 115,
  def: 47,
  agility: 53,
  critChance: 0.07,
  rank: 'C+',
  strengths: ['Highest HP', 'Regeneration'],
  weaknesses: ['Slowest'],
  passiveDescription:
    'Stitched from the dead and struck with lightning, its body shrugs off pain no living thing could bear.',
  skills: [
    {
      id: 'lightning-born-vigor',
      name: 'Lightning-Born Vigor',
      description:
        'The spark that first gave it life surges anew. Recovers 6% max HP at the start of each of its next 2 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'lightning-born-vigor-regen',
          name: 'Lightning-Born Vigor',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.06),
          turnsRemaining: 2,
          description: 'Recovers 6% max HP per turn',
        });
        ctx.log("Frankenstein's Monster surges with Lightning-Born Vigor.");
      },
    },
    {
      id: 'wretched-resolve',
      name: 'Wretched Resolve',
      description: 'A creation that refuses to be destroyed. Raises own Defense by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'wretched-resolve',
          name: 'Wretched Resolve',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% DEF',
        });
        ctx.log("Frankenstein's Monster steels itself with Wretched Resolve!");
      },
    },
    {
      id: 'monstrous-grip',
      name: 'Monstrous Grip',
      description: 'A crushing, unrelenting hold. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-grip__critReady',
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
    name: "Requiem for the Wretched",
    japaneseName: 'Requiem for the Wretched',
    description: "All the creature's sorrow and strength poured into one final, devastating blow.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log("Frankenstein's Monster unleashes the Requiem for the Wretched!");
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Requiem for the Wretched' });
      const recoil = Math.round(ctx.self.maxHp * 0.1);
      ctx.self.hp = ctx.self.hp - recoil;
      ctx.log(`Frankenstein's Monster takes ${recoil} damage, its stitched body straining under the force.`);
    },
  },
};

const morganLeFay: ServantDefinition = {
  id: 'morgan-le-fay',
  name: 'Morgan le Fay',
  title: 'The Winter Queen',
  className: 'Berserker',
  trueName: 'Morgan le Fay',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Morgan",
  maxHp: 1500,
  atk: 122,
  def: 60,
  agility: 55,
  critChance: 0.08,
  rank: 'A+',
  strengths: ['Highest HP', 'Debuffs'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The tragic Winter Queen, ruler of a Lostbelt frozen in endless twilight.',
  skills: [
    {
      id: 'le-fays-curse',
      name: "Le Fay's Curse",
      description: "A sorceress's curse saps the enemy's strength. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'le-fays-curse',
          name: "Le Fay's Curse",
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log("Morgan le Fay casts Le Fay's Curse upon the enemy!");
      },
    },
    {
      id: 'winters-reign',
      name: "Winter's Reign",
      description: "An endless winter sustains its queen. Recovers 7% max HP at the start of each of her next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'winters-reign-regen',
          name: "Winter's Reign",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log("Morgan le Fay calls upon Winter's Reign.");
      },
    },
    {
      id: 'fairy-queens-wrath',
      name: "Fairy Queen's Wrath",
      description: 'A queen who tolerates no defiance. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fairy-queens-wrath__critReady',
          name: "Fairy Queen's Wrath",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Morgan le Fay's Fairy Queen's Wrath rises.");
      },
    },
  ],
  noblePhantasm: {
    name: "Le Morte d'Arthur: Winter's Judgment",
    japaneseName: "Le Morte d'Arthur",
    description: "A frozen judgment, passed down by the Winter Queen upon all who defy her.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log("Morgan le Fay passes Winter's Judgment!");
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: "Winter's Judgment" });
      applyStatus(ctx.enemy, {
        id: 'winters-judgment-dot',
        name: 'Frostbite',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 2,
        description: 'Afflicted by frostbite',
      });
    },
  },
};

const arjunaAlter: ServantDefinition = {
  id: 'arjuna-alter',
  name: 'Arjuna Alter',
  title: 'The Malignant Vigilante',
  className: 'Berserker',
  trueName: 'Arjuna',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Arjuna_(Alter)",
  maxHp: 1400,
  atk: 130,
  def: 62,
  agility: 58,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Highest Damage'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A hero who absorbed an entire pantheon of gods, now sitting in terrible judgment over creation.',
  skills: [
    {
      id: 'diamond-rain',
      name: 'Diamond Rain',
      description: "A rain of divine splinters shatters the enemy's guard. Lowers enemy Defense by 22% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'diamond-rain',
          name: 'Diamond Rain',
          kind: 'debuff',
          stat: 'def',
          amount: -0.22,
          turnsRemaining: 3,
          description: '-22% DEF',
        });
        ctx.log('Arjuna Alter calls down a Diamond Rain!');
      },
    },
    {
      id: 'fated-wheel',
      name: 'Fated Wheel',
      description: "A pantheon's borrowed might turns in his favor. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fated-wheel',
          name: 'Fated Wheel',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Arjuna Alter turns the Fated Wheel!');
      },
    },
    {
      id: 'vayus-judgment',
      name: "Vayu's Judgment",
      description: "The wind god's speed lends him an opening. Next attack is a guaranteed critical hit.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'vayus-judgment__critReady',
          name: "Vayu's Judgment",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Arjuna Alter channels Vayu's Judgment.");
      },
    },
  ],
  noblePhantasm: {
    name: "Pashupata: Anger of the Terrible One",
    japaneseName: 'Pashupata',
    description: "A weapon of world-ending judgment, wielded without a shred of hesitation.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Arjuna Alter unleashes Pashupata: Anger of the Terrible One!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Pashupata' });
    },
  },
};

const ibukiDouji: ServantDefinition = {
  id: 'ibuki-douji',
  name: 'Ibuki-Douji',
  title: 'The Great Fiend of Ooe Mountain',
  className: 'Berserker',
  trueName: 'Ibuki-Douji',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Ibuki_Dōji_(Berserker)",
  maxHp: 1550,
  atk: 128,
  def: 58,
  agility: 50,
  critChance: 0.08,
  rank: 'A+',
  strengths: ['Highest HP', 'Highest Damage'],
  weaknesses: ['Slow'],
  passiveDescription: 'A divine avatar of the Yamata no Orochi, a titanic entity of raw, ancient Japanese power.',
  skills: [
    {
      id: 'orochis-breath',
      name: "Orochi's Breath",
      description: "A fiend's poisonous breath weakens all it touches. Afflicts the enemy with poison.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'orochis-breath',
          name: "Orochi's Breath",
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Poisoned',
        });
        ctx.log("Ibuki-Douji exhales Orochi's Breath!");
      },
    },
    {
      id: 'eight-heads-fury',
      name: "Eight Heads' Fury",
      description: 'An eight-headed serpent lends its rage. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'eight-heads-fury',
          name: "Eight Heads' Fury",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Ibuki-Douji channels the Eight Heads' Fury!");
      },
    },
    {
      id: 'mountain-fiends-hide',
      name: "Mountain Fiend's Hide",
      description: 'A hide that has weathered a thousand years. Raises own Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mountain-fiends-hide',
          name: "Mountain Fiend's Hide",
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% DEF',
        });
        ctx.log("Ibuki-Douji's Mountain Fiend's Hide hardens!");
      },
    },
  ],
  noblePhantasm: {
    name: "Yamata no Orochi: The Eight-Forked Ruin",
    japaneseName: 'Yamata no Orochi',
    description: 'A titanic serpent of ancient Japan, unleashed in eight simultaneous strikes.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Ibuki-Douji summons Yamata no Orochi!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'The Eight-Forked Ruin' });
      const recoil = Math.round(ctx.self.maxHp * 0.05);
      ctx.self.hp = ctx.self.hp - recoil;
      ctx.log(`Ibuki-Douji takes ${recoil} damage from the strain of the serpent's fury.`);
    },
  },
};

const cuChulainnAlter: ServantDefinition = {
  id: 'cu-chulainn-alter',
  name: 'Cú Chulainn (Alter)',
  title: 'The Hound of Culann, Berserk',
  className: 'Berserker',
  trueName: 'Cú Chulainn',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Cú_Chulainn_(Alter)",
  maxHp: 1350,
  atk: 132,
  def: 55,
  agility: 62,
  critChance: 0.12,
  rank: 'A+',
  strengths: ['Highest Damage', 'Sustain via Lifesteal'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A mutated, spiked nightmare of the Hound of Culann, fighting with pure, unrestrained brutality.',
  skills: [
    {
      id: 'warp-spasm',
      name: 'Warp Spasm',
      description: "A berserk transformation that twists flesh and mind alike. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'warp-spasm',
          name: 'Warp Spasm',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Cú Chulainn (Alter) is consumed by the Warp Spasm!');
      },
    },
    {
      id: 'spiked-thorn',
      name: 'Spiked Thorn',
      description: 'A crude, brutal strike that drains the wound it deals. Heals for 20% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Spiked Thorn' });
        const healed = Math.round(dmg * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Cú Chulainn (Alter) recovers ${healed} HP from the Spiked Thorn.`);
      },
    },
    {
      id: 'houndss-hunger',
      name: "Hound's Hunger",
      description: "A hunger that never abates. Lowers enemy Defense by 15% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'hounds-hunger',
          name: "Hound's Hunger",
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 3,
          description: '-15% DEF',
        });
        ctx.log("Cú Chulainn (Alter)'s Hound's Hunger gnaws at the enemy's guard!");
      },
    },
  ],
  noblePhantasm: {
    name: "Curruid Coinchenn: The Twisted Spear",
    japaneseName: 'Curruid Coinchenn',
    description: 'A cursed spear thrown with all the brutality of a broken mind.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Cú Chulainn (Alter) hurls the Curruid Coinchenn!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Curruid Coinchenn' });
    },
  },
};

const hijikata: ServantDefinition = {
  id: 'hijikata',
  name: 'Hijikata Toshizo',
  title: 'The Demon Vice-Commander',
  className: 'Berserker',
  trueName: 'Hijikata Toshizo',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Hijikata_Toshizō",
  maxHp: 1250,
  atk: 118,
  def: 60,
  agility: 62,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Sustain via Lifesteal', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The Shinsengumi Vice-Commander who refuses to die, growing more dangerous the closer death comes.',
  skills: [
    {
      id: 'demons-resolve',
      name: "Demon's Resolve",
      description: 'A refusal to fall that only strengthens with every wound. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'demons-resolve',
          name: "Demon's Resolve",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Hijikata Toshizo's Demon's Resolve hardens!");
      },
    },
    {
      id: 'shinsengumi-blade',
      name: 'Shinsengumi Blade',
      description: 'A commander leading from the front line. Deals 1.3x damage, and heals for 20% of the damage dealt.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Shinsengumi Blade' });
        const healed = Math.round(dmg * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Hijikata Toshizo recovers ${healed} HP from the exchange.`);
      },
    },
    {
      id: 'unyielding-vice-commander',
      name: 'Unyielding Vice-Commander',
      description: "A vow to lead the Shinsengumi to the very end. Recovers 8% max HP at the start of each of his next 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'unyielding-vice-commander-regen',
          name: 'Unyielding Vice-Commander',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 2,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log('Hijikata Toshizo refuses to fall.');
      },
    },
  ],
  noblePhantasm: {
    name: "Shinsengumi: Til the Last Man Falls",
    japaneseName: 'Shinsengumi',
    description: "A final charge, leading his men even as a demon in a man's uniform.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log("Hijikata Toshizo charges: Til the Last Man Falls!");
      const dmg = ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: 'Til the Last Man Falls' });
      const healed = Math.round(dmg * 0.15);
      ctx.self.hp = ctx.self.hp + healed;
      ctx.log(`Hijikata Toshizo recovers ${healed} HP, refusing to fall.`);
    },
  },
};

const barghest: ServantDefinition = {
  id: 'barghest',
  name: 'Barghest',
  title: 'The Fairy Knight Gawain',
  className: 'Berserker',
  trueName: 'Gawain',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Barghest",
  maxHp: 1500,
  atk: 120,
  def: 65,
  agility: 50,
  critChance: 0.08,
  rank: 'A+',
  strengths: ['Highest HP', 'Durability'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A towering, honorable Fairy Knight bearing the name of Gawain, loyal unto the last swing of her blade.',
  skills: [
    {
      id: 'fairy-knights-oath',
      name: "Fairy Knight's Oath",
      description: "An oath of loyalty that never wavers. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'fairy-knights-oath',
          name: "Fairy Knight's Oath",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Barghest's Fairy Knight's Oath burns bright!");
      },
    },
    {
      id: 'giants-greatsword',
      name: "Giant's Greatsword",
      description: 'A blade too heavy for any but her to wield. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: "Giant's Greatsword" });
        ctx.log("Barghest swings the Giant's Greatsword!");
      },
    },
    {
      id: 'unbreakable-loyalty',
      name: 'Unbreakable Loyalty',
      description: "A loyalty that outlasts any wound. Raises own Defense by 25% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'unbreakable-loyalty',
          name: 'Unbreakable Loyalty',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% DEF',
        });
        ctx.log("Barghest's Unbreakable Loyalty holds firm!");
      },
    },
  ],
  noblePhantasm: {
    name: "Excalibur Galatine: The Fang of Loyalty",
    japaneseName: 'Excalibur Galatine',
    description: 'A borrowed name and a borrowed blade, wielded with a fidelity all her own.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Barghest unleashes the Fang of Loyalty!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'The Fang of Loyalty' });
    },
  },
};

const vladIII: ServantDefinition = {
  id: 'vlad-iii',
  name: 'Vlad III',
  title: 'The Lord Impaler',
  className: 'Berserker',
  trueName: 'Vlad III',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Vlad_III",
  maxHp: 1500,
  atk: 125,
  def: 68,
  agility: 50,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Sustain', 'Debuffs'],
  weaknesses: ['Slow'],
  passiveDescription: "A tragic hero-king whose devotion to his people curdled into a legend of horror.",
  skills: [
    {
      id: 'compassion',
      name: 'Compassion',
      description: 'A terror sown to spare his people worse cruelty. Lowers enemy Attack by 22% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'compassion',
          name: 'Compassion',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.22,
          turnsRemaining: 2,
          description: '-22% Attack',
        });
        ctx.log('Vlad III instills dread through Compassion!');
      },
    },
    {
      id: 'domination',
      name: 'Domination',
      description: 'An iron rule over his own body and land alike. Raises own Defense by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'domination',
          name: 'Domination',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Defense',
        });
        ctx.log('Vlad III asserts Domination over the battlefield!');
      },
    },
    {
      id: 'corpse-forest',
      name: 'Corpse Forest',
      description: 'A forest of iron stakes rises from the earth. Afflicts the enemy with a damage-over-time effect.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'corpse-forest',
          name: 'Corpse Forest',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Afflicted by the Corpse Forest',
        });
        ctx.log('Vlad III raises the Corpse Forest around the enemy!');
      },
    },
  ],
  noblePhantasm: {
    name: "Kazikli Bey: Lord of Impalement",
    japaneseName: 'Kazikli Bey',
    description: 'A field of iron stakes driven home all at once, in the name of a broken vow.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Vlad III invokes Kazikli Bey!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.95, { label: 'Kazikli Bey' });
    },
  },
};

const sakataKintoki: ServantDefinition = {
  id: 'sakata-kintoki',
  name: 'Sakata Kintoki',
  title: 'The Golden Boy',
  className: 'Berserker',
  trueName: 'Sakata Kintoki',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Sakata_Kintoki",
  maxHp: 1300,
  atk: 140,
  def: 38,
  agility: 55,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Highest Damage', 'NP Gauge Charge'],
  weaknesses: ['Lowest Defense'],
  passiveDescription: 'Raised by a mountain witch and strong enough to wrestle bears as a child, he never learned to hold back.',
  skills: [
    {
      id: 'monstrous-strength-kintoki',
      name: 'Monstrous Strength',
      description: 'A child who threw boulders for sport, grown into a man who throws mountains. Raises own Attack by 25% for 3 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'monstrous-strength-kintoki',
          name: 'Monstrous Strength',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Attack',
        });
        ctx.log('Sakata Kintoki flexes with Monstrous Strength!');
      },
    },
    {
      id: 'animal-communication',
      name: 'Animal Communication',
      description: 'Old friends from the mountain still answer his call. Floods his Noble Phantasm gauge.',
      cooldown: 5,
      npGainSelf: 40,
      tag: 'utility',
      effect: (ctx) => {
        ctx.log('Sakata Kintoki calls on Animal Communication!');
      },
    },
    {
      id: 'natural-body',
      name: 'Natural Body',
      description: "A child of the mountains, hale and hearty. Heals self for 20% max HP.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Sakata Kintoki's Natural Body recovers ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Golden Spark',
    japaneseName: 'Kongou Rikishi Retsuzan',
    description: "A flash of golden lightning loosed from the axe Golden Eater, splitting the mountain in one blow.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Sakata Kintoki unleashes Golden Spark!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.3, { label: 'Golden Spark' });
    },
  },
};

const dariusIII: ServantDefinition = {
  id: 'darius-iii',
  name: 'Darius III',
  title: 'The Great King of Persia',
  className: 'Berserker',
  trueName: 'Darius III',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Darius_III",
  maxHp: 1460,
  atk: 131,
  def: 52,
  agility: 58,
  critChance: 0.09,
  rank: 'A',
  strengths: ['Raw Power', 'High HP', 'Regeneration'],
  weaknesses: ['Low Defense', 'Low Crit Rate'],
  passiveDescription: 'The rival of the King of Conquerors, risen again with his deathless army at his back.',
  skills: [
    {
      id: 'immortal-ten-thousand',
      name: 'The Immortal Ten Thousand',
      description: 'His deathless soldiers lend him their strength. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'immortal-ten-thousand',
          name: 'The Immortal Ten Thousand',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('The Immortal Ten Thousand rally behind Darius III!');
      },
    },
    {
      id: 'battle-continuation-darius',
      name: 'Battle Continuation',
      description: 'A king who met the Conqueror three times and never yielded. Recovers 5% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'battle-continuation-darius-regen',
          name: 'Battle Continuation',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Recovers 5% max HP per turn',
        });
        ctx.log('Darius III refuses to fall — his wounds begin to close.');
      },
    },
    {
      id: 'great-kings-bulk',
      name: "The Great King's Bulk",
      description: 'A colossal frame that shrugs off lesser blows. Raises own Defense by 20% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'great-kings-bulk',
          name: "The Great King's Bulk",
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% DEF',
        });
        ctx.log("Darius III braces his colossal frame.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Athanaton Ten Thousand: Army of the Immortal',
    japaneseName: 'Athanaton Ten Thousand',
    description: 'The deathless army of Persia surges forward as one crushing wave.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Darius III raises his hand — Athanaton Ten Thousand!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: 'Athanaton Ten Thousand' });
    },
  },
};

const samson: ServantDefinition = {
  id: 'samson',
  name: 'Samson',
  title: 'The Nazirite of the Unshorn Hair',
  className: 'Berserker',
  trueName: 'Samson',
  fateWikiUrl: "https://typemoon.fandom.com/wiki/Samson",
  maxHp: 1430,
  atk: 134,
  def: 50,
  agility: 56,
  critChance: 0.09,
  rank: 'A+',
  strengths: ['Raw Power', 'High HP'],
  weaknesses: ['Lowest Defense', 'Low Crit Rate'],
  passiveDescription: 'A judge of impossible strength, unbeatable while his sacred vow remains unbroken.',
  skills: [
    {
      id: 'nazirite-vow',
      name: 'Nazirite Vow',
      description: 'The unshorn vow burns bright in his blood. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'nazirite-vow',
          name: 'Nazirite Vow',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Samson\'s Nazirite Vow blazes with strength!');
      },
    },
    {
      id: 'jawbone-strike',
      name: 'Jawbone Strike',
      description: 'The improvised weapon of a thousand-strong rout. Deals 1.4x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.4, { label: 'Jawbone Strike' });
        ctx.log('Samson swings the jawbone in a wide, bone-cracking arc!');
      },
    },
    {
      id: 'strength-returned',
      name: 'Strength Returned',
      description: 'What was taken from him always comes back. Heals self for 15% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Samson's strength returns to him, restoring ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Pillars of the Temple: Strength That Brings the House Down',
    japaneseName: 'Pillars of the Temple',
    description: 'He seizes the pillars of the world itself and pulls them down upon his enemy.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Samson seizes the pillars — and brings the house down!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Pillars of the Temple' });
      const recoil = Math.round(ctx.self.maxHp * 0.04);
      ctx.self.hp = ctx.self.hp - recoil;
      ctx.log(`Samson takes ${recoil} damage in the collapse.`);
    },
  },
};

export const BERSERKER_SERVANTS: ServantDefinition[] = [
  heracles,
  lancelot,
  spartacus,
  frankenstein,
  morganLeFay,
  arjunaAlter,
  ibukiDouji,
  cuChulainnAlter,
  hijikata,
  barghest,
  vladIII,
  sakataKintoki,
  dariusIII,
  samson,
];
