import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const arthur: ServantDefinition = {
  id: 'saber',
  name: 'Artoria Pendragon',
  title: 'The King of Knights',
  className: 'Saber',
  trueName: 'Artoria Pendragon',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Artoria_Pendragon",
  maxHp: 1140,
  atk: 105,
  def: 81,
  agility: 70,
  critChance: 0.12,
  rank: 'B',
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
          amount: 0.25,
          turnsRemaining: 1,
          description: '+25% ATK (1 turn)',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 4.05, { label: 'Excalibur' });
    },
  },
};

const siegfried: ServantDefinition = {
  id: 'siegfried',
  name: 'Siegfried',
  title: 'The Dragon-Blooded Knight',
  className: 'Saber',
  trueName: 'Siegfried',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Siegfried",
  maxHp: 1490,
  atk: 122,
  def: 96,
  agility: 65,
  critChance: 0.1,
  rank: 'A+',
  strengths: ['Durability', 'Sustained Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: "Bathed in a dragon's blood, his skin turns aside nearly any blow — save one hidden weak point.",
  skills: [
    {
      id: 'dragon-skin',
      name: 'Dragon Skin',
      description: "The dragon's blood wards his body. Raises own Defense by 25% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'dragon-skin',
          name: 'Dragon Skin',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% DEF',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.87, { label: 'Balmung' });
    },
  },
};

const musashi: ServantDefinition = {
  id: 'musashi',
  name: 'Musashi',
  title: 'The Sword Saint',
  className: 'Saber',
  trueName: 'Miyamoto Musashi',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Miyamoto_Musashi",
  maxHp: 1070,
  atk: 116,
  def: 61,
  agility: 90,
  critChance: 0.15,
  rank: 'C+',
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
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 1.43, { label: 'Nine Heavens I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.43, { label: 'Nine Heavens II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.43, { label: 'Nine Heavens III' });
    },
  },
};


const altera: ServantDefinition = {
  id: 'altera',
  name: 'Altera',
  title: 'The Scourge of God',
  className: 'Saber',
  trueName: 'Attila the Hun',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Altera",
  maxHp: 1200,
  atk: 130,
  def: 60,
  agility: 65,
  critChance: 0.1,
  rank: 'A',
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Senji_Muramasa",
  maxHp: 1000,
  atk: 121,
  def: 55,
  agility: 70,
  critChance: 0.15,
  rank: 'C',
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
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: 'Causality Severed' });
    },
  },
};

const mordred: ServantDefinition = {
  id: 'mordred',
  name: 'Mordred',
  title: 'The Knight of Treachery',
  className: 'Saber',
  trueName: 'Mordred',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Mordred",
  maxHp: 1220,
  atk: 132,
  def: 58,
  agility: 68,
  critChance: 0.15,
  rank: 'A',
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
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
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
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Yagyū_Munenori",
  maxHp: 1050,
  atk: 120,
  def: 62,
  agility: 72,
  critChance: 0.15,
  rank: 'C',
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
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.55, { label: 'Shinkage-ryu' });
    },
  },
};

const nero: ServantDefinition = {
  id: 'nero',
  name: 'Nero Claudius',
  title: 'The Emperor of Roses',
  className: 'Saber',
  trueName: 'Nero Claudius',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Nero_Claudius",
  maxHp: 1100,
  atk: 111,
  def: 58,
  agility: 60,
  critChance: 0.15,
  rank: 'C+',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.87, { label: 'Aestus Domus Aurea' });
    },
  },
};

const okitaSouji: ServantDefinition = {
  id: 'okita-souji',
  name: 'Okita Souji',
  title: 'The First Unit Captain of the Shinsengumi',
  className: 'Saber',
  trueName: 'Okita Souji',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Okita_Sōji",
  maxHp: 950,
  atk: 132,
  def: 52,
  agility: 88,
  critChance: 0.15,
  rank: 'C+',
  strengths: ['Highest Damage', 'Speed'],
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
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.6, { label: 'Kikuichimonji' });
    },
  },
};

