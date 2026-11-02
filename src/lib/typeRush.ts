export type RushMode = 'flow' | 'rush';
export type RushPhase = 'ready' | 'playing' | 'paused' | 'ended';
export const RUSH_TOOLS = ['figma', 'illustrator', 'photoshop', 'lightroom', 'html', 'css', 'claude'] as const;
export type ToolId = typeof RUSH_TOOLS[number];
export type Drop = { id: number; text: string; good: boolean; x: number; baseX: number; y: number; width: number; size: number; speed: number; angle: number; born: number; landingAt: number };
export type Spark = { x: number; y: number; vx: number; vy: number; age: number; text: string; good: boolean };
export type RushGame = {
  phase: RushPhase; mode: RushMode; width: number; height: number; elapsed: number; remaining: number;
  score: number; combo: number; longest: number; lives: number; paddle: number; target: number;
  caught: number; missed: number; perfect: number;
  spawnIn: number; sequence: number; nextLanding: number; plannedX: number; lastWasBomb: boolean;
  drops: Drop[]; sparks: Spark[]; event: number; feedback: 'catch' | 'hit' | 'miss' | '';
};
export const ROUND_SECONDS = 30;
export const CATCH_SECONDS = 1;
export const paddleWidth = (width: number) => Math.max(74, Math.min(132, width * .24)) / width;
export const multiplier = (combo: number) => Math.min(4, 1 + Math.floor(combo / 4));
export const rushWave = (elapsed: number) => Math.min(3, 1 + Math.floor(elapsed / 10));
export const challengeDay = (date = new Date()) => date.toISOString().slice(0, 10);
export function seededRandom(day: string) {
  let seed = 2166136261;
  for (const char of `tool-rush-v2:${day}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function dropMetrics(good: boolean, _text: string, fieldWidth: number) {
  const size = good ? Math.max(40, Math.min(50, fieldWidth * .085)) : Math.max(30, Math.min(38, fieldWidth * .07));
  return { size, width: size / fieldWidth };
}
export const contactLine = (game: RushGame, drop: Drop) => 1 - 40 / game.height - drop.size / 2 / game.height;
export const rushRanks = [{ name: 'Bronze', score: 150 }, { name: 'Silver', score: 350 }, { name: 'Gold', score: 600 }] as const;
export const rushRank = (score: number) => [...rushRanks].reverse().find(rank => score >= rank.score)?.name ?? 'Keep going';

export function createRushGame(mode: RushMode, width: number, height: number): RushGame {
  return { phase: 'ready', mode, width, height, elapsed: 0, remaining: ROUND_SECONDS, score: 0, combo: 0, longest: 0, lives: 3, paddle: .5, target: .5, caught: 0, missed: 0, perfect: 0, spawnIn: .4, sequence: 0, nextLanding: 0, plannedX: .5, lastWasBomb: false, drops: [], sparks: [], event: 0, feedback: '' };
}

export function resizeRushGame(game: RushGame, width: number, height: number) {
  if (width <= 0 || height <= 0) return;
  game.width = width; game.height = height;
  game.drops.forEach(drop => {
    Object.assign(drop, dropMetrics(drop.good, drop.text, width));
    const distance = contactLine(game, drop) + .08;
    drop.speed = distance / (drop.landingAt - drop.born);
    drop.y = -.08 + drop.speed * (game.elapsed - drop.born);
  });
}

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const dropInterval = (game: RushGame) => game.mode === 'flow' ? 1.2 : 1.08 - (rushWave(game.elapsed) - 1) * .07;

function spawn(game: RushGame, random: () => number) {
  const wave = rushWave(game.elapsed);
  // Consume the same random values on every screen and with either motion setting.
  const roll = random(), tool = random(), lane = random(), turn = random();
  const good = game.sequence < 3 || game.lastWasBomb || roll > .24;
  const text = good ? RUSH_TOOLS[Math.floor(tool * RUSH_TOOLS.length)] : 'BOMB';
  const { size, width } = dropMetrics(good, text, game.width);
  const spacing = dropInterval(game);
  const margin = Math.max(.14, paddleWidth(game.width) / 2 + .035, width / 2 + .035);
  // Leave reaction time, then allow less travel than keyboard control can cover.
  const reach = (spacing - .28) * .8;
  const desired = margin + lane * (1 - margin * 2);
  const x = good ? clamp(desired, Math.max(margin, game.plannedX - reach), Math.min(1 - margin, game.plannedX + reach))
    : clamp(game.plannedX + (lane - .5) * .1, margin, 1 - margin);
  if (good) game.plannedX = x;
  else {
    // Reserve a reachable escape position before planning the next tool.
    const escape = paddleWidth(game.width) / 2 + width / 2 + .085;
    const left = x - escape, right = x + escape;
    game.plannedX = clamp(left < margin ? right : right > 1 - margin ? left : turn < .5 ? left : right, margin, 1 - margin);
  }
  const flight = game.mode === 'flow' ? 3.6 : 3.2 - (wave - 1) * .12;
  const landingAt = Math.max(game.elapsed + flight, game.nextLanding + spacing);
  const line = 1 - 40 / game.height - size / 2 / game.height;
  const speed = (line + .08) / (landingAt - game.elapsed);
  game.nextLanding = landingAt; game.lastWasBomb = !good;
  game.drops.push({ id: game.sequence++, text, good, x, baseX: x, y: -.08, width, size, speed, angle: (turn - .5) * .16, born: game.elapsed, landingAt });
}

export function stepRushGame(game: RushGame, elapsed: number, random: () => number = Math.random, reducedMotion = false) {
  if (game.phase !== 'playing') return game.phase;
  const dt = Math.max(0, Math.min(.05, elapsed, game.remaining));
  game.elapsed += dt;
  game.remaining = Math.max(0, game.remaining - dt);
  const halfPaddle = paddleWidth(game.width) / 2;
  game.target = Math.max(halfPaddle, Math.min(1 - halfPaddle, game.target));
  game.paddle += (game.target - game.paddle) * (1 - Math.exp(-dt * 22));
  game.spawnIn -= dt;
  if (game.spawnIn <= 0) {
    spawn(game, random);
    game.spawnIn += dropInterval(game);
  }
  const catchY = 1 - 36 / game.height;
  game.drops = game.drops.filter(drop => {
    const previous = drop.y;
    drop.y = -.08 + drop.speed * (game.elapsed - drop.born);
    const line = contactLine(game, drop);
    const caught = previous <= line && drop.y >= line && Math.abs(drop.x - game.paddle) < halfPaddle + drop.width * .42;
    if (caught) {
      game.event++;
      game.feedback = drop.good ? 'catch' : 'hit';
      if (drop.good) {
        game.caught++; game.combo++; game.longest = Math.max(game.longest, game.combo);
        const perfect = Math.abs(drop.x - game.paddle) < halfPaddle * .45;
        if (perfect) game.perfect++;
        const points = (perfect ? 15 : 10) * multiplier(game.combo);
        game.score += points;
        game.remaining += CATCH_SECONDS;
        game.sparks.push({ x: drop.x, y: catchY - .07, vx: 0, vy: -.14, age: 0, text: `${perfect ? 'Perfect · ' : ''}${points} pts · +${CATCH_SECONDS}s`, good: true });
        // Visual particles never consume the daily challenge's random sequence.
        if (!reducedMotion) for (let i = 0; i < 4; i++) game.sparks.push({ x: drop.x, y: catchY, vx: Math.sin(drop.id * 3 + i * 5) * .16, vy: -.12 - i * .04, age: 0, text: '•', good: true });
      } else {
        game.lives = Math.max(0, game.lives - 1); game.combo = 0;
        game.sparks.push({ x: drop.x, y: catchY - .08, vx: 0, vy: -.1, age: 0, text: 'Life lost', good: false });
      }
      return false;
    }
    if (drop.y > 1.07) {
      if (drop.good) { game.missed++; game.combo = 0; game.feedback = 'miss'; game.event++; }
      return false;
    }
    return true;
  });
  game.sparks = game.sparks.filter(spark => {
    spark.age += dt; spark.x += spark.vx * dt; spark.y += spark.vy * dt;
    return spark.age < .7;
  }).slice(-36);
  if (game.remaining <= 0 || game.lives <= 0) game.phase = 'ended';
  return game.phase;
}
