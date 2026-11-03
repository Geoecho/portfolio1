import { useRef } from 'react';
import { ArrowUpRight, ArrowDown } from './AnimatedIcons';
import { gsap, useGSAP } from '../lib/scrollMotion';
import HeroProjectStack from './HeroProjectStack';

export default function Hero({ onOpenProject, onContact }: { onOpenProject: (id: number) => void; onContact: () => void }) {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-title-line', { yPercent: 110, opacity: 0, filter: 'blur(6px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: .82, stagger: .12, clearProps: 'transform,filter,opacity' }, 0)
        .from('.hero-reveal', { y: 16, opacity: 0, duration: .7, stagger: .1 }, .3)
        .from('.hero-stack-container', { y: 24, opacity: 0, duration: .85 }, .44);
    });
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.hero-feature-depth', { y: -45, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1 } });
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="intro" className="hero-section">
    <div className="hero-layout"><div className="hero-copy"><h1 className="hero-title"><span className="hero-title-mask"><span className="hero-title-line">Make it simple.</span></span><span className="hero-title-mask"><span className="hero-title-line hero-title-accent">Make it work.</span></span></h1><p className="hero-reveal hero-description">I design websites and apps that make the next step feel obvious.</p></div>
      <div className="hero-feature-depth"><HeroProjectStack onOpenProject={onOpenProject} /></div>
      <div className="hero-reveal hero-actions"><a href="#projects" className="hero-cta">View projects <ArrowDown size={18} /></a><a href="#contact" className="hero-secondary" onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return; event.preventDefault(); onContact(); }}>Contact <ArrowUpRight size={18} /></a></div>
    </div>
  </section>;
}