const gawain: ServantDefinition = {
  id: 'gawain',
  name: 'Gawain',
  title: 'The Knight of the Sun',
  className: 'Saber',
  trueName: 'Gawain',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Gawain",
  maxHp: 1450,
  atk: 124,
  def: 88,
  agility: 59,
  critChance: 0.13,
  rank: 'A+',
  strengths: ['Highest Defense', 'Highest HP'],
  weaknesses: ['Predictable'],
  passiveDescription: 'The Knight of the Sun, whose strength swells to unbreakable heights beneath an open sky.',
  skills: [
    {
      id: 'chivalric-blessing',
      name: 'Chivalric Blessing',
      description: "A knight's honor is its own shield. Raises own Defense by 25% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'chivalric-blessing',
          name: 'Chivalric Blessing',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% DEF',
        });
        ctx.log('Gawain is warded by a Chivalric Blessing!');
      },
    },
    {
      id: 'gift-of-the-sun',
      name: 'Gift of the Sun',
      description: 'The sun itself lends him its strength. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'gift-of-the-sun',
          name: 'Gift of the Sun',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log('Gawain basks in the Gift of the Sun!');
      },
    },
    {
      id: 'round-table-oath',
      name: 'Round Table Oath',
      description: "A knight's vow mends every wound. Recovers 7% max HP at the start of each of his next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'round-table-oath-regen',
          name: 'Round Table Oath',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log('Gawain honors the Round Table Oath.');
      },
    },
  ],
  noblePhantasm: {
    name: 'Excalibur Galatine: Sword of Chivalry',
    japaneseName: 'Excalibur Galatine',
    description: "A blade of pure sunlight, wielded with the unshakable honor of the Round Table.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Gawain unsheathes Excalibur Galatine!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.3, { label: 'Excalibur Galatine' });
    },
  },
};

const richard: ServantDefinition = {
  id: 'richard',
  name: 'Richard I',
  title: 'The Lionheart',
  className: 'Saber',
  trueName: 'Richard I',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Richard_I",
  maxHp: 1150,
  atk: 118,
  def: 62,
  agility: 62,
  critChance: 0.14,
  rank: 'B+',
  strengths: ['Buffs', 'Guaranteed Crits'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The Lionheart King, whose sheer force of will can turn any blade he holds into Excalibur itself.',
  skills: [
    {
      id: 'kingship-become-a-blade',
      name: 'Kingship: Become a Blade',
      description: 'A king who becomes the sword he needs. Raises own Attack by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kingship-become-a-blade',
          name: 'Kingship: Become a Blade',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% ATK',
        });
        ctx.log("Richard I invokes Kingship: Become a Blade!");
      },
    },
    {
      id: 'lionhearted-resolve',
      name: 'Lionhearted Resolve',
      description: "A king's heart that will not break. Raises own Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'lionhearted-resolve',
          name: 'Lionhearted Resolve',
          kind: 'buff',
          stat: 'def',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% DEF',
        });
        ctx.log("Richard I's Lionhearted Resolve steadies him!");
      },
    },
    {
      id: 'crusaders-vanguard',
      name: "Crusader's Vanguard",
      description: 'A king who always leads the charge. Next attack is a guaranteed critical hit.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'crusaders-vanguard__critReady',
          name: "Crusader's Vanguard",
          kind: 'buff',
          turnsRemaining: 1,
          description: 'Next attack guaranteed crit',
        });
        ctx.log("Richard I leads the Crusader's Vanguard.");
      },
    },
  ],
  noblePhantasm: {
    name: 'Excalibur: Sword of Promised Kingship',
    japaneseName: 'Excalibur',
    description: 'Any blade Richard wields becomes, for a moment, the legendary sword itself.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Richard I becomes the Sword of Promised Kingship!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Sword of Promised Kingship' });
    },
  },
};

const charlemagne: ServantDefinition = {
  id: 'charlemagne',
  name: 'Charlemagne',
  title: 'The King of the Franks',
  className: 'Saber',
  trueName: 'Charlemagne',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Charlemagne",
  maxHp: 1150,
  atk: 112,
  def: 65,
  agility: 58,
  critChance: 0.12,
  rank: 'B',
  strengths: ['Durability'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: "A dashing, cool-headed king who does things simply because they're worth doing well.",
  skills: [
    {
      id: 'kingly-charisma',
      name: 'Kingly Charisma',
      description: "A king who leads simply by being himself. Raises own Attack by 22% for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kingly-charisma',
          name: 'Kingly Charisma',
          kind: 'buff',
          stat: 'atk',
          amount: 0.22,
          turnsRemaining: 2,
          description: '+22% ATK',
        });
        ctx.log("Charlemagne's Kingly Charisma inspires confidence!");
      },
    },
    {
      id: 'twelve-paladins-oath',
      name: "Twelve Paladins' Oath",
      description: 'An oath sworn beside his greatest knights. Raises own Defense by 22% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'twelve-paladins-oath',
          name: "Twelve Paladins' Oath",
          kind: 'buff',
          stat: 'def',
          amount: 0.22,
          turnsRemaining: 3,
          description: '+22% DEF',
        });
        ctx.log("Charlemagne swears the Twelve Paladins' Oath!");
      },
    },
    {
      id: 'joyeuse-strike',
      name: 'Joyeuse Strike',
      description: 'A joyful blade never strikes twice the same way. Deals 1.2x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.2, { label: 'Joyeuse Strike' });
        ctx.log('Charlemagne strikes with Joyeuse!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Joyeuse: The Radiant Coronation',
    japaneseName: 'Joyeuse',
    description: 'A blade that once crowned an empire, brought to bear one final time.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Charlemagne invokes Joyeuse: The Radiant Coronation!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.8, { label: 'The Radiant Coronation' });
    },
  },
};

