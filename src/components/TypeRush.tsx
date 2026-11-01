import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { Bomb as BombGlyph } from 'lucide-react';
import { Bomb, Gamepad, Heart, Maximize2, Minimize2, Pause, Play, RotateCcw } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { softwareLogos } from '../data/softwareLogos';
import { readRushRecords, saveRushRecord } from '../lib/toolRushRecords';
import { challengeDay, createRushGame, dropMetrics, multiplier, paddleWidth, ROUND_SECONDS, rushRank, rushRanks, rushWave, seededRandom, stepRushGame, type RushGame, type RushMode, type RushPhase, type ToolId } from '../lib/typeRush';

const snapshot = (game: RushGame) => ({ score: game.score, combo: game.combo, longest: game.longest, lives: game.lives, caught: game.caught, perfect: game.perfect, wave: rushWave(game.elapsed), seconds: Math.ceil(ROUND_SECONDS - game.elapsed) });

function draw(canvas: HTMLCanvasElement, game: RushGame) {
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
  for (const spark of game.sparks) {
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - spark.age / .7);
    ctx.font = `650 ${spark.text.length > 1 ? 20 : 13}px "Work Sans Variable",sans-serif`;
    ctx.fillStyle = spark.good ? '#d60000' : '#000000';
    ctx.fillText(spark.text, spark.x * width, spark.y * height); ctx.restore();
  }
}

function Rules({ detailed = false }: { detailed?: boolean }) {
  return <><div className="rush-rules">
    <div><span className="rush-logo-samples">{(['figma', 'photoshop', 'claude'] as const).map(id => <span key={id} className="rush-tool"><img src={softwareLogos[id].src} alt={softwareLogos[id].name} /></span>)}</span><strong>Catch the tools</strong><p>10 points. Center it for 15.<br />Build a combo up to 4x.</p></div>
    <div><span className="rush-bomb-sample"><Bomb size={30} /></span><strong>Dodge bombs</strong><p>Each hit costs a life.<br />You have three.</p></div>
  </div>{detailed && <p className="rush-rule-detail">Move the red paddle with your mouse, finger, or arrow keys. Catch Figma, Adobe, HTML/CSS, and Claude logos. Land one in the center for a precision bonus. Every four catches boosts your multiplier, up to 4x. A missed tool or bomb resets your combo. Three waves get faster over 30 seconds. Daily uses the same drop sequence for everyone, refreshed at midnight UTC. Practice is slower and scores separately. Your best is saved only on this device.</p>}</>;
}

