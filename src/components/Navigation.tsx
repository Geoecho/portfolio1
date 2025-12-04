import { useState, useEffect } from 'react';
import { Home, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const smoothScrollTo = (targetY: number, duration = 600) => {
  const startY = window.pageYOffset || window.scrollY || 0;
  const distance = targetY - startY;
  let startTime: number | null = null;

  const step = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const progress = Math.min(1, (currentTime - startTime) / duration);
    const eased = easeInOutQuad(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const navItems = [
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#characteristics' },
    { name: 'Work', href: '#projects' },
  ];

  useEffect(() => {
    const allSections = [
      { name: 'Intro', href: '#intro' },
      ...navItems,
      { name: 'Contact', href: '#contact' }
    ];
    
    const sections = allSections.map(item => document.getElementById(item.href.substring(1)));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleClick = (href: string) => {
    const sectionId = href.substring(1);
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    
    // Special behavior per section
    if (sectionId === 'intro') {
      // Scroll to the very top of the page
      smoothScrollTo(0, 700);
      return;
    }

    if (element) {
      const rect = element.getBoundingClientRect();
      const headerOffset = 20;
      const targetY = rect.top + (window.pageYOffset || window.scrollY || 0) - headerOffset;
      smoothScrollTo(targetY, 700);
    }
  };

  return (
    <nav className="fixed bottom-6 inset-x-0 z-50">
      <div className="flex justify-center px-4">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 rounded-full shadow-2xl border border-white/10 backdrop-blur-md w-auto max-w-full bg-gradient-to-b from-dark/80 via-dark/95 to-dark/80">
        {/* Home Icon */}
        <motion.button
          whileHover={{ rotate: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.03, 1], y: [0, -1, 0] }}
          transition={{
            scale: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            y: { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }}
          onClick={() => handleClick('#intro')}
          className={`p-2.5 sm:p-3 rounded-full transition-colors duration-300 flex-shrink-0 flex items-center justify-center ${
            activeSection === 'intro'
              ? 'bg-primary text-white'
              : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home size={20} strokeWidth={2.5} />
        </motion.button>

        {/* Middle Links - flattened so spacing is uniform with gap */}
        {navItems.map((item) => {
          const isActive = activeSection === item.href.substring(1);
          return (
            <motion.button
              key={item.name}
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(item.href)}
              className={`relative px-2.5 sm:px-3.5 py-2 text-sm font-medium transition-colors duration-300 rounded-full whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-white'
              }`}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full -z-10 bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Contact CTA */}
        <motion.button
          whileHover={{ rotate: 3, scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          animate={{ scale: [1, 1.035, 1], y: [0, -1, 0] }}
          transition={{
            scale: { duration: 4.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.2 },
            y: { duration: 4.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.2 }
          }}
          onClick={() => handleClick('#contact')}
          className={`flex items-center gap-1 sm:gap-2 px-3.5 sm:px-4.5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
            activeSection === 'contact'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-dark hover:bg-primary hover:text-white'
          }`}
        >
          <span>Let's Talk</span>
          <Send size={16} strokeWidth={2.5} />
        </motion.button>
      </div>
      </div>
    </nav>
  );
};

export default Navigation;
