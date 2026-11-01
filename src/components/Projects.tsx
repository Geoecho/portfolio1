import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, Maximize2 } from './AnimatedIcons';
import { projects } from '../data/projects';
import { SectionIntro } from './SectionIntro';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import ScrollIndicator, { setScrollIndicator } from './ScrollIndicator';

type Project = typeof projects[number];
const filters = ['All work', 'Websites', 'Apps', 'Interactions'] as const;
const orderedProjects = [...projects].sort((a, b) => (a.id === 6 ? -2 : a.id === -1 ? -1 : 0) - (b.id === 6 ? -2 : b.id === -1 ? -1 : 0));

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const ref = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const hasExpanded = useRef(false);
  const reduced = useMotionPreference();
  const go = (direction: number) => setSlide(value => Math.max(0, Math.min(project.detailImages.length - 1, value + direction)));
  useLayoutEffect(() => {
    if (!hasExpanded.current && !expanded) return;
    hasExpanded.current = true;
    ref.current?.scrollTo({ top: 0, behavior: 'instant' });
    const frame = requestAnimationFrame(() => (expanded ? backButton : expandButton).current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [expanded]);
  useEffect(() => {
    const oldFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const root = document.getElementById('root');
    const hadInert = root?.hasAttribute('inert');
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (expandedRef.current) setExpanded(false); else onClose(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); setSlide(value => Math.min(value + 1, project.detailImages.length - 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSlide(value => Math.max(value - 1, 0)); }
      if (event.key !== 'Tab') return;
      const controls = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]') || []).filter(item => item.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      if (!hadInert) root?.removeAttribute('inert');
      document.removeEventListener('keydown', onKey);
      oldFocus?.focus({ preventScroll: true });
    };
  }, [onClose, project]);

  return <motion.div data-lenis-prevent className={`project-overlay${expanded ? ' is-image-expanded' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }} onClick={onClose}>
    <motion.div layout={!reduced} ref={ref} role="dialog" aria-modal="true" aria-labelledby="project-title" tabIndex={-1} className={`project-dialog ${expanded ? 'gallery-expanded' : ''}`} initial={reduced ? { opacity: 0 } : { y: '100vh', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: '100vh', opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: .55, ease: [.22, 1, .36, 1], layout: { duration: .55, ease: [.22, 1, .36, 1] } }} onClick={event => event.stopPropagation()}>
      <div className="dialog-top">{expanded && <button ref={backButton} type="button" className="dialog-back" onClick={() => setExpanded(false)} aria-label="Back to project"><ArrowLeft size={20} /><span>Back</span></button>}<button className="dialog-close" onClick={onClose} aria-label="Close project">Close <X size={20} /></button></div>
      <motion.div layout={!reduced} transition={{ layout: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] } }} className="dialog-body"><motion.div layout={!reduced} transition={{ layout: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] } }} className="dialog-gallery"><motion.div layout={!reduced} transition={{ layout: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] } }} className="gallery-stage">
        <AnimatePresence mode="wait" initial={false}><motion.img key={slide} src={project.detailImages[slide]} alt={`${project.name} design, image ${slide + 1}`} initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -24 }} transition={{ duration: reduced ? 0 : .25 }} drag={reduced ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={.15} onDragEnd={(_, info) => { if (info.offset.x < -50) go(1); if (info.offset.x > 50) go(-1); }} /></AnimatePresence>
        {!expanded && <button ref={expandButton} type="button" className="gallery-expand icon-button" onClick={() => setExpanded(true)} aria-label="Expand image" aria-pressed={false}><Maximize2 size={19} /></button>}
      </motion.div><div className="gallery-controls"><button className="icon-button" disabled={slide === 0} onClick={() => go(-1)} aria-label="Previous image"><ArrowLeft size={20} /></button><div className="gallery-thumbnails" role="group" aria-label="Project images">{project.detailImages.map((src, i) => <button key={src} onClick={() => setSlide(i)} aria-label={`Show image ${i + 1}`} aria-pressed={slide === i} className={slide === i ? 'selected' : ''}><img src={src} alt="" /></button>)}</div><button className="icon-button" disabled={slide === project.detailImages.length - 1} onClick={() => go(1)} aria-label="Next image"><ArrowRight size={20} /></button></div><span className="sr-only" role="status">Image {slide + 1} of {project.detailImages.length}</span></motion.div>
      <motion.div className="dialog-copy" animate={{ opacity: expanded ? 0 : 1 }} transition={{ duration: reduced ? 0 : .25, delay: expanded ? 0 : .15 }} aria-hidden={expanded} {...(expanded ? { inert: '' } : {})}><h2 id="project-title">{project.name}</h2><p className="project-category">{project.category}</p><p className="dialog-description">{project.longDescription}</p>{project.url && <a className="hero-cta" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18} /></a>}</motion.div></motion.div>
    </motion.div>
  </motion.div>;
}

export default function Projects({ selectedId, onSelect }: { selectedId: number | null; onSelect: (id: number | null) => void }) {
  const [filter, setFilter] = useState<typeof filters[number]>('All work');
  const selected = projects.find(project => project.id === selectedId) || null;
  const reduced = useMotionPreference();
  const visible = orderedProjects.filter(project => filter === 'All work' || (filter === 'Websites' && project.category.includes('Website')) || (filter === 'Apps' && project.category === 'App Design') || (filter === 'Interactions' && project.category === 'Login Screen'));
  const closeRef = useRef(() => onSelect(null));
  const section = useRef<HTMLElement>(null);
  const focusProject = useRef<(index: number) => void>(() => undefined);
  useGSAP(() => {
    const root = section.current!;
    const stage = root.querySelector<HTMLElement>('.work-grid')!;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>(':scope > article'));
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', space: '(min-height: 640px)' }, match => {
      if (!match.conditions?.motion || !match.conditions.space) {
        if (match.conditions?.motion) cards.forEach(card => gsap.from(card, { autoAlpha: 0, y: 32, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } }));
        return;
      }
      root.classList.add('work-stack');
      const position = (slot: number) => ({ y: slot * 18, scale: 1 - slot * .045, filter: `blur(${slot * 3}px)`, autoAlpha: slot < 3 ? 1 : 0 });
      cards.forEach((card, index) => gsap.set(card, { ...position(Math.min(index, 3)), zIndex: cards.length - index, yPercent: 0 }));
      let active = -1;
      const showActive = (index: number) => {
        if (active === index) return;
        active = index;
        root.dataset.projectIndex = String(index);
        cards.forEach((card, i) => { card.dataset.front = String(i === index); });
        setScrollIndicator(root.querySelector('.work-stack-indicator'), index, visible[index].name);
      };
      showActive(0);
      if (cards.length === 1) return () => {
        root.classList.remove('work-stack');
        delete root.dataset.projectIndex;
        cards.forEach(card => { delete card.dataset.front; });
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'project-stack', trigger: stage,
          start: () => `top ${(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-clearance')) || 92) + 12}px`,
          end: () => `+=${Math.max(480, window.innerHeight * .78) * (cards.length - 1)}`,
          pin: true, pinSpacing: true, scrub: .4, anticipatePin: 1,
        },
      });
      for (let index = 0; index < cards.length - 1; index++) {
        const at = index + .35;
        timeline.fromTo(cards[index], { ...position(0), yPercent: 0 }, { y: -28, yPercent: -18, scale: .96, autoAlpha: 0, filter: 'blur(8px)', duration: .65, ease: 'power2.inOut', immediateRender: false }, at);
        for (let next = index + 1; next < Math.min(cards.length, index + 4); next++) {
          timeline.fromTo(cards[next], { ...position(next - index), yPercent: 0 }, { ...position(next - index - 1), duration: .65, ease: 'power2.inOut', immediateRender: false }, at);
        }
      }
      timeline.to({}, { duration: .5 }, cards.length - 1);
      timeline.eventCallback('onUpdate', () => showActive(Math.min(cards.length - 1, Math.floor(timeline.time() + .25))));
      // Tabbing to the next card also brings it to the front of the scroll scene.
      let focusFrame = 0;
      focusProject.current = index => {
        if (index === active) return;
        cancelAnimationFrame(focusFrame);
        // Wait for the browser's own focus scrolling before positioning the scene.
        focusFrame = requestAnimationFrame(() => {
          const trigger = timeline.scrollTrigger!;
          const progress = (index + .12) / timeline.duration();
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
          ScrollTrigger.update();
          trigger.getTween()?.progress(1);
          timeline.progress(progress);
        });
      };
      return () => {
        cancelAnimationFrame(focusFrame);
        focusProject.current = () => undefined;
        root.classList.remove('work-stack');
        delete root.dataset.projectIndex;
        cards.forEach(card => { delete card.dataset.front; });
      };
    });
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(frame); media.revert(); };
  }, { scope: section, dependencies: [filter, reduced], revertOnUpdate: true });
  return <section ref={section} id="projects" className="editorial-section">
    <SectionIntro title="Projects." />
    <div className="work-toolbar"><div className="filter-list" role="group" aria-label="Filter projects">{filters.map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`filter-button ${filter === item ? 'active' : ''}`}>{filter === item && <motion.span className="filter-active" layoutId="work-filter" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}<span>{item}</span></button>)}</div><span className="work-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</span></div>
    <div className="work-grid">{visible.map((project, index) => <article data-project-id={project.id} className={project.id === 6 ? 'work-featured' : undefined} key={project.id}>
      <div className="work-card-reveal"><motion.button type="button" onFocus={() => focusProject.current(index)} onClick={() => onSelect(project.id)} className="work-card group" aria-label={`Explore ${project.name}`} whileTap={reduced ? {} : { scale: .985 }}>
        <div className="work-art"><img src={project.image} alt={`${project.name} design preview`} loading="lazy" /></div><div className="work-card-copy"><div className="work-info"><div><span>{project.category}</span><h3>{project.name}</h3></div><span className="work-card-arrow"><ArrowUpRight size={24} /></span></div><p className="work-description">{project.description}</p></div>
      </motion.button></div>
    </article>)}<ScrollIndicator labels={visible.map(project => project.name)} label="Project progress" className="work-stack-indicator" /></div>
    {createPortal(<AnimatePresence>{selected && <ProjectDialog key={selected.id} project={selected} onClose={closeRef.current} />}</AnimatePresence>, document.body)}
  </section>;
}
