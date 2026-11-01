import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';

export default function BackToTop({ onActivate }: { onActivate?: () => void }) {
  const [visible, setVisible] = useState(false);
  const reduced = useMotionPreference();
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const activate = () => {
    if (onActivate) onActivate();
    else window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };
  return <AnimatePresence>{visible && <motion.button type="button" onClick={activate} className="back-to-top" aria-label="Back to top" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : .2 }}><ArrowUp size={21} /></motion.button>}</AnimatePresence>;
}