export default function TypeRush() {
  const reduced = useMotionPreference();
  const [mode, setMode] = useState<RushMode>(reduced ? 'flow' : 'rush');
  const [phase, setPhase] = useState<RushPhase>('ready');
  const game = useRef(createRushGame(mode, 800, 460));
  const [hud, setHud] = useState(() => snapshot(game.current));
  const [newBest, setNewBest] = useState(false);
  const [day, setDay] = useState(challengeDay);
  const [records, setRecords] = useState(() => readRushRecords(challengeDay()));
  const random = useRef<() => number>(Math.random);
  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [reservedHeight, setReservedHeight] = useState(0);
  const [items, setItems] = useState<{ id: number; size: number; good: boolean; text: string }[]>([]);
  const itemSignature = useRef('');
  const itemNodes = useRef(new Map<number, HTMLSpanElement>());
  const root = useRef<HTMLDivElement>(null);
  const fullscreenButton = useRef<HTMLButtonElement>(null);
  const nativeFullscreen = useRef(false);
  const surface = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paddle = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pulse = useRef<Animation | null>(null);
  const keys = useRef(new Set<string>());
  const paint = useCallback(() => {
    const current = game.current;
    if (!canvas.current) return;
    draw(canvas.current, current);
    const signature = current.drops.map(drop => `${drop.id}:${drop.size}:${drop.text}`).join(',');
    if (signature !== itemSignature.current) { itemSignature.current = signature; setItems(current.drops.map(({ id, size, good, text }) => ({ id, size, good, text }))); }
    for (const drop of current.drops) {
      const node = itemNodes.current.get(drop.id);
      if (node) {
        node.style.left = `${drop.x * 100}%`; node.style.top = `${drop.y * 100}%`;
        node.style.transform = `translate(-50%,-50%) rotate(${reduced ? 0 : drop.angle}rad)`;
      }
    }
    if (paddle.current) { paddle.current.style.left = `${current.paddle * 100}%`; paddle.current.style.width = `${paddleWidth(current.width) * 100}%`; }
    if (progress.current) progress.current.style.transform = `scaleX(${Math.max(0, 1 - current.elapsed / ROUND_SECONDS)})`;
  }, [reduced]);
  useLayoutEffect(() => { paint(); }, [items, expanded, paint]);
  const pause = useCallback(() => {
    if (game.current.phase !== 'playing') return;
    game.current.phase = 'paused'; keys.current.clear(); setPhase('paused'); setHud(snapshot(game.current));
  }, []);

  useEffect(() => {
    if (!mount || !surface.current || !canvas.current) return;
    let mounted = true;
    const resize = () => {
      if (!surface.current || !canvas.current) return;
      const rect = surface.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      game.current.width = rect.width; game.current.height = rect.height;
      game.current.drops.forEach(drop => Object.assign(drop, dropMetrics(drop.good, drop.text, rect.width)));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.current.width = Math.round(rect.width * ratio); canvas.current.height = Math.round(rect.height * ratio);
      paint();
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(surface.current);
    const visibility = () => { if (document.hidden) pause(); };
    const view = new IntersectionObserver(entries => { if (entries.some(entry => entry.intersectionRatio < .45)) pause(); }, { threshold: [.45] });
    view.observe(surface.current);
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility);
    void document.fonts.ready.then(() => { if (mounted) paint(); });
    return () => { mounted = false; observer.disconnect(); view.disconnect(); pulse.current?.cancel(); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility); };
  }, [mount, expanded, paint, pause]);

  const exitFullscreen = useCallback(() => {
    pause(); setShowRules(false);
    if (document.fullscreenElement === root.current) {
      void document.exitFullscreen().catch(() => {}).finally(() => { nativeFullscreen.current = false; setExpanded(false); });
    } else setExpanded(false);
  }, [pause]);
  useEffect(() => {
    const change = () => {
      if (document.fullscreenElement === root.current && document.fullscreenElement) nativeFullscreen.current = true;
      else if (nativeFullscreen.current) { nativeFullscreen.current = false; pause(); setShowRules(false); setExpanded(false); }
    };
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, [pause]);
  useLayoutEffect(() => {
    if (!expanded) return;
    const page = document.getElementById('root');
    const wasInert = page?.inert ?? false, overflow = document.body.style.overflow, scrollY = window.scrollY;
    document.body.style.overflow = 'hidden'; if (page) page.inert = true;
    fullscreenButton.current?.focus({ preventScroll: true });
    const trap = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); if (showRules) setShowRules(false); else exitFullscreen(); }
      if (event.key !== 'Tab' || !root.current) return;
      const focusable = [...root.current.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]')].filter(node => node.getClientRects().length && !node.closest('[inert]'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = overflow; if (page) page.inert = wasInert;
      document.removeEventListener('keydown', trap); window.scrollTo(0, scrollY);
      requestAnimationFrame(() => fullscreenButton.current?.focus({ preventScroll: true }));
    };
  }, [expanded, exitFullscreen, showRules]);
  const enterFullscreen = () => {
    pause(); setReservedHeight(root.current?.getBoundingClientRect().height ?? 0);
    flushSync(() => setExpanded(true));
    // Keep the edge-to-edge layout if native fullscreen is unavailable (including iPhone).
    if (document.fullscreenEnabled && root.current?.requestFullscreen) void root.current.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    if (phase !== 'playing') { paint(); return; }
    let frame = 0, previous = 0, lastHud = 0;
    const tick = (now: number) => {
      if (game.current.phase !== 'playing') return;
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0; previous = now;
      const direction = Number(keys.current.has('ArrowRight') || keys.current.has('d')) - Number(keys.current.has('ArrowLeft') || keys.current.has('a'));
      if (direction) game.current.target += direction * dt * 1.25;
      const event = game.current.event;
      const updatedPhase = stepRushGame(game.current, dt, random.current, reduced);
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
        const previousBest = readRushRecords(day);
        setNewBest(game.current.score > (mode === 'rush' ? previousBest.dailyBest : previousBest.practiceBest));
        setRecords(saveRushRecord(day, mode, game.current.score));
        setHud(snapshot(game.current)); setPhase('ended'); keys.current.clear();
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, mode, day, reduced, paint]);

  const start = () => {
    const { width, height } = game.current;
    const today = challengeDay(); setDay(today); setRecords(readRushRecords(today));
    random.current = mode === 'rush' ? seededRandom(today) : Math.random;
    game.current = createRushGame(mode, width, height); game.current.phase = 'playing';
    keys.current.clear(); setNewBest(false); setHud(snapshot(game.current)); setPhase('playing'); setShowRules(false);
    requestAnimationFrame(() => surface.current?.focus({ preventScroll: true }));
  };
  const chooseMode = (next: RushMode) => {
    if (next === mode) return;
    game.current = createRushGame(next, game.current.width, game.current.height);
    setMode(next); setPhase('ready'); setHud(snapshot(game.current)); setNewBest(false); paint();
  };
  const resume = () => { game.current.phase = 'playing'; setPhase('playing'); requestAnimationFrame(() => surface.current?.focus({ preventScroll: true })); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (game.current.phase !== 'playing') return;
    const rect = event.currentTarget.getBoundingClientRect(); game.current.target = (event.clientX - rect.left) / rect.width;
  };
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || showRules) return;
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key) && phase === 'playing') { event.preventDefault(); keys.current.add(event.key); }
    if (event.key === ' ' && !event.repeat) { event.preventDefault(); if (phase === 'playing') pause(); else if (phase === 'paused') resume(); else start(); }
    if (event.key === 'Escape' && !expanded) { event.preventDefault(); pause(); }
  };
  const overlay = phase !== 'playing' || showRules;
  const best = mode === 'rush' ? records.dailyBest : records.practiceBest;
  const goal = rushRanks.find(rank => hud.score < rank.score) ?? rushRanks[2];
  const dateLabel = new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const content = <div ref={root} className={`rush-game${expanded ? ' is-expanded' : ''}`} role={expanded ? 'dialog' : undefined} aria-modal={expanded || undefined} aria-labelledby="rush-title" data-lenis-prevent={expanded || undefined}>
    <div className="rush-toolbar"><div className="rush-identity"><Gamepad size={26} /><div><h3 id="rush-title">Tool Rush</h3><span>{mode === 'rush' ? `Daily challenge · ${dateLabel}` : 'Practice · Find your rhythm'}</span></div></div><div className="rush-tools">
      {(phase === 'playing' || phase === 'paused') && <button type="button" className="icon-button" onClick={phase === 'playing' ? pause : resume} disabled={showRules} aria-label={phase === 'playing' ? 'Pause game' : 'Resume game'} title={phase === 'playing' ? 'Pause game' : 'Resume game'}>{phase === 'playing' ? <Pause size={19} /> : <Play size={19} />}</button>}
      <button type="button" className="icon-button rush-help" onClick={() => { pause(); setShowRules(!showRules); }} aria-label={showRules ? 'Close instructions' : 'How to play'} title="How to play" aria-pressed={showRules}>?</button>
      <button ref={fullscreenButton} type="button" className="icon-button" onClick={expanded ? exitFullscreen : enterFullscreen} aria-label={expanded ? 'Exit fullscreen' : 'Fullscreen game'} title={expanded ? 'Exit fullscreen' : 'Fullscreen game'}>{expanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}</button>
    </div></div>
    <div className="rush-hud"><div className="rush-stat"><span>Score</span><strong>{hud.score}</strong></div><div className="rush-stat rush-combo"><span>Combo</span><strong>{multiplier(hud.combo)}x</strong><span className="rush-combo-meter" aria-label={`${hud.combo} consecutive catches`}><span style={{ transform: `scaleX(${multiplier(hud.combo) === 4 ? 1 : (hud.combo % 4) / 4})` }} /></span></div><div className="rush-stat"><span>Lives</span><span className="rush-lives" aria-label={`${hud.lives} lives remaining`}>{[0, 1, 2].map(index => <span key={index} data-alive={index < hud.lives}><Heart size={16} /></span>)}</span></div><div className="rush-stat"><span>Time</span><strong className="rush-time" role="timer" aria-label="Seconds remaining">{hud.seconds}<small>s</small></strong></div></div>
    <div className="rush-challenge"><div><span>{phase === 'playing' || phase === 'paused' ? `Wave ${hud.wave} / 3` : mode === 'rush' ? 'Daily challenge' : 'Practice run'}<strong>{hud.score >= 600 ? 'Gold unlocked' : `${goal.name} at ${goal.score}`}</strong></span><span>{records.persistent ? 'Device best' : 'Visit best'} <strong>{best}</strong></span></div><div className="rush-rank-track" role="progressbar" aria-label={`Progress to ${goal.name}`} aria-valuemin={0} aria-valuemax={goal.score} aria-valuenow={Math.min(hud.score, goal.score)}><span style={{ transform: `scaleX(${Math.min(1, hud.score / goal.score)})` }} /></div></div>
    <div ref={surface} className="rush-field" data-phase={phase} role="group" tabIndex={0} aria-label="Tool Rush playing field" aria-describedby="rush-instructions" onKeyDown={onKey} onKeyUp={event => keys.current.delete(event.key)} onBlur={() => keys.current.clear()} onPointerMove={move} onPointerDown={event => { if (phase !== 'playing' || showRules) return; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus({ preventScroll: true }); move(event); }}>
      <canvas ref={canvas} className="rush-canvas" aria-hidden="true" />
      {items.map(item => <span key={item.id} className={`rush-pickup ${item.good ? 'rush-tool' : 'rush-bomb'}`} data-tool={item.good ? item.text : undefined} aria-hidden="true" style={{ width: item.size, height: item.size }} ref={node => { if (node) itemNodes.current.set(item.id, node); else itemNodes.current.delete(item.id); }}>{item.good ? <img src={softwareLogos[item.text as ToolId].src} alt="" /> : <BombGlyph size={item.size} fill="currentColor" strokeWidth={1.5} />}</span>)}
      <div ref={paddle} className="rush-paddle" aria-hidden="true" />
      {overlay && <div className="rush-overlay" data-lenis-prevent><div className="rush-overlay-content">
        {showRules ? <><h4>How to play</h4><Rules detailed /><button type="button" className="hero-cta rush-start" onClick={() => setShowRules(false)}>Got it<Play size={18} /></button></> : <>
          {phase === 'ready' ? <><h4>Catch your tools.<br /><span>Beat your best.</span></h4><p className="rush-ready-tip">Move the red paddle to catch the logos.</p><Rules /></> : phase === 'paused' ? <><span className="rush-kicker">Game paused</span><h4>Ready when<br /><span>you are.</span></h4><p>Your score and time are saved for this round.</p></> : <><span className="rush-kicker">{newBest ? 'New personal best' : hud.lives === 0 ? 'Out of lives. Go again?' : 'Time’s up. Nice run.'}</span><h4 className="rush-final-score">{hud.score}<span>{hud.score >= 150 ? `${rushRank(hud.score)} run` : 'points'}</span></h4><div className="rush-result-stats"><span><strong>{hud.caught}</strong>tools caught</span><span><strong>{hud.perfect}</strong>perfect catches</span><span><strong>{hud.longest}</strong>best streak</span></div><p>{mode === 'rush' ? 'Today’s' : 'Practice'} best: {best}</p></>}
          {phase !== 'paused' && <div className="rush-modes" role="group" aria-label="Game mode"><button type="button" aria-label="Practice" aria-pressed={mode === 'flow'} onClick={() => chooseMode('flow')}>Practice<span>Learn the rhythm</span></button><button type="button" aria-label="Daily" aria-pressed={mode === 'rush'} onClick={() => chooseMode('rush')}>Daily<span>Three faster waves</span></button></div>}
          <button type="button" className="hero-cta rush-start" onClick={phase === 'paused' ? resume : start}>{phase === 'ready' ? 'Let’s play' : phase === 'paused' ? 'Keep going' : 'Play again'}{phase === 'ended' ? <RotateCcw size={18} /> : <Play size={18} />}</button>
        </>}
      </div></div>}
      <div className="rush-timer-track" aria-hidden="true"><div ref={progress} /></div>
    </div>
    <div id="rush-instructions" className="rush-instructions"><span><span className="rush-mini-tool"><img src={softwareLogos.figma.src} alt="" /></span> Catch tools <BombGlyph size={16} fill="currentColor" /> Dodge</span><span>Move the paddle: mouse, touch, ← → <span className="rush-key-hint">· Space to pause</span></span></div>
    <span className="sr-only" role="status">{phase === 'ended' ? `Round over. ${hud.score} points. Best streak ${hud.longest}.` : phase === 'paused' ? 'Game paused. Choose Keep going to resume.' : phase === 'playing' ? `${hud.lives} lives remaining.` : ''}</span>
  </div>;
  return <><div className="rush-mount" ref={setMount} style={expanded ? { height: reservedHeight } : undefined} />{mount && createPortal(content, expanded ? document.body : mount)}</>;
}
