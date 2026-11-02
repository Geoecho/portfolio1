import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreference } from '../hooks/useMotionPreference';

let openViews = 0;
let savedOverflow = '';
let savedInert = false;

/** Page-sized views keep the portfolio's scroll position and keyboard focus. */
export default function FullscreenView({ children, className, labelledBy, onClose, onEscape, direction = 'right' }: {
  children: ReactNode; className: string; labelledBy: string; onClose: () => void;
  onEscape?: () => void; direction?: 'right' | 'bottom';
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const escape = useRef(onEscape ?? onClose);
  escape.current = onEscape ?? onClose;
  useLayoutEffect(() => {
    const page = document.getElementById('root');
    const oldFocus = document.activeElement as HTMLElement | null;
    if (openViews === 0) {
      savedInert = page?.inert ?? false;
      savedOverflow = document.body.style.overflow;
    }
    openViews += 1;
    document.body.style.overflow = 'hidden';
    if (page) page.inert = true;
    root.current?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); escape.current(); }
      if (event.key !== 'Tab') return;
      const nodes = [...root.current!.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],[tabindex="0"]')].filter(node => node.getClientRects().length && !node.closest('[inert]'));
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      openViews -= 1;
      if (openViews === 0) {
        document.body.style.overflow = savedOverflow;
        if (page) page.inert = savedInert;
      }
      document.removeEventListener('keydown', keyboard);
      if (openViews === 0 && oldFocus?.isConnected) oldFocus.focus({ preventScroll: true });
    };
  }, []);
  const offset = direction === 'right' ? { x: '100%' } : { y: '100%' };
  return <motion.div ref={root} className={`fullscreen-view ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} data-lenis-prevent
    initial={reduced ? { opacity: 0 } : offset} animate={{ x: 0, y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : offset}
    transition={{ duration: reduced ? 0 : .6, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
