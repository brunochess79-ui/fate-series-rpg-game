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
    {
      id: 'witch-of-colchis-true-power',
      name: "The Witch of Colchis, Unbound",
      description: "The princess who once betrayed her own kingdom for love lets her full sorcery show. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'witch-of-colchis-true-power-atk',
          name: "The Witch of Colchis, Unbound",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'witch-of-colchis-true-power-def',
          name: "The Witch of Colchis, Unbound",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'witch-of-colchis-true-power-dmg',
          name: "The Witch of Colchis, Unbound",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Medea becomes The Witch of Colchis, Unbound!");
      },
    },
  ],
  noblePhantasm: {
    name: "Rule of the Jeweled Sword",
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
    {
      id: 'goddess-of-aeaea-awakened',
      name: "The Goddess of Aeaea, Awakened",
      description: "The island witch remembers she was a goddess long before she was a witch. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'goddess-of-aeaea-awakened-atk',
          name: "The Goddess of Aeaea, Awakened",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'goddess-of-aeaea-awakened-def',
          name: "The Goddess of Aeaea, Awakened",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'goddess-of-aeaea-awakened-dmg',
          name: "The Goddess of Aeaea, Awakened",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Circe becomes The Goddess of Aeaea, Awakened!");
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
  rank: 'A',
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
    {
      id: 'prophets-final-vision',
      name: "The Prophet's Final Vision",
      description: "He has seen every ending already; now he chooses to fight past this one. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'prophets-final-vision-atk',
          name: "The Prophet's Final Vision",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'prophets-final-vision-def',
          name: "The Prophet's Final Vision",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'prophets-final-vision-dmg',
          name: "The Prophet's Final Vision",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Merlin reveals The Prophet's Final Vision!");
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
    {
      id: 'seers-unwritten-verse',
      name: "The Seer's Unwritten Verse",
      description: "For once, he writes a prophecy that has not yet come to pass. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'seers-unwritten-verse-atk',
          name: "The Seer's Unwritten Verse",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'seers-unwritten-verse-def',
          name: "The Seer's Unwritten Verse",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'seers-unwritten-verse-dmg',
          name: "The Seer's Unwritten Verse",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Nostradamus pens The Seer's Unwritten Verse!");
      },
    },
  ],
  noblePhantasm: {
    name: "Les Propheties: The Written Fate",
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
    {
      id: 'marshals-final-devotion',
      name: "The Marshal's Final Devotion",
      description: "Every twisted rite he ever performed was, in his mind, an act of devotion - and it answers him now. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'marshals-final-devotion-atk',
          name: "The Marshal's Final Devotion",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'marshals-final-devotion-def',
          name: "The Marshal's Final Devotion",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'marshals-final-devotion-dmg',
          name: "The Marshal's Final Devotion",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Gilles de Rais gives in to The Marshal's Final Devotion!");
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
    {
      id: 'kings-true-authority',
      name: "The King's True Authority",
      description: "The ring on his finger remembers it once commanded seventy-two pillars of devils. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'kings-true-authority-atk',
          name: "The King's True Authority",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'kings-true-authority-def',
          name: "The King's True Authority",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'kings-true-authority-dmg',
          name: "The King's True Authority",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Solomon exercises The King's True Authority!");
      },
    },
  ],
  noblePhantasm: {
    name: "Ars Nova: The 72 Pillars",
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
  atk: 103,
  def: 55,
  agility: 62,
  critChance: 0.15,
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
    {
      id: 'nine-tails-unveiled',
      name: "Nine Tails, Unveiled",
      description: "The playful mask falls away, and the ancient fox spirit shows her true age and power. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'nine-tails-unveiled-atk',
          name: "Nine Tails, Unveiled",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'nine-tails-unveiled-def',
          name: "Nine Tails, Unveiled",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'nine-tails-unveiled-dmg',
          name: "Nine Tails, Unveiled",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Tamamo-no-Mae becomes Nine Tails, Unveiled!");
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

const castoria: ServantDefinition = {
  id: 'castoria',
  name: 'Artoria Pendragon',
  title: 'Lily of the Lake, Caster',
  className: 'Caster',
  trueName: 'Artoria Pendragon (Caster)',
  maxHp: 1050,
  atk: 85,
  def: 60,
  agility: 58,
  critChance: 0.1,
  rank: 'C+',
  strengths: ['Debuffs', 'Buffs'],
  weaknesses: ['Low Attack'],
  passiveDescription: 'A young king who never drew the sword, wielding magecraft in its place.',
  skills: [
    {
      id: 'mystic-face',
      name: 'Mystic Face',
      description: 'Petrifying eyes unsettle the foe. Lowers enemy Crit Chance by 12% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'mystic-face',
          name: 'Mystic Face',
          kind: 'debuff',
          stat: 'critChance',
          amount: -0.12,
          turnsRemaining: 3,
          description: '-12% Crit Chance',
        });
        ctx.log('Artoria Pendragon unsettles the enemy with her Mystic Face!');
      },
    },
    {
      id: 'discernment-of-the-poor',
      name: 'Discernment of the Poor',
      description: 'A clear-eyed judgment of the battlefield. Raises own Agility by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'discernment',
          name: 'Discernment of the Poor',
          kind: 'buff',
          stat: 'agility',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Agility',
        });
        ctx.log('Artoria Pendragon reads the flow of battle with Discernment of the Poor!');
      },
    },
    {
      id: 'mana-burst-flame',
      name: 'Mana Burst (Flame)',
      description: "A burst of magecraft through her staff. Raises own Attack by 25% for 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mana-burst-flame',
          name: 'Mana Burst (Flame)',
          kind: 'buff',
          stat: 'atk',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% ATK',
        });
        ctx.log('Artoria Pendragon channels Mana Burst (Flame)!');
      },
    },
    {
      id: 'lakes-gentlest-blessing',
      name: "The Lake's Gentlest Blessing",
      description: "The kindness she never got to give as a king, she gives now as something else entirely. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'lakes-gentlest-blessing-atk',
          name: "The Lake's Gentlest Blessing",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'lakes-gentlest-blessing-def',
          name: "The Lake's Gentlest Blessing",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'lakes-gentlest-blessing-dmg',
          name: "The Lake's Gentlest Blessing",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Artoria calls upon The Lake's Gentlest Blessing!");
      },
    },
  ],
  noblePhantasm: {
    name: "Excalibur Morgan",
    japaneseName: 'Excalibur Morgan',
    description: "A lake-forged blade of magecraft, unleashed as a torrent of light.",
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Artoria Pendragon calls forth Excalibur Morgan!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.5, { label: 'Excalibur Morgan' });
    },
  },
};

