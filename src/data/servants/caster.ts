import type { ServantDefinition } from '../../types';
import { applyStatus, dispelBuffs } from '../../engine/status';

const medea: ServantDefinition = {
  id: 'caster',
  name: 'Medea',
  title: 'Witch of Colchis',
  className: 'Caster',
  trueName: 'Medea',
  maxHp: 1015,
  atk: 116,
  def: 61,
  agility: 55,
  critChance: 0.08,
  rank: 'B+',
  strengths: ['Debuffs', 'Regeneration'],
  weaknesses: ['Low Damage', 'Fragile'],
  passiveDescription: 'A sorceress who unravels enemies with curses rather than steel.',
  skills: [
    {
      id: 'rule-breaker',
      name: 'Rule Breaker',
      description: "A dagger that severs magecraft. Dispels the enemy's buffs.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        const removed = dispelBuffs(ctx.enemy);
        ctx.log(
          removed > 0
            ? "Medea uses Rule Breaker, dispelling the enemy's buffs!"
            : 'Medea uses Rule Breaker, but there was nothing to dispel.',
        );
      },
    },
    {
      id: 'territory-creation',
      name: 'Territory Creation',
      description: "A witch's workshop. Heals self for 19% max HP.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.19);
        ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
        ctx.log(`Medea draws on their Territory Creation, healing ${healed} HP.`);
      },
    },
    {
      id: 'item-construction',
      name: 'Item Construction',
      description: 'A cursed talisman weakens the enemy. Lowers enemy Attack by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'cursed-talisman',
          name: 'Cursed Talisman',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log('Medea curses the enemy with a Cursed Talisman!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Rule of the Jeweled Sword',
    japaneseName: 'Rule of the Jeweled Sword',
    description: 'A barrage of magical blades that rains down over three strikes.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Medea invokes the Rule of the Jeweled Sword!');
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Jeweled Sword I' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Jeweled Sword II' });
      ctx.dealDamage(ctx.self, ctx.enemy, 1.3, { label: 'Jeweled Sword III' });
      applyStatus(ctx.enemy, {
        id: 'jeweled-curse',
        name: 'Lingering Curse',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 2,
        description: 'Afflicted by a lingering curse',
      });
    },
  },
};

const circe: ServantDefinition = {
  id: 'circe',
  name: 'Circe',
  title: 'The Witch-Goddess of Aeaea',
  className: 'Caster',
  trueName: 'Circe',
  maxHp: 1025,
  atk: 113,
  def: 59,
  agility: 55,
  critChance: 0.08,
  rank: 'B+',
  strengths: ['Debuffs', 'Tempo Control', 'Regeneration'],
  weaknesses: ['Low Damage', 'Fragile'],
  passiveDescription: 'Her potions and spells twist the body and mind of any who cross her.',
  skills: [
    {
      id: 'transmutation-curse',
      name: 'Transmutation Curse',
      description: "A curse that clouds the enemy's fortune. Lowers enemy crit rate for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'transmutation-curse',
          name: 'Transmutation Curse',
          kind: 'debuff',
          stat: 'critChance',
          amount: -0.3,
          turnsRemaining: 3,
          description: '-30% crit chance scaling',
        });
        ctx.log('Circe lays a Transmutation Curse upon the enemy!');
      },
    },
    {
      id: 'aeaeas-ward',
      name: "Aeaea's Ward",
      description: 'The protection of her enchanted island. Recovers 6% max HP at the start of each of her next 2 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'aeaeas-ward-regen',
          name: "Aeaea's Ward",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.06),
          turnsRemaining: 2,
          description: 'Recovers 6% max HP per turn',
        });
        ctx.log("Circe calls upon Aeaea's Ward.");
      },
    },
    {
      id: 'enchanted-chalice',
      name: 'Enchanted Chalice',
      description: "A draught that saps the enemy's resolve. Drains 20% from the enemy's Noble Phantasm gauge.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        ctx.enemy.npGauge = Math.max(0, ctx.enemy.npGauge - 20);
        ctx.log("Circe's Enchanted Chalice saps the enemy's resolve!");
      },
    },
  ],
  noblePhantasm: {
    name: "Circe's Curse: Beasts of Aeaea",
    japaneseName: 'Beasts of Aeaea',
    description: 'A transmuting curse that leaves the enemy stunned as swine.',
    rank: 'C+',
    effect: (ctx) => {
      ctx.log("Circe's Curse turns the enemy into a Beast of Aeaea!");
      ctx.dealDamage(ctx.self, ctx.enemy, 2.4, { label: "Circe's Curse" });
      applyStatus(ctx.enemy, {
        id: 'aeaea-stun',
        name: 'Transmuted',
        kind: 'stun',
        turnsRemaining: 1,
        description: 'Cannot act next turn',
      });
    },
  },
};

