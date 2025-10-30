# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project type: React (Create React App) SPA with React Router, TailwindCSS, and Socket.IO client.

Common commands
- Install deps
```bash path=null start=null
npm install
```
- Start dev server (CRA on http://localhost:3000)
```bash path=null start=null
npm start
```
- Run tests (Jest via react-scripts; no tests currently in repo)
```bash path=null start=null
npm test
# Single test by name/pattern
npm test -- -t "pattern"
# Single file (pattern match)
npm test -- src/some/File.test.js
```
- Build production bundle
```bash path=null start=null
npm run build
```
Notes on linting
- No standalone lint script; CRA runs ESLint during start/build. If you add custom linting, define an npm script (e.g., "lint").

Architecture overview
- Entry and composition
  - `src/index.js` bootstraps React 18 root, wraps `App` with `BrowserRouter` and `ContextAPIProvider` for simple global state.
  - `src/App.js` declares all routes (React Router v6). Notable paths: `/play/quick`, `/play/double`, `/play/double/roomId/:roomId`, `/menu`, `/test`.
- State/context
  - `src/utils/ContextAPI.js` provides a minimal context with `name` and `setName` for player identity.
- Game logic (Tic-Tac-Toe)
  - Winning patterns in `src/utils/Patterns.js` are reused across modes.
  - Local two-player drag/drop demo in `src/games/DoublePlayer.jsx` and `src/menu/Demo.jsx` manipulates DOM to drop X/O into `.dropBox` nodes and checks wins via `Patterns`.
- Multiplayer and networking
  - Socket.IO client initialized in `src/App.js` with `io.connect("http://localhost:5000")` and passed into routes.
  - `src/menu/Quick.jsx` and `src/menu/Multiplayer.jsx` orchestrate room join/create, drag/drop synchronization, and basic turn flow via Socket.IO events (`quickPlayFind`, `drop`, `endTurn`, etc.).
  - `src/mode/Double.jsx` implements a grid-click multiplayer variant using `socket.emit("play", { id, roomId, name })` and listens for `updateGame`.
  - A sample Node/Socket.IO server exists at `src/menu/ppserver.js` (listens on port 3001) but the client points to port 5000. You must run a compatible server on 5000 or update the client URL.
- UI and pages
  - High-level pages under `src/pages/` (`Home`, `Mode`, `Game`, etc.), with feature components in `src/components/`. Tailwind utilities are used alongside `.css/.scss` files in `src/styles/`.
- Styling
  - Tailwind configured in `tailwind.config.js` with `content: ["./src/**/*.{js,jsx,ts,tsx}"]`. Global styles in `src/index.css` plus component/feature styles.
- Environment
  - `.env` sets `GENERATE_SOURCEMAP=false` for smaller builds.
- Deployment
  - SPA redirect file `netilify.toml` in root appears intended for Netlify redirects, but the conventional filename is `netlify.toml` and the redirect rule should target `/* -> / index.html`.
- Dependencies of note
  - Solana wallet adapter libs and `boardgame.io` are present but not referenced in the current code paths.

Backend/server expectations
- Multiplayer features require a Socket.IO backend not included here. By default the client expects `http://localhost:5000`. To experiment with the sample:
```bash path=null start=null
# Runs example Socket.IO server on 3001 (adjust client URL if needed)
node src/menu/ppserver.js
```

Repository conventions and caveats
- Package manager: README uses npm; both `package-lock.json` and `yarn.lock` exist—prefer npm to avoid conflicts.
- Tests: `react-scripts test` is configured, but this repo contains no `*.test.js` files yet.
- Unused/placeholder files: `src/utils/ProtectedRoutes.jsx`, several files in `src/menu/` (e.g., jQuery-based examples) are exploratory and not wired into routes.
