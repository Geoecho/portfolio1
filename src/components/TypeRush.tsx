import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Gamepad, Heart, Pause, Play, RotateCcw } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { createRushGame, multiplier, paddleWidth, ROUND_SECONDS, stepRushGame, type RushGame, type RushMode, type RushPhase } from '../lib/typeRush';

const bestThisVisit: Record<RushMode, number> = { flow: 0, rush: 0 };
const snapshot = (game: RushGame) => ({ score: game.score, combo: game.combo, longest: game.longest, lives: game.lives, seconds: Math.ceil(ROUND_SECONDS - game.elapsed) });

function draw(canvas: HTMLCanvasElement, game: RushGame, reduced: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = game;
  ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(214,0,0,.055)'; ctx.lineWidth = .65;
  for (let x = 0; x < width; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  ctx.font = `750 ${Math.min(width * .23, 170)}px "Work Sans Variable",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeStyle = 'rgba(0,0,0,.04)'; ctx.lineWidth = 1;
  ctx.strokeText('PLAY', width / 2, height * .5);
  ctx.strokeStyle = 'rgba(0,0,0,.1)'; ctx.beginPath(); ctx.moveTo(18, height - 32); ctx.lineTo(width - 18, height - 32); ctx.stroke();
  for (const drop of game.drops) {
    ctx.save(); ctx.translate(drop.x * width, drop.y * height); ctx.rotate(reduced ? 0 : drop.angle);
    ctx.font = `750 ${drop.size}px "Work Sans Variable",sans-serif`;
    ctx.fillStyle = drop.good ? '#d60000' : '#000000';
    ctx.fillText(`${drop.good ? '+' : '×'} ${drop.text}`, 0, 0);
    ctx.restore();
  }
  for (const spark of game.sparks) {
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - spark.age / .7);
    ctx.font = `650 ${spark.text.length > 1 ? 20 : 13}px "Work Sans Variable",sans-serif`;
    ctx.fillStyle = spark.good ? '#d60000' : '#000000';
    ctx.fillText(spark.text, spark.x * width, spark.y * height); ctx.restore();
  }
}

export default function TypeRush() {
  const reduced = useMotionPreference();
  const [mode, setMode] = useState<RushMode>(reduced ? 'flow' : 'rush');
  const [phase, setPhase] = useState<RushPhase>('ready');
  const game = useRef(createRushGame(mode, 800, 420));
  const [hud, setHud] = useState(() => snapshot(game.current));
  const [newBest, setNewBest] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paddle = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pulse = useRef<Animation | null>(null);
  const keys = useRef(new Set<string>());
  const paint = useCallback(() => {
    if (!canvas.current) return;
    draw(canvas.current, game.current, reduced);
    if (paddle.current) {
      paddle.current.style.left = `${game.current.paddle * 100}%`;
      paddle.current.style.width = `${paddleWidth(game.current.width) * 100}%`;
    }
    if (progress.current) progress.current.style.transform = `scaleX(${Math.max(0, 1 - game.current.elapsed / ROUND_SECONDS)})`;
  }, [reduced]);
  const pause = useCallback(() => {
    if (game.current.phase !== 'playing') return;
    game.current.phase = 'paused'; keys.current.clear(); setPhase('paused'); setHud(snapshot(game.current));
  }, []);

  useEffect(() => {
    let mounted = true;
    const resize = () => {
      const rect = surface.current!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      game.current.width = rect.width; game.current.height = rect.height;
      game.current.drops.forEach(drop => {
        drop.size = Math.max(19, Math.min(30, rect.width * .04));
        drop.width = (drop.text.length + 2) * drop.size * .57 / rect.width;
      });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.current!.width = Math.round(rect.width * ratio); canvas.current!.height = Math.round(rect.height * ratio);
      paint();
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(surface.current!);
    const visibility = () => { if (document.hidden) pause(); };
    const view = new IntersectionObserver(entries => { if (entries.some(entry => entry.intersectionRatio < .45)) pause(); }, { threshold: [.45] });
    view.observe(surface.current!);
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility);
    void document.fonts.ready.then(() => { if (mounted) paint(); });
    return () => { mounted = false; observer.disconnect(); view.disconnect(); pulse.current?.cancel(); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility); };
  }, [paint, pause]);

  useEffect(() => {
    if (phase !== 'playing') { paint(); return; }
    let frame = 0, previous = 0, lastHud = 0;
    const tick = (now: number) => {
      if (game.current.phase !== 'playing') return;
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;
      const direction = Number(keys.current.has('ArrowRight') || keys.current.has('d')) - Number(keys.current.has('ArrowLeft') || keys.current.has('a'));
      if (direction) game.current.target += direction * dt * 1.25;
      const event = game.current.event;
      const updatedPhase = stepRushGame(game.current, dt, Math.random, reduced);
      if (!reduced && game.current.event !== event && game.current.feedback !== 'miss' && paddle.current) {
        pulse.current?.cancel();
        pulse.current = paddle.current.animate([
          { transform: 'translateX(-50%) scaleX(1)', backgroundColor: '#d60000' },
          { transform: 'translateX(-50%) scaleX(1.16)', backgroundColor: game.current.feedback === 'hit' ? '#000000' : '#d60000' },
          { transform: 'translateX(-50%) scaleX(1)', backgroundColor: '#d60000' },
        ], { duration: 200, easing: 'ease-out' });
      }
      paint();
      if (now - lastHud > 80) { setHud(snapshot(game.current)); lastHud = now; }
      if (updatedPhase === 'ended') {
        setNewBest(game.current.score > bestThisVisit[mode]);
        bestThisVisit[mode] = Math.max(bestThisVisit[mode], game.current.score);
        setHud(snapshot(game.current)); setPhase('ended'); keys.current.clear();
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, mode, reduced, paint]);

  const start = () => {
    const { width, height } = game.current;
    game.current = createRushGame(mode, width, height); game.current.phase = 'playing';
    keys.current.clear(); setNewBest(false); setHud(snapshot(game.current)); setPhase('playing');
    requestAnimationFrame(() => surface.current?.focus({ preventScroll: true }));
  };
  const resume = () => { game.current.phase = 'playing'; setPhase('playing'); requestAnimationFrame(() => surface.current?.focus({ preventScroll: true })); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (game.current.phase !== 'playing') return;
    const rect = event.currentTarget.getBoundingClientRect();
    game.current.target = (event.clientX - rect.left) / rect.width;
  };
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key) && phase === 'playing') { event.preventDefault(); keys.current.add(event.key); }
    if (event.key === ' ' && !event.repeat) { event.preventDefault(); if (phase === 'playing') pause(); else if (phase === 'paused') resume(); else start(); }
    if (event.key === 'Escape') { event.preventDefault(); pause(); }
  };

  return <div className="rush-game">
    <div className="rush-hud"><div className="rush-score"><span>Score</span><strong>{hud.score}</strong></div><div className="rush-combo"><strong>×{multiplier(hud.combo)}</strong><span>{hud.combo ? `${hud.combo} in a row` : 'Find your flow'}</span></div><div className="rush-vitals"><span className="rush-lives" aria-label={`${hud.lives} lives remaining`}>{[0, 1, 2].map(index => <span key={index} data-alive={index < hud.lives}><Heart size={15} /></span>)}</span><span className="rush-time" role="timer" aria-label="Seconds remaining">{hud.seconds}s</span>{phase === 'playing' ? <button type="button" className="icon-button rush-pause" onClick={pause} aria-label="Pause game"><Pause size={18} /></button> : <span className="rush-game-icon"><Gamepad size={22} /></span>}</div></div>
    <div ref={surface} className="rush-field" data-phase={phase} role="group" tabIndex={0} aria-label="Type Rush playing field" aria-describedby="rush-instructions" onKeyDown={onKey} onKeyUp={event => keys.current.delete(event.key)} onBlur={() => keys.current.clear()} onPointerMove={move} onPointerDown={event => { if (phase !== 'playing') return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus({ preventScroll: true }); move(event); }}>
      <canvas ref={canvas} className="rush-canvas" aria-hidden="true" />
      <div ref={paddle} className="rush-paddle" aria-hidden="true" />
      {phase !== 'playing' && <div className="rush-overlay">
        {phase === 'ready' ? <><span className="rush-kicker">Type Rush</span><h3>Less noise.<br /><span>More play.</span></h3><p>Catch the red words.<br />Let the black ones fall.</p></> : phase === 'paused' ? <><span className="rush-kicker">Take a breath</span><h3>Stay in<br /><span>the game.</span></h3><p>Your score and time are right here.</p></> : <><span className="rush-kicker">{newBest ? 'Your best run yet' : 'Nice run'}</span><h3 className="rush-final-score">{hud.score}<span>points.</span></h3><p>Best streak: {hud.longest}<br />Best this visit: {bestThisVisit[mode]}</p></>}
        {phase !== 'paused' && <div className="rush-modes" role="group" aria-label="Game pace"><button type="button" aria-pressed={mode === 'flow'} onClick={() => setMode('flow')}>Flow</button><button type="button" aria-pressed={mode === 'rush'} onClick={() => setMode('rush')}>Rush</button></div>}
        <button type="button" className="hero-cta rush-start" onClick={phase === 'paused' ? resume : start}>{phase === 'ready' ? 'Let’s play' : phase === 'paused' ? 'Keep going' : 'Play again'}{phase === 'ended' ? <RotateCcw size={18} /> : <Play size={18} />}</button>
      </div>}
      <div className="rush-timer-track" aria-hidden="true"><div ref={progress} /></div>
    </div>
    <div id="rush-instructions" className="rush-instructions"><span><strong>+ red</strong> is good. <strong>× black</strong> is noise.</span><span>Mouse, touch, or ← →. Space to pause.</span></div>
    <span className="sr-only" role="status">{phase === 'ended' ? `Round over. ${hud.score} points. Best streak ${hud.longest}.` : phase === 'paused' ? 'Game paused. Choose Keep going to resume.' : ''}</span>
  </div>;
}
