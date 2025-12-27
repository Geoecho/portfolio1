import { useState, useEffect } from 'react';
import { Home, Send, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const smoothScrollTo = (targetY: number, duration = 1000) => {
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#characteristics' },
    { name: 'Work', href: '#projects' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Aesthetics', href: '#aesthetics' },
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Enforce theme color by replacing any existing tags
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = theme === 'dark' ? '#141414' : '#ffffff';
    document.head.appendChild(meta);

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClick = (href: string) => {
    const sectionId = href.substring(1);
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || window.scrollY || 0;

      // Explicit offsets for consistent spacing
      const DESKTOP_OFFSET = 40;
      const MOBILE_OFFSET = 40;

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      let targetY;

      if (sectionId === 'contact' && !isDesktop) {
        // Center alignment for Contact on Mobile
        targetY = (rect.top + scrollTop) + (rect.height / 2) - (window.innerHeight / 2);
      } else {
        const offset = isDesktop ? DESKTOP_OFFSET : MOBILE_OFFSET;
        targetY = rect.top + scrollTop - offset;
      }

      smoothScrollTo(Math.max(targetY, 0), 1000);
    }
  };

  return (
    <>
      {/* Desktop Navigation (lg and up) */}
      <nav className="hidden lg:block fixed bottom-6 inset-x-0 z-50">
        <div className="flex justify-center px-4">
          <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-full backdrop-blur-md w-auto nav-surface nav-shadow">
            {/* Home Icon */}
            <motion.button
              whileHover={{ rotate: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95, rotate: 8 }}
              onClick={() => handleClick('#intro')}
              className={`p-2.5 rounded-full transition-colors duration-300 flex items-center justify-center ${activeSection === 'intro'
                ? 'bg-primary text-white'
                : 'chip-surface hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              aria-label="Home"
            >
              <Home size={18} strokeWidth={2.25} />
            </motion.button>

            {/* Middle Links */}
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ y: -1, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-300 rounded-full whitespace-nowrap ${isActive ? 'bg-primary text-white' : 'text-theme-primary'
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
              whileTap={{ scale: 0.94, rotate: -6 }}
              onClick={() => handleClick('#contact')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 whitespace-nowrap ${activeSection === 'contact'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-primary text-white hover:bg-primary/90'
                }`}
            >
              <span>Let's talk</span>
              <Send size={16} strokeWidth={2.25} />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.06, rotate: theme === 'dark' ? 8 : -8 }}
              whileTap={{ scale: 0.92, rotate: theme === 'dark' ? 18 : -18 }}
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full chip-surface flex items-center justify-center transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -12, scale: 0.95, opacity: 0.7 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="inline-flex"
              >
                {theme === 'dark' ? <Sun size={18} strokeWidth={2.25} /> : <Moon size={18} strokeWidth={2.25} />}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Navigation (below lg) */}
      <nav className="lg:hidden fixed bottom-6 inset-x-0 z-50">
        <div className="flex justify-center w-full">
          {/* Compact Nav Bar */}
          <div className="mx-auto flex items-center gap-2 px-3 py-2.5 rounded-full backdrop-blur-md nav-surface nav-shadow w-[calc(100%-2rem)] max-w-md">
            {/* Home */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick('#intro')}
              className={`p-2.5 rounded-full transition-colors duration-300 ${activeSection === 'intro'
                ? 'bg-primary text-white'
                : 'chip-surface'
                }`}
              aria-label="Home"
            >
              <Home size={18} strokeWidth={2.25} />
            </motion.button>

            {/* Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full chip-surface transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={18} strokeWidth={2.25} /> : <Menu size={18} strokeWidth={2.25} />}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.06, rotate: theme === 'dark' ? 8 : -8 }}
              whileTap={{ scale: 0.92, rotate: theme === 'dark' ? 18 : -18 }}
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full chip-surface flex items-center justify-center transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -12, scale: 0.95, opacity: 0.7 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="inline-flex"
              >
                {theme === 'dark' ? <Sun size={18} strokeWidth={2.25} /> : <Moon size={18} strokeWidth={2.25} />}
              </motion.span>
            </motion.button>

            {/* Contact CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick('#contact')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${activeSection === 'contact'
                ? 'bg-primary text-white'
                : 'bg-primary text-white hover:bg-primary/90'
                }`}
            >
              <span>Let's talk</span>
              <Send size={16} strokeWidth={2.25} />
            </motion.button>
          </div>
        </div>

        {/* Expandable Menu - Centered on Screen */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed bottom-[calc(100px+10px)] inset-x-0 z-50 px-4"
            >
              <div className="mx-auto w-full max-w-xs sm:max-w-md p-3 rounded-2xl backdrop-blur-md nav-surface nav-shadow max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-2 items-stretch text-center">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                      <motion.button
                        key={item.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleClick(item.href)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'chip-surface hover:bg-black/5 dark:hover:bg-white/10'
                          }`}
                      >
                        {item.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>

  );
};

export default Navigation;