const merlin: ServantDefinition = {
  id: 'merlin',
  name: 'Merlin',
  title: 'The Prophet of Britain',
  className: 'Caster',
  trueName: 'Merlin',
  maxHp: 1050,
  atk: 108,
  def: 65,
  agility: 55,
  critChance: 0.1,
  rank: 'B+',
  strengths: ['Cooldown Manipulation', 'Support'],
  weaknesses: ['Low Damage'],
  passiveDescription: 'A trickster mage whose prophecy sees three steps ahead.',
  skills: [
    {
      id: 'mana-blessing',
      name: 'Mana Blessing',
      description: 'A gift of magical power. Raises own Attack by 30% for 2 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mana-blessing',
          name: 'Mana Blessing',
          kind: 'buff',
          stat: 'atk',
          amount: 0.3,
          turnsRemaining: 2,
          description: '+30% ATK',
        });
        ctx.log('Merlin grants himself a Mana Blessing!');
      },
    },
    {
      id: 'sacred-prophecy',
      name: 'Sacred Prophecy',
      description: 'He foresaw this battle three steps ahead. Resets the cooldowns of his other Skills.',
      cooldown: 6,
      npGainSelf: 20,
      tag: 'utility',
      effect: (ctx) => {
        ctx.self.skillCooldowns = ctx.self.skillCooldowns.map(() => 0);
        ctx.log('Merlin recalls a Sacred Prophecy — every path is already prepared.');
      },
    },
    {
      id: 'illusory-fog',
      name: 'Illusory Fog',
      description: "A fog that clouds the enemy's aim. Lowers enemy crit rate for 2 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'illusory-fog',
          name: 'Illusory Fog',
          kind: 'debuff',
          stat: 'critChance',
          amount: -0.25,
          turnsRemaining: 2,
          description: '-25% crit chance scaling',
        });
        ctx.log('Merlin conjures an Illusory Fog around the enemy!');
      },
    },
  ],
  noblePhantasm: {
    name: "The Once and Future Wizard's Gift",
    japaneseName: 'Kaleidoscope',
    description: "A wizard's blessing beyond death, mending all wounds and clearing every curse.",
    rank: 'A',
    effect: (ctx) => {
      ctx.log("Merlin bestows the Once and Future Wizard's Gift!");
      const healed = Math.round(ctx.self.maxHp * 0.45);
      ctx.self.hp = ctx.self.hp + healed; // clamped once at end of round, see clampHp in battle.ts
      ctx.self.statuses = ctx.self.statuses.filter((s) => s.kind !== 'debuff' && s.kind !== 'dot');
      applyStatus(ctx.self, {
        id: 'wizards-gift',
        name: "Wizard's Gift",
        kind: 'buff',
        stat: 'atk',
        amount: 0.25,
        turnsRemaining: 3,
        description: '+25% ATK',
      });
      ctx.log(`Merlin recovers ${healed} HP, clears his afflictions, and rises renewed.`);
    },
  },
};

