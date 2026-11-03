import { useRef } from 'react';
import { Layers, Type, MousePointer2 } from './AnimatedIcons';
import FeedbackButton from './FeedbackButton';
import { SectionIntro } from './SectionIntro';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scrollMotion';
import { useSectionMotion } from '../hooks/useSectionMotion';

const principles = [
  { label: 'Clarity', title: 'Make room for what matters.', text: 'One clear purpose. Fewer competing choices. I remove the friction so people can focus on what they came to do.', icon: Layers },
  { label: 'Hierarchy', title: 'Make the next step feel natural.', text: 'Type, space, and contrast work together to guide attention. The important things should feel important.', icon: Type },
  { label: 'Feedback', title: 'Make every interaction count.', text: 'A response at the right moment turns an action into understanding. Motion should explain what just happened.', icon: MousePointer2 },
];

export default function DesignPhilosophy() {
  const section = useRef<HTMLElement>(null);
  useSectionMotion(section, '.principle-card');
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.principle-card', section.current!);
      const cleanups: Array<() => void> = [];
      cards.forEach((card, index) => {
        const timeline = gsap.timeline({ paused: true, defaults: { duration: .65, ease: 'power3.out' } });
        if (index === 0) {
          timeline.fromTo(card.querySelectorAll('.clarity-ui-secondary'), { opacity: 1, x: 0 }, { opacity: 0, x: i => i === 0 ? -12 : 12 }, 0)
            .fromTo(card.querySelector('.clarity-ui-main'), { width: '32%' }, { width: '65%' }, 0);
        } else if (index === 1) {
          timeline.fromTo(card.querySelector('.hierarchy-ui-title'), { width: '45%', height: 7 }, { width: '100%', height: 15 }, 0)
            .fromTo(card.querySelector('.hierarchy-ui-action'), { width: '65%' }, { width: '45%' }, 0);
        } else {
          timeline.fromTo(card.querySelector('.feedback-ui'), { y: 10 }, { y: 0 }, 0);
        }
        const play = () => { timeline.timeScale(1).restart(); };
        const reset = () => { timeline.timeScale(1.4).reverse(); };
        const blur = (event: FocusEvent) => { if (!card.contains(event.relatedTarget as Node | null)) reset(); };
        card.addEventListener('mouseenter', play);
        card.addEventListener('mouseleave', reset);
        card.addEventListener('focusin', play);
        card.addEventListener('focusout', blur);
        card.addEventListener('click', play);
        ScrollTrigger.create({ trigger: card, start: 'top 85%', end: 'bottom 15%', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset });
        cleanups.push(() => {
          card.removeEventListener('mouseenter', play);
          card.removeEventListener('mouseleave', reset);
          card.removeEventListener('focusin', play);
          card.removeEventListener('focusout', blur);
          card.removeEventListener('click', play);
        });
      });
      return () => cleanups.forEach(cleanup => cleanup());
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="philosophy" className="editorial-section philosophy-section">
    <SectionIntro title="Design principles." />
    <div className="principle-grid">{principles.map(({ label, title, text, icon: Icon }, index) => <article className="principle-card" key={label}>
      <div className="principle-card-top"><span className="surface-icon"><Icon size={21} strokeWidth={1.6} /></span><span>{label}</span></div>
      {index === 2 ? <div className="principle-illustration"><div className="feedback-ui"><FeedbackButton className="feedback-ui-button" previewOnHover /></div></div> : <button type="button" className="principle-illustration" aria-label={`Replay ${label.toLowerCase()} demonstration`}>
        {index === 0 && <div className="clarity-ui"><span className="clarity-ui-secondary" /><span className="clarity-ui-main"><span /><span /><span /></span><span className="clarity-ui-secondary" /></div>}
        {index === 1 && <div className="hierarchy-ui"><span className="hierarchy-ui-eyebrow" /><span className="hierarchy-ui-title" /><span className="hierarchy-ui-body" /><span className="hierarchy-ui-body short" /><span className="hierarchy-ui-action" /></div>}
      </button>}
      <h3>{title}</h3><p>{text}</p>
    </article>)}</div>
  </section>;
}
