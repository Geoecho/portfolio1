import { useEffect } from 'react';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Characteristics from './components/Characteristics';
import Projects from './components/Projects';
import DesignPhilosophy from './components/DesignPhilosophy';
import Aesthetics from './components/Playground';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import BackgroundIcons from './components/BackgroundIcons';
import { useLenis } from './hooks/useLenis';
import CustomCursor from './components/CustomCursor';

function App() {
  useLenis();

  // Force scroll to top on mount/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    // Optional: if using browser history restoration, we might need to disable it
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="min-h-screen text-theme-primary selection:bg-primary selection:text-white overflow-hidden">
      <CustomCursor />
      <Navigation />
      <div className="grid-background fixed inset-0 z-0 pointer-events-none" />
      <BackgroundIcons />

      {/* Vignettes - soft and uniform on all sides (desktop) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 z-[5] vignette-top" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-32 z-[5] vignette-bottom" />
      <div className="pointer-events-none fixed inset-y-0 left-0 w-32 z-[5] vignette-left hidden lg:block" />
      <div className="pointer-events-none fixed inset-y-0 right-0 w-32 z-[5] vignette-right hidden lg:block" />
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] dark:from-[#050505] to-transparent z-[40] pointer-events-none lg:hidden" />

      <div className="relative z-10 max-w-7xl mx-auto mt-0 sm:mt-10 mb-0 sm:mb-16 lg:mb-24 px-4 sm:px-6 lg:px-8 rounded-none sm:rounded-3xl panel-surface overflow-hidden">
<div className="space-y-8 sm:space-y-12">
          <Hero />
          <Skills />
          <Characteristics />
          <Projects />
          <DesignPhilosophy />
          <Aesthetics />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default App;
