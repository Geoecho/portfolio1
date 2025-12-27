import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layers, Maximize, Monitor, Aperture } from 'lucide-react';

const Aesthetics = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const aestheticItems = [
    {
      id: 1,
      icon: Layers,
      title: 'Modular Systems',
      description: 'Scalable consistency. Building interfaces with atomic components that fit together perfectly.',
    },
    {
      id: 2,
      icon: Type,
      title: 'Swiss Typography',
      description: 'The power of the grid. Using type not just for reading, but as the primary structural element of design.',
    },
    {
      id: 3,
      icon: Maximize,
      title: 'Negative Space',
      description: 'Breathing room is a feature. Mastering the art of emptiness to give content maximum impact.',
    },
    {
      id: 4,
      icon: Palette,
      title: 'Intentional Color',
      description: 'Restrained palettes. Using color as a functional tool for hierarchy and focus, never just for decoration.',
    },
    {
      id: 5,
      icon: Monitor,
      title: 'Dark Mode UI',
      description: 'Comfort and contrast. designing specifically for low-light environments with softer hues and reduced strain.',
    },
    {
      id: 6,
      icon: Aperture,
      title: 'Motion Kinetics',
      description: 'Physics-based interactions. Ensuring every movement has weight, momentum, and a natural feel.',
    },
  ];

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
  }, []);

  return (
    <section
      id="aesthetics"
      className="py-16 sm:py-[60px] scroll-mt-[40px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Aesthetics</h2>
          <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            Design isn't just about problem-solving; it's about feeling.
            These are the visual principles and patterns that I enjoy exploring.
          </p>
        </div>

        {/* Aesthetics Grid */}
        <div className="relative">

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 pr-12 snap-x snap-mandatory scroll-px-6 lg:mx-0 lg:px-0 lg:pr-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 no-scrollbar"
          >
            <AnimatePresence mode="sync">
              {aestheticItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeIndex;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1
                    }}
                    viewport={{ once: true }}
                    className="group relative flex-shrink-0 w-[280px] sm:w-[320px] sm:w-auto h-full snap-center snap-always"
                    data-scroll-item
                    data-index={index}
                  >
                    <div
                      className={`relative h-full p-6 sm:p-8 rounded-2xl card-surface transition-all duration-300 cursor-default overflow-hidden ${isActive ? 'border-primary' : 'lg:group-hover:border-primary/25 lg:group-hover:shadow-lg'}`}
                    >
                      <div className="relative z-10">
                        <div
                          className={`w-10 h-10 mb-6 flex items-center justify-center rounded-lg card-surface card-surface-hover transition-colors duration-300 transition-transform ${isActive ? 'rotate-6' : 'group-hover:rotate-6'}`}
                        >
                          <Icon className="w-5 h-5 text-primary transition-colors duration-300" strokeWidth={2} />
                        </div>

                        <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-theme-primary group-hover:text-primary'}`}>
                          {item.title}
                        </h3>

                        <p className="text-sm text-muted leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className={`absolute bottom-0 right-0 w-24 h-24 overflow-hidden rounded-br-2xl pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-primary/30 to-transparent" />
                        <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-primary/30 to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Aesthetics;