const zhugeLiang: ServantDefinition = {
  id: 'zhuge-liang',
  name: 'Zhuge Liang',
  title: 'Lord El-Melloi II',
  className: 'Caster',
  trueName: 'Zhuge Kongming',
  maxHp: 1000,
  atk: 78,
  def: 55,
  agility: 50,
  critChance: 0.08,
  rank: 'C',
  strengths: ['Sustain', 'Debuffs'],
  weaknesses: ['Frail', 'Low Attack'],
  passiveDescription: 'A sleeping dragon of unmatched strategy, more dangerous in mind than in body.',
  skills: [
    {
      id: 'eight-trigrams',
      name: 'Eight Trigrams Formation',
      description: 'A defensive array of shifting positions. Raises own Defense by 25% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'eight-trigrams',
          name: 'Eight Trigrams Formation',
          kind: 'buff',
          stat: 'def',
          amount: 0.25,
          turnsRemaining: 3,
          description: '+25% Defense',
        });
        ctx.log('Zhuge Liang arrays the Eight Trigrams Formation!');
      },
    },
    {
      id: 'empty-fort-strategy',
      name: 'Empty Fort Strategy',
      description: 'A calculated bluff leaves the enemy hesitant. Lowers enemy Attack by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'empty-fort',
          name: 'Empty Fort Strategy',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.18,
          turnsRemaining: 3,
          description: '-18% Attack',
        });
        ctx.log('Zhuge Liang bluffs the enemy with the Empty Fort Strategy!');
      },
    },
    {
      id: 'banka-no-kaze',
      name: 'Banka no Kaze',
      description: 'A borrowed wind fills the sails of fortune. Heals self for 16% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.16);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Zhuge Liang calls the Banka no Kaze, healing ${healed} HP.`);
      },
    },
    {
      id: 'sleeping-dragons-last-plan',
      name: "The Sleeping Dragon's Last Plan",
      description: "One final stratagem, calculated to the smallest detail, unfolds exactly as written. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'sleeping-dragons-last-plan-atk',
          name: "The Sleeping Dragon's Last Plan",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'sleeping-dragons-last-plan-def',
          name: "The Sleeping Dragon's Last Plan",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'sleeping-dragons-last-plan-dmg',
          name: "The Sleeping Dragon's Last Plan",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Zhuge Liang enacts The Sleeping Dragon's Last Plan!");
      },
    },
  ],
  noblePhantasm: {
    name: "The Wisdom That Traverses the Heavens",
    japaneseName: 'Guardian of the Heavenly Tetrapoles',
    description: 'A strategem centuries in the making, brought to bear all at once.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Zhuge Liang unveils The Wisdom That Traverses the Heavens!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.3, { label: 'Heavenly Tetrapoles' });
      applyStatus(ctx.enemy, {
        id: 'strategy-exposed',
        name: 'Strategy Exposed',
        kind: 'debuff',
        stat: 'def',
        amount: -0.15,
        turnsRemaining: 2,
        description: '-15% Defense',
      });
    },
  },
};

