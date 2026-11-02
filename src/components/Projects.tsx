import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight } from './AnimatedIcons';
import { projects } from '../data/projects';
import { SectionIntro } from './SectionIntro';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scrollMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';
import FullscreenView from './FullscreenView';
import ScrollIndicator, { setScrollIndicator } from './ScrollIndicator';

type Project = typeof projects[number];
const filters = ['All work', 'Websites', 'Apps', 'Interactions'] as const;
const orderedProjects = [...projects].sort((a, b) => (a.id === 6 ? -2 : a.id === -1 ? -1 : 0) - (b.id === 6 ? -2 : b.id === -1 ? -1 : 0));

function ProjectView({ project, onClose }: { project: Project; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const reduced = useMotionPreference();
  const reveal = (delay = 0) => ({
    initial: reduced ? false as const : { opacity: 0, y: 12, filter: 'blur(7px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] as [number, number, number, number] },
  });
  const go = (direction: number) => setSlide(value => Math.max(0, Math.min(project.detailImages.length - 1, value + direction)));
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); setSlide(value => Math.min(value + 1, project.detailImages.length - 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSlide(value => Math.max(value - 1, 0)); }
    };
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [project]);
  return <FullscreenView className="project-view" labelledBy="project-title" onClose={onClose}>
    <header className="project-view-bar"><button type="button" className="view-back" onClick={onClose}><ArrowLeft size={20} /><span>Back</span></button><span className="project-view-name">{project.name}</span>{project.url && <a className="project-visit" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18} /></a>}</header>
    <div className="project-view-scroll">
      <div className="project-view-intro"><motion.div {...reveal(.18)}><p>{project.category}</p><h2 id="project-title">{project.name}<span>.</span></h2></motion.div><motion.p {...reveal(.26)} className="project-view-description">{project.longDescription}</motion.p></div>
      <motion.div {...reveal(.3)} className="project-view-gallery">
        <div className="project-image-stage">
          <AnimatePresence mode="wait" initial={false}><motion.img key={slide} src={project.detailImages[slide]} alt={project.name + ' design, image ' + (slide + 1)} initial={{ opacity: 0, y: reduced ? 0 : 16, filter: reduced ? 'none' : 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.12} dragMomentum={false} onDragEnd={(_, info) => { if (info.offset.x < -40 || (info.offset.x < -12 && info.velocity.x < -450)) go(1); else if (info.offset.x > 40 || (info.offset.x > 12 && info.velocity.x > 450)) go(-1); }} /></AnimatePresence>
        </div>
        <div className="project-image-controls"><button type="button" className="icon-button" disabled={slide === 0} onClick={() => go(-1)} aria-label="Previous image"><ArrowLeft size={20} /></button><div className="project-image-dots" role="group" aria-label="Project images">{project.detailImages.map((src, i) => <button type="button" key={src} onClick={() => setSlide(i)} aria-label={ 'Show image ' + (i + 1)} aria-pressed={slide === i}><span /></button>)}</div><button type="button" className="icon-button" disabled={slide === project.detailImages.length - 1} onClick={() => go(1)} aria-label="Next image"><ArrowRight size={20} /></button></div>
        <span className="sr-only" role="status">Image {slide + 1} of {project.detailImages.length}</span>
      </motion.div>
    </div>
  </FullscreenView>;
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
    {createPortal(<AnimatePresence>{selected && <ProjectView key={selected.id} project={selected} onClose={closeRef.current} />}</AnimatePresence>, document.body)}
  </section>;
}
