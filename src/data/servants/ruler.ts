import type { ServantDefinition } from '../../types';
import { applyStatus } from '../../engine/status';

const jeanne: ServantDefinition = {
  id: 'jeanne',
  name: "Jeanne d'Arc",
  title: 'The Holy Maiden of Orléans',
  className: 'Ruler',
  trueName: "Jeanne d'Arc",
  maxHp: 1300,
  atk: 85,
  def: 70,
  agility: 65,
  critChance: 0.08,
  rank: 'B',
  strengths: ['Regeneration', 'Shielding'],
  weaknesses: ['Low Crit Rate'],
  passiveDescription: 'A saint who hears the voice of God, mediating the Grail War with mercy for all sides.',
  skills: [
    {
      id: 'protection-of-the-faith',
      name: 'Protection of the Faith',
      description:
        "Divine grace wards her from harm. Grants a shield that absorbs damage equal to 18% of her max HP, lasting this turn and the next.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'buff',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'protection-of-the-faith',
          name: 'Protection of the Faith',
          kind: 'shield',
          potency: Math.round(ctx.self.maxHp * 0.18),
          turnsRemaining: 1,
          description: 'Absorbs damage until depleted',
        });
        ctx.log("Jeanne d'Arc is warded by the Protection of the Faith!");
      },
    },
    {
      id: 'luminosite-eternelle',
      name: 'Luminosité Éternelle',
      description: "The saint's undying light. Recovers 8% max HP at the start of each of her next 3 turns.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'luminosite-eternelle-regen',
          name: 'Luminosité Éternelle',
          kind: 'regen',
          potency: Math.round(ctx.self.maxHp * 0.08),
          turnsRemaining: 3,
          description: 'Recovers 8% max HP per turn',
        });
        ctx.log("Jeanne d'Arc calls upon Luminosité Éternelle.");
      },
    },
    {
      id: 'revelation',
      name: 'Revelation',
      description: "A voice from God parts the fog of war. Clears all of her own debuffs and curses.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'utility',
      effect: (ctx) => {
        const cleared = ctx.self.statuses.some((s) => s.kind === 'debuff' || s.kind === 'dot');
        ctx.self.statuses = ctx.self.statuses.filter((s) => s.kind !== 'debuff' && s.kind !== 'dot');
        ctx.log(
          cleared
            ? "Jeanne d'Arc receives a Revelation, casting off every affliction!"
            : "Jeanne d'Arc receives a Revelation, but no affliction yet clings to her.",
        );
      },
    },
    {
      id: 'voice-of-the-saints',
      name: "The Voice of the Saints",
      description: "The voices that guided her since childhood speak again, louder than ever. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'voice-of-the-saints-atk',
          name: "The Voice of the Saints",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'voice-of-the-saints-def',
          name: "The Voice of the Saints",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'voice-of-the-saints-dmg',
          name: "The Voice of the Saints",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Jeanne d'Arc hears The Voice of the Saints!");
      },
    },
  ],
  noblePhantasm: {
    name: "La Pucelle: Flag of the Crusade",
    japaneseName: 'La Pucelle',
    description: 'A banner raised high, rallying courage and smiting the wicked in one motion.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log("Jeanne d'Arc raises La Pucelle: Flag of the Crusade!");
      ctx.dealDamage(ctx.self, ctx.enemy, 2.9, { label: 'Flag of the Crusade' });
      const healed = Math.round(ctx.self.maxHp * 0.15);
      ctx.self.hp = ctx.self.hp + healed;
      ctx.log(`Jeanne d'Arc recovers ${healed} HP, borne up by her own faith.`);
    },
  },
};

const amakusa: ServantDefinition = {
  id: 'amakusa',
  name: 'Amakusa Shirou',
  title: 'The Priest of Tempering Blades',
  className: 'Ruler',
  trueName: 'Amakusa Shirou Tokisada',
  maxHp: 1250,
  atk: 95,
  def: 75,
  agility: 62,
  critChance: 0.12,
  rank: 'B+',
  strengths: ['Evasion', 'Debuffs'],
  weaknesses: ['Low Attack'],
  passiveDescription: 'A saintly boy-priest, gentle to allies and merciless to those who prey on the weak.',
  skills: [
    {
      id: 'imaginary-number-body',
      name: 'Imaginary Number Body',
      description: "A body given form through faith alone. Grants self a full dodge next turn.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'utility',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'imaginary-number-body',
          name: 'Imaginary Number Body',
          kind: 'evade',
          turnsRemaining: 1,
          description: 'Will evade the next attack',
        });
        ctx.log('Amakusa Shirou turns his body to Imaginary Numbers!');
      },
    },
    {
      id: 'sea-of-miracles',
      name: 'Sea of Miracles',
      description: 'A miracle beyond reason. Heals self for 20% max HP.',
      cooldown: 5,
      npGainSelf: 20,
      tag: 'heal',
      effect: (ctx) => {
        const healed = Math.round(ctx.self.maxHp * 0.2);
        ctx.self.hp = ctx.self.hp + healed;
        ctx.log(`Amakusa Shirou calls upon a Sea of Miracles, healing ${healed} HP.`);
      },
    },
    {
      id: 'blessing-of-the-kingdom',
      name: 'Blessing of the Kingdom of God',
      description: "A quiet rebuke that saps the enemy's will. Lowers enemy Attack by 20% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'blessing-of-the-kingdom',
          name: 'Blessing of the Kingdom of God',
          kind: 'debuff',
          stat: 'atk',
          amount: -0.2,
          turnsRemaining: 3,
          description: '-20% Attack',
        });
        ctx.log('Amakusa Shirou pronounces the Blessing of the Kingdom of God!');
      },
    },
    {
      id: 'undying-faith-of-amakusa',
      name: "The Undying Faith of Amakusa",
      description: "The conviction of thirty-seven thousand martyrs settles onto his shoulders. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'undying-faith-of-amakusa-atk',
          name: "The Undying Faith of Amakusa",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'undying-faith-of-amakusa-def',
          name: "The Undying Faith of Amakusa",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'undying-faith-of-amakusa-dmg',
          name: "The Undying Faith of Amakusa",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Amakusa Shirou channels The Undying Faith of Amakusa!");
      },
    },
  ],
  noblePhantasm: {
    name: "Perfect Nirvana",
    japaneseName: 'Kanzen Naru Nyorai Nehan',
    description: 'A wave of absolute peace that leaves nothing standing in its path.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Amakusa Shirou invokes Perfect Nirvana!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.4, { label: 'Perfect Nirvana' });
    },
  },
};

