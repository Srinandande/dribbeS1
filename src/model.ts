export type Skill = "cut" | "spin" | "nutmeg" | "wall";
export type Kind = "cone" | "person" | "car" | "hole";
export interface Entity {
  id: number;
  x: number;
  z: number;
  kind: Kind;
  passed: boolean;
  beaten: boolean;
  color: number;
}
export const MOVES: Record<
  Skill,
  { cooldown: number; duration: number; points: number }
> = {
  cut: { cooldown: 1.2, duration: 0.25, points: 30 },
  spin: { cooldown: 2.5, duration: 0.65, points: 65 },
  nutmeg: { cooldown: 1.5, duration: 0.55, points: 130 },
  wall: { cooldown: 2, duration: 0.75, points: 95 },
};
export class Run {
  x = 0;
  distance = 0;
  speed = 18;
  score = 0;
  flow = 1;
  flowTime = 0;
  health = 3;
  heat = 0;
  chase = 0;
  invincible = 0;
  slow = 0;
  time = 0;
  ended = false;
  active: Skill | null = null;
  activeTime = 0;
  direction = 1;
  entities: Entity[] = [];
  cooldowns: Record<Skill, number> = { cut: 0, spin: 0, nutmeg: 0, wall: 0 };
  message = "FIND YOUR FLOW";
  messageTime = 0;
  lastSkill: Skill | null = null;
  nextSpawn = 42;
  nextId = 0;
  rewards = 0;
  private random: () => number;
  constructor(random: () => number = Math.random) {
    this.random = random;
    this.entities = [
      this.entity("cone", -2, 35),
      this.entity("person", 0, 62),
      this.entity("hole", 2, 89),
      this.entity("car", -3.4, 119),
    ];
    this.nextSpawn = 145;
  }
  entity(kind: Kind, x: number, z: number): Entity {
    return {
      id: this.nextId++,
      kind,
      x,
      z,
      passed: false,
      beaten: false,
      color: Math.floor(this.random() * 4),
    };
  }
  say(text: string) {
    this.message = text;
    this.messageTime = 2.4;
  }
  reward(skill: Skill) {
    const varied = this.lastSkill !== skill;
    this.flow = Math.min(8, this.flow + (varied ? 1 : 0));
    this.flowTime = 5;
    this.score += MOVES[skill].points * this.flow * (varied ? 1 : 0.2);
    this.lastSkill = skill;
    this.rewards++;
    this.say(
      `${skill === "nutmeg" ? "NUTMEG" : skill === "wall" ? "WALL PASS" : skill === "spin" ? "ROULETTE" : "SHARP CUT"} ${varied ? "" : "· MIX IT UP!"} +${Math.round(MOVES[skill].points * this.flow * (varied ? 1 : 0.2))}`,
    );
  }
  use(skill: Skill) {
    if (this.ended || this.cooldowns[skill] > 0) return false;
    const ahead = this.entities.filter(
      (e) => !e.beaten && e.z - this.distance > 0 && e.z - this.distance < 15,
    );
    const target = ahead.find(
      (e) => e.kind === "person" && Math.abs(e.x - this.x) < 0.8,
    );
    if (skill === "nutmeg" && !target) {
      this.say("LINE UP A PEDESTRIAN · PRESS E CLOSER");
      return false;
    }
    if (skill === "wall" && Math.abs(this.x) < 3.65) {
      this.say("GET CLOSER TO A SIDE WALL");
      return false;
    }
    this.cooldowns[skill] = MOVES[skill].cooldown;
    this.active = skill;
    this.activeTime = MOVES[skill].duration;
    if (skill === "nutmeg" && target) {
      target.beaten = true;
      this.reward(skill);
      this.heat = Math.min(100, this.heat + 30);
      if (!this.chase) {
        this.chase = 36;
        this.say("NUTMEG! · HEY! COME BACK HERE!");
      }
    }
    if (skill === "wall") this.reward(skill);
    if (skill === "cut") {
      const near = ahead.some((e) => Math.abs(e.x - this.x) < 1.5);
      this.x = Math.max(-4.65, Math.min(4.65, this.x + this.direction * 1.4));
      if (near) this.reward(skill);
      else this.say("SHARP CUT · TRY IT NEAR AN OBSTACLE");
    }
    if (skill === "spin") this.say("ROULETTE · BEAT A CONE OR PEDESTRIAN");
    return true;
  }
  update(dt: number, axis: number) {
    if (this.ended) return;
    dt = Math.min(dt, 0.05);
    this.time += dt;
    if (axis) this.direction = Math.sign(axis);
    this.x = Math.max(-4.65, Math.min(4.65, this.x + axis * 5.6 * dt));
    this.speed =
      (18 + Math.min(12, this.distance / 150)) * (this.slow > 0 ? 0.45 : 1);
    this.distance += this.speed * dt;
    this.score += dt * this.speed * 0.6;
    this.slow = Math.max(0, this.slow - dt);
    this.invincible = Math.max(0, this.invincible - dt);
    this.messageTime = Math.max(0, this.messageTime - dt);
    this.flowTime = Math.max(0, this.flowTime - dt);
    if (!this.flowTime) this.flow = 1;
    for (const s of Object.keys(MOVES) as Skill[])
      this.cooldowns[s] = Math.max(0, this.cooldowns[s] - dt);
    this.activeTime -= dt;
    if (this.activeTime <= 0) this.active = null;
    if (this.distance + 160 > this.nextSpawn) {
      const kinds: Kind[] = ["cone", "person", "hole", "person", "car"];
      const k = kinds[Math.floor(this.random() * kinds.length)];
      this.entities.push(
        this.entity(
          k,
          k === "car"
            ? this.random() < 0.5
              ? -3.3
              : 3.3
            : (this.random() - 0.5) * 8,
          this.nextSpawn,
        ),
      );
      this.nextSpawn += 18 + this.random() * 16;
    }
    for (const e of this.entities) {
      const dz = e.z - this.distance;
      const dx = Math.abs(e.x - this.x);
      if (dz < 1.5 && dz > -2 && !e.passed) {
        e.passed = true;
        const width = e.kind === "car" ? 1.15 : e.kind === "hole" ? 0.65 : 0.55;
        if (dx < width && !e.beaten) {
          if (
            this.active === "spin" &&
            (e.kind === "person" || e.kind === "cone")
          ) {
            e.beaten = true;
            this.reward("spin");
          } else if (this.invincible <= 0) {
            this.health--;
            this.invincible = 1.8;
            this.slow = 1.4;
            this.flow = 1;
            this.flowTime = 0;
            this.say("LOOSE TOUCH! · KEEP MOVING");
            if (this.chase) this.chase = Math.max(2, this.chase - 9);
          }
        } else if (!e.beaten && dx < width + 0.45) {
          this.score += 25 * this.flow;
          this.flowTime = Math.max(this.flowTime, 2);
          this.say("CLOSE CALL +25");
        }
      }
    }
    this.entities = this.entities.filter((e) => e.z > this.distance - 15);
    if (this.chase) {
      this.chase += dt * (this.slow > 0 ? -6 : 1.5);
      if (this.chase > 50) {
        this.chase = 0;
        this.heat = Math.max(0, this.heat - 20);
        this.score += 200;
        this.say("LOST THEM! +200");
      } else if (this.chase < 1) this.ended = true;
    }
    if (this.health <= 0) this.ended = true;
  }
}
