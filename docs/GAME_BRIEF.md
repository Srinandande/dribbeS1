I want you to act as the lead game developer/product engineer and build the first playable prototype of a game called **Dribble Streets**.

Do not try to build the full future vision immediately. Work iteratively and prioritize getting a genuinely playable core loop running as quickly as possible. Make sensible technical decisions yourself instead of repeatedly asking me minor implementation questions. Explain major architectural/design decisions when they matter.

# GAME CONCEPT

Dribble Streets is a street-sports endless runner built around **skillful dribbling**, rather than simply avoiding obstacles.

Think of the forward-running accessibility of an endless runner such as Subway Surfers, but with a **higher, slightly top-down behind-the-player camera** so the player, ball, nearby NPCs, feet/hands and lateral dribbling movements are clearly visible.

The player continuously travels forward through a living urban street while controlling either a football/soccer ball or, eventually, a basketball.

The player is NOT restricted to three lanes.

The playable space includes:

- road
- sidewalk
- spaces between parked vehicles
- gaps between pedestrians
- areas beside shops/stalls
- eventually alleys, plazas, markets, parks, courtyards, etc.

The key idea is:

**You don't just dodge the street. You dribble through it.**

# CORE GAMEPLAY

The player should be able to move left/right fluidly while progressing forward and maintaining control of the ball.

Skill moves are central to the game.

Eventually I want a large library of recognizable football and basketball dribbling techniques, but the first prototype should contain only enough moves to prove that this system is fun.

For the initial FOOTBALL prototype, prioritize:

1. normal left/right dribbling
2. sharp left/right cut
3. body feint / simple skill
4. roulette/spin
5. nutmeg
6. wall pass / give-and-go

The system must be designed so many more moves can be added later without rewriting the core game.

Future football possibilities include:

- stepovers
- scissors
- elastico/flip-flap
- Cruyff-style turn
- drag-back
- heel-to-heel
- ball roll
- chop
- fake shot
- rainbow/flick
- juggling transitions
- different nutmegs
- contextual wall passes
- combinations of moves

Future basketball moves can include:

- crossover
- between-the-legs
- behind-the-back
- spin
- hesitation
- in-and-out
- double crossover
- snatch-back
- wrap-around
- contextual bounce passes
- combinations

Do NOT implement all of these now. Architect the move system so they can eventually be added as data/configuration plus animation/behavior rather than hardcoding the entire game around the first few moves.

# CONTEXTUAL SKILLS

Skills should interact with the environment.

Examples:

Pedestrian ahead + correct positioning/timing → player can attempt a nutmeg.

Wall beside player + correct angle → wall-pass opportunity.

Traffic cones → player can simply avoid them OR slalom through them for additional style/combo points.

Obstacle → beginner can dodge it, while an advanced player may use a skill move around/over it.

Important design principle:

**Most obstacles should eventually have a safe/boring solution and a more difficult stylish solution.**

# FLOW / COMBO SYSTEM

Reward varied, stylish play.

Example:

Ball Roll → Nutmeg → Wall Pass → Roulette → Near Miss

could create:

FLOW x5

Repeatedly spamming the same move should give diminishing rewards.

Variety, timing, risk and clean execution should increase Flow.

Higher Flow can eventually affect:

- score multiplier
- speed
- music intensity
- crowd reactions
- visual effects
- special opportunities

For the prototype, implement a simple version that clearly demonstrates the concept.

# STREET WORLD

The street should feel alive rather than being an empty obstacle track.

The player can travel on BOTH road and sidewalk.

Possible environmental objects:

- parked cars
- occasional moving cars
- bicycles
- traffic cones
- potholes
- manholes
- puddles
- benches
- bins
- street signs
- construction barriers
- food stalls
- café tables
- shop fronts

NPC/environmental life can eventually include:

- normal pedestrians
- people carrying food/groceries
- people sitting
- street vendors
- cyclists
- people walking dogs
- cats relaxing near shops
- pigeons
- children
- street musicians
- football/basketball fans
- people who stop and watch
- people who cheer after impressive skills
- people filming the player

For the MVP, use only enough variety to make the street visibly alive.

# CHASE SYSTEM

IMPORTANT: the run should NOT begin with someone automatically chasing the player.

The beginning should feel relatively calm.

Chases emerge dynamically because of events.

Examples:

- nutmeg an easily annoyed NPC → they may chase
- disturb a street dog → dog may chase
- interfere with a cyclist → cyclist may chase
- cause chaos near a shop → shopkeeper may chase
- sufficiently high chaos/Heat → police may notice and chase

Different chasers should eventually behave differently.

Examples:

Dog:
fast bursts, agile, can use sidewalk.

Angry pedestrian:
slower but may throw objects.

Cyclist:
fast on open road, weaker through crowds/narrow spaces.

Police:
more persistent and associated with higher Heat.

For the prototype, implement ONE simple chase type first, but architect it so additional chaser behaviors can be added.

# THROWN OBJECTS

Some angry NPCs/chasing characters may eventually throw harmless/cartoonish objects such as:

- newspaper
- paper cup
- food
- cake
- soft objects
- water

Getting hit should generally NOT immediately end the run.

Instead:

HIT → temporary slowdown → Flow/combo endangered → chaser gains distance.

Keep the tone playful/cartoonish.

# NPC INTERACTIONS

Not every NPC is an obstacle.

NPCs can be:

- neutral
- friendly
- cheering
- interactive
- defenders/challenges
- annoyed
- chasing

