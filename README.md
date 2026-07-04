# Holy Grail War

A Fate-series-inspired turn-based Servant battle game. Choose a Master and one of
30 Servants — including the full Fate/Zero lineup (Artoria Pendragon, Gilgamesh,
Cú Chulainn, Iskandar, Gilles de Rais, Hassan-i Sabbah, Lancelot) alongside 23
more spanning Saber, Archer, Lancer, Rider, Caster, Assassin, and Berserker —
and fight it out with Attacks, Skills, Noble Phantasms, and Command Spells.
The Servant picker has a class filter to make browsing the roster easy, and
every ability has an expandable description in battle.

## Modes

- **Local Battle (2 Players)** — hot-seat play on one device, each player picks
  their own Master name and Servant.
- **Battle a Rival Master (vs AI)** — play solo against a CPU-controlled Master.

## Gameplay

- Each round, both Masters choose their move without seeing the other's
  choice. In hot-seat play, one player locks in their move, then a "pass the
  device" screen hides it before the other player chooses; both moves are
  revealed and resolved together. Neither player can win just by acting
  "first" — both moves always play out in full.
- If both Servants are defeated in the same round, the one who took the
  lesser blow (less-negative HP — e.g. -12 beats -28) wins the Grail's favor;
  an exact tie in overkill falls back to the higher Luck stat.
- A hit that's fully evaded or fully absorbed by a shield deals no net damage
  and grants no Noble Phantasm gauge to the attacker.
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
