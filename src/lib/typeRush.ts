export type RushMode = 'flow' | 'rush';
export type RushPhase = 'ready' | 'playing' | 'paused' | 'ended';
export type Drop = { id: number; text: string; good: boolean; x: number; baseX: number; y: number; width: number; size: number; speed: number; angle: number; born: number };
export type Spark = { x: number; y: number; vx: number; vy: number; age: number; text: string; good: boolean };
export type RushGame = {
  phase: RushPhase; mode: RushMode; width: number; height: number; elapsed: number;
  score: number; combo: number; longest: number; lives: number; paddle: number; target: number;
  spawnIn: number; sequence: number; drops: Drop[]; sparks: Spark[]; event: number; feedback: 'catch' | 'hit' | 'miss' | '';
};
const goodWords = ['BONUS', 'WIN', 'LUCK', 'BOOST', 'SPARK', 'WOW'];
export const ROUND_SECONDS = 30;
export const paddleWidth = (width: number) => Math.max(74, Math.min(132, width * .24)) / width;
export const multiplier = (combo: number) => Math.min(4, 1 + Math.floor(combo / 4));
export function dropMetrics(good: boolean, text: string, fieldWidth: number) {
  const size = good ? Math.max(18, Math.min(26, fieldWidth * .038)) : Math.max(30, Math.min(38, fieldWidth * .07));
  return { size, width: (good ? text.length * size * .61 + 24 : size) / fieldWidth };
}
export const contactLine = (game: RushGame, drop: Drop) => 1 - 40 / game.height - (drop.good ? drop.size * .7 : drop.size / 2) / game.height;

export function createRushGame(mode: RushMode, width: number, height: number): RushGame {
  return { phase: 'ready', mode, width, height, elapsed: 0, score: 0, combo: 0, longest: 0, lives: 3, paddle: .5, target: .5, spawnIn: .4, sequence: 0, drops: [], sparks: [], event: 0, feedback: '' };
}

function spawn(game: RushGame, random: () => number) {
  const good = random() > .28;
  const text = good ? goodWords[Math.floor(random() * goodWords.length)] : 'BOMB';
  const { size, width } = dropMetrics(good, text, game.width);
  const margin = width / 2 + .025;
  const x = margin + random() * (1 - margin * 2);
  const pace = game.mode === 'flow' ? .72 : 1;
  game.drops.push({ id: game.sequence++, text, good, x, baseX: x, y: -.08, width, size, speed: (.25 + game.elapsed / ROUND_SECONDS * .19) * pace, angle: (random() - .5) * .22, born: game.elapsed });
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
    game.spawnIn += Math.max(.44, .95 - game.elapsed * .014) * (game.mode === 'flow' ? 1.2 : 1);
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
        game.combo++; game.longest = Math.max(game.longest, game.combo);
        const points = 10 * multiplier(game.combo);
        game.score += points;
        game.sparks.push({ x: drop.x, y: catchY - .04, vx: 0, vy: -.14, age: 0, text: `${points} pts`, good: true });
        if (!reducedMotion) for (let i = 0; i < 4; i++) game.sparks.push({ x: drop.x, y: catchY, vx: (random() - .5) * .32, vy: -.12 - random() * .2, age: 0, text: drop.text[i % drop.text.length], good: true });
      } else {
        game.lives = Math.max(0, game.lives - 1); game.combo = 0;
        game.sparks.push({ x: drop.x, y: catchY - .08, vx: 0, vy: -.1, age: 0, text: 'Life lost', good: false });
      }
      return false;
    }
    if (drop.y > 1.07) {
      if (drop.good) { game.combo = 0; game.feedback = 'miss'; game.event++; }
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