Some NPCs may offer contextual interactions.

Example:

Player passes football to an NPC → NPC returns it ahead → GIVE & GO bonus.

A child might return a loose ball.

A fan might cheer after a difficult skill.

A skilled street player might act briefly like a defender who can be beaten using a skill.

These systems are future-facing; only implement what is necessary for the first prototype.

# HYPE AND HEAT

Design the game with two separate concepts in mind:

**HYPE** = how impressive/entertaining the player's run is.

**HEAT** = how much chaos/negative attention the player has generated.

High Hype:

- cheering
- people watching
- phones coming out
- larger reactions
- bigger Flow opportunities

High Heat:

- angry NPCs
- projectiles
- dogs/chasers
- eventually police
- more chaotic situations

A player should eventually be able to have:

HIGH HYPE + LOW HEAT

or

HIGH HYPE + HIGH HEAT

These systems do not need full implementation in the earliest prototype, but structure the code so they can be added cleanly.

# VISUAL DIRECTION

For the first version, deliberately use a simple **retro pixel-art / 32-bit-era-inspired aesthetic**.

Do NOT spend excessive development time on high-quality assets yet.

Use simple original placeholder/pixel assets where necessary.

The important things are:

- readable player
- clearly visible ball
- readable NPCs
- readable obstacles
- clear road/sidewalk boundaries
- satisfying movement
- satisfying skill feedback

The camera should be:

**behind player + elevated + noticeably tilted downward**

rather than pure top-down or pure third-person.

I need to see enough of the player and ball that football dribbling animations such as left/right touches, nutmegs and spins remain visually satisfying.

# PLATFORM

FIRST TARGET:

**Browser playable game.**

It should run locally in a modern browser and ultimately be deployable as a simple web build.

SECOND TARGET:

Android APK.

Do not prioritize APK packaging until the browser prototype works well, but avoid architectural decisions that unnecessarily make Android packaging difficult later.

Choose the engine/framework you think best supports:

- browser-first development
- 2D/2.5D gameplay
- this camera/perspective
- lots of entities
- animation
- future Android deployment
- fast iteration

Phaser or Godot are possibilities, but choose based on the actual requirements rather than blindly following that suggestion.

# FUTURE VISION — DO NOT BUILD YET

If the prototype proves fun, I eventually want Dribble Streets to grow into a much richer game with:

- substantially improved graphics
- different cities/neighborhoods
- different environmental behavior by location
- football mode
- basketball mode
- many playable characters
- large skill-move libraries
- different balls
- costumes
- shoes
- cosmetics
- character-specific animation styles
- challenges
- leaderboards
- achievements
- progression
- unlockable skills
- seasonal events
- limited-time locations
- original street characters
- influencer/athlete cameos
- licensed characters where appropriate
- branded balls
- branded clothing/shoes
- brand integrations
- sponsored street events
- live-ops

Do not let this future scope contaminate the MVP.

# FIRST PLAYABLE MVP

I want the first meaningful milestone to be approximately:

**One character + one football + one street + basic NPCs/obstacles + several satisfying skill interactions.**

It should include:

- continuous forward progression
- smooth left/right movement
- road and sidewalk
- visible dribbling
- simple procedural/repeating street generation
- basic pedestrians
- cones
- pothole/manhole-type hazard
- parked vehicle/large obstacle
- collision/slowdown
- scoring
- Flow/combo
- at least one basic skill
- spin/roulette
- contextual nutmeg
- contextual wall pass if feasible
- one simple chase-trigger scenario
- restart/game-over loop
- keyboard controls for desktop testing

Mobile/touch controls can follow once the core feel is working.

# DEVELOPMENT PRINCIPLES

Please follow these rules throughout the project:

1. Get something playable quickly.
2. Do not overengineer the MVP.
3. Keep systems modular enough for expansion.
4. Separate gameplay logic from content/configuration where practical.
5. Prefer reusable entity/component patterns.
6. Keep skill moves extensible.
7. Keep NPC behaviors extensible.
8. Keep obstacle types extensible.
9. Avoid unnecessary dependencies.
10. Maintain readable project structure.
11. Comment non-obvious gameplay code.
12. Keep a short development README.
13. Track major design/architecture decisions.
14. Test after meaningful changes.
15. Fix broken gameplay before adding features.
16. Use temporary assets rather than blocking development waiting for final art.
17. Never expand scope merely because something sounds cool; preserve ideas for later milestones.

# HOW I WANT YOU TO WORK

Start by inspecting the environment and deciding the smallest appropriate technical architecture.

Then:

1. Create the project structure.
2. Get a minimal game running.
3. Establish the camera/perspective.
4. Create player movement and ball/dribble behavior.
5. Create a simple playable street.
6. Add basic obstacle/NPC spawning.
7. Add collision behavior.
8. Add the first skill mechanic.
9. Add Flow/scoring.
10. Iterate toward the first playable MVP described above.

Do not spend the first response giving me a giant theoretical game-design document.

Actually start building.

When there is a tradeoff, optimize first for:

**GAME FEEL → PLAYABILITY → ITERATION SPEED → EXTENSIBILITY → GRAPHICAL POLISH.**

Maintain a simple backlog file for ideas that we intentionally postpone so we don't lose good ideas while keeping MVP scope under control.

The long-term identity to preserve is:

**DRIBBLE STREETS**

*A street-sports runner where you don't just dodge the world — you dribble through it.*