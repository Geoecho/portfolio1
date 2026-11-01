import { useEffect, useRef, type ComponentType, type CSSProperties, type HTMLAttributes, type RefAttributes } from 'react';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ArrowUpRightIcon } from './icons/arrow-up-right';
import { ArrowDownIcon } from './icons/arrow-down';
import { ArrowUpIcon } from './icons/arrow-up';
import { InstagramIcon } from './icons/instagram';
import { LinkedinIcon } from './icons/linkedin';
import { ArrowLeftIcon } from './icons/arrow-left';
import { ArrowRightIcon } from './icons/arrow-right';
import { LayersIcon } from './icons/layers';
import { LayoutPanelTopIcon } from './icons/layout-panel-top';
import { ScanTextIcon } from './icons/scan-text';
import { CursorClickIcon } from './icons/cursor-click';
import { CheckIcon } from './icons/check';
import { LayoutGridIcon } from './icons/layout-grid';
import { GalleryThumbnailsIcon } from './icons/gallery-thumbnails';
import { PenToolIcon } from './icons/pen-tool';
import { SwitchCameraIcon } from './icons/switch-camera';
import { TerminalIcon } from './icons/terminal';
import { SparklesIcon } from './icons/sparkles';
import { XIcon } from './icons/x';
import { MenuIcon } from './icons/menu';
import { RotateCCWIcon } from './icons/rotate-ccw';
import { LoaderCircleIcon } from './icons/loader-circle';
import { PaletteIcon } from './icons/palette';
import { HeartIcon } from './icons/heart';
import { MaximizeIcon } from './icons/maximize';
import { MinimizeIcon } from './icons/minimize';
import { HomeIcon } from './icons/home';
import { UserIcon } from './icons/user';
import { PauseIcon } from './icons/pause';
import { PlayIcon } from './icons/play';
import { AudioLinesIcon } from './icons/audio-lines';

type Handle = { startAnimation: () => void; stopAnimation: () => void };
type SourceIcon = ComponentType<HTMLAttributes<HTMLSpanElement> & { size?: number } & RefAttributes<Handle>>;
type IconProps = { size?: number; className?: string; strokeWidth?: number };

// The actual lucide-animated components, controlled from the whole action target.
// Each keeps its own motion: arrows travel, hearts beat, and layers separate.
function animated(Source: SourceIcon, name: string) {
  return function AnimatedIcon({ size = 24, className = '', strokeWidth = 1.7 }: IconProps) {
    const root = useRef<HTMLSpanElement>(null);
    const handle = useRef<Handle>(null);
    const reduced = useMotionPreference();
    useEffect(() => {
      if (reduced || !root.current) return;
      const action = root.current.closest('button,a,[role="tab"]') || root.current.parentElement || root.current;
      const play = () => handle.current?.startAnimation();
      const stop = () => handle.current?.stopAnimation();
      action.addEventListener('mouseenter', play);
      action.addEventListener('mouseleave', stop);
      action.addEventListener('focusin', play);
      action.addEventListener('focusout', stop);
      action.addEventListener('pointerdown', play);
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { play(); observer.disconnect(); }
      }, { threshold: .5 });
      observer.observe(root.current);
      return () => {
        observer.disconnect();
        action.removeEventListener('mouseenter', play);
        action.removeEventListener('mouseleave', stop);
        action.removeEventListener('focusin', play);
        action.removeEventListener('focusout', stop);
        action.removeEventListener('pointerdown', play);
        stop();
      };
    }, [reduced]);
    return <span ref={root} className={`animated-lucide ${className}`} data-icon={name} aria-hidden="true" style={{ '--icon-stroke': strokeWidth } as CSSProperties}><Source ref={handle} size={size} className="icon-art" /></span>;
  };
}

export const ArrowUpRight = animated(ArrowUpRightIcon, 'arrow-up-right');
export const ArrowDown = animated(ArrowDownIcon, 'arrow-down');
export const ArrowUp = animated(ArrowUpIcon, 'arrow-up');
export const Instagram = animated(InstagramIcon, 'instagram');
export const Linkedin = animated(LinkedinIcon, 'linkedin');
export const ArrowLeft = animated(ArrowLeftIcon, 'arrow-left');
export const ArrowRight = animated(ArrowRightIcon, 'arrow-right');
export const Layers = animated(LayersIcon, 'layers');
export const LayoutTemplate = animated(LayoutPanelTopIcon, 'layout-panel-top');
export const Type = animated(ScanTextIcon, 'scan-text');
export const MousePointer2 = animated(CursorClickIcon, 'cursor-click');
export const Check = animated(CheckIcon, 'check');
export const Figma = animated(LayoutGridIcon, 'layout-grid');
export const Image = animated(GalleryThumbnailsIcon, 'gallery-thumbnails');
export const PenTool = animated(PenToolIcon, 'pen-tool');
export const Camera = animated(SwitchCameraIcon, 'switch-camera');
export const Code2 = animated(TerminalIcon, 'terminal');
export const Sparkles = animated(SparklesIcon, 'sparkles');
export const X = animated(XIcon, 'x');
export const Menu = animated(MenuIcon, 'menu');
export const RotateCcw = animated(RotateCCWIcon, 'rotate-ccw');
export const Loader2 = animated(LoaderCircleIcon, 'loader-circle');
export const Palette = animated(PaletteIcon, 'palette');
export const Heart = animated(HeartIcon, 'heart');
export const Maximize2 = animated(MaximizeIcon, 'maximize');
export const Minimize2 = animated(MinimizeIcon, 'minimize');
export const Home = animated(HomeIcon, 'home');
export const User = animated(UserIcon, 'user');
export const Pause = animated(PauseIcon, 'pause');
export const Play = animated(PlayIcon, 'play');
export const Music = animated(AudioLinesIcon, 'audio-lines');
