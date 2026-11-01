import { useRef } from 'react';
import { ArrowUpRight, Layers, LayoutTemplate } from './AnimatedIcons';
import portrait from '../assets/memoji.png';
import { SectionIntro } from './SectionIntro';
import { gsap, useGSAP } from '../lib/scrollMotion';
import { useSectionMotion } from '../hooks/useSectionMotion';

export default function Characteristics() {
  const section = useRef<HTMLElement>(null);
  useSectionMotion(section, '.profile-card, .about-detail');
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.profile-portrait img', { y: 18 }, { y: -18, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="characteristics" className="editorial-section about-section">
    <SectionIntro title="About me." />
    <div className="about-layout"><div className="profile-card"><div className="profile-portrait"><img src={portrait} alt="An illustrated portrait of Hristijan" loading="lazy" /></div><div className="profile-caption"><h3>Hristijan Bristić</h3><p>UI/UX designer · Skopje, Macedonia</p></div></div>
      <div className="about-copy"><div className="about-detail"><p className="about-lead">A partner in figuring things out.</p><p>I work with people who have an idea and need a thoughtful way to bring it to life. I connect structure, visual design, and interaction to make websites and products easier to use.</p><p>I value honest feedback, calm collaboration, and the small decisions that make the whole experience feel right.</p></div>
        <div className="about-services"><div className="about-service about-detail"><span className="surface-icon"><Layers size={21} strokeWidth={1.6} /></span><div><h3>Digital products</h3><p>User flows, interfaces, and design systems.</p></div></div><div className="about-service about-detail"><span className="surface-icon"><LayoutTemplate size={21} strokeWidth={1.6} /></span><div><h3>Websites & identity</h3><p>A clear presence, from the first impression on.</p></div></div></div>
        <div className="about-detail about-cta"><a href="#contact" className="hero-secondary">Let’s work together <ArrowUpRight size={17} /></a></div>
      </div>
    </div>
  </section>;
}
