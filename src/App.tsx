import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Characteristics from './components/Characteristics';
import Projects from './components/Projects';
import DesignPhilosophy from './components/DesignPhilosophy';
import Aesthetics from './components/Playground';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import { useLenis } from './hooks/useLenis';
import TopBar from './components/TopBar';
import BackToTop from './components/BackToTop';
import KineticGrid from './components/KineticGrid';
import { projects } from './data/projects';
import FullscreenView from './components/FullscreenView';
import PrivacyPolicy from './components/PrivacyPolicy';
import { ArrowLeft } from './components/AnimatedIcons';

const TypeRush = lazy(() => import('./components/TypeRush'));
const readView = () => new URLSearchParams(window.location.search).get('view');

function App() {
  const { scrollToTop, scrollToContact } = useLenis();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(readView);
  const selectedProjectId = projects.find(project => view === `project-${project.id}`)?.id ?? null;
  const openView = useCallback((next: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', next);
    window.history.pushState({ ...window.history.state, portfolioView: true }, '', url);
    setView(next);
  }, []);
  const closeView = useCallback(() => {
    if (window.history.state?.portfolioView) { window.history.back(); return; }
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    window.history.replaceState(window.history.state, '', url);
    setView(null);
  }, []);
  const setSelectedProjectId = useCallback((id: number | null) => {
    if (id === null) closeView(); else openView(`project-${id}`);
  }, [closeView, openView]);
  useEffect(() => {
    const sync = () => setView(readView());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // Track scroll progress — direct DOM write, no re-render
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen text-theme-primary selection:bg-primary selection:text-white portfolio-root">
      <KineticGrid />
      <div className="viewport-edge viewport-edge-top" aria-hidden="true" />
      <div className="viewport-edge viewport-edge-bottom" aria-hidden="true" />
      <a href="#projects" className="skip-link">Skip to work</a>
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[200] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-primary"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
        />
      </div>
      <Navigation onHome={scrollToTop} onContact={scrollToContact} />
      <TopBar onHome={scrollToTop} onOpenGame={() => openView('game')} />
      <BackToTop onActivate={scrollToTop} />


      <main className="portfolio-panel relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
        <div>
          <Hero onOpenProject={setSelectedProjectId} onContact={scrollToContact} />
          <Projects selectedId={selectedProjectId} onSelect={setSelectedProjectId} />
          <Characteristics />
          <DesignPhilosophy />
          <Skills />
          <Aesthetics />
          <Contact onOpenPrivacy={() => openView('privacy')} />
        </div>
      </main>
    </div>
    {createPortal(<Suspense fallback={null}><AnimatePresence>{view === 'game' && <TypeRush onClose={closeView} />}</AnimatePresence></Suspense>, document.body)}
    {createPortal(<AnimatePresence>{view === 'privacy' && <FullscreenView className="privacy-view" labelledBy="privacy-title" onClose={closeView}><header className="project-view-bar"><button type="button" className="view-back" onClick={closeView}><ArrowLeft size={20} /><span>Back</span></button><span className="project-view-name">Privacy</span></header><div className="privacy-view-scroll"><PrivacyPolicy embedded onContact={() => { closeView(); window.setTimeout(scrollToContact, 700); }} /></div></FullscreenView>}</AnimatePresence>, document.body)}
    </MotionConfig>
  );
}

export default App;
