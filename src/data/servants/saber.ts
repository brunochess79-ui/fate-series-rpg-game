import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const arthur: ServantDefinition = {
  id: 'saber',
  name: 'Artoria Pendragon',
  title: 'The King of Knights',
  className: 'Saber',
  trueName: 'Artoria Pendragon',
  maxHp: 1140,
  atk: 105,
  def: 81,
  agility: 70,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Balanced Stats', 'Durability'],
  weaknesses: ['No Specialty'],
  passiveDescription: 'A king born to lead: steady stats with no glaring weakness.',
  skills: [
    {
      id: 'charisma',
      name: 'Charisma',
      description: 'The bearing of a king. Raises own Attack by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'charisma',
          name: 'Charisma',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% ATK',
        });
        ctx.log('Artoria radiates Charisma — ATK rises!');
      },
    },
    {
      id: 'mana-burst',
      name: 'Mana Burst',
      description: 'Converts magical energy into raw power for the next attack.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mana-burst',
          name: 'Mana Burst',
          kind: 'buff',
          stat: 'atk',
          amount: 0.4,
          turnsRemaining: 1,
          description: '+40% ATK (1 turn)',
        });
        ctx.log('Artoria channels Mana Burst!');
      },
    },
    {
      id: 'instinct',
      name: 'Instinct',
      description: 'A sixth sense for danger. Guarantees the next enemy attack will miss entirely.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'instinct-evade',
          name: 'Instinct',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Next incoming attack is evaded',
        });
        ctx.log('Artoria heightens Instinct, reading the enemy before they move!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Sword of Promised Victory',
    japaneseName: 'Excalibur',
    description: 'A blade of light that cuts down all before it.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Artoria unsheathes the Sword of Promised Victory!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.15, { label: 'Excalibur' });
    },
  },
};

const siegfried: ServantDefinition = {
  id: 'siegfried',
  name: 'Siegfried',
  title: 'The Dragon-Blooded Knight',
  className: 'Saber',
  trueName: 'Siegfried',
  maxHp: 1210,
  atk: 110,
  def: 76,
  agility: 65,
  critChance: 0.1,
  rank: 'A',
  strengths: ['Durability', 'Sustained Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: "Bathed in a dragon's blood, his skin turns aside nearly any blow — save one hidden weak point.",
  skills: [
    {
      id: 'dragon-skin',
      name: 'Dragon Skin',
      description: "The dragon's blood wards his body. Raises own Defense by 30% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'dragon-skin',
          name: 'Dragon Skin',
          kind: 'buff',
          stat: 'def',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% DEF',
        });
        ctx.log("Siegfried's Dragon Skin hardens against harm!");
      },
    },
    {
      id: 'balmungs-edge',
      name: "Balmung's Edge",
      description: 'A whetted blade strikes true. Raises own Attack by 25% for 1 turn.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'balmungs-edge',
          name: "Balmung's Edge",
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 1,
          description: '+25% ATK (1 turn)',
        });
        ctx.log('Siegfried readies Balmung for a decisive strike!');
      },
    },
    {
      id: 'nothungs-whisper',
      name: "Nothung's Whisper",
      description: "An old sword-song steadies his wounds. Recovers 4% max HP at the start of each of his next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'nothungs-whisper-regen',
          name: "Nothung's Whisper",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.04),
          turnsRemaining: 3,
          description: 'Recovers 4% max HP per turn',
        });
        ctx.log("Siegfried hears Nothung's Whisper — his wounds begin to close.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Twilight of the Dragonslayer',
    japaneseName: 'Balmung',
    description: 'The invulnerable dragonslayer bears down with an unstoppable blow.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Siegfried unleashes the Twilight of the Dragonslayer!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.2, { label: 'Balmung' });
    },
  },
};

const musashi: ServantDefinition = {
  id: 'musashi',
  name: 'Musashi',
  title: 'The Sword Saint',
  className: 'Saber',
  trueName: 'Miyamoto Musashi',
  maxHp: 1070,
  atk: 113,
  def: 61,
  agility: 90,
  critChance: 0.18,
  rank: 'A',
  strengths: ['Speed', 'Critical Hits'],
  weaknesses: ['Fragile'],
  passiveDescription: 'Master of the two-sword style, striking with blinding speed.',
  skills: [
    {
      id: 'niten-ichi-ryu',
      name: 'Niten Ichi-ryu',
      description: 'The two-sword style in full flow. Raises own Attack by 20% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'niten-ichi-ryu',
          name: 'Niten Ichi-ryu',
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 2,
          description: '+20% ATK',
        });
        ctx.log('Musashi flows into the Niten Ichi-ryu stance!');
      },
    },
    {
      id: 'void-perception',
      name: 'Void Perception',
      description: 'Sees through every opening. Raises own crit rate for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'void-perception',
          name: 'Void Perception',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.4,
          turnsRemaining: 2,
          description: '+40% crit chance scaling',
        });
        ctx.log('Musashi perceives the Void — every opening is clear.');
      },
    },
    {
      id: 'ichi-no-tachi',
      name: 'Ichi no Tachi',
      description: 'The first cut decides all. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'ichi-no-tachi__critReady',
          name: 'Ichi no Tachi',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Musashi commits to the first, decisive cut.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Nine Heavens, One Blade',
    japaneseName: 'Nichirin no Ittou',
    description: 'A blinding flurry of cuts from both swords at once.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Musashi unleashes Nine Heavens, One Blade!');
      ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Nine Heavens I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Nine Heavens II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Nine Heavens III' });
    },
  },
};