const scathachSkadi: ServantDefinition = {
  id: 'scathach-skadi',
  name: 'Scáthach-Skadi',
  title: 'Goddess of the Iceberg',
  className: 'Caster',
  trueName: 'Scáthach-Skadi',
  maxHp: 1200,
  atk: 105,
  def: 60,
  agility: 80,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Critical Hits', 'Debuffs'],
  weaknesses: ['Low Defense'],
  passiveDescription: 'The Instructor of Shadows, fused with a frost goddess of the Norse Lostbelt.',
  skills: [
    {
      id: 'ansuz-rune',
      name: 'Ansuz: Rune of the Beginning',
      description: 'A rune of dawning power. Raises own Attack by 28% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'ansuz-rune',
          name: 'Ansuz: Rune of the Beginning',
          kind: 'buff',
          stat: 'atk',
          amount: 0.28,
          turnsRemaining: 3,
          description: '+28% Attack',
        });
        ctx.log("Scáthach-Skadi inscribes the Ansuz Rune!");
      },
    },
    {
      id: 'skadis-judgment',
      name: "Skadi's Judgment",
      description: 'A frozen verdict cast upon the enemy. Lowers enemy Defense by 22% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'skadis-judgment',
          name: "Skadi's Judgment",
          kind: 'debuff',
          stat: 'def',
          amount: -0.22,
          turnsRemaining: 3,
          description: '-22% Defense',
        });
        ctx.log("Scáthach-Skadi passes Skadi's Judgment on the enemy!");
      },
    },
    {
      id: 'mystic-eyes-enchantment',
      name: 'Mystic Eyes of Enchantment',
      description: 'Twin gazes of shadow and frost. Raises own Crit Chance by 15% for 3 turns.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'mystic-eyes-enchantment',
          name: 'Mystic Eyes of Enchantment',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Crit Chance',
        });
        ctx.log('Scáthach-Skadi opens her Mystic Eyes of Enchantment!');
      },
    },
    {
      id: 'iceberg-goddess-unbound',
      name: "The Iceberg Goddess, Unbound",
      description: "The cold beneath her cheer finally shows itself, vast and absolute. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'iceberg-goddess-unbound-atk',
          name: "The Iceberg Goddess, Unbound",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'iceberg-goddess-unbound-def',
          name: "The Iceberg Goddess, Unbound",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'iceberg-goddess-unbound-dmg',
          name: "The Iceberg Goddess, Unbound",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Scáthach-Skadi becomes The Iceberg Goddess, Unbound!");
      },
    },
  ],
  noblePhantasm: {
    name: "Skoll and Hati: Chasing Wolves of the Twilight",
    japaneseName: 'Skoll and Hati',
    description: 'Twin wolves of shadow and ice, loosed to run down the sun and moon.',
    rank: 'A+',
    effect: (ctx) => {
      ctx.log('Scáthach-Skadi unleashes Skoll and Hati!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.7, { label: 'Skoll and Hati' });
    },
  },
};

