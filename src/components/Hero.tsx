import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Dribbble, Instagram, Linkedin } from 'lucide-react';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  const words = ["RIGHT", "INTUITIVE", "EFFORTLESS", "NATURAL"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      id="intro"
      className="min-h-screen relative flex items-center overflow-hidden py-16 sm:py-[60px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >


      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 h-full">
        {/* Centered Text Content with fade-in from top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-12 z-20 text-center"
        >


          {/* Centered Text Content with fade-in from top */}


          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight flex flex-col gap-2 w-full items-center"
          >
            <span className="text-center">Designs that feel</span>
            <span className="relative block h-[1.3em] overflow-hidden min-w-[2ch] text-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={words[index]}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="text-primary block whitespace-nowrap"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              <span className="invisible pointer-events-none opacity-0 block whitespace-nowrap">{words[index]}</span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
            className="text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Greetings! I'm Hristijan, a passionate 26-year-old UI/UX designer based in the city of Skopje, Macedonia.
            I approach design through balance, aligning structure with creative flexibility.
          </motion.p>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center gap-8 items-center"
          >
            <motion.a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="Dribbble"
              animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.92, y: 0 }}
            >
              <Dribbble size={28} strokeWidth={1.5} />
            </motion.a>
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
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
