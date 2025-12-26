import { motion } from 'framer-motion';
import memoji from './assets/memoji.png';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Characteristics from './components/Characteristics';
import Projects from './components/Projects';
import DesignPhilosophy from './components/DesignPhilosophy';
import Playground from './components/Playground';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import BackgroundIcons from './components/BackgroundIcons';
import { useLenis } from './hooks/useLenis';
import CustomCursor from './components/CustomCursor';

function App() {
  useLenis();
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
        {/* Peeking Memoji */}
        <motion.div
          initial={{ y: -120, rotate: -113, opacity: 0 }}
          animate={{ y: 0, rotate: -113, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
            delay: 0.2
          }}
          className="absolute -top-0 -right-3 z-50 pointer-events-none select-none"
        >
          <img
            src={memoji}
            alt="Peeking Memoji"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
          />
        </motion.div>

        <div className="space-y-16 sm:space-y-[60px]">
          <Hero />
          <Skills />
          <Characteristics />
          <Projects />
          <DesignPhilosophy />
          <Playground />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default App;
