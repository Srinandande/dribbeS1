# Dribble Streets

A street-sports runner where you don't just dodge the world — you dribble through it.

## Status

Project planning export. The original game brief is preserved in `docs/GAME_BRIEF.md`. No playable game or Android APK is included yet.

## Proposed stack

- Phaser + TypeScript for a browser-first 2D game.
- Vite for development and static production builds.
- Capacitor for Android packaging after the browser prototype is playable.
- Android Studio, Android SDK and compatible JDK for APK builds.

The elevated behind-player view will be simulated with sprite positioning, scaling and depth sorting. Phaser does not provide a true 3D camera. Validate this perspective with player and ball movement before building out the street.

## First milestone

One character, one football, one street, continuous forward travel, unrestricted lateral movement, visible dribbling, keyboard input and restart. Then add hazards, skill interactions, Flow scoring and one event-triggered chase.

See `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `BACKLOG.md`.

## Repository

https://github.com/Srinandande/dribbeS1

Clone the project:

```sh
git clone https://github.com/Srinandande/dribbeS1.git
cd dribbeS1
```

This repository currently contains the project brief and development plan. Game implementation is the next milestone.

## Tooling and plugins

The GitHub ChatGPT integration is useful for repository work. Phaser, Vite, TypeScript and Capacitor are project dependencies, not ChatGPT plugins. No Figma, Canva, Base44 or paid hosting integration is required for the prototype.

References: https://docs.phaser.io/phaser/getting-started/what-is-phaser and https://capacitorjs.com/docs/android
