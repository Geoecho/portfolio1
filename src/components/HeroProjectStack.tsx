import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../data/projects';
import { gsap, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ArrowUpRight } from './AnimatedIcons';

const featured = [6, -1, 2].map(id => projects.find(project => project.id === id)!);
const position = (slot: number) => ({
  x: 0, xPercent: slot * 3.5, y: slot * 18, scale: 1 - slot * .045,
  rotation: slot * 2, filter: `blur(${slot * 3}px)`, zIndex: featured.length - slot,
});
type Direction = -1 | 1;
type Gesture = {
  id: number; x: number; y: number; dx: number; dy: number; width: number; offset: number;
  axis: 'pending' | 'horizontal' | 'vertical'; canOpen: boolean;
  samples: { x: number; time: number }[];
};

export default function HeroProjectStack({ onOpenProject }: { onOpenProject: (id: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLButtonElement[]>([]);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const advance = useRef<(next: number, swipe?: Direction) => void>(() => undefined);
  const pendingSwipe = useRef<Direction | null>(null);
  const queuedFrame = useRef(0);
  const settle = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const pendingTap = useRef<number | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const inView = useInView(root, { amount: .6 });
  const reduced = useMotionPreference();

  const { contextSafe } = useGSAP(() => {
    cards.current = gsap.utils.toArray<HTMLButtonElement>('.hero-stack-card', root.current!);
    cards.current.forEach((card, index) => gsap.set(card, { ...position((index - activeRef.current + featured.length) % featured.length), autoAlpha: 1 }));
    busy.current = false; gesture.current = null; pendingSwipe.current = null; pendingTap.current = null;
    setSwitching(false); setDragging(false);
    return () => { busy.current = false; settle.current?.kill(); cancelAnimationFrame(queuedFrame.current); };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  const goTo = contextSafe((next: number, swipe?: Direction) => {
    if (busy.current) { if (swipe) pendingSwipe.current = swipe; return; }
    if (next === activeRef.current) return;
    settle.current?.kill();
    const restoreKeyboardFocus = focused && root.current?.contains(document.activeElement);
    busy.current = true; setSwitching(true);
    const previous = activeRef.current;
    const finish = () => {
      activeRef.current = next; setActive(next); busy.current = false; setSwitching(false);
      const pending = pendingSwipe.current; pendingSwipe.current = null;
      queuedFrame.current = requestAnimationFrame(() => {
        if (pending) advance.current((next + (pending < 0 ? 1 : featured.length - 1)) % featured.length, pending);
        else if (restoreKeyboardFocus) cards.current[next]?.focus({ preventScroll: true });
      });
    };
    if (reduced) {
      cards.current.forEach((card, index) => gsap.set(card, { ...position((index - next + featured.length) % featured.length), autoAlpha: 1 }));
      finish(); return;
    }
    const direction = swipe ?? ((next - previous + featured.length) % featured.length === 1 ? -1 : 1);
    const timeline = gsap.timeline({ onComplete: finish });
    if (swipe) {
      const card = cards.current[previous];
      const width = card.offsetWidth;
      const offset = Number(gsap.getProperty(card, 'x')) || 0;
      // Continue outwards from the finger's release point; never recenter a committed swipe.
      const exitX = direction * Math.max(width * .48, Math.abs(offset) + width * .18);
      timeline.to(card, { x: exitX, xPercent: 0, y: -8, rotation: direction * 7, scale: .98, autoAlpha: 0, duration: .24, ease: 'power2.out' }, 0)
        .set(card, { ...position((previous - next + featured.length) % featured.length), autoAlpha: 1 }, .24);
    } else {
      timeline.to(cards.current[previous], { x: 0, xPercent: direction * 22, y: -18, rotation: direction * 6, scale: 1.015, duration: .22, ease: 'power2.inOut' }, 0)
        .set(cards.current[previous], { zIndex: 1 }, .22)
        .to(cards.current[previous], { ...position((previous - next + featured.length) % featured.length), duration: .42, ease: 'power3.out' }, .22);
    }
    cards.current.forEach((card, index) => {
      if (index === previous) return;
      const target = position((index - next + featured.length) % featured.length);
      timeline.set(card, { zIndex: target.zIndex }, swipe ? .18 : .2)
        .to(card, { ...target, autoAlpha: 1, duration: swipe ? .38 : .46, ease: swipe ? 'power3.out' : 'power3.inOut' }, swipe ? 0 : .14);
    });
  });
  advance.current = goTo;

  const springBack = contextSafe(() => {
    if (busy.current) return;
    settle.current?.kill();
    settle.current = gsap.to(cards.current[activeRef.current], { x: 0, rotation: 0, duration: reduced ? 0 : .22, ease: 'power3.out' });
  });
  const updateGesture = (event: ReactPointerEvent<HTMLDivElement>, current: Gesture) => {
    current.dx = event.clientX - current.x; current.dy = event.clientY - current.y;
    current.samples.push({ x: event.clientX, time: event.timeStamp });
    current.samples = current.samples.filter(sample => event.timeStamp - sample.time <= 100);
    if (current.axis === 'pending' && Math.max(Math.abs(current.dx), Math.abs(current.dy)) >= 6) {
      current.axis = Math.abs(current.dx) >= Math.abs(current.dy) ? 'horizontal' : 'vertical';
    }
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || gesture.current) return;
    pendingTap.current = null;
    settle.current?.kill();
    const card = cards.current[activeRef.current];
    gesture.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0,
      width: event.currentTarget.clientWidth, offset: busy.current ? 0 : Number(gsap.getProperty(card, 'x')) || 0,
      axis: 'pending', canOpen: !busy.current && card.contains(event.target as Node),
      samples: [{ x: event.clientX, time: event.timeStamp }],
    };
    // The scene stays still while cards move, including swipes that leave its edges.
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    updateGesture(event, current);
    if (current.axis === 'horizontal' && !reduced && !busy.current) {
      const x = current.offset + Math.max(-current.width * .8, Math.min(current.width * .8, current.dx * .75));
      gsap.set(cards.current[activeRef.current], { x, rotation: Math.max(-6, Math.min(6, current.dx * .012)) });
    }
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    updateGesture(event, current);
    gesture.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.axis === 'horizontal') {
      const first = current.samples[0], last = current.samples[current.samples.length - 1];
      const velocity = (last.x - first.x) / Math.max(1, last.time - first.time);
      const flick = Math.abs(current.dx) >= 12 && Math.abs(velocity) >= .35 && Math.sign(velocity) === Math.sign(current.dx);
      if (Math.abs(current.dx) >= Math.min(44, current.width * .12) || flick) {
        const direction: Direction = current.dx < 0 ? -1 : 1;
        advance.current((activeRef.current + (direction < 0 ? 1 : featured.length - 1)) % featured.length, direction);
      } else springBack();
    } else {
      springBack();
      if (current.axis === 'pending' && current.canOpen && !busy.current) pendingTap.current = featured[activeRef.current].id;
    }
  };
  const cancelGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (gesture.current?.id !== event.pointerId) return;
    gesture.current = null; pendingTap.current = null; setDragging(false);
    springBack();
  };

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (reduced || hovered || focused || dragging || !inView || !pageVisible || switching) return;
    const timer = window.setTimeout(() => { if (!gesture.current) advance.current((activeRef.current + 1) % featured.length); }, 2800);
    return () => window.clearTimeout(timer);
  }, [active, reduced, hovered, focused, dragging, inView, pageVisible, switching]);

  return <div ref={root} className="hero-stack-container" role="group" aria-label="Featured projects" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }} onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); advance.current((activeRef.current + (event.key === 'ArrowRight' ? 1 : featured.length - 1)) % featured.length); } }}>
    <div className="hero-stack-scene" aria-live="off" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={cancelGesture} onLostPointerCapture={event => { if (event.target === event.currentTarget) cancelGesture(event); }} onClick={event => {
      // Open on click, after pointer capture ends, so the same tap cannot hit the new modal.
      if (event.detail === 0 || pendingTap.current === null) return;
      const projectId = pendingTap.current; pendingTap.current = null; onOpenProject(projectId);
    }}>{featured.map((project, index) => <button type="button" key={project.id} className="hero-stack-card" data-project-id={project.id} data-front={index === active} tabIndex={index === active ? 0 : -1} aria-hidden={index !== active} aria-disabled={switching || undefined} disabled={index !== active} onClick={event => { if (!busy.current && event.detail === 0) onOpenProject(project.id); }} aria-label={`View ${project.name} project`}>
      <div className="hero-stack-art"><img src={project.image} alt={`${project.name} design preview`} /></div>
      <div className="hero-stack-caption"><div><h2>{project.name}</h2><p>{project.category}</p></div><ArrowUpRight size={21} /></div>
    </button>)}</div>
    <div className="hero-stack-indicator" aria-hidden="true">{featured.map((project, index) => <motion.span key={project.id} data-active={index === active} initial={false} animate={{ flexGrow: index === active ? 3 : 1, backgroundColor: index === active ? '#d60000' : '#000000' }} transition={{ duration: reduced ? 0 : .38, ease: [.22, 1, .36, 1] }} />)}</div>
  </div>;
}
