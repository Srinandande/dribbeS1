import Phaser from "phaser";
import "./style.css";
import { Run, MOVES, type Skill, type Entity } from "./model";
const el = (id: string) => document.getElementById(id)!;
let best = 0;
try {
  best = Number(localStorage.getItem("ds-best")) || 0;
} catch {}
el("best").textContent = String(best).padStart(6, "0");
class Street extends Phaser.Scene {
  run = new Run();
  g!: Phaser.GameObjects.Graphics;
  keys!: Record<string, Phaser.Input.Keyboard.Key>;
  playing = false;
  paused = false;
  hold = { left: false, right: false };
  labels: Phaser.GameObjects.Text[] = [];
  constructor() {
    super("street");
  }
  create() {
    this.g = this.add.graphics();
    this.keys = this.input.keyboard!.addKeys(
      "LEFT,RIGHT,A,D,SPACE,SHIFT,E,Q,P,ENTER",
    ) as typeof this.keys;
    el("start").onclick = () => {
      if (this.paused) {
        this.togglePause();
        return;
      }
      this.run = new Run();
      this.playing = true;
      this.paused = false;
      el("overlay").classList.add("hidden");
      el("pause").textContent = "Ⅱ";
    };
    el("pause").onclick = () => this.togglePause();
    document.querySelectorAll<HTMLButtonElement>("[data-hold]").forEach((b) => {
      const key = b.dataset.hold as "left" | "right";
      b.onpointerdown = (e) => {
        b.setPointerCapture(e.pointerId);
        this.hold[key] = true;
      };
      b.onpointerup = b.onpointercancel = () => (this.hold[key] = false);
    });
    document.querySelectorAll<HTMLButtonElement>("[data-skill]").forEach(
      (b) =>
        (b.onclick = () => {
          if (this.playing && !this.paused)
            this.run.use(b.dataset.skill as Skill);
        }),
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.playing && !this.paused) this.togglePause();
    });
    window.addEventListener("blur", () => {
      this.hold.left = this.hold.right = false;
      if (this.playing && !this.paused) this.togglePause();
    });
    this.draw();
  }
  togglePause() {
    if (!this.playing) return;
    this.paused = !this.paused;
    el("pause").textContent = this.paused ? "▶" : "Ⅱ";
    if (this.paused)
      this.overlay(
        "TAKE A BREATHER",
        "Street on hold.",
        "Your ball will be right here.",
        "KEEP PLAYING",
      );
    else el("overlay").classList.add("hidden");
  }
  overlay(k: string, t: string, c: string, b: string) {
    el("overlay-kicker").textContent = k;
    el("overlay-title").textContent = t;
    el("overlay-copy").textContent = c;
    el("start").innerHTML = b + " <span>↗</span>";
    el("overlay").classList.remove("hidden");
  }
  update(_time: number, delta: number) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.P)) this.togglePause();
    if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER) && !this.playing)
      el("start").click();
    if (this.playing && !this.paused) {
      for (const [key, s] of [
        ["SHIFT", "cut"],
        ["SPACE", "spin"],
        ["E", "nutmeg"],
        ["Q", "wall"],
      ] as [string, Skill][])
        if (Phaser.Input.Keyboard.JustDown(this.keys[key])) this.run.use(s);
      const axis =
        Number(
          this.keys.RIGHT.isDown || this.keys.D.isDown || this.hold.right,
        ) -
        Number(this.keys.LEFT.isDown || this.keys.A.isDown || this.hold.left);
      this.run.update(delta / 1000, axis);
      if (this.run.ended) {
        this.playing = false;
        best = Math.max(best, Math.floor(this.run.score));
        try {
          localStorage.setItem("ds-best", String(best));
        } catch {}
        el("best").textContent = String(best).padStart(6, "0");
        this.overlay(
          "EVERY RUN IS A NEW STORY",
          "One more block?",
          `${Math.floor(this.run.distance)} m · ${Math.floor(this.run.score)} points · ${this.run.rewards} clean skills`,
          "RUN IT BACK",
        );
      }
    }
    this.draw();
    const r = this.run;
    el("score").textContent = String(Math.floor(r.score)).padStart(6, "0");
    el("flow").textContent = "×" + r.flow;
    el("flowbar").style.width = (r.flowTime / 5) * 100 + "%";
    el("distance").textContent = Math.floor(r.distance) + " m";
    el("health").textContent =
      "● ".repeat(Math.max(0, r.health)) +
      "○ ".repeat(3 - Math.max(0, r.health));
    el("message").textContent =
      r.messageTime > 0
        ? r.message
        : r.chase
          ? `CHASE ${Math.round(r.chase)} m · HEAT ${r.heat}`
          : "KEEP YOUR TOUCH. FIND YOUR FLOW.";
    document
      .querySelectorAll<HTMLButtonElement>("[data-skill]")
      .forEach((b) => {
        const s = b.dataset.skill as Skill;
        b.style.opacity = r.cooldowns[s] > 0 ? ".4" : "1";
      });
  }
  project(x: number, z: number) {
    const scale = 1 / (1 + Math.max(-10, z) / 55);
    return { x: 270 + x * 45 * scale, y: 100 + 440 * scale, s: scale };
  }
  rect(x: number, y: number, w: number, h: number, c: number) {
    this.g.fillStyle(c, 1);
    this.g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  poly(points: number[], c: number) {
    this.g.fillStyle(c, 1);
    this.g.fillPoints(
      Array.from(
        { length: points.length / 2 },
        (_, i) => new Phaser.Math.Vector2(points[i * 2], points[i * 2 + 1]),
      ),
      true,
    );
  }
  ground(x1: number, x2: number, z1: number, z2: number, c: number) {
    const a = this.project(x1, z1),
      b = this.project(x2, z1),
      d = this.project(x2, z2),
      e = this.project(x1, z2);
    this.poly([a.x, a.y, b.x, b.y, d.x, d.y, e.x, e.y], c);
  }
  person(
    x: number,
    y: number,
    s: number,
    color: number,
    player = false,
    phase = 0,
  ) {
    const g = this.g;
    g.fillStyle(0x10232a, 0.3);
    g.fillEllipse(x, y + 2 * s, 23 * s, 8 * s);
    const skin = player ? 0xd6a27b : 0xb87e5d;
    const step = Math.sin(phase) * 5 * s;
    this.rect(x - 8 * s, y - 23 * s, 7 * s, 18 * s + step, 0x253145);
    this.rect(x + 2 * s, y - 23 * s, 7 * s, 18 * s - step, 0x253145);
    this.rect(x - 10 * s, y - 6 * s + step, 9 * s, 5 * s, 0xf5e8c6);
    this.rect(x + 2 * s, y - 6 * s - step, 10 * s, 5 * s, 0xf5e8c6);
    this.rect(x - 12 * s, y - 47 * s, 24 * s, 26 * s, color);
    this.rect(x - 17 * s, y - 43 * s, 6 * s, 21 * s, skin);
    this.rect(x + 12 * s, y - 43 * s, 6 * s, 21 * s, skin);
    this.rect(x - 8 * s, y - 62 * s, 16 * s, 17 * s, skin);
    this.rect(x - 9 * s, y - 64 * s, 18 * s, 7 * s, 0x27302d);
    if (player) {
      this.rect(x - 5 * s, y - 40 * s, 10 * s, 3 * s, 0x173c3c);
      this.rect(x + 2 * s, y - 38 * s, 3 * s, 11 * s, 0x173c3c);
    }
  }
  obstacle(e: Entity) {
    const p = this.project(e.x, e.z - this.run.distance),
      s = p.s,
      x = p.x,
      y = p.y,
      g = this.g;
    if (e.beaten) {
      g.lineStyle(2, 0xb9f174, 0.8);
      g.strokeEllipse(x, y, 35 * s, 12 * s);
    }
    if (e.kind === "person") {
      this.person(
        x,
        y,
        s,
        [0xf4a261, 0x98b8a4, 0xc27e88, 0x758bb4][e.color],
        false,
        this.run.time * 7 + e.id,
      );
      if (
        e.z - this.run.distance < 15 &&
        !e.beaten &&
        Math.abs(e.x - this.run.x) < 0.8
      ) {
        g.lineStyle(2, 0xb9f174);
        g.strokeCircle(x, y - 80 * s, 10 * s);
      }
    }
    if (e.kind === "cone") {
      g.fillStyle(0x142933, 0.3);
      g.fillEllipse(x, y, 24 * s, 8 * s);
      this.rect(x - 12 * s, y - 5 * s, 24 * s, 5 * s, 0x354b50);
      this.poly(
        [x - 9 * s, y - 5 * s, x, y - 32 * s, x + 9 * s, y - 5 * s],
        0xed8756,
      );
      this.rect(x - 5 * s, y - 16 * s, 10 * s, 4 * s, 0xffedca);
    }
    if (e.kind === "hole") {
      g.fillStyle(0x1e343e);
      g.fillEllipse(x, y, 45 * s, 15 * s);
      g.lineStyle(2 * s, 0x718084);
      g.strokeEllipse(x, y, 36 * s, 11 * s);
      g.lineBetween(x - 12 * s, y, x + 12 * s, y);
    }
    if (e.kind === "car") {
      this.rect(x - 30 * s, y - 82 * s, 60 * s, 81 * s, 0x223942);
      this.rect(
        x - 27 * s,
        y - 90 * s,
        54 * s,
        80 * s,
        e.x > 0 ? 0xca805d : 0x6b9291,
      );
      this.rect(x - 22 * s, y - 76 * s, 44 * s, 22 * s, 0x1f3a47);
      this.rect(
        x - 24 * s,
        y - 50 * s,
        48 * s,
        26 * s,
        e.x > 0 ? 0xe29b73 : 0x92b6a8,
      );
      this.rect(x - 21 * s, y - 18 * s, 42 * s, 7 * s, 0x28424b);
      this.rect(x - 24 * s, y - 8 * s, 10 * s, 5 * s, 0xffe4a7);
      this.rect(x + 14 * s, y - 8 * s, 10 * s, 5 * s, 0xffe4a7);
    }
  }
  draw() {
    const g = this.g,
      r = this.run;
    g.clear();
    this.rect(0, 0, 540, 610, 0x88a8ac);
    this.rect(0, 72, 540, 80, 0x6d9195);
    for (let i = 0; i < 14; i++) {
      const h = 25 + ((i * 37) % 62);
      this.rect(i * 42, 100 - h, 36, h, i % 2 ? 0x69858c : 0x78959a);
      for (let j = 0; j < 3; j++)
        this.rect(i * 42 + 7 + j * 9, 105 - h, 4, 9, 0xa5b8af);
    }
    this.ground(-8, 8, -10, 500, 0x42545b);
    this.ground(-5.2, -3, -10, 500, 0x98a59b);
    this.ground(3, 5.2, -10, 500, 0x98a59b);
    this.ground(-3.12, -3, -10, 500, 0xd7d3ad);
    this.ground(3, 3.12, -10, 500, 0xd7d3ad);
    for (let z = 300; z > -20; z -= 8) {
      const zz = z - (r.distance % 8);
      this.ground(-5.15, -3.18, zz, zz + 0.15, 0x7e918a);
      this.ground(3.18, 5.15, zz, zz + 0.15, 0x7e918a);
    }
    for (let z = 300; z > -10; z -= 16) {
      const zz = z - (r.distance % 16);
      this.ground(-0.04, 0.04, zz, zz + 5, 0xb7b6a0);
    }
    // Building facades scroll in world space, leaving the pavement fully playable.
    for (let z = 260; z > -30; z -= 24) {
      const zz = z - (r.distance % 24);
      for (const side of [-1, 1]) {
        const p = this.project(side * 5.25, zz),
          p2 = this.project(side * 5.25, zz + 23),
          s = p.s;
        const outer = side < 0 ? -40 : 580;
        const colors =
          side < 0
            ? [0xbd9877, 0x9ea487, 0xba8267]
            : [0x76948d, 0xc6aa88, 0x9e8e80];
        const c = colors[Math.abs(Math.floor((z + r.distance) / 24)) % 3];
        this.poly(
          [p.x, p.y, outer, p.y, outer, p.y - 165 * s, p.x, p.y - 165 * s],
          c,
        );
        this.poly(
          [p.x, p.y, p2.x, p2.y, p2.x, p2.y - 165 * p2.s, p.x, p.y - 165 * s],
          c - 0x12100c,
        );
        const wx = side < 0 ? p.x - 34 * s : p.x + 9 * s;
        this.rect(wx, p.y - 125 * s, 24 * s, 32 * s, 0x37545c);
        this.rect(wx, p.y - 115 * s, 24 * s, 3 * s, 0x96b4aa);
        this.rect(wx - 4 * s, p.y - 70 * s, 34 * s, 9 * s, 0xe3c79d);
        this.rect(wx, p.y - 59 * s, 25 * s, 51 * s, 0x354e50);
        this.rect(
          wx - 8 * s,
          p.y - 74 * s,
          42 * s,
          6 * s,
          side < 0 ? 0x698f74 : 0xd6875f,
        );
      }
    }
    const items = r.entities
      .filter((e) => e.z - r.distance < 300)
      .map((e) => ({ z: e.z - r.distance, e }));
    items.push({ z: 0, e: null as unknown as Entity });
    items.sort((a, b) => b.z - a.z);
    for (const item of items) {
      if (item.e) {
        this.obstacle(item.e);
        continue;
      }
      const p = this.project(r.x, 0);
      if (r.active === "spin") {
        g.lineStyle(3, 0xb9f174, 0.7);
        g.strokeEllipse(p.x, p.y - 15, 70, 25);
      }
      if (r.invincible <= 0 || Math.floor(r.time * 12) % 2 === 0)
        this.person(p.x, p.y, 1, 0xb9f174, true, r.time * 13);
      let bx = p.x + Math.sin(r.time * 12) * 12,
        by = p.y - 7 - Math.abs(Math.cos(r.time * 12)) * 7;
      if (r.active === "nutmeg") {
        bx = p.x;
        by -=
          Math.sin((1 - r.activeTime / MOVES.nutmeg.duration) * Math.PI) * 70;
      }
      if (r.active === "wall") {
        const t = 1 - r.activeTime / MOVES.wall.duration;
        bx = p.x + (Math.sign(r.x) * 237 + 270 - p.x) * Math.sin(t * Math.PI);
        by -= Math.sin(t * Math.PI) * 40;
      }
      if (r.active === "spin") {
        bx = p.x + Math.sin(r.activeTime * 14) * 27;
        by = p.y - 17 + Math.cos(r.activeTime * 14) * 10;
      }
      g.fillStyle(0x142a30, 0.35);
      g.fillEllipse(bx, by + 8, 15, 5);
      g.fillStyle(0xfff2d1);
      g.fillCircle(bx, by, 7);
      this.rect(bx - 2, by - 3, 4, 4, 0x233c43);
      this.rect(bx + 3, by + 2, 3, 3, 0x233c43);
      this.rect(bx - 5, by + 1, 2, 3, 0x233c43);
    }
    if (r.chase) {
      this.person(
        this.project(r.x - 0.6, 0).x,
        610 - Math.max(0, 35 - r.chase) * 1.5,
        0.9,
        0xea9871,
        false,
        r.time * 16,
      );
      this.rect(12, 15, 100, 5, 0x243d43);
      this.rect(12, 15, (1 - r.chase / 50) * 100, 5, 0xf3a077);
    }
    // Fine scanlines keep the original geometric artwork softly pixel-like.
    g.fillStyle(0x10232d, 0.045);
    for (let y = 0; y < 610; y += 4) g.fillRect(0, y, 540, 1);
  }
}
new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 540,
  height: 610,
  backgroundColor: "#88a8ac",
  pixelArt: true,
  antialias: false,
  scene: [Street],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { keyboard: true },
  audio: { noAudio: true },
});
