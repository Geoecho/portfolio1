import { RefObject } from 'react';
import { gsap, useGSAP } from '../lib/scrollMotion';

export function useSectionMotion(scope: RefObject<HTMLElement>, selector: string) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>(selector, scope.current!);
      items.forEach((item, index) => {
        gsap.from(item, {
          y: 28, opacity: 0, duration: .75, delay: (index % 3) * .08, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 92%', once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope, dependencies: [selector] });
}