const sherlock: ServantDefinition = {
  id: 'sherlock',
  name: 'Sherlock Holmes',
  title: "The World's Greatest Detective",
  className: 'Ruler',
  trueName: 'Sherlock Holmes',
  maxHp: 1200,
  atk: 100,
  def: 65,
  agility: 70,
  critChance: 0.15,
  rank: 'A',
  strengths: ['Critical Strikes', 'Debuffs'],
  weaknesses: ['No Self-Heal'],
  passiveDescription: 'A detective whose deductions cut deeper than any blade, exposing every flaw.',
  skills: [
    {
      id: 'insight',
      name: 'Insight',
      description: 'A glance reveals every weak point. Raises own Crit Chance by 18% for 3 turns.',
      cooldown: 4,
      npGainSelf: 20,
      tag: 'crit',
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'insight',
          name: 'Insight',
          kind: 'buff',
          stat: 'critChance',
          amount: 0.18,
          turnsRemaining: 3,
          description: '+18% Crit Chance',
        });
        ctx.log("Sherlock Holmes deduces the enemy's weak points with Insight!");
      },
    },
    {
      id: 'science-of-deduction',
      name: 'The Science of Deduction',
      description: "Every flaw in the enemy's stance, laid bare. Lowers enemy Defense by 22% for 3 turns.",
      cooldown: 4,
      npGainSelf: 20,
      tag: 'debuff',
      effect: (ctx) => {
        applyStatus(ctx.enemy, {
          id: 'science-of-deduction',
          name: 'The Science of Deduction',
          kind: 'debuff',
          stat: 'def',
          amount: -0.22,
          turnsRemaining: 3,
          description: '-22% Defense',
        });
        ctx.log('Sherlock Holmes exposes a flaw with the Science of Deduction!');
      },
    },
    {
      id: 'bartitsu',
      name: 'Bartitsu',
      description: "A gentleman's martial art, applied with surgical precision. Deals a bonus strike.",
      cooldown: 5,
      npGainSelf: 20,
      tag: 'utility',
      dealsDamage: true,
      effect: (ctx) => {
        ctx.log('Sherlock Holmes strikes with Bartitsu!');
        ctx.dealDamage(ctx.self, ctx.enemy, 1.4, { label: 'Bartitsu' });
      },
    },
    {
      id: 'greatest-detective-alive',
      name: "The Greatest Detective Alive",
      description: "Every clue, every deduction, every case ever solved converges on this single moment. Raises own Attack by 20%, Defense by 15%, and damage dealt by 15% for 3 turns.",
      cooldown: 0,
      npGainSelf: 20,
      tag: 'buff',
      oneTimeUse: true,
      effect: (ctx) => {
        applyStatus(ctx.self, {
          id: 'greatest-detective-alive-atk',
          name: "The Greatest Detective Alive",
          kind: 'buff',
          stat: 'atk',
          amount: 0.2,
          turnsRemaining: 3,
          description: '+20% Attack',
        });
        applyStatus(ctx.self, {
          id: 'greatest-detective-alive-def',
          name: "The Greatest Detective Alive",
          kind: 'buff',
          stat: 'def',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% Defense',
        });
        applyStatus(ctx.self, {
          id: 'greatest-detective-alive-dmg',
          name: "The Greatest Detective Alive",
          kind: 'buff',
          stat: 'damage',
          amount: 0.15,
          turnsRemaining: 3,
          description: '+15% damage dealt',
        });
        ctx.log("Sherlock Holmes becomes The Greatest Detective Alive!");
      },
    },
  ],
  noblePhantasm: {
    name: "The Vanished People",
    japaneseName: 'The Vanished People',
    description: 'A truth so absolute it erases every possibility but one: defeat.',
    rank: 'A',
    effect: (ctx) => {
      ctx.log('Sherlock Holmes reveals The Vanished People!');
      ctx.dealDamage(ctx.self, ctx.enemy, 3.5, { label: 'The Vanished People' });
    },
  },
};

export const RULER_SERVANTS: ServantDefinition[] = [jeanne, amakusa, sherlock];
