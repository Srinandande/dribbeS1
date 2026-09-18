# Development milestones

## 1 — Core feel
- [ ] Initialize Phaser, TypeScript and Vite; lock dependency versions.
- [ ] Establish elevated pseudo-3D perspective.
- [ ] Continuous progression and smooth lateral motion across road and sidewalk.
- [ ] Visible ball touches and original placeholder player art.
- [ ] Keyboard input and restart.

Acceptance: movement and the ball remain readable at normal speed; no lane snapping.

## 2 — Playable street
- [ ] Repeating street chunks with bounded entity counts.
- [ ] Pedestrians, cones, a ground hazard and parked vehicles.
- [ ] Collision slowdowns and recovery.
- [ ] Score, run end and restart loop.

Acceptance: several minutes of play without unbounded spawning or unavoidable obstacle walls.

## 3 — Dribble identity
- [ ] Sharp cut or feint.
- [ ] Roulette/spin.
- [ ] Contextual nutmeg.
- [ ] Contextual wall pass if feasible.
- [ ] Flow rewards with repetition penalty.
- [ ] One event-triggered annoyed pedestrian chase.

Acceptance: successful skills require timing/position, variety earns more than spam, and runs begin without a chaser.

## 4 — Mobile and Android
- [ ] Touch controls through the shared action map.
- [ ] Responsive layout and device performance checks.
- [ ] Capacitor Android project and debug APK.
- [ ] Device testing of input, pause/resume, audio and offline assets.

After each meaningful change: build/type-check, exercise affected gameplay manually, and add focused logic tests where they protect collision or scoring behavior.
