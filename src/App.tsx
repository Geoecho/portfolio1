import { useEffect } from 'react';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Characteristics from './components/Characteristics';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import BackgroundIcons from './components/BackgroundIcons';

function App() {
  useEffect(() => {
    // Ensure page always starts at the very top on initial load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Navigation />
      <div className="grid-background fixed inset-0 z-0 pointer-events-none" />
      <BackgroundIcons />

      {/* Vignettes - soft and uniform on all sides (desktop) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 z-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-32 z-40 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      <div className="pointer-events-none fixed inset-y-0 left-0 w-32 z-40 bg-gradient-to-r from-black/60 via-black/25 to-transparent hidden md:block" />
      <div className="pointer-events-none fixed inset-y-0 right-0 w-32 z-40 bg-gradient-to-l from-black/60 via-black/25 to-transparent hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto mt-0 sm:mt-10 mb-0 sm:mb-16 lg:mb-24 px-5 sm:px-6 lg:px-8 rounded-none sm:rounded-3xl border border-white/10 bg-gradient-to-b from-dark/80 via-dark/90 to-dark/80">
        <Hero />
        <Skills />
        <Characteristics />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}

export default App;
