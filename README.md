# Chess Trainer Starter

A minimal **chess trainer** starter kit built with Vite + React + TypeScript. It includes a puzzle trainer, local spaced-repetition, unit tests with Vitest, linting with ESLint, and CI via GitHub Actions.

## Features
- React + TypeScript + Vite
- Chess logic with `chess.js`
- Drag-and-drop board with `react-chessboard`
- Local spaced repetition (SM-2–style, saved in `localStorage`)
- Sample puzzles (`puzzles/sample.json`)
- Vitest unit tests
- ESLint + Prettier
- GitHub Actions CI (install, lint, test, build)

## Quick start
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run test` — run unit tests (Vitest)
- `npm run lint` — run ESLint
- `npm run format` — format with Prettier

## Project structure
```
.
├─ src/
│  ├─ components/
│  │  └─ Board.tsx
│  ├─ lib/
│  │  ├─ chess.ts
│  │  └─ sm2.ts
│  ├─ tests/
│  │  └─ chess.test.ts
│  ├─ App.tsx
│  └─ main.tsx
├─ puzzles/
│  └─ sample.json
├─ public/
│  └─ favicon.svg
├─ .github/workflows/ci.yml
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ eslint.config.js
└─ README.md
```

## Puzzle format
Each puzzle object:
```json
{
  "id": "p1",
  "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/1bP5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 2 3",
  "solution": ["a2a3", "b4d2", "d1d2"], 
  "rating": 800,
  "tags": ["opening tactic"]
}
```
- `fen`: starting position.
- `solution`: minimal move sequence in UCI (lowercase files, e.g. `e2e4`). Your move is first.
- Add your own files under `puzzles/` and point the app to them.

## Notes
- For production data or syncing, swap the `localStorage` store in `sm2.ts` for an API.
- For end-to-end tests, add Playwright; CI is ready to extend.
