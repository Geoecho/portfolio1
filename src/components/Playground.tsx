import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Code, Wand2, Shapes, ExternalLink } from 'lucide-react';

const Playground = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const experiments = [
    {
      id: 1,
      category: 'Visual',
      icon: Palette,
      title: 'Gradient Explorations',
      description: 'Experimenting with color theory and gradient transitions in modern interfaces.',
      tags: ['Color', 'Theory', 'Gradients'],
    },
    {
      id: 2,
      category: 'Interactive',
      icon: Wand2,
      title: 'Micro-interactions',
      description: 'Subtle animations that bring interfaces to life and guide user attention.',
      tags: ['Animation', 'UX', 'Motion'],
    },
    {
      id: 3,
      category: 'Visual',
      icon: Shapes,
      title: 'Geometric Patterns',
      description: 'Playing with shapes, symmetry, and mathematical beauty in design.',
      tags: ['Patterns', 'Geometry', 'Art'],
    },
    {
      id: 4,
      category: 'Code',
      icon: Code,
      title: 'CSS Experiments',
      description: 'Pushing the boundaries of what\'s possible with pure CSS and creative layouts.',
      tags: ['CSS', 'Web', 'Creative'],
    },
    {
      id: 5,
      category: 'Interactive',
      icon: Wand2,
      title: 'Scroll Narratives',
      description: 'Storytelling through scroll-driven animations and parallax effects.',
      tags: ['Scroll', 'Story', 'Motion'],
    },
    {
      id: 6,
      category: 'Visual',
      icon: Palette,
      title: 'Typography Play',
      description: 'Exploring type as a visual element, beyond just readability.',
      tags: ['Type', 'Layout', 'Design'],
    },
  ];

  const categories = ['All', 'Visual', 'Interactive', 'Code'];

  const filteredExperiments = activeCategory === 'All'
    ? experiments
    : experiments.filter(exp => exp.category === activeCategory);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // When the category changes, scroll to start
    el.scrollTo({ left: 0, behavior: 'auto' });
  }, [activeCategory]);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setActiveIndex(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex: number | null = null;
      let minDiff = Infinity;

      container.querySelectorAll('[data-scroll-item]').forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const diff = Math.abs(containerCenter - itemCenter);

        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = Number(item.getAttribute('data-index'));
        }
      });

      if (closestIndex !== null) {
        setActiveIndex(closestIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeCategory]);

  return (
    <section
      id="playground"
      className="py-16 sm:py-[60px] scroll-mt-[40px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Playground</h2>
          <p className="text-muted max-w-2xl leading-relaxed">
            A space for experimentation, exploration, and creative freedom.
            Here's where ideas come to play without the constraints of client work.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 sm:mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-primary text-white shadow-lg'
                : 'chip-surface hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Experiments Grid */}
        <div className="relative">

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 pr-12 snap-x snap-mandatory scroll-px-6 lg:mx-0 lg:px-0 lg:pr-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 no-scrollbar"
          >
            <AnimatePresence mode="sync">
              {filteredExperiments.map((experiment, index) => {
                const Icon = experiment.icon;
                const isActive = index === activeIndex;
                return (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.03
                    }}
                    className="group relative flex-shrink-0 w-[280px] sm:w-[320px] sm:w-auto h-full snap-center snap-always"
                    data-scroll-item
                    data-index={index}
                  >
                    <div
                      className={`relative h-full p-6 sm:p-8 rounded-2xl card-surface transition-all duration-300 cursor-pointer overflow-hidden ${isActive ? 'border-primary' : 'lg:group-hover:border-primary/25 lg:group-hover:shadow-lg'}`}
                    >
                      <div className={`absolute top-6 right-6 sm:top-8 sm:right-8 z-20 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>
                        <ExternalLink className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="relative z-10">
                        <div
                          className={`w-10 h-10 mb-6 flex items-center justify-center rounded-lg card-surface card-surface-hover transition-colors duration-300 transition-transform ${isActive ? 'rotate-6' : 'group-hover:rotate-6'}`}
                        >
                          <Icon className="w-5 h-5 text-primary transition-colors duration-300" strokeWidth={2} />
                        </div>

                        <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-theme-primary group-hover:text-primary'}`}>
                          {experiment.title}
                        </h3>

                        <p className="text-muted leading-relaxed text-sm sm:text-base mb-5 line-clamp-2">
                          {experiment.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {experiment.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full chip-surface"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>


                      </div>

                      <div className={`absolute bottom-0 left-0 w-16 h-16 overflow-hidden rounded-bl-2xl pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="absolute bottom-0 left-0 w-px h-6 bg-gradient-to-t from-primary/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-6 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

        {/* Empty state */}
        {filteredExperiments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            No experiments in this category yet.
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Playground;
