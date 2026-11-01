import { useLayoutEffect, useRef } from 'react';
import SocialLinks from './SocialLinks';
import MusicPlayer from './MusicPlayer';
import { ScrollTrigger } from '../lib/scrollMotion';

export default function TopBar() {
  const bar = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      const clearance = Math.ceil(bar.current!.getBoundingClientRect().bottom + 16);
      document.documentElement.style.setProperty('--top-bar-clearance', `${clearance}px`);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const observer = new ResizeObserver(update);
    observer.observe(bar.current!);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty('--top-bar-clearance');
    };
  }, []);

  return <header ref={bar} className="top-bar" aria-label="Music and social links">
    <div className="top-bar-content">
      <div id="music-embed-slot" />
      <div className="top-bar-actions"><MusicPlayer /><SocialLinks /></div>
    </div>
  </header>;
}
