# Dribble Streets — First Touch

A street-sports runner where you don't just dodge the world — you dribble through it.

## Play locally

Use Node.js 22.18+ (or Node.js 24) and npm:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Run `npm run build` for a static production build in `dist/`, `npm run preview` to serve that build, and `npm test` for gameplay logic tests.

For a single HTML file that opens directly in a desktop browser, run `npm run standalone` and open `dist/Dribble-Streets.html`.

## Validation

The production build/type-check and six simulation tests pass. Automated visual/input browser checks could not run because Chromium could not launch in the build environment; real browser playtesting remains required. GitHub Actions repeats the logic tests and production build on pushes and pull requests.

## Controls

| Action | Keyboard |
| --- | --- |
| Move freely | Left/right arrows or A/D |
| Sharp cut | Hold a direction + Shift |
| Roulette/spin | Space |
| Nutmeg | E, aligned with a nearby pedestrian |
| Wall pass | Q, near either edge |
| Pause/resume | P or pause button |
| Start/restart | Onscreen button or Enter |

Touch buttons appear on mobile. Three collisions end the run; hits briefly slow you down. Spin beats cones and pedestrians, but cannot pass through parked cars or ground hazards. Mix successful skills to build Flow. A nutmegged pedestrian starts a chase; clean running lets you escape. Empty spins do not earn points. Best score is stored on the current device where browser storage is available.

## Implemented

- Phaser 3, TypeScript and Vite, using original geometric pixel-style art.
- Elevated pseudo-3D projection with unrestricted road/sidewalk movement.
- Visible dribbling, four skills, contextual timing, cooldowns and repetition penalties.
- Streamed street scenery, pedestrians, cones, parked cars and manholes.
- Collision recovery, score/Flow, event-triggered chase, game over and restart.
- Responsive page, touch input and automatic pause on lost focus.

## Architecture

`src/model.ts` contains the testable world simulation and skill configuration. `src/main.ts` handles Phaser rendering and input. `src/style.css` and `index.html` provide the responsive shell. World positions and collisions are independent of the perspective projection. Entity counts stay bounded as the street streams past.

## Known prototype limits

No sound, authored sprite animations, friendly give-and-go NPCs or full crowd behavior yet. The ball's skill animation is visual; contact outcomes are evaluated by the world simulation. Hype is represented by Flow and successful skill count; richer Hype reactions remain deferred. Chase behavior is intentionally simple. Android packaging and real-device performance testing are still pending.

## Android next

After playtesting, add Capacitor with `dist` as its web directory, choose a permanent application ID, generate the Android project, and test it in Android Studio. Touch controls already share the keyboard action interface. No APK is claimed or included in this milestone.

Original requirements: `docs/GAME_BRIEF.md`. Architecture: `docs/ARCHITECTURE.md`. Deferred scope: `BACKLOG.md`.
