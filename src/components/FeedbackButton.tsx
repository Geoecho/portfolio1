import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, ArrowUpRight } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';

export default function FeedbackButton({ className, previewOnHover = false }: { className: string; previewOnHover?: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'working' | 'done'>('idle');
  const button = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const reduced = useMotionPreference();
  const clear = useCallback(() => { timers.current.forEach(window.clearTimeout); timers.current = []; }, []);
  const reset = useCallback(() => { clear(); setPhase('idle'); }, [clear]);
  const run = useCallback(() => {
    clear();
    setPhase('working');
    timers.current = [window.setTimeout(() => setPhase('done'), 450), window.setTimeout(() => setPhase('idle'), 2100)];
  }, [clear]);
  useEffect(() => clear, [clear]);
  useEffect(() => {
    if (!previewOnHover || !button.current) return;
    const card = button.current.closest('.principle-card')!;
    card.addEventListener('mouseenter', run);
    card.addEventListener('mouseleave', reset);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { run(); observer.disconnect(); }
    }, { threshold: .7 });
    observer.observe(button.current);
    return () => { observer.disconnect(); card.removeEventListener('mouseenter', run); card.removeEventListener('mouseleave', reset); };
  }, [previewOnHover, run, reset]);

  const label = phase === 'idle' ? 'Save changes' : phase === 'working' ? 'Saving…' : 'Changes saved';
  return <motion.button ref={button} type="button" className={`${className} feedback-action ${phase === 'done' ? 'is-complete' : ''}`} onClick={run} aria-label={label} aria-busy={phase === 'working'} whileHover={reduced ? {} : { y: -2 }} whileTap={reduced ? {} : { scale: .96 }}>
    <AnimatePresence mode="wait" initial={false}><motion.span key={phase} className="feedback-action-content" initial={{ opacity: 0, filter: reduced ? 'none' : 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: reduced ? 'none' : 'blur(4px)' }} transition={{ duration: reduced ? 0 : .12 }}>
      {phase === 'working' ? <Loader2 size={18} className="loading-spinner" /> : phase === 'done' ? <Check size={18} /> : <ArrowUpRight size={18} />}<span aria-live="polite">{label}</span>
    </motion.span></AnimatePresence>
  </motion.button>;
}