const saito: ServantDefinition = {
  id: 'saito',
  name: 'Saito Hajime',
  title: 'The Wolf of Mibu',
  className: 'Saber',
  trueName: 'Saito Hajime',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Saitō_Hajime",
  maxHp: 1100,
  atk: 104,
  def: 62,
  agility: 70,
  critChance: 0.12,
  rank: 'B',
  strengths: ['Speed', 'Critical Strikes'],
  weaknesses: ['Low HP'],
  passiveDescription: 'A relaxed swordsman whose blade moves faster than the eye can follow.',
  skills: [
    {
      id: 'gunto-soujutsu',
      name: 'Gunto Soujutsu',
      description: 'A sword style honed for lethal speed. Raises own Crit Chance by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'gunto-soujutsu',
          name: 'Gunto Soujutsu',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.18,
          turnsRemaining: 3,
          description: '+18% Crit Chance',
        });
        ctx.log('Saito Hajime draws upon Gunto Soujutsu!');
      },
    },
    {
      id: 'oath-of-the-wolves',
      name: 'Oath of the Wolves',
      description: "A vow to the Shinsengumi's code. Raises own Attack by 25% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'oath-of-the-wolves',
          name: 'Oath of the Wolves',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Attack',
        });
        ctx.log('Saito Hajime renews his Oath of the Wolves!');
      },
    },
    {
      id: 'aku-soku-zan',
      name: 'Aku Soku Zan',
      description: 'Swift death to evil, without hesitation. Deals a bonus strike.',
      cooldown: 5,
      tag: 'utility',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.log('Saito Hajime cuts down evil with Aku Soku Zan!');
        ctx.dealDamage(ctx.self, ctx.enemy, 1.4, { label: 'Aku Soku Zan' });
      },
    },
  ],
  noblePhantasm: {
    name: 'Gyakuryuu: Left-Handed Reverse Blade',
    japaneseName: 'Gyakuryuu',
    description: "A left-handed reverse stroke, faster than the enemy's guard can respond.",
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Saito Hajime unleashes Gyakuryuu!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.25, { label: 'Gyakuryuu' });
    },
  },
};

const sigurd: ServantDefinition = {
  id: 'sigurd',
  name: 'Sigurd',
  title: 'The Crown Prince of Dragonslayers',
  className: 'Saber',
  trueName: 'Sigurd',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Sigurd",
  maxHp: 1300,
  atk: 132,
  def: 66,
  agility: 70,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Critical Hits', 'Burst Damage'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'The Norse hero who slew Fafnir, cool-headed where his other self burns hot.',
  skills: [
    {
      id: 'primordial-rune-warrior',
      name: 'Primordial Rune (Warrior)',
      description: 'Runes etched for battle sharpen every strike. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'primordial-rune-warrior',
          name: 'Primordial Rune (Warrior)',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
        });
        ctx.log('Sigurd inscribes a Primordial Rune of war!');
      },
    },
    {
      id: 'dragonslayers-insight',
      name: "Dragonslayer's Insight",
      description: "Eyes that found Fafnir's heart find every weakness. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'dragonslayers-insight',
          name: "Dragonslayer's Insight",
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log("Sigurd's Dragonslayer's Insight lays the enemy's guard bare!");
      },
    },
    {
      id: 'crystallized-wisdom',
      name: 'Crystallized Wisdom',
      description: "The dragon's heart granted him wisdom beyond men. Heals self for 15% max HP.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Sigurd's Crystallized Wisdom mends his wounds for ${healed} HP.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Bölverkr Gram: The Sword of Actualization',
    japaneseName: 'Bölverkr Gram',
    description: 'The demonic sword that split an anvil, swung with the full might of the dragonslayer.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Sigurd ignites Gram — Bölverkr Gram!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Bölverkr Gram' });
    },
  },
};