const elCid: ServantDefinition = {
  id: 'el-cid',
  name: 'El Cid',
  title: 'The Undefeated Champion',
  className: 'Saber',
  trueName: 'Rodrigo Díaz de Vivar',
  maxHp: 1190,
  atk: 103,
  def: 84,
  agility: 55,
  critChance: 0.08,
  rank: 'A',
  strengths: ['Durability', 'Shielding'],
  weaknesses: ['Slow', 'Low Crit Rate'],
  passiveDescription: 'Even in death, his legend rides on — a champion who never loses.',
  skills: [
    {
      id: 'banner-of-valencia',
      name: 'Banner of Valencia',
      description: 'A banner that rallies the faithful. Raises own Attack and Defense by 10% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'banner-of-valencia-atk',
          name: 'Banner of Valencia',
          kind: 'buff',
          stat: 'atk',
          amount: 0.1,
          turnsRemaining: 3,
          description: '+10% ATK',
        });
        applyStatus(ctx.self, {
          id: 'banner-of-valencia-def',
          name: 'Banner of Valencia',
          kind: 'buff',
          stat: 'def',
          amount: 0.1,
          turnsRemaining: 3,
          description: '+10% DEF',
        });
        ctx.log('El Cid raises the Banner of Valencia!');
      },
    },
    {
      id: 'tizonas-oath',
      name: "Tizona's Oath",
      description:
        "An oath sworn on his blade. Grants a shield that absorbs damage equal to 20% of his max HP, lasting this turn and the next.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'tizonas-oath-shield',
          name: "Tizona's Oath",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("El Cid swears Tizona's Oath — a ward surrounds him.");
      },
    },
    {
      id: 'undying-resolve',
      name: 'Undying Resolve',
      description: 'He rides on even in death. Raises own Defense by 40% for 1 turn.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'undying-resolve',
          name: 'Undying Resolve',
          kind: 'buff',
          stat: 'def',
          amount: 0.4,
          turnsRemaining: 1,
          description: '+40% DEF (1 turn)',
        });
        ctx.log('El Cid steels himself with Undying Resolve!');
      },
    },
  ],
  noblePhantasm: {
    name: 'The Last Ride of the Campeador',
    japaneseName: 'Tizona',
    description: "Legend says his corpse rode to one final victory — the champion charges on regardless.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('El Cid rides out for one last, undying charge!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.05, { label: 'Tizona' });
      applyStatus(ctx.self, {
        id: 'campeadors-legend',
        name: "Campeador's Legend",
        kind: 'buff',
        stat: 'atk',
        amount: 0.15,
        turnsRemaining: 2,
        description: '+15% ATK',
      });
    },
  },
};

const altera: ServantDefinition = {
  id: 'altera',
  name: 'Altera',
  title: 'The Scourge of God',
  className: 'Saber',
  trueName: 'Attila the Hun',
  maxHp: 1200,
  atk: 130,
  def: 60,
  agility: 65,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Highest Damage'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'An alien weapon of planetary destruction, wrapped in the historical myth of Attila the Hun.',
  skills: [
    {
      id: 'sword-of-shalltear',
      name: 'Sword of Shalltear',
      description: "A blade that answers to no nation. Raises own Attack by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sword-of-shalltear',
          name: 'Sword of Shalltear',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Altera draws the Sword of Shalltear!');
      },
    },
    {
      id: 'gods-scourge',
      name: "God's Scourge",
      description: "A weapon that scours nations from the map. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'gods-scourge',
          name: "God's Scourge",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Altera's presence alone scourges the enemy's defenses!");
      },
    },
    {
      id: 'silent-conquest',
      name: 'Silent Conquest',
      description: 'A conqueror who needs no words. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'silent-conquest__critReady',
          name: 'Silent Conquest',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Altera advances in Silent Conquest.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Utter Extinction',
    japaneseName: 'Origin of a Dark Star',
    description: 'A weapon built to erase a planet, unleashed as a single terrible strike.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Altera invokes Utter Extinction!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'Utter Extinction' });
    },
  },
};

