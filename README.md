# Holy Grail War

A Fate-series-inspired turn-based Servant battle game. Choose a Master and one of
seven Servants — Saber, Archer, Lancer, Rider, Caster, Assassin, or Berserker —
and fight it out with Attacks, Skills, Noble Phantasms, and Command Spells.

## Modes

- **Local Battle (2 Players)** — hot-seat play on one device, each player picks
  their own Master name and Servant.
- **Battle a Rival Master (vs AI)** — play solo against a CPU-controlled Master.

## Gameplay

- Each Servant has 3 unique Skills (with cooldowns) and one Noble Phantasm that
  unlocks once its gauge reaches 100%.
- Every Master starts with 3 Command Spells, usable once each, to heal, guarantee
  a critical hit, or instantly charge the Noble Phantasm gauge.
- Reduce the opposing Servant's HP to 0 to win the Holy Grail War.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

Built with React, TypeScript, and Vite.
