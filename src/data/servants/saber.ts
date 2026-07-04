import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const arthur: ServantDefinition = {
  id: 'saber',
  name: 'Artoria Pendragon',
  title: 'The King of Knights',
  className: 'Saber',
  trueName: 'Artoria Pendragon',
  maxHp: 950,
  atk: 110,
  def: 85,
  agility: 70,
  luck: 70,
  critChance: 0.12,
  rank: 'A+',
  strengths: ['Balanced Stats', 'Durability'],
  weaknesses: ['No Specialty'],
  passiveDescription: 'A king born to lead: steady stats with no glaring weakness.',
  skills: [
    {
      id: 'charisma',
      name: 'Charisma',
      description: 'The bearing of a king. Raises own Attack by 20% for 3 turns.',
      cooldown: 4,
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
      npGainSelf: 14,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { label: 'Excalibur' });
    },
  },
};

const siegfried: ServantDefinition = {
  id: 'siegfried',
  name: 'Siegfried',
  title: 'The Dragon-Blooded Knight',
  className: 'Saber',
  trueName: 'Siegfried',
  maxHp: 1000,
  atk: 115,
  def: 80,
  agility: 65,
  luck: 50,
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
      npGainSelf: 14,
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
  maxHp: 880,
  atk: 118,
  def: 65,
  agility: 90,
  luck: 55,
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
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'void-perception',
          name: 'Void Perception',
          kind: 'buff',
          stat: 'luck',
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
      ctx.dealDamage(ctx.self, ctx.enemy, 1.15, { label: 'Nine Heavens I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.15, { label: 'Nine Heavens II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.15, { label: 'Nine Heavens III' });
    },
  },
};

const elCid: ServantDefinition = {
  id: 'el-cid',
  name: 'El Cid',
  title: 'The Undefeated Champion',
  className: 'Saber',
  trueName: 'Rodrigo Díaz de Vivar',
  maxHp: 980,
  atk: 108,
  def: 88,
  agility: 55,
  luck: 60,
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
      description: "An oath sworn on his blade. Grants a shield that absorbs damage equal to 20% of his max HP.",
      cooldown: 5,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'tizonas-oath-shield',
          name: "Tizona's Oath",
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 3,
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
      ctx.dealDamage(ctx.self, ctx.enemy, 2.9, { label: 'Tizona' });
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

export const SABER_SERVANTS: ServantDefinition[] = [arthur, siegfried, musashi, elCid];