const sengoMuramasa: ServantDefinition = {
  id: 'sengo-muramasa',
  name: 'Sengo Muramasa',
  title: 'The Cursed Blacksmith',
  className: 'Saber',
  trueName: 'Sengo Muramasa',
  maxHp: 1000,
  atk: 118,
  def: 55,
  agility: 70,
  critChance: 0.18,
  rank: 'A',
  strengths: ['Critical Hits', 'Speed'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: 'A legendary blacksmith who borrows a body to forge a blade capable of cutting causality itself.',
  skills: [
    {
      id: 'forge-of-madness',
      name: 'Forge of Madness',
      description: 'A cursed forge sharpens every strike. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'forge-of-madness',
          name: 'Forge of Madness',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.4,
          turnsRemaining: 2,
          description: '+40% crit chance scaling',
        });
        ctx.log('Sengo Muramasa stokes the Forge of Madness!');
      },
    },
    {
      id: 'blade-of-severance',
      name: 'Blade of Severance',
      description: 'A cursed edge that cuts through fate. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Blade of Severance' });
        ctx.log('Sengo Muramasa cuts with the Blade of Severance!');
      },
    },
    {
      id: 'cursed-edge',
      name: 'Cursed Edge',
      description: 'A blade thirsting for blood. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'cursed-edge__critReady',
          name: 'Cursed Edge',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Sengo Muramasa readies the Cursed Edge.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Kyokuto no Kenja: Causality Severed',
    japaneseName: 'Muramasa',
    description: 'A blade forged to cut through causality itself, ending the fight before it can happen.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Sengo Muramasa severs causality itself!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { guaranteedCrit: true, label: 'Causality Severed' });
    },
  },
};

const mordred: ServantDefinition = {
  id: 'mordred',
  name: 'Mordred',
  title: 'The Knight of Treachery',
  className: 'Saber',
  trueName: 'Mordred',
  maxHp: 1150,
  atk: 124,
  def: 58,
  agility: 68,
  critChance: 0.16,
  rank: 'A+',
  strengths: ['Critical Hits', 'Speed'],
  weaknesses: ['Low Defense'],
  passiveDescription: "Artoria's rebellious knight, fighting with savage, wild strikes that carry a lifetime of resentment.",
  skills: [
    {
      id: 'knight-of-owner',
      name: 'Knight of Owner',
      description: 'A stolen crown demands to be worn. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'knight-of-owner',
          name: 'Knight of Owner',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Mordred claims the Knight of Owner!');
      },
    },
    {
      id: 'secret-of-pedigree',
      name: 'Secret of Pedigree',
      description: 'A bloodline she refuses to be denied. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'secret-of-pedigree',
          name: 'Secret of Pedigree',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% crit chance scaling',
        });
        ctx.log("Mordred's Secret of Pedigree drives her forward!");
      },
    },
    {
      id: 'rebellious-strike',
      name: 'Rebellious Strike',
      description: 'A wild, savage swing born of resentment. Deals 1.3x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Rebellious Strike' });
        ctx.log('Mordred lashes out with a Rebellious Strike!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Clarent Blood Arthur',
    japaneseName: 'Clarent Blood Arthur',
    description: "A borrowed blade unleashed with all of a rebel knight's fury.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Mordred unleashes Clarent Blood Arthur!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'Clarent Blood Arthur' });
    },
  },
};

const yagyuMunenori: ServantDefinition = {
  id: 'yagyu-munenori',
  name: 'Yagyu Munenori',
  title: 'The Sword Master of the Shogunate',
  className: 'Saber',
  trueName: 'Yagyu Munenori',
  maxHp: 1050,
  atk: 115,
  def: 62,
  agility: 72,
  critChance: 0.2,
  rank: 'A',
  strengths: ['Critical Hits', 'Speed'],
  weaknesses: ['Low HP'],
  passiveDescription: 'A cold, calculated master of the sword, disciplined enough to end a duel with a single stroke.',
  skills: [
    {
      id: 'no-sword',
      name: 'No-Sword',
      description: "A stance that turns any weapon against its wielder. Raises own crit rate for 2 turns.",
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'no-sword',
          name: 'No-Sword',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.35,
          turnsRemaining: 2,
          description: '+35% crit chance scaling',
        });
        ctx.log('Yagyu Munenori takes the stance of No-Sword.');
      },
    },
    {
      id: 'shogunates-discipline',
      name: "Shogunate's Discipline",
      description: 'A discipline that has never once wavered. Raises own Defense by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'shogunates-discipline',
          name: "Shogunate's Discipline",
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% DEF',
        });
        ctx.log("Yagyu Munenori's Shogunate's Discipline holds firm!");
      },
    },
    {
      id: 'single-stroke',
      name: 'Single Stroke',
      description: 'A duel ended before it truly began. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'single-stroke__critReady',
          name: 'Single Stroke',
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Yagyu Munenori prepares a Single Stroke.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Shinkage-ryu: The Sword That Cuts Nothing',
    japaneseName: 'Shinkage-ryu',
    description: 'A blade drawn to end the fight without a single wasted motion.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Yagyu Munenori draws Shinkage-ryu!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { guaranteedCrit: true, label: 'Shinkage-ryu' });
    },
  },
};

