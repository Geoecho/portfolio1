import { useRef } from 'react';
import { ArrowUpRight } from './AnimatedIcons';
import { gsap, ScrollTrigger, useGSAP } from '../lib/scrollMotion';
import firstScreen from '../assets/gridline-1.png';
import secondScreen from '../assets/gridline-2.png';
import thirdScreen from '../assets/gridline-3.png';
import firstMobileScreen from '../assets/gridline-mobile-1.jpg';
import secondMobileScreen from '../assets/gridline-mobile-2.jpg';
import thirdMobileScreen from '../assets/gridline-mobile-3.jpg';

const mobileScreens = [firstMobileScreen, secondMobileScreen, thirdMobileScreen];

const chapters = [
  { label: 'The challenge', title: 'A studio needs more than a good first impression.', text: 'Gridline Labs needed a home that could express its design point of view and help people understand what the studio can do. A clear identity, with a clear path to a conversation.', image: firstScreen, alt: 'Gridline Labs landing page with its digital experiences headline' },
  { label: 'The design decision', title: 'Give the work room. Give every detail a purpose.', text: 'Confident typography sets the rhythm. A restrained palette keeps attention on the work. Services, projects, and values each get their own space, without competing for it.', image: secondScreen, alt: 'Gridline Labs website showing its design language and content sections' },
  { label: 'The experience', title: 'An introduction that becomes an invitation.', text: 'The finished website brings the studio’s identity, services, and selected work together. A considered sequence that helps visitors move from “Who are you?” to “Let’s build something.”', image: thirdScreen, alt: 'Gridline Labs website showing the finished studio experience' },
];

export default function FeaturedProject() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    const setup = (mobile: boolean) => {
      const root = section.current!;
      const layout = root.querySelector<HTMLElement>('.story-layout')!;
      const visual = root.querySelector<HTMLElement>('.story-visual')!;
      const stage = root.querySelector<HTMLElement>('.story-stage')!;
      const frames = gsap.utils.toArray<HTMLElement>('.story-frame', root);
      const steps = gsap.utils.toArray<HTMLElement>('.story-step', root);
      const className = mobile ? 'story-mobile-motion' : 'story-motion';
      root.classList.add(className);
      gsap.set(frames[0], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
      gsap.set(frames.slice(1), { autoAlpha: 0, y: mobile ? 24 : 32, scale: 1.025, filter: mobile ? 'blur(4px)' : 'blur(0px)' });
      if (mobile) {
        gsap.set(steps[0], { autoAlpha: 1, filter: 'blur(0px)' });
        gsap.set(steps.slice(1), { autoAlpha: 0, filter: 'blur(8px)' });
      }
      const start = () => {
        const clearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-clearance')) || 16;
        return `top ${mobile ? clearance : Math.max(100, clearance)}px`;
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: layout,
          start,
          end: () => `+=${Math.max(1, layout.offsetHeight - (mobile ? stage : visual).offsetHeight)}`,
          ...(mobile ? {} : { pin: visual, pinSpacing: false }),
          scrub: mobile ? .35 : .65,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const active = self.progress < .31 ? 0 : self.progress < .73 ? 1 : 2;
            root.dataset.storyFrame = String(active);
            steps.forEach((step, i) => step.classList.toggle('is-current', i === active));
          },
        },
      });
      timeline.to(frames[0], { autoAlpha: 0, y: -24, filter: mobile ? 'blur(4px)' : 'blur(0px)', duration: .35 }, .6)
        .to(frames[1], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .35 }, .6)
        .to(frames[1], { autoAlpha: 0, y: -24, filter: mobile ? 'blur(4px)' : 'blur(0px)', duration: .35 }, 1.6)
        .to(frames[2], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .35 }, 1.6)
        .to({}, { duration: .3 });
      if (mobile) {
        timeline.to(steps[0], { autoAlpha: 0, filter: 'blur(8px)', duration: .35 }, .6)
          .to(steps[1], { autoAlpha: 1, filter: 'blur(0px)', duration: .35 }, .6)
          .to(steps[1], { autoAlpha: 0, filter: 'blur(8px)', duration: .35 }, 1.6)
          .to(steps[2], { autoAlpha: 1, filter: 'blur(0px)', duration: .35 }, 1.6);
      }
      gsap.fromTo('.story-progress-fill', { scaleX: 0 }, {
        scaleX: 1, ease: 'none', scrollTrigger: {
          trigger: layout, start,
          end: () => `+=${Math.max(1, layout.offsetHeight - (mobile ? stage : visual).offsetHeight)}`, scrub: true,
        },
      });
      // Images have fixed frames; refresh once fonts finish affecting the chapter heights.
      let mounted = true;
      void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
      return () => {
        mounted = false;
        root.classList.remove(className);
        delete root.dataset.storyFrame;
        steps.forEach(step => step.classList.remove('is-current'));
      };
    };
    media.add('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)', () => setup(false));
    media.add('(max-width: 1023px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)', () => setup(true));
    media.add('(max-width: 1023px) and (max-height: 739px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.story-step-copy', section.current!).forEach(copy => {
        gsap.from(copy, { autoAlpha: 0, filter: 'blur(6px)', duration: .7, ease: 'power2.out', scrollTrigger: { trigger: copy, start: 'top 90%', once: true } });
      });
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="featured-work" className="editorial-section featured-story" aria-labelledby="featured-title">
    <div className="story-heading"><h2 id="featured-title">Gridline Labs</h2><a className="text-link" href="https://gridlinelabs.com" target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18} /></a></div>
    <div className="story-layout"><div className="story-stage">
      <div className="story-chapters">{chapters.map((chapter, index) => <article className="story-step" key={chapter.label}>
        <div className="story-step-copy"><h4>{chapter.title}</h4><p>{chapter.text}</p></div>
        <figure className="story-mobile-image"><picture><source media="(max-width: 767px)" srcSet={mobileScreens[index]} /><img src={chapter.image} alt={chapter.alt} loading="lazy" /></picture></figure>
      </article>)}</div>
      <div className="story-visual" aria-hidden="true">
        <div className="story-window-bar"><span>gridlinelabs.com</span><ArrowUpRight size={16} /></div>
        <div className="story-screen">{chapters.map((chapter, index) => <div className="story-frame" key={chapter.label}><picture><source media="(max-width: 767px)" srcSet={mobileScreens[index]} /><img src={chapter.image} alt="" loading="eager" /></picture></div>)}</div>
        <div className="story-progress"><div className="story-progress-fill" /></div>
      </div>
    </div></div>
  </section>;
}
