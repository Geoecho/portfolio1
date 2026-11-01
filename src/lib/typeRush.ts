export type RushMode = 'flow' | 'rush';
export type RushPhase = 'ready' | 'playing' | 'paused' | 'ended';
export const RUSH_TOOLS = ['figma', 'illustrator', 'photoshop', 'lightroom', 'html', 'css', 'claude'] as const;
export type ToolId = typeof RUSH_TOOLS[number];
export type Drop = { id: number; text: string; good: boolean; x: number; baseX: number; y: number; width: number; size: number; speed: number; angle: number; born: number };
export type Spark = { x: number; y: number; vx: number; vy: number; age: number; text: string; good: boolean };
export type RushGame = {
  phase: RushPhase; mode: RushMode; width: number; height: number; elapsed: number;
  score: number; combo: number; longest: number; lives: number; paddle: number; target: number;
  caught: number; missed: number; perfect: number;
  spawnIn: number; sequence: number; drops: Drop[]; sparks: Spark[]; event: number; feedback: 'catch' | 'hit' | 'miss' | '';
};
export const ROUND_SECONDS = 30;
export const paddleWidth = (width: number) => Math.max(74, Math.min(132, width * .24)) / width;
export const multiplier = (combo: number) => Math.min(4, 1 + Math.floor(combo / 4));
export const rushWave = (elapsed: number) => Math.min(3, 1 + Math.floor(elapsed / 10));
export const challengeDay = (date = new Date()) => date.toISOString().slice(0, 10);
export function seededRandom(day: string) {
  let seed = 2166136261;
  for (const char of `tool-rush-v1:${day}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
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
  return { phase: 'ready', mode, width, height, elapsed: 0, score: 0, combo: 0, longest: 0, lives: 3, paddle: .5, target: .5, caught: 0, missed: 0, perfect: 0, spawnIn: .4, sequence: 0, drops: [], sparks: [], event: 0, feedback: '' };
}

function spawn(game: RushGame, random: () => number) {
  const wave = rushWave(game.elapsed);
  const good = random() > (game.mode === 'rush' ? .2 + (wave - 1) * .055 : .2);
  const text = good ? RUSH_TOOLS[Math.floor(random() * RUSH_TOOLS.length)] : 'BOMB';
  const { size, width } = dropMetrics(good, text, game.width);
  const margin = width / 2 + .025;
  const x = margin + random() * (1 - margin * 2);
  const speed = game.mode === 'rush' ? .3 + (wave - 1) * .075 : .22 + (wave - 1) * .035;
  game.drops.push({ id: game.sequence++, text, good, x, baseX: x, y: -.08, width, size, speed, angle: (random() - .5) * .22, born: game.elapsed });
}

export function stepRushGame(game: RushGame, elapsed: number, random: () => number = Math.random, reducedMotion = false) {
  if (game.phase !== 'playing') return game.phase;
  const dt = Math.max(0, Math.min(.05, elapsed));
  game.elapsed = Math.min(ROUND_SECONDS, game.elapsed + dt);
  const halfPaddle = paddleWidth(game.width) / 2;
  game.target = Math.max(halfPaddle, Math.min(1 - halfPaddle, game.target));
  game.paddle += (game.target - game.paddle) * (1 - Math.exp(-dt * 22));
  game.spawnIn -= dt;
  if (game.spawnIn <= 0) {
    spawn(game, random);
    game.spawnIn += game.mode === 'rush' ? .76 - (rushWave(game.elapsed) - 1) * .13 : 1.05 - (rushWave(game.elapsed) - 1) * .08;
  }
  const catchY = 1 - 36 / game.height;
  game.drops = game.drops.filter(drop => {
    const previous = drop.y;
    drop.y += drop.speed * dt;
    if (!reducedMotion) drop.x = Math.max(drop.width / 2, Math.min(1 - drop.width / 2, drop.baseX + Math.sin((game.elapsed - drop.born) * 2.2 + drop.id) * .018));
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
        game.sparks.push({ x: drop.x, y: catchY - .07, vx: 0, vy: -.14, age: 0, text: `${perfect ? 'Perfect · ' : ''}${points} pts`, good: true });
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
  if (game.elapsed >= ROUND_SECONDS || game.lives <= 0) game.phase = 'ended';
  return game.phase;
}
