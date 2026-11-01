import { forwardRef, useEffect, useImperativeHandle, useRef, type HTMLAttributes } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Bomb } from 'lucide-react';

type Handle = { startAnimation: () => void; stopAnimation: () => void };
export const BombIcon = forwardRef<Handle, HTMLAttributes<HTMLSpanElement> & { size?: number }>(function BombIcon({ size = 24, className, ...props }, ref) {
  const controls = useAnimation();
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controls.stop(); }; }, [controls]);
  useImperativeHandle(ref, () => ({
    startAnimation: () => { if (mounted.current) void controls.start({ rotate: [0, -8, 7, 0], transition: { duration: .5, ease: 'easeInOut' } }); },
    stopAnimation: () => { if (mounted.current) { controls.stop(); controls.set({ rotate: 0 }); } },
  }));
  return <span className={className} {...props}><motion.span style={{ display: 'inline-flex' }} animate={controls}><Bomb size={size} fill="currentColor" strokeWidth={1.5} /></motion.span></span>;
});
