import test from "node:test";
import assert from "node:assert/strict";
import { Run } from "../src/model.ts";
test("calm start and continuous lateral movement", () => {
  const r = new Run(() => 0.5);
  r.update(0.05, 1);
  assert.equal(r.chase, 0);
  assert(r.x > 0 && r.x < 1);
  assert(r.distance > 0);
});
test("nutmeg requires a aligned nearby pedestrian and triggers chase", () => {
  const r = new Run();
  assert.equal(r.use("nutmeg"), false);
  r.entities = [r.entity("person", 0, 8)];
  assert.equal(r.use("nutmeg"), true);
  assert(r.entities[0].beaten);
  assert(r.chase > 0);
  assert.equal(r.health, 3);
});
test("wall pass is contextual and repeated rewards diminish", () => {
  const r = new Run();
  assert.equal(r.use("wall"), false);
  r.x = 4;
  r.use("wall");
  const first = r.score;
  r.cooldowns.wall = 0;
  r.use("wall");
  assert(r.score - first < first);
  assert.equal(r.flow, 2);
});
test("spin beats soft obstacles but not cars", () => {
  const r = new Run();
  r.entities = [r.entity("cone", 0, 1)];
  r.use("spin");
  r.update(0.01, 0);
  assert.equal(r.health, 3);
  assert.equal(r.rewards, 1);
  r.entities = [r.entity("car", 0, r.distance + 1)];
  r.update(0.01, 0);
  assert.equal(r.health, 2);
});
test("collision slows, grants recovery window and ends after three hits", () => {
  const r = new Run();
  for (let i = 0; i < 3; i++) {
    r.invincible = 0;
    r.entities = [r.entity("car", r.x, r.distance + 1)];
    r.update(0.01, 0);
  }
  assert.equal(r.health, 0);
  assert(r.ended);
  assert(r.slow > 0);
});
test("long run keeps bounded entities and flow expires", () => {
  const r = new Run(() => 0.5);
  r.reward("wall");
  for (let i = 0; i < 4000; i++) {
    r.health = 3;
    r.invincible = 1;
    r.update(0.05, 0);
  }
  assert(r.entities.length < 20);
  assert.equal(r.flow, 1);
});
