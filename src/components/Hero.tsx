import { useRef } from 'react';
import { ArrowUpRight, ArrowDown } from './AnimatedIcons';
import { gsap, useGSAP } from '../lib/scrollMotion';
import HeroProjectStack from './HeroProjectStack';

export default function Hero({ onOpenProject, onContact }: { onOpenProject: (id: number) => void; onContact: () => void }) {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-reveal', { y: 24, opacity: 0, duration: .85, stagger: .09, ease: 'power3.out' });
      gsap.from('.hero-stack-container', { y: 32, opacity: 0, duration: 1, delay: .25, ease: 'power3.out' });
    });
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.hero-feature-depth', { y: -45, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1 } });
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="intro" className="hero-section">
    <div className="hero-layout"><div className="hero-copy"><h1 className="hero-reveal hero-title">Make it simple.<br /><span>Make it work.</span></h1><p className="hero-reveal hero-description">I design websites and apps that make the next step feel obvious.</p></div>
      <div className="hero-feature-depth"><HeroProjectStack onOpenProject={onOpenProject} /></div>
      <div className="hero-reveal hero-actions"><a href="#projects" className="hero-cta">View projects <ArrowDown size={18} /></a><a href="#contact" className="hero-secondary" onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return; event.preventDefault(); onContact(); }}>Contact <ArrowUpRight size={18} /></a></div>
    </div>
  </section>;
}
