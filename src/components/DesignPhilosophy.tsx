
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Zap, Target } from 'lucide-react';


const DesignPhilosophy = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

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
  const principles = [
    {
      icon: Sparkles,
      title: 'Simplicity First',
      description: 'Strip away the unnecessary. Every element must earn its place through purpose and clarity.',
    },
    {
      icon: Layers,
      title: 'Hierarchy & Balance',
      description: 'Visual weight guides the eye. Structure creates understanding before content does.',
    },
    {
      icon: Zap,
      title: 'Intentional Motion',
      description: 'Animation reveals relationships. Movement should feel natural, never arbitrary.',
    },
    {
      icon: Target,
      title: 'User-Centered',
      description: 'Design serves people, not aesthetics. Beauty emerges from solving real problems.',
    },
  ];

  return (
    <motion.section
      id="philosophy"
      className="pt-12 pb-16 sm:py-[60px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-12 sm:mb-16 text-right">
        <h2 className="text-4xl font-bold mb-6">Design Philosophy</h2>
        <p className="text-muted max-w-2xl ml-auto leading-relaxed">
          My approach to design is rooted in clarity, intention, and empathy.
          These principles guide every decision, from the first sketch to the final pixel.
        </p>
        <p className="mt-6 text-muted italic text-sm sm:text-base max-w-2xl ml-auto">
          "Good design is as little design as possible."
          <span className="block mt-2 text-muted not-italic text-xs">— Dieter Rams</span>
        </p>
      </div>

      <div className="relative">

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 sm:gap-6 snap-x snap-mandatory scroll-px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 no-scrollbar"
        >
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px] sm:w-auto h-full snap-center snap-always"
                data-scroll-item
                data-index={index}
              >
                <div
                  className={`relative h-full p-6 sm:p-8 rounded-2xl card-surface transition-all duration-300 ${isActive ? 'border-primary' : 'lg:group-hover:border-primary/25 lg:group-hover:shadow-lg'}`}
                >
                  <div
                    className={`w-10 h-10 mb-6 flex items-center justify-center rounded-lg card-surface transition-colors duration-300 transition-transform ${isActive ? 'rotate-6' : 'group-hover:rotate-6'}`}
                  >
                    <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>

                  <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-theme-primary group-hover:text-primary'}`}>
                    {principle.title}
                  </h3>
                  <p className="text-muted leading-relaxed text-sm sm:text-base mb-5 line-clamp-2">
                    {principle.description}
                  </p>

                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none">
                    <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                    <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-white/20 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </motion.section >
  );
};

export default DesignPhilosophy;
