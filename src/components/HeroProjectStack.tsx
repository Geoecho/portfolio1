import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../data/projects';
import { gsap, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ArrowUpRight } from './AnimatedIcons';

const featured = [6, -1, 2].map(id => projects.find(project => project.id === id)!);
const position = (slot: number) => ({
  xPercent: slot * 3.5,
  y: slot * 18,
  scale: 1 - slot * .045,
  rotation: slot * 2,
  filter: `blur(${slot * 3}px)`,
  zIndex: featured.length - slot,
});

export default function HeroProjectStack({ onOpenProject }: { onOpenProject: (id: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLButtonElement[]>([]);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const advance = useRef<(next: number) => void>(() => undefined);
  const [active, setActive] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const inView = useInView(root, { amount: .6 });
  const reduced = useMotionPreference();

  const { contextSafe } = useGSAP(() => {
    cards.current = gsap.utils.toArray<HTMLButtonElement>('.hero-stack-card', root.current!);
    cards.current.forEach((card, index) => gsap.set(card, position((index - activeRef.current + featured.length) % featured.length)));
    busy.current = false;
    setSwitching(false);
    return () => { busy.current = false; };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  const goTo = contextSafe((next: number) => {
    if (busy.current || next === activeRef.current) return;
    busy.current = true;
    setSwitching(true);
    const previous = activeRef.current;
    const finish = () => {
      activeRef.current = next;
      setActive(next);
      busy.current = false;
      setSwitching(false);
    };
    if (reduced) {
      cards.current.forEach((card, index) => gsap.set(card, position((index - next + featured.length) % featured.length)));
      finish();
      return;
    }
    const direction = (next - previous + featured.length) % featured.length === 1 ? -1 : 1;
    const timeline = gsap.timeline({ onComplete: finish });
    // Lift the outgoing card clear of the stack before it settles behind.
    timeline.to(cards.current[previous], { xPercent: direction * 22, y: -18, rotation: direction * 6, scale: 1.015, duration: .36, ease: 'power2.inOut' }, 0)
      .set(cards.current[previous], { zIndex: 1 }, .36)
      .to(cards.current[previous], { ...position((previous - next + featured.length) % featured.length), duration: .66, ease: 'power3.out' }, .36);
    cards.current.forEach((card, index) => {
      if (index === previous) return;
      const target = position((index - next + featured.length) % featured.length);
      timeline.set(card, { zIndex: target.zIndex }, .32)
        .to(card, { ...target, duration: .7, ease: 'power3.inOut' }, .22);
    });
  });
  advance.current = goTo;

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (reduced || hovered || focused || !inView || !pageVisible || switching) return;
    const timer = window.setTimeout(() => advance.current((activeRef.current + 1) % featured.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, reduced, hovered, focused, inView, pageVisible, switching]);

  return <div ref={root} className="hero-stack-container" role="group" aria-label="Featured projects" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="hero-stack-scene" aria-live="off">{featured.map((project, index) => <button type="button" key={project.id} className="hero-stack-card" data-project-id={project.id} data-front={index === active} tabIndex={index === active ? 0 : -1} aria-hidden={index !== active} disabled={index !== active || switching} onClick={() => onOpenProject(project.id)} aria-label={`View ${project.name} project`}>
      <div className="hero-stack-art"><img src={project.image} alt={`${project.name} design preview`} /></div>
      <div className="hero-stack-caption"><div><h2>{project.name}</h2><p>{project.category}</p></div><ArrowUpRight size={21} /></div>
    </button>)}</div>
    <div className="hero-stack-indicator" aria-hidden="true">{featured.map((project, index) => <motion.span key={project.id} data-active={index === active} initial={false} animate={{ flexGrow: index === active ? 3 : 1, backgroundColor: index === active ? '#d60000' : '#000000' }} transition={{ duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] }} />)}</div>
  </div>;
}
