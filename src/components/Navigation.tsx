import { useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Home, Image, User, Layers, PenTool, Sparkles, Menu, X, ArrowUpRight } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';

const links = [
  { label: 'Home', id: 'intro', icon: Home },
  { label: 'Work', id: 'projects', icon: Image },
  { label: 'About', id: 'characteristics', icon: User },
  { label: 'Approach', id: 'philosophy', icon: Layers },
  { label: 'Tools', id: 'skills', icon: PenTool },
  { label: 'Playground', id: 'aesthetics', icon: Sparkles },
];

export default function Navigation({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  const [active, setActive] = useState('intro');
  const [menu, setMenu] = useState(false);
  const reduced = useMotionPreference();
  const indicator = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 34 };
  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenu(false);
    if (!['intro', 'contact'].includes(id) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (id === 'contact') onContact();
    else onHome();
  };
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const ids = [...links.map(item => item.id), 'contact'];
        const current = ids.filter(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * .35).pop();
        setActive(current || 'intro');
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => {
    if (!menu) return;
    document.querySelector<HTMLElement>('#mobile-navigation a[aria-current]')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(false); document.getElementById('mobile-menu-toggle')?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  return <div className="site-dock">
    <nav className="navigation-dock" aria-label="Main navigation"><LayoutGroup id="portfolio-navigation">
    <div className="dock-bar">
      <a href="#" className={`dock-mobile-home ${active === 'intro' ? 'active' : ''}`} aria-current={active === 'intro' ? 'location' : undefined} onClick={event => navigate(event, 'intro')}>
        {active === 'intro' && <motion.span className="dock-active" layoutId="mobile-home-active" transition={indicator} />}
        <span className="nav-icon"><Home size={18} /></span><span className="nav-label">Home</span>
      </a>
      <button className="dock-icon mobile-menu-toggle" id="mobile-menu-toggle" aria-expanded={menu} aria-controls="mobile-navigation" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>{menu ? <X size={19} /> : <Menu size={19} />}</button>
      <div className="dock-links">{links.map(({ label, id, icon: Icon }) => <a key={id} href={id === 'intro' ? '#' : `#${id}`} onClick={event => navigate(event, id)} className={`dock-nav-item ${active === id ? 'active' : ''}`} aria-current={active === id ? 'location' : undefined}>
        {active === id && <motion.span className="dock-active" layoutId="desktop-navigation-active" transition={indicator} />}
        <motion.span className="nav-icon" initial={false} animate={{ scale: active === id && !reduced ? [1, 1.12, 1] : 1 }} transition={{ duration: reduced ? 0 : .35 }}><Icon size={18} /></motion.span><span className="nav-label">{label}</span>
      </a>)}</div>
      <a className="dock-contact" href="#contact" onClick={event => navigate(event, 'contact')}>Let's talk <ArrowUpRight size={17} /></a>
    </div>
    <AnimatePresence initial={false}>{menu && <motion.div id="mobile-navigation" className="dock-menu" initial={{ opacity: 0, y: reduced ? 0 : 12, filter: reduced ? 'none' : 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: reduced ? 0 : 8, filter: reduced ? 'none' : 'blur(4px)' }} transition={{ duration: reduced ? 0 : .2 }}>{links.map(({ label, id, icon: Icon }) => <a key={id} href={id === 'intro' ? '#' : `#${id}`} onClick={event => navigate(event, id)} aria-current={active === id ? 'location' : undefined}>
      {active === id && <motion.span className="dock-active" layoutId="mobile-menu-active" transition={indicator} />}
      <span className="nav-icon"><Icon size={19} /></span><span className="nav-label">{label}</span>
    </a>)}</motion.div>}</AnimatePresence>
  </LayoutGroup></nav></div>;
}
