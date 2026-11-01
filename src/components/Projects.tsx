import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, Maximize2, Minimize2 } from './AnimatedIcons';
import { projects } from '../data/projects';
import { SectionIntro } from './SectionIntro';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import ProjectPreview from './ProjectPreview';

type Project = typeof projects[number];
const filters = ['All work', 'Websites', 'Apps', 'Interactions'] as const;
const orderedProjects = [...projects].sort((a, b) => (a.id === 6 ? -2 : a.id === -1 ? -1 : 0) - (b.id === 6 ? -2 : b.id === -1 ? -1 : 0));

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const go = (direction: number) => setSlide(value => Math.max(0, Math.min(project.detailImages.length - 1, value + direction)));
  useEffect(() => {
    const oldFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const root = document.getElementById('root');
    const hadInert = root?.hasAttribute('inert');
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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

  return <motion.div data-lenis-prevent className="project-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }} onClick={onClose}>
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby="project-title" tabIndex={-1} className={`project-dialog ${expanded ? 'gallery-expanded' : ''}`} initial={reduced ? { opacity: 0 } : { y: '100vh', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: '100vh', opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: .55, ease: [.22, 1, .36, 1] }} onClick={event => event.stopPropagation()}>
      <div className="dialog-top"><button className="dialog-close" onClick={onClose} aria-label="Close project">Close <X size={20} /></button></div>
      <div className="dialog-body"><div className="dialog-gallery"><div className="gallery-stage">
        <AnimatePresence mode="wait" initial={false}><motion.img key={slide} src={project.detailImages[slide]} alt={`${project.name} design, image ${slide + 1}`} initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -24 }} transition={{ duration: reduced ? 0 : .25 }} drag={reduced ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={.15} onDragEnd={(_, info) => { if (info.offset.x < -50) go(1); if (info.offset.x > 50) go(-1); }} /></AnimatePresence>
        <button className="gallery-expand icon-button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Reduce image' : 'Expand image'} aria-pressed={expanded}>{expanded ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
      </div><div className="gallery-controls"><button className="icon-button" disabled={slide === 0} onClick={() => go(-1)} aria-label="Previous image"><ArrowLeft size={20} /></button><div className="gallery-thumbnails" role="group" aria-label="Project images">{project.detailImages.map((src, i) => <button key={src} onClick={() => setSlide(i)} aria-label={`Show image ${i + 1}`} aria-pressed={slide === i} className={slide === i ? 'selected' : ''}><img src={src} alt="" /></button>)}</div><button className="icon-button" disabled={slide === project.detailImages.length - 1} onClick={() => go(1)} aria-label="Next image"><ArrowRight size={20} /></button></div><span className="sr-only" role="status">Image {slide + 1} of {project.detailImages.length}</span></div>
      <div className="dialog-copy"><h2 id="project-title">{project.name}</h2><p className="project-category">{project.category}</p><p className="dialog-description">{project.longDescription}</p>{project.url && <a className="hero-cta" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18} /></a>}</div></div>
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
  useGSAP(context => {
    if (reduced) return;
    const ids = new Set(visible.map(project => String(project.id)));
    const cards = gsap.utils.toArray<HTMLElement>('.work-card-reveal', section.current!).filter(card => ids.has(card.closest<HTMLElement>('[data-project-id]')!.dataset.projectId!));
    gsap.set(cards, { autoAlpha: 0, y: 64, filter: 'blur(6px)' });
    ScrollTrigger.batch(cards, {
      start: 'top 90%', once: true, interval: .12,
      onEnter: batch => { context.add(() => { gsap.to(batch, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .85, stagger: .16, ease: 'power3.out', overwrite: true }); }); },
    });
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, { scope: section, dependencies: [filter, reduced], revertOnUpdate: true });
  return <section ref={section} id="projects" className="editorial-section">
    <SectionIntro title="Projects." />
    <div className="work-toolbar"><div className="filter-list" role="group" aria-label="Filter projects">{filters.map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`filter-button ${filter === item ? 'active' : ''}`}>{filter === item && <motion.span className="filter-active" layoutId="work-filter" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}<span>{item}</span></button>)}</div><span className="work-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</span></div>
    <motion.div layout={!reduced} onLayoutAnimationComplete={() => ScrollTrigger.refresh()} className="work-grid"><AnimatePresence mode="popLayout" initial={false}>{visible.map(project => <motion.article data-project-id={project.id} layout={!reduced} className={project.id === 6 ? 'work-featured' : undefined} key={project.id} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }}>
      <div className="work-card-reveal"><motion.button type="button" onClick={() => onSelect(project.id)} className="work-card group" aria-label={`Explore ${project.name}`} whileHover={reduced ? {} : { y: -6 }} whileTap={reduced ? {} : { scale: .985 }}>
        <div className="work-art"><ProjectPreview image={project.image} detailImages={project.detailImages} name={project.name} /></div><div className="work-card-copy"><div className="work-info"><div><span>{project.category}</span><h3>{project.name}</h3></div><span className="work-card-arrow"><ArrowUpRight size={24} /></span></div><p className="work-description">{project.description}</p></div>
      </motion.button></div>
    </motion.article>)}</AnimatePresence></motion.div>
    {createPortal(<AnimatePresence>{selected && <ProjectDialog key={selected.id} project={selected} onClose={closeRef.current} />}</AnimatePresence>, document.body)}
  </section>;
}