const chenGong: ServantDefinition = {
  id: 'chen-gong',
  name: 'Chen Gong',
  title: 'Strategist of the Three Kingdoms',
  className: 'Caster',
  trueName: 'Chen Gong',
  maxHp: 900,
  atk: 82,
  def: 48,
  agility: 55,
  critChance: 0.1,
  rank: 'C',
  strengths: ['Traps', 'Debuffs'],
  weaknesses: ['Frail', 'Low HP'],
  passiveDescription: 'An advisor whose cunning outlasted his master, laying traps within traps.',
  skills: [
    {
      id: 'cunning-strategy',
      name: 'Cunning Strategy',
      description: 'A plan within a plan. Lowers enemy Attack by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'cunning-strategy',
          name: 'Cunning Strategy',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% Attack',
        });
        ctx.log("Chen Gong lays out a Cunning Strategy!");
      },
    },
    {
      id: 'feigned-retreat',
      name: 'Feigned Retreat',
      description: 'A false withdrawal draws the enemy astray. Grants self a full dodge next turn.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'utility',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'feigned-retreat',
          name: 'Feigned Retreat',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Will evade the next attack',
        });
        ctx.log('Chen Gong stages a Feigned Retreat!');
      },
    },
    {
      id: 'poisoned-trap',
      name: 'Poisoned Arrow Trap',
      description: 'A hidden trap laced with poison. Afflicts the enemy with a damage-over-time effect.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'poisoned-trap',
          name: 'Poisoned Arrow Trap',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.05),
          turnsRemaining: 3,
          description: 'Afflicted by a poisoned trap',
        });
        ctx.log('Chen Gong springs a Poisoned Arrow Trap!');
      },
    },
    {
      id: 'strategists-hidden-hand',
      name: "The Strategist's Hidden Hand",
      description: "Every plan within a plan he has ever laid finally converges on this one move. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'strategists-hidden-hand-atk',
          name: "The Strategist's Hidden Hand",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'strategists-hidden-hand-def',
          name: "The Strategist's Hidden Hand",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'strategists-hidden-hand-dmg',
          name: "The Strategist's Hidden Hand",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Chen Gong reveals The Strategist's Hidden Hand!");
      },
    },
  ],
  noblePhantasm: {
    name: "Chapters of the Grand Strategy",
    japaneseName: 'Chapters of the Grand Strategy',
    description: 'A treatise of war given form, closing every avenue of escape.',
    rank: 'B',
    effect: (ctx) => {
      ctx.log('Chen Gong opens the Chapters of the Grand Strategy!');
      ctx.dealDamage(ctx.self, ctx.enemy, 2.4, { label: 'Grand Strategy' });
    },
  },
};

const anastasia: ServantDefinition = {
  id: 'anastasia',
  name: 'Anastasia Nikolaevna Romanova',
  title: 'The Frost Duchess',
  className: 'Caster',
  trueName: 'Anastasia Nikolaevna Romanova',
  maxHp: 1180,
  atk: 96,
  def: 62,
  agility: 62,
  critChance: 0.13,
  rank: 'B',
  strengths: ['Debuffs', 'Sustain'],
  weaknesses: ['Low Attack'],
  passiveDescription: 'A young duchess bearing a frozen crown, her sorrow given the shape of winter itself.',
  skills: [
    {
      id: 'absolute-zero',
      name: 'Absolute Zero',
      description: 'A cold that stills even the will to move. Lowers enemy Agility by 20% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'absolute-zero',
          name: 'Absolute Zero',
          kind: 'debuff',
          stat: 'agility',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% Agility',
        });
        ctx.log('Anastasia freezes the battlefield with Absolute Zero!');
      },
    },
    {
      id: 'grand-duchess-grace',
      name: "Grand Duchess's Grace",
      description: 'A quiet dignity that steadies her wounds. Heals self for 19% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.19);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Anastasia draws on her Grand Duchess's Grace, healing ${healed} HP.`);
      },
    },
    {
      id: 'frozen-curse',
      name: 'Frozen Curse',
      description: 'A creeping frost afflicts the enemy. Applies a damage-over-time effect.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'frozen-curse',
          name: 'Frozen Curse',
          kind: 'dot',
          potency: Math.round(ctx.enemy.maxHp * 0.04),
          turnsRemaining: 3,
          description: 'Afflicted by the Frozen Curse',
        });
        ctx.log('Anastasia lays a Frozen Curse upon the enemy!');
      },
    },
    {
      id: 'duchess-of-the-frozen-dawn',
      name: "Duchess of the Frozen Dawn",
      description: "The last princess of a fallen empire calls on a colder, older kind of miracle. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'duchess-of-the-frozen-dawn-atk',
          name: "Duchess of the Frozen Dawn",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'duchess-of-the-frozen-dawn-def',
          name: "Duchess of the Frozen Dawn",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'duchess-of-the-frozen-dawn-dmg',
          name: "Duchess of the Frozen Dawn",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Anastasia becomes Duchess of the Frozen Dawn!");
      },
    },
  ],
  noblePhantasm: {
    name: "General Frost, Backup!",
    japaneseName: 'General Frost, Backup!',
    description: 'A frozen general summoned to bury the enemy in an endless winter.',
    rank: 'B+',
    effect: (ctx) => {
      ctx.log('Anastasia calls, General Frost, Backup!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.0, { label: 'General Frost' });
      applyStatus(ctx.enemy, {
        id: 'general-frost-chill',
        name: 'Frostbitten',
        kind: 'debuff',
        stat: 'atk',
        amount: -0.15,
        turnsRemaining: 2,
        description: '-15% Attack',
      });
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
  castoria,
  zhugeLiang,
  scathachSkadi,
  chenGong,
  anastasia,
];