const rama: ServantDefinition = {
  id: 'rama',
  name: 'Rama',
  title: 'The Seventh Avatar',
  className: 'Saber',
  trueName: 'Rama',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Rama",
  maxHp: 1220,
  atk: 127,
  def: 62,
  agility: 76,
  critChance: 0.14,
  rank: 'A',
  strengths: ['Critical Hits', 'Speed'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'The hero-king of the Ramayana, cursed to be forever parted from his beloved.',
  skills: [
    {
      id: 'blessing-of-martial-arts',
      name: 'Blessing of Martial Arts',
      description: 'Divine training honed to perfection. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'blessing-of-martial-arts',
          name: 'Blessing of Martial Arts',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% crit chance scaling',
        });
        ctx.log('Rama invokes the Blessing of Martial Arts!');
      },
    },
    {
      id: 'rakshasa-slaying-arrow',
      name: 'Rakshasa-Slaying Arrow',
      description: 'An arrow that felled demon-kind. Deals 1.35x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.35, { label: 'Rakshasa-Slaying Arrow' });
        ctx.log('Rama looses a Rakshasa-Slaying Arrow!');
      },
    },
    {
      id: 'grace-of-the-raghu',
      name: 'Grace of the Raghu',
      description: 'The blood of a divine dynasty restores him. Heals self for 15% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.15);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`The Grace of the Raghu restores ${healed} HP to Rama.`);
      },
    },
  ],
  noblePhantasm: {
    name: 'Brahmastra: The Bow of Sanction',
    japaneseName: 'Brahmastra',
    description: 'The ultimate divine weapon, loosed as a single all-annihilating arrow.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Rama draws the Bow of Sanction — Brahmastra!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.85, { label: 'Brahmastra' });
    },
  },
};

const bedivere: ServantDefinition = {
  id: 'bedivere',
  name: 'Bedivere',
  title: 'The Knight of the Silver Arm',
  className: 'Saber',
  trueName: 'Bedivere',
  fateWikiUrl: "https://fategrandorder.fandom.com/wiki/Bedivere",
  maxHp: 1240,
  atk: 123,
  def: 69,
  agility: 72,
  critChance: 0.12,
  rank: 'A',
  strengths: ['Durability', 'Regeneration'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'The last knight at his king\'s side, who carried Excalibur back to the lake.',
  skills: [
    {
      id: 'oath-of-the-lake',
      name: 'Oath of the Lake',
      description: 'A duty carried to the very end steadies him. Recovers 5% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'oath-of-the-lake-regen',
          name: 'Oath of the Lake',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Recovers 5% max HP per turn',
        });
        ctx.log('Bedivere renews his Oath of the Lake.');
      },
    },
    {
      id: 'calm-and-collected',
      name: 'Calm and Collected',
      description: 'The steadiest hand of the Round Table. Raises own Defense by 25% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'calm-and-collected',
          name: 'Calm and Collected',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 2,
          description: '+25% DEF',
        });
        ctx.log('Bedivere stands Calm and Collected.');
      },
    },
    {
      id: 'silver-arm',
      name: 'Silver Arm',
      description: 'The prosthetic arm of silver strikes with hidden force. Deals 1.35x damage.',
      cooldown: 3,
      tag: 'crit',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.dealDamage(ctx.self, ctx.enemy, 1.35, { label: 'Silver Arm' });
        ctx.log('Bedivere strikes with the Silver Arm!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Switch On — Airgetlám: Sword of the Unfading Light',
    japaneseName: 'Airgetlám',
    description: 'The silver arm unbound, releasing all of its stored light in one blow.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Bedivere releases the restraints — Switch On, Airgetlám!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.9, { label: 'Airgetlám' });
    },
  },
};

export const SABER_SERVANTS: ServantDefinition[] = [
  arthur,
  siegfried,
  musashi,
  altera,
  sengoMuramasa,
  mordred,
  yagyuMunenori,
  nero,
  okitaSouji,
  gawain,
  richard,
  charlemagne,
  saito,
  sigurd,
  rama,
  bedivere,
];
