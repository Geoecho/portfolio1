import { useRef } from 'react';
import { useSectionMotion } from '../hooks/useSectionMotion';

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
};

export function SectionIntro({ title }: { title: string }) {
  const intro = useRef<HTMLDivElement>(null);
  useSectionMotion(intro, 'h2');
  return <div ref={intro} className="section-intro">
    <h2>{title}</h2>
  </div>;
}
