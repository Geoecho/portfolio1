import { forwardRef, useEffect, useImperativeHandle, useRef, type HTMLAttributes } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

type Handle = { startAnimation: () => void; stopAnimation: () => void };

export const GamepadIcon = forwardRef<Handle, HTMLAttributes<HTMLSpanElement> & { size?: number }>(function GamepadIcon({ size = 24, className, ...props }, ref) {
  const controls = useAnimation();
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controls.stop(); }; }, [controls]);
  useImperativeHandle(ref, () => ({
    startAnimation: () => { if (mounted.current) void controls.start({ rotate: [0, -9, 8, -4, 0], y: [0, -2, 0], transition: { duration: .55, ease: 'easeInOut' } }); },
    stopAnimation: () => { if (mounted.current) { controls.stop(); controls.set({ rotate: 0, y: 0 }); } },
  }));
  return <span className={className} {...props}><motion.span style={{ display: 'inline-flex' }} animate={controls}><Gamepad2 size={size} /></motion.span></span>;
});
