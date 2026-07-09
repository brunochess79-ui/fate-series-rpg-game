# Holy Grail War

A Fate-series-inspired turn-based Servant battle game. Choose a Master and one of
90 Servants spanning the 7 classic classes (Saber, Archer, Lancer, Rider, Caster,
Assassin, Berserker) plus 7 extra classes (Ruler, Avenger, Shielder, Alter Ego,
Foreigner, Pretender, Beast) — including the full Fate/Zero lineup, most of
Fate/stay night and Fate/Grand Order's biggest names, and a handful of deep-cut
fan favorites — and fight it out with Attacks, Skills, Noble Phantasms, and
Command Spells. The Servant picker has a class filter to make browsing the
roster easy, and every ability has an expandable description in battle.

## Modes

- **Local Battle (2 Players)** — hot-seat play on one device, each player picks
  their own Master name and Servant.
- **Battle a Rival Master (vs AI)** — play solo against a CPU-controlled Master.
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
- Every Master starts with 3 Command Spells, usable once each, to heal (+25%
  HP) or guarantee a critical hit. The healing Command Spell can't be used
  two rounds in a row.
- Reduce the opposing Servant's HP to 0 to win the Holy Grail War.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

Built with React, TypeScript, and Vite.