const nostradamus: ServantDefinition = {
  id: 'nostradamus',
  name: 'Nostradamus',
  title: 'The Seer of Prophecy',
  className: 'Caster',
  trueName: 'Nostradamus',
  maxHp: 975,
  atk: 106,
  def: 56,
  agility: 50,
  critChance: 0.07,
  rank: 'B',
  strengths: ['Debuffs', 'Damage over Time', 'Self-Cleanse'],
  weaknesses: ['Low Damage', 'Fragile', 'Low HP'],
  passiveDescription: 'Foretells calamity, and shapes the battlefield with grim portents.',
  skills: [
    {
      id: 'prophecy-of-ruin',
      name: 'Prophecy of Ruin',
      description: "A foretold collapse of the enemy's guard. Lowers enemy Defense by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'prophecy-of-ruin',
          name: 'Prophecy of Ruin',
          kind: 'debuff',
          stat: 'def',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% DEF',
        });
        ctx.log('Nostradamus foretells a Prophecy of Ruin!');
      },
    },
    {
      id: 'foreseen-doom',
      name: 'Foreseen Doom',
      description: "A grim portent saps the enemy's strength. Lowers enemy Attack by 18% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'foreseen-doom',
          name: 'Foreseen Doom',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% ATK',
        });
        ctx.log('Nostradamus reveals a Foreseen Doom!');
      },
    },
    {
      id: 'omen-ward',
      name: 'Omen Ward',
      description: 'He foresees his own ill fortune and turns it aside. Clears all of his own debuffs and curses.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const cleared = ctx.self.statuses.some((s) => s.kind === 'debuff' || s.kind === 'dot');
        ctx.self.statuses = ctx.self.statuses.filter((s) => s.kind !== 'debuff' && s.kind !== 'dot');
        ctx.log(
          cleared
            ? 'Nostradamus raises an Omen Ward, casting off every ill omen!'
            : 'Nostradamus raises an Omen Ward, but no ill omen yet clings to him.',
        );
      },
    },
  ],
  noblePhantasm: {
    name: 'Les Propheties: The Written Fate',
    japaneseName: 'Les Propheties',
    description: 'A calamity foretold in verse, made real upon the enemy.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log('Nostradamus reads from Les Propheties — the Written Fate comes due!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.05, { label: 'Les Propheties' });
      applyStatus(ctx.enemy, {
        id: 'written-fate-curse',
        name: 'Written Fate',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 3,
        description: 'Bound by a foretold curse',
      });
    },
  },
};

const gillesDeRais: ServantDefinition = {
  id: 'gilles-de-rais',
  name: 'Gilles de Rais',
  title: 'The Fallen Marshal of France',
  className: 'Caster',
  trueName: 'Gilles de Rais',
  maxHp: 975,
  atk: 111,
  def: 59,
  agility: 50,
  critChance: 0.08,
  rank: 'B',
  strengths: ['Debuffs', 'Regeneration'],
  weaknesses: ['Low Damage', 'Fragile', 'Low HP'],
  passiveDescription:
    'Once a marshal who fought beside a saint, later ruined by heresy and forbidden research into alchemy.',
  skills: [
    {
      id: 'forbidden-alchemy',
      name: 'Forbidden Alchemy',
      description: 'A corrosive, experimental transmutation. Lowers enemy Defense by 15% for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'forbidden-alchemy',
          name: 'Forbidden Alchemy',
          kind: 'debuff',
          stat: 'def',
          amount: -0.15,
          turnsRemaining: 2,
          description: '-15% DEF',
        });
        ctx.log('Gilles de Rais unleashes Forbidden Alchemy upon the enemy!');
      },
    },
    {
      id: 'heretics-ritual',
      name: "Heretic's Ritual",
      description: 'A dark rite sustains his failing body. Recovers 6% max HP at the start of each of his next 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'heretics-ritual-regen',
          name: "Heretic's Ritual",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.06),
          turnsRemaining: 3,
          description: 'Recovers 6% max HP per turn',
        });
        ctx.log("Gilles de Rais performs a Heretic's Ritual.");
      },
    },
    {
      id: 'marshals-discipline',
      name: "Marshal's Discipline",
      description: 'A memory of his soldiering days beside a saint. Raises own Attack by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'marshals-discipline',
          name: "Marshal's Discipline",
          kind: 'buff',
          stat: 'atk',
          amount: 0.18,
          turnsRemaining: 3,
          description: '+18% ATK',
        });
        ctx.log("Gilles de Rais calls upon a Marshal's Discipline!");
      },
    },
  ],
  noblePhantasm: {
    name: "Prelati's Spellbook: Forbidden Grimoire",
    japaneseName: "Prelati's Spellbook",
    description: 'A cursed tome of forbidden research, unleashed as calamity upon the enemy.',
    rank: 'C',
    effect: (ctx) => {
      ctx.log("Gilles de Rais opens Prelati's Spellbook — a Forbidden Grimoire!");
      ctx.dealDamage(ctx.self, ctx.enemy, 2.65, { label: 'Forbidden Grimoire' });
      applyStatus(ctx.enemy, {
        id: 'grimoire-curse',
        name: 'Grimoire Curse',
        kind: 'dot',
        potency: Math.round(ctx.enemy.maxHp * 0.04),
        turnsRemaining: 3,
        description: 'Afflicted by a forbidden curse',
      });
    },
  },
};

