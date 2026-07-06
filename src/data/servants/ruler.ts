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
  rank: 'B+',
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
  ],
  noblePhantasm: {
    name: 'La Pucelle: Flag of the Crusade',
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

export const RULER_SERVANTS: ServantDefinition[] = [jeanne];
