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

- **Training: Learn a Servant's Best Line** — pick a Servant and a practice
  opponent and a coach recommends the best move each round, with the reason. After
  you choose it tells you whether you matched the best line, and a summary at the
  end scores you. For 20 Servants the coach teaches a line that testing found
  beats the standard Hard-bot line; every other Servant is taught the standard best
  line. (The Hard AI itself still plays the standard line.)

- **Watch: Perfect AI vs Perfect AI** — choose (or randomly draw) a Servant for each
  side. Every round both bots' full action menus are shown (every skill with its
  cooldown, description, NP gauge and Command Spells) with the move each locked in
  highlighted and the reason for it. Press "Play out round" to resolve it and read the
  log, or tick Auto-play with a delay between rounds. "Watch Another" re-draws any
  random picks.

## Gameplay

- A Servant that lost its action to a stun can't be stunned again the next round (a delayed stun that would land right after one is shrugged off).

- Servants with the top base crit chance (15%) have their Noble Phantasm damage reduced by 10%.

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
- A stun cast by a Skill takes hold in the same round: the stunned Servant loses its
  action that round, even a fully charged Noble Phantasm. (A stun from a Noble
  Phantasm lands alongside its damage and takes effect the following round.)
- Each Servant has 3 unique Skills (with cooldowns) and one Noble Phantasm that
  unlocks once its gauge reaches 100%.
- Every Master has 3 Command Spells in total (shared by a 2v2 team), used to
  heal (+25% max HP) or make the next plain Attack a guaranteed critical hit.
  Only one can be used per round, and never two rounds in a row.
- Shields absorb damage only during the round they are cast (Lord Camelot's
  lasts that round and the next).
- Reduce the opposing Servant's HP to 0 to win the Holy Grail War.

## Servant ratings

Each Servant's rating letter (C to A+) comes from a full round-robin tournament
in which every Servant fights every other, each playing its best line (the
verified-better line where one was found). Scoring works in two steps:

1. Rank every Servant by head-to-head wins alone. The top 15 of that ranking
   become the benchmark group.
2. Count each Servant's record against the benchmark group, out of 15. A member
   of the group cannot face itself, so it is credited 0.5 (a draw with itself) in
   place of that missing matchup. Beating the group more than 5 times earns a
   bonus that grows with each extra win: 1, 3, 6, 10, 15, 21... points for 6, 7,
   8, 9, 10, 11... wins.

The score is wins plus that bonus. Letters are handed out by score (top 20 are
A+, then 22 A, 22 B+, 20 B, 10 C+, 6 C), and a Servant tied with or half a point
behind the last Servant of the next letter up is rounded up. Every tournament is
scored this way.

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
