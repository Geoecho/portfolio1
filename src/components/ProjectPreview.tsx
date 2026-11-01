import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useMotionPreference } from '../hooks/useMotionPreference';

export default function ProjectPreview({ image, detailImages, name }: { image: string; detailImages: string[]; name: string }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: .6 });
  const reduced = useMotionPreference();
  const frames = useMemo(() => Array.from(new Set([image, ...detailImages])), [image, detailImages]);
  const [slide, setSlide] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const action = root.current?.closest('button');
    if (!action) return;
    const enter = () => setEngaged(true);
    const leave = () => { setEngaged(false); setSlide(0); };
    action.addEventListener('mouseenter', enter);
    action.addEventListener('mouseleave', leave);
    action.addEventListener('focusin', enter);
    action.addEventListener('focusout', leave);
    return () => {
      action.removeEventListener('mouseenter', enter);
      action.removeEventListener('mouseleave', leave);
      action.removeEventListener('focusin', enter);
      action.removeEventListener('focusout', leave);
    };
  }, []);

  useEffect(() => {
    if (reduced || !inView) { setSlide(0); return; }
    // Load only the images belonging to previews that are actually on screen.
    frames.forEach(src => { const preload = new window.Image(); preload.src = src; });
    if (frames.length < 2) return;
    if (engaged) {
      const interval = window.setInterval(() => setSlide(value => (value + 1) % frames.length), 1800);
      return () => window.clearInterval(interval);
    }
    // One quiet swap on view; continuous playback is reserved for hover/focus.
    const timeout = window.setTimeout(() => setSlide(1), 1800);
    return () => window.clearTimeout(timeout);
  }, [engaged, frames, inView, reduced]);

  return <div ref={root} className="project-preview" data-preview-frame={slide}>
    <AnimatePresence initial={false}><motion.img key={frames[slide]} src={frames[slide]} alt={`${name} design preview`} loading="lazy" initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: reduced ? 0 : .6, ease: [.22, 1, .36, 1] }} /></AnimatePresence>
  </div>;
}
