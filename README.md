# Holy Grail War

A Fate-series-inspired turn-based Servant battle game. Choose a Master and one of
100 Servants spanning the 7 classic classes (Saber, Archer, Lancer, Rider, Caster,
Assassin, Berserker) plus extra classes (Ruler, Avenger, Shielder, Alter Ego,
Foreigner, Pretender, Moon Cancer) — including the full Fate/Zero lineup, most of
Fate/stay night and Fate/Grand Order's biggest names, and a handful of deep-cut
fan favorites — and fight it out with Attacks, Skills, Noble Phantasms, and
Command Spells. The Servant picker has a class filter to make browsing the
roster easy, and every ability has an expandable description in battle.

## Modes

- **Local Battle (2 Players)** — hot-seat play on one device, each player picks
  their own Master name and Servant.
- **Battle a Rival Master (vs AI)** — play solo against a CPU-controlled Master.
  Pick an AI difficulty on the setup screen (see below), and choose whether your
  own Servant(s) and the rival's are picked by you or drawn at random — handy for
  practicing a specific matchup.
- **2v2 Team Battle (2 Players / vs AI)** — each Master fields two Servants that
  fight at the same time. Every round both Servants act, offensive moves pick a
  target on the enemy team, and a Master loses only when both of their Servants
  have fallen.

## Gameplay

- Each round, both Masters choose their move without seeing the other's
  choice. In hot-seat play, one player locks in their move, then a "pass the
  device" screen hides it before the other player chooses; both moves are
  revealed and resolved together. Neither player can win just by acting
  "first" — both moves always play out in full.
- If both Servants are defeated in the same round, the one who took the
  lesser blow (less-negative HP — e.g. -12 beats -28) wins the Grail's favor.
  If they took the exact same blow, it's a draw.
- Every hit has a chance to be dodged entirely: a small baseline chance for
  anyone, nudged up or down by the Agility gap between the two Servants
  (capped so a big Agility edge is never a guaranteed dodge). A hit that's
  dodged, evaded, or fully absorbed by a shield deals no net damage and
  grants no Noble Phantasm gauge to the attacker.
- Each Servant has 3 unique Skills (with cooldowns) and one Noble Phantasm that
  unlocks once its gauge reaches 100%.
- Every Master has 3 Command Spells in total (shared by a 2v2 team), used to
  heal (+25% max HP) or make the next plain Attack a guaranteed critical hit.
  Only one can be used per round, and never two rounds in a row.
- Shields absorb damage only during the round they are cast (Lord Camelot's
  lasts that round and the next).
- Reduce the opposing Servant's HP to 0 to win the Holy Grail War.

## AI difficulty

Against the AI (1v1 or 2v2) you choose how well the rival plays:

- **Easy** — plays badly on purpose: it wastes heals while healthy, sometimes
  holds back a fully charged Noble Phantasm, aims at your healthiest Servant,
  never uses Command Spells, and plays each Servant with the options that
  measurably lose that Servant the most matchups.
- **Normal** — simple rules: heal when hurt, otherwise buff, debuff or attack,
  and fire the Noble Phantasm when charged.
- **Hard** — plays each Servant's best-known line (found by testing options
  against the whole roster): skipping weak skills, timing heals, setting up
  guaranteed crits before the Noble Phantasm, and shielding when you are about
  to fire yours.

In a battery of simulated fights across the roster, Hard beats Normal about
83% of the time, Normal beats Easy about 73%, and Hard beats Easy about 95%.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

Built with React, TypeScript, and Vite.