const solomon: ServantDefinition = {
  id: 'solomon',
  name: 'Solomon',
  title: 'The King of Magic',
  className: 'Caster',
  trueName: 'Solomon',
  maxHp: 1300,
  atk: 120,
  def: 65,
  agility: 60,
  critChance: 0.15,
  rank: 'A+',
  strengths: ['Highest Damage', 'Cooldown Manipulation'],
  weaknesses: ['Low HP'],
  passiveDescription: 'The King of Magic, source of nearly every school of thaumaturgy that came after him.',
  skills: [
    {
      id: 'ars-almadel-salomonis',
      name: 'Ars Almadel Salomonis',
      description: "The Temple's own authority saps the enemy's strength. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'ars-almadel-salomonis',
          name: 'Ars Almadel Salomonis',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% ATK',
        });
        ctx.log('Solomon invokes Ars Almadel Salomonis!');
      },
    },
    {
      id: 'wisdom-of-solomon',
      name: 'Wisdom of Solomon',
      description: "Perfect foresight sees every path at once. Resets the cooldowns of his other Skills.",
      cooldown: 6,
      npGainSelf: 20,
      tag: 'utility',
      effect: (ctx) => {
        ctx.self.skillCooldowns = ctx.self.skillCooldowns.map(() => 0);
        ctx.log('Solomon draws on the Wisdom of Solomon - every path is already known.');
      },
    },
    {
      id: 'djinn-command',
      name: 'Djinn Command',
      description: 'Bound spirits rise to shield their king. Grants a shield that absorbs damage equal to 20% of his max HP, lasting this turn and the next.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'djinn-command-shield',
          name: 'Djinn Command',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.2),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log('Solomon commands his Djinn to shield him!');
      },
    },
  ],
  noblePhantasm: {
    name: 'Ars Nova: The 72 Pillars',
    japaneseName: 'Ars Nova',
    description: "The full authority of the 72 Pillars, brought to bear in a single verdict.",
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Solomon calls upon Ars Nova: The 72 Pillars!');
      ctx.dealDamage(ctx.self, ctx.enemy, 4.0, { label: 'The 72 Pillars' });
    },
  },
};

const tamamo: ServantDefinition = {
  id: 'tamamo',
  name: 'Tamamo-no-Mae',
  title: 'The Nine-Tailed Fox',
  className: 'Caster',
  trueName: 'Tamamo-no-Mae',
  maxHp: 1100,
  atk: 100,
  def: 55,
  agility: 62,
  critChance: 0.18,
  rank: 'B+',
  strengths: ['Critical Hits', 'Regeneration'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'A witty, devoted nine-tailed fox spirit, eternally rivaling Nero for her Master\'s affection.',
  skills: [
    {
      id: 'foxfire-charm',
      name: 'Foxfire Charm',
      description: 'A fox-fire that sharpens the senses. Raises own crit rate for 2 turns.',
      cooldown: 3,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'foxfire-charm',
          name: 'Foxfire Charm',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.4,
          turnsRemaining: 2,
          description: '+40% crit chance scaling',
        });
        ctx.log('Tamamo-no-Mae kindles a Foxfire Charm!');
      },
    },
    {
      id: 'nine-tails-blessing',
      name: "Nine Tails' Blessing",
      description: "A fox spirit's devotion mends every wound. Recovers 7% max HP at the start of each of her next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'nine-tails-blessing-regen',
          name: "Nine Tails' Blessing",
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.07),
          turnsRemaining: 3,
          description: 'Recovers 7% max HP per turn',
        });
        ctx.log("Tamamo-no-Mae grants Nine Tails' Blessing.");
      },
    },
    {
      id: 'vulpine-mischief',
      name: 'Vulpine Mischief',
      description: "A trickster's charm unravels the enemy's guard. Lowers enemy Defense by 18% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'vulpine-mischief',
          name: 'Vulpine Mischief',
          kind: 'debuff',
          stat: 'def',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% DEF',
        });
        ctx.log('Tamamo-no-Mae plays a bit of Vulpine Mischief!');
      },
    },
  ],
  noblePhantasm: {
    name: "Song of Kayo-Manaka: The Fox's Blessing",
    japaneseName: 'Kayo-Manaka',
    description: "A nine-tailed fox's ancient song, blessing an ally and searing an enemy in the same breath.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Tamamo-no-Mae sings the Song of Kayo-Manaka!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.7, { label: 'Kayo-Manaka' });
      const healed = Math.round(ctx.self.maxHp * 0.15);
      ctx.self.hp = ctx.self.hp + healed;
      ctx.log(`Tamamo-no-Mae recovers ${healed} HP from her own song.`);
    },
  },
};

export const CASTER_SERVANTS: ServantDefinition[] = [
  medea,
  circe,
  merlin,
  nostradamus,
  gillesDeRais,
  solomon,
  tamamo,
];
