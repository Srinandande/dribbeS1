# Initial architecture decisions

Status: proposed; validate against the first playable prototype.

1. Use Phaser with TypeScript and Vite. The brief favors quick browser iteration and readable pixel sprites. Simulate the tilted elevated perspective in 2D; if a true rotating 3D camera becomes essential, revisit the engine before investing in content.
2. Keep world coordinates separate from screen projection. Use ground-plane collision bounds so visual perspective does not change gameplay rules.
3. Start with small modules: game scene, player/ball, street generation, skills, collision, scoring and NPC behavior. Introduce abstractions only as needed.
4. Define skill IDs, cooldowns, timing windows, eligibility and reward parameters as data; implement individual movement/animation behavior in small handlers.
5. Keep Hype and Heat distinct. Begin calm; only an explicit NPC event triggers the first chase.
6. Map keyboard input to game actions. Later, touch controls call the same actions.
7. Package the production web assets with Capacitor after the browser milestone. Test WebView performance, pause/resume, screen sizing and touch input on a real Android device before calling Android ready.

## Suggested source layout for implementation

- src/main.ts — application entry
- src/game/scenes/ — boot and run scenes
- src/game/entities/ — player, ball, NPC and obstacles
- src/game/systems/ — movement, skills, collision, Flow and chase
- src/game/content/ — move and obstacle definitions
- src/game/rendering/ — world-to-screen projection
- src/game/input/ — action mapping
- public/assets/ — original placeholder assets

## Android sequence

1. Complete and test the web build.
2. Install Capacitor core, CLI and Android packages at compatible versions.
3. Initialize the app with a chosen permanent application ID and web output directory `dist`.
4. Add the Android platform, rebuild web assets and synchronize them.
5. Open the generated Android project in Android Studio and test on a device.
6. Build a debug APK for testing; configure private signing credentials for a release APK. Never commit signing keys or passwords.

Android tooling versions must follow the Capacitor version selected at implementation time. APK packaging is not implemented in this planning export.
