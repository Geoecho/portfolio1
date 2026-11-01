import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useInView } from 'framer-motion';
import { projects } from '../data/projects';
import { gsap, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ArrowUpRight } from './AnimatedIcons';

const featured = [6, -1, 2].map(id => projects.find(project => project.id === id)!);
const count = featured.length;
// Identical cycles let native scrolling wrap without moving the visible cards.
const slides = Array.from({ length: count * 3 }, (_, index) => featured[index % count]);
const wrap = (value: number) => ((value % count) + count) % count;

export default function HeroProjectStack({ onOpenProject }: { onOpenProject: (id: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);
  const segments = useRef<HTMLElement[]>([]);
  const width = useRef(0);
  const frame = useRef(0);
  const settleTimer = useRef(0);
  const settleAction = useRef<() => void>(() => {});
  const physicalSlot = useRef(count);
  const normalizingTo = useRef<number | null>(null);
  const touching = useRef(false);
  const scrolling = useRef(false);
  const suppressClickUntil = useRef(0);
  const touch = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const mouse = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const focusAfterScroll = useRef(false);
  const [slot, setSlot] = useState(count);
  const [isTouching, setIsTouching] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const inView = useInView(root, { amount: .6 });
  const reduced = useMotionPreference();

  const paint = useCallback(() => {
    const scroller = track.current;
    if (!scroller?.clientWidth) return;
    const progress = scroller.scrollLeft / scroller.clientWidth;
    const nearest = Math.max(0, Math.min(slides.length - 1, Math.round(progress)));
    if (nearest !== physicalSlot.current) { physicalSlot.current = nearest; setSlot(nearest); }
    const phase = reduced ? Math.round(progress) : progress;
    cards.current.forEach((card, index) => {
      const angle = (wrap(index - phase + count / 2) - count / 2) * Math.PI * 2 / count;
      const sine = Math.sin(angle), cosine = Math.cos(angle);
      const depth = (1 - cosine) / 1.5;
      const orbit = sine * width.current * .48 * Math.max(0, (cosine + .5) / 1.5);
      // One reversible path for the whole stack, driven directly by the scroll position.
      gsap.set(card, {
        x: orbit + width.current * (.0525 - .020207 * sine) * depth,
        y: (27 - 10.3923 * sine) * depth,
        scale: 1 - (.0675 - .025981 * sine) * depth,
        rotation: (3 - 1.1547 * sine) * depth,
        filter: `blur(${Math.max(0, (4.5 - 1.73205 * sine) * depth)}px)`,
        zIndex: Math.round((cosine + 1) * 1000 + sine * 10), force3D: true,
      });
      const distance = Math.abs(wrap(index - progress + count / 2) - count / 2);
      const weight = Math.max(0, 1 - distance);
      if (segments.current[index]) gsap.set(segments.current[index], { flexGrow: 1 + weight * 2, backgroundColor: index === wrap(nearest) ? '#d60000' : '#000000' });
    });
  }, [reduced]);
  const requestPaint = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; paint(); });
  }, [paint]);
  const scheduleSettle = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => settleAction.current(), 160);
  }, []);
  const settleScroll = useCallback(() => {
    const scroller = track.current;
    if (!scroller?.clientWidth || touching.current || mouse.current) return;
    const progress = scroller.scrollLeft / scroller.clientWidth;
    const nearest = Math.round(progress);
    if (Math.abs(progress - nearest) > .01) {
      scroller.scrollTo({ left: nearest * scroller.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
      scheduleSettle(); return;
    }
    const canonical = count + wrap(nearest);
    const left = canonical * scroller.clientWidth;
    if (Math.abs(scroller.scrollLeft - left) > 1) {
      normalizingTo.current = left;
      scroller.scrollTo({ left, behavior: 'instant' });
    }
    paint(); scrolling.current = false; setIsScrolling(false);
    if (focusAfterScroll.current) {
      focusAfterScroll.current = false;
      scroller.querySelector<HTMLButtonElement>(`[data-slot="${canonical}"]`)?.focus({ preventScroll: true });
    }
  }, [paint, reduced, scheduleSettle]);
  settleAction.current = settleScroll;

  useGSAP(() => {
    const scroller = track.current!;
    cards.current = Array.from(root.current!.querySelectorAll<HTMLElement>('.hero-stack-card'));
    segments.current = Array.from(root.current!.querySelectorAll<HTMLElement>('.hero-stack-indicator > span'));
    const resize = () => {
      const active = wrap(physicalSlot.current);
      width.current = root.current!.querySelector<HTMLElement>('.hero-stack-scene')!.clientWidth;
      normalizingTo.current = (count + active) * scroller.clientWidth;
      scroller.scrollTo({ left: normalizingTo.current, behavior: 'instant' });
      paint();
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(scroller);
    const end = () => settleAction.current();
    scroller.addEventListener('scrollend', end);
    return () => {
      observer.disconnect(); scroller.removeEventListener('scrollend', end);
      cancelAnimationFrame(frame.current); window.clearTimeout(settleTimer.current);
      frame.current = 0; touching.current = false; scrolling.current = false;
    };
  }, { scope: root, dependencies: [paint], revertOnUpdate: true });

  const onScroll = () => {
    const scroller = track.current!;
    requestPaint();
    if (normalizingTo.current !== null && Math.abs(scroller.scrollLeft - normalizingTo.current) < 1) { normalizingTo.current = null; return; }
    normalizingTo.current = null;
    if (!scrolling.current) { scrolling.current = true; setIsScrolling(true); }
    scheduleSettle();
  };
  const moveTo = (next: number, keyboard = false) => {
    const scroller = track.current;
    if (!scroller) return;
    focusAfterScroll.current = keyboard;
    scrolling.current = true; setIsScrolling(true);
    scroller.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, next)) * scroller.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
    scheduleSettle();
  };
  const finishTouch = () => {
    if (touch.current?.moved) suppressClickUntil.current = performance.now() + 350;
    touch.current = null; touching.current = false; setIsTouching(false); scheduleSettle();
  };
  const mouseDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    mouse.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
    event.currentTarget.style.scrollSnapType = 'none';
    touching.current = true; setIsTouching(true);
  };
  const mouseMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = mouse.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; event.currentTarget.setPointerCapture(event.pointerId); }
    if (drag.moved) event.currentTarget.scrollLeft = drag.left - dx;
  };
  const mouseUp = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = mouse.current;
    if (!drag || drag.id !== event.pointerId) return;
    mouse.current = null; touching.current = false; setIsTouching(false);
    event.currentTarget.style.scrollSnapType = '';
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      suppressClickUntil.current = performance.now() + 350;
      const dx = event.clientX - drag.x;
      const step = !cancelled && Math.abs(dx) > 32 ? (dx < 0 ? 1 : -1) : 0;
      moveTo(Math.round(drag.left / event.currentTarget.clientWidth) + step);
    } else scheduleSettle();
  };

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (reduced || hovered || focused || isTouching || isScrolling || !inView || !pageVisible) return;
    const timer = window.setTimeout(() => {
      const scroller = track.current;
      if (scroller && !touching.current && !scrolling.current) moveTo(Math.round(scroller.scrollLeft / scroller.clientWidth) + 1);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [slot, reduced, hovered, focused, isTouching, isScrolling, inView, pageVisible]);

  return <div ref={root} className="hero-stack-container" role="group" aria-roledescription="carousel" aria-label="Featured projects" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }} onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const scroller = track.current!;
      moveTo(Math.round(scroller.scrollLeft / scroller.clientWidth) + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  }}>
    <div className="hero-stack-scene"><div className="hero-stack-visuals" aria-hidden="true">{featured.map((project, index) => <article key={project.id} className="hero-stack-card" data-project-id={project.id} data-front={index === wrap(slot)}>
      <div className="hero-stack-art"><img src={project.image} alt="" /></div>
      <div className="hero-stack-caption"><div><h2>{project.name}</h2><p>{project.category}</p></div><ArrowUpRight size={21} /></div>
    </article>)}</div>
      <div ref={track} className="hero-stack-track" onScroll={onScroll} onTouchStart={event => {
        touching.current = true; setIsTouching(true);
        const point = event.touches[0];
        touch.current = { x: point.clientX, y: point.clientY, moved: scrolling.current };
      }} onTouchMove={event => {
        const point = event.touches[0];
        if (touch.current && Math.hypot(point.clientX - touch.current.x, point.clientY - touch.current.y) > 8) touch.current.moved = true;
      }} onTouchEnd={finishTouch} onTouchCancel={finishTouch} onPointerDown={mouseDown} onPointerMove={mouseMove} onPointerUp={event => mouseUp(event)} onPointerCancel={event => mouseUp(event, true)} onPointerLeave={event => { if (mouse.current && !mouse.current.moved) mouseUp(event, true); }}>
        {slides.map((project, index) => <button key={index} type="button" className="hero-stack-hit" data-slot={index} tabIndex={index === slot ? 0 : -1} aria-hidden={index !== slot} aria-label={`View ${project.name} project`} onClick={event => { if (event.detail === 0 || performance.now() >= suppressClickUntil.current) onOpenProject(project.id); }} />)}
      </div>
    </div>
    <div className="hero-stack-indicator" aria-hidden="true">{featured.map((project, index) => <span key={project.id} data-active={index === wrap(slot)} />)}</div>
  </div>;
}