const nero: ServantDefinition = {
  id: 'nero',
  name: 'Nero Claudius',
  title: 'The Emperor of Roses',
  className: 'Saber',
  trueName: 'Nero Claudius',
  maxHp: 1100,
  atk: 105,
  def: 58,
  agility: 60,
  critChance: 0.2,
  rank: 'B+',
  strengths: ['Critical Hits'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A theatrical Emperor of Rome, loud, passionate, and utterly convinced of her own genius.',
  skills: [
    {
      id: 'imperial-privilege',
      name: 'Imperial Privilege',
      description: "An emperor's authority heals every wound. Heals self for 18% max HP.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.18);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Nero Claudius invokes Imperial Privilege, healing ${healed} HP.`);
      },
    },
    {
      id: 'rooms-of-guest',
      name: "Roomu no Kyaku",
      description: "A theatrical flourish raises her spirits. Raises own Attack by 22% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'rooms-of-guest',
          name: "Roomu no Kyaku",
          kind: 'buff',
          stat: 'atk',
          amount: 0.22,
          turnsRemaining: 2,
          description: '+22% ATK',
        });
        ctx.log('Nero Claudius performs a rousing flourish!');
      },
    },
    {
      id: 'a-flash-of-blades-song',
      name: "A Flash of Blade's Song",
      description: 'A performer never misses her cue. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'blades-song__critReady',
          name: "A Flash of Blade's Song",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log('Nero Claudius readies a Flash of Blade\'s Song.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Aestus Domus Aurea: The Golden Theater',
    japaneseName: 'Aestus Domus Aurea',
    description: "A golden palace of flame, raised as the final act of the Emperor's stage.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Nero Claudius raises Aestus Domus Aurea!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Aestus Domus Aurea' });
    },
  },
};

const okitaSouji: ServantDefinition = {
  id: 'okita-souji',
  name: 'Okita Souji',
  title: 'The First Unit Captain of the Shinsengumi',
  className: 'Saber',
  trueName: 'Okita Souji',
  maxHp: 950,
  atk: 122,
  def: 52,
  agility: 88,
  critChance: 0.25,
  rank: 'A+',
  strengths: ['Highest Crit Rate', 'Speed'],
  weaknesses: ['Low HP', 'Fragile'],
  passiveDescription: "A deadly Shinsengumi captain whose swordplay is undercut only by her own failing health.",
  skills: [
    {
      id: 'mumyo-sinken',
      name: 'Mumyo Sinken',
      description: 'A technique too fast for the eye to follow. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mumyo-sinken',
          name: 'Mumyo Sinken',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.35,
          turnsRemaining: 2,
          description: '+35% crit chance scaling',
        });
        ctx.log('Okita Souji unleashes Mumyo Sinken!');
      },
    },
    {
      id: 'threefold-lotus-strike',
      name: 'Threefold Lotus Strike',
      description: 'Three strikes disguised as one. Deals 1.2x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Threefold Lotus Strike' });
        ctx.log('Okita Souji lands a Threefold Lotus Strike!');
      },
    },
    {
      id: 'blood-cough',
      name: 'Endure the Illness',
      description: 'A will stronger than her failing lungs. Recovers 6% max HP at the start of each of her next 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'endure-the-illness-regen',
          name: 'Endure the Illness',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.06),
          turnsRemaining: 2,
          description: 'Recovers 6% max HP per turn',
        });
        ctx.log('Okita Souji fights through her illness.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Kikuichimonji: Three-Part Certain Kill Technique',
    japaneseName: 'Kikuichimonji',
    description: 'A blade strike so fast it lands three times before the eye can register one.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Okita Souji unleashes Kikuichimonji!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { guaranteedCrit: true, label: 'Kikuichimonji' });
    },
  },
};

export const SABER_SERVANTS: ServantDefinition[] = [
  arthur,
  siegfried,
  musashi,
  elCid,
  altera,
  sengoMuramasa,
  mordred,
  yagyuMunenori,
  nero,
  okitaSouji,
];
