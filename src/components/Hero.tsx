import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
});

const Hero = () => {
  const words = ["right.", "intuitive.", "effortless.", "natural."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="intro"
      className="relative flex items-center overflow-hidden pt-40 pb-12 sm:pt-52 sm:pb-20"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 h-full">
        <div className="lg:col-span-12 z-20 text-center">

          <motion.h1
            {...fadeUp(0)}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight tracking-tight flex flex-col gap-2 w-full items-center"
          >
            <span className="text-center">Designs that feel</span>
            <span className="relative block h-[1.3em] overflow-hidden w-full text-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={words[index]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  className="text-primary block whitespace-nowrap w-full font-sans"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              <span className="invisible pointer-events-none opacity-0 block whitespace-nowrap font-sans">{words[index]}</span>
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200 mb-8"
          >
            Crafting intuitive interfaces for modern <span className="font-bold text-primary">web & mobile</span> products.
          </motion.p>

          <motion.p
            {...fadeUp(0.18)}
            className="text-muted text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Greetings! I'm Hristijan, a passionate 26-year-old UI/UX designer based in the city of Skopje, Macedonia.
            I approach design through balance, aligning structure with creative flexibility.
          </motion.p>

          <SocialIcons className="hidden lg:flex justify-center gap-8 items-center" delay={0.25} />
        </div>
      </div>

      {/* Social Icons - Mobile Layout */}
      <div className="absolute top-6 right-0 z-50 lg:hidden">
        <SocialIcons className="flex gap-6 items-center" delay={0.25} />
      </div>
    </section>
  );
};

const SocialIcons = ({ className, delay }: { className?: string, delay: number }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
<motion.a
        href="https://instagram.com/hristijanbr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-primary transition-colors duration-300"
        aria-label="Instagram"
        animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.92, y: 0 }}
      >
        <Instagram size={28} strokeWidth={1.5} />
      </motion.a>
      <motion.a
        href="https://www.linkedin.com/in/hristijan-bristi%C4%87-94482b197"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-primary transition-colors duration-300"
        aria-label="LinkedIn"
        animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.92, y: 0 }}
      >
        <Linkedin size={28} strokeWidth={1.5} />
      </motion.a>
    </motion.div>
  );
};


export default Hero;
