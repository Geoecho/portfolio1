import Hero from './components/Hero';
import Skills from './components/Skills';
import Characteristics from './components/Characteristics';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Navigation />
      <div className="grid-background fixed inset-0 z-0 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 border-l border-r border-white/10 bg-gradient-to-b from-dark/80 via-dark/90 to-dark/80">
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
