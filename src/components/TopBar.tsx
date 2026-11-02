import { useLayoutEffect, useRef } from 'react';
import SocialLinks from './SocialLinks';
import MusicPlayer from './MusicPlayer';
import { ScrollTrigger } from '../lib/scrollMotion';
import { Gamepad } from './AnimatedIcons';
import PortraitMark from './PortraitMark';

export default function TopBar({ onOpenGame, onHome }: { onOpenGame: () => void; onHome: () => void }) {
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
      <div className="top-bar-actions"><div className="top-bar-play"><button type="button" className="portrait-home" onClick={onHome} aria-label="Home" title="Back to home"><PortraitMark decorative /></button><MusicPlayer /><button type="button" className="top-bar-game" onClick={onOpenGame} aria-label="Play Tool Rush"><Gamepad size={20} /><span>Play</span></button></div><SocialLinks /></div>
    </div>
  </header>;
}
