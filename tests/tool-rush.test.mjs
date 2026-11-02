import test from 'node:test';
import assert from 'node:assert/strict';
import { createRushGame, stepRushGame, resizeRushGame, contactLine, dropMetrics, paddleWidth, seededRandom, CATCH_SECONDS, ROUND_SECONDS } from '../src/lib/typeRush.ts';

function playing(mode = 'rush', width = 390, height = 540) {
  const game = createRushGame(mode, width, height);
  game.phase = 'playing';
  return game;
}

function aboutToLand(game, good = true, x = .5) {
  const drop = { id: 0, text: good ? 'figma' : 'BOMB', good, x, baseX: x, y: 0, ...dropMetrics(good, '', game.width), speed: 0, angle: 0, born: game.elapsed - 3, landingAt: game.elapsed + .01 };
  drop.speed = (contactLine(game, drop) + .08) / (drop.landingAt - drop.born);
  drop.y = -.08 + drop.speed * (game.elapsed - drop.born);
  game.spawnIn = 100;
  game.drops = [drop];
}

test('each tool adds one second, including an edge catch, without rewinding the wave clock', () => {
  const game = playing();
  game.elapsed = 24; game.remaining = .01;
  aboutToLand(game);
  stepRushGame(game, .02);
  assert.equal(game.caught, 1);
  assert.equal(game.score, 15);
  assert.equal(game.phase, 'playing');
  assert.ok(Math.abs(game.remaining - CATCH_SECONDS) < 1e-8);
  assert.equal(game.elapsed, 24.01);
  assert.ok(game.sparks.some(spark => spark.text.includes('+1s')));
  aboutToLand(game, true, .5 + paddleWidth(game.width) * .4);
  const before = game.remaining;
  stepRushGame(game, .02);
  assert.equal(game.caught, 2);
  assert.equal(game.score, 25);
  assert.ok(Math.abs(game.remaining - (before - .02 + CATCH_SECONDS)) < 1e-8);
});

test('bombs cost a life and award no time; missing a tool breaks the combo', () => {
  const game = playing();
  aboutToLand(game, false);
  stepRushGame(game, .02);
  assert.equal(game.lives, 2);
  assert.ok(Math.abs(game.remaining - (ROUND_SECONDS - .02)) < 1e-8);
  game.combo = 5;
  aboutToLand(game, true, .85);
  const drop = game.drops[0];
  drop.born = game.elapsed - 6;
  drop.speed = .25;
  drop.y = 1.1;
  stepRushGame(game, .02);
  assert.equal(game.missed, 1);
  assert.equal(game.combo, 0);
  assert.equal(game.lives, 2);
});

test('bonus time can extend play beyond 30 seconds; pause freezes both clocks', () => {
  const game = playing();
  game.elapsed = 29.99; game.remaining = 5; game.spawnIn = 100;
  stepRushGame(game, .05);
  assert.equal(game.phase, 'playing');
  assert.ok(game.elapsed > ROUND_SECONDS);
  game.phase = 'paused';
  const saved = structuredClone(game);
  stepRushGame(game, 1);
  assert.deepEqual(game, saved);
  game.phase = 'playing'; game.remaining = .01;
  stepRushGame(game, .05);
  assert.equal(game.phase, 'ended');
  assert.equal(game.remaining, 0);
});

function playWithKeyboard(mode, width, height, seed, reduced = false, rotate = false) {
  const game = playing(mode, width, height);
  const random = seededRandom(seed);
  const seen = new Map();
  let focus = -1, reactAt = 0, rotated = false;
  const dt = 1 / 120;
  while (game.phase === 'playing' && game.elapsed < 120) {
    if (rotate && !rotated && game.elapsed > 8) {
      resizeRushGame(game, 760, 250); rotated = true;
    }
    const incoming = game.drops.filter(drop => drop.landingAt >= game.elapsed).sort((a, b) => a.landingAt - b.landingAt);
    const next = incoming[0];
    if (next) {
      if (focus !== next.id) { focus = next.id; reactAt = game.elapsed + .22; }
      let target = next.x;
      if (!next.good) {
        const half = paddleWidth(game.width) / 2;
        const distance = half + next.width / 2 + .045;
        const escape = [next.x - distance, next.x + distance].filter(x => x >= half && x <= 1 - half);
        const following = incoming.find(drop => drop.good)?.x ?? game.paddle;
        target = escape.sort((a, b) => Math.abs(a - following) - Math.abs(b - following))[0];
        assert.ok(Number.isFinite(target), 'A bomb must leave an escape route');
      }
      if (game.elapsed >= reactAt) {
        game.target += Math.max(-1.25 * dt, Math.min(1.25 * dt, target - game.target));
      }
    }
    stepRushGame(game, dt, random, reduced);
    for (const drop of game.drops) if (!seen.has(drop.id)) seen.set(drop.id, { id: drop.id, text: drop.text, good: drop.good, x: drop.x, born: drop.born, landingAt: drop.landingAt });
  }
  return { game, drops: [...seen.values()] };
}

test('the generated path is reachable at keyboard speed after a 220ms reaction, on mobile and desktop', () => {
  for (const mode of ['flow', 'rush']) for (const [width, height] of [[288, 400], [358, 600], [1100, 560]]) for (let seed = 1; seed <= 12; seed++) {
    const { game, drops } = playWithKeyboard(mode, width, height, `fairness-${seed}`);
    const context = `${mode}, ${width}x${height}, seed ${seed}`;
    assert.equal(game.missed, 0, `Unreachable tool: ${context}`);
    assert.equal(game.lives, 3, `Unavoidable bomb: ${context}`);
    assert.ok(game.caught > 20, context);
    assert.ok(game.elapsed > ROUND_SECONDS, 'Successful catches should extend the round');
    for (let i = 1; i < drops.length; i++) {
      assert.ok(drops[i].landingAt - drops[i - 1].landingAt >= .939, `Overlapping arrivals: ${context}`);
      assert.ok(drops[i].good || drops[i - 1].good, 'No consecutive bombs');
    }
  }
});

test('daily patterns are deterministic and reduced motion does not change gameplay', () => {
  const a = playWithKeyboard('rush', 390, 600, '2026-11-02');
  const b = playWithKeyboard('rush', 390, 600, '2026-11-02', true);
  assert.deepEqual(a.drops, b.drops);
  assert.equal(a.game.score, b.game.score);
  assert.notDeepEqual(a.drops, playWithKeyboard('rush', 390, 600, '2026-11-03').drops);
});

test('resizing keeps arrivals scheduled and the remaining tools catchable', () => {
  const { game } = playWithKeyboard('rush', 358, 600, 'rotation', false, true);
  assert.equal(game.missed, 0);
  assert.equal(game.lives, 3);
  assert.ok(game.caught > 30);
  const sample = playing();
  stepRushGame(sample, .05, seededRandom('resize'));
  sample.spawnIn = 0;
  stepRushGame(sample, .05, seededRandom('resize'));
  const arrivals = sample.drops.map(drop => drop.landingAt);
  resizeRushGame(sample, 1100, 400);
  assert.deepEqual(sample.drops.map(drop => drop.landingAt), arrivals);
  for (const drop of sample.drops) assert.ok(Math.abs((contactLine(sample, drop) - drop.y) / drop.speed - (drop.landingAt - sample.elapsed)) < 1e-8);
});
