import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
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

function App() {
  const { scrollToTop, scrollToContact } = useLenis();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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
      <a href="#projects" className="skip-link">Skip to work</a>
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[200] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-primary"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
        />
      </div>
      <Navigation onHome={scrollToTop} onContact={scrollToContact} />
      <TopBar />
      <BackToTop onActivate={scrollToTop} />


      <main className="portfolio-panel relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
        <div>
          <Hero onOpenProject={setSelectedProjectId} onContact={scrollToContact} />
          <Projects selectedId={selectedProjectId} onSelect={setSelectedProjectId} />
          <Characteristics />
          <DesignPhilosophy />
          <Skills />
          <Aesthetics />
          <Contact />
        </div>
      </main>
    </div>
    </MotionConfig>
  );
}

export default App;
