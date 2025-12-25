import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Characteristics = () => {
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
  const marqueeWords = [
    'PROBLEM SOLVER',
    'TEAMPLAYER',
    'FRIENDLY',
    'QUICK LEARNER',
    'CREATIVE',
    'DETAIL ORIENTED',
    'PRECISE',
    'INTUITIVE',
  ];

  return (
    <motion.section
      id="characteristics"
      className="pt-12 pb-16 sm:py-[60px]"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-12 sm:mb-16 text-right">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Personal Characteristics</h2>
      </div>

      <div className="relative w-full h-auto">
        <div className="rounded-2xl card-surface overflow-hidden">
          <div className="relative px-6 sm:px-8 py-4">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center gap-6 pr-6">
                  {marqueeWords.map((word) => (
                    <span
                      key={`${dup}-${word}`}
                      className="text-primary uppercase tracking-[0.18em] text-sm sm:text-base font-semibold"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative">

          <div ref={scrollerRef} className="mt-6 sm:mt-8 flex gap-4 overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 items-stretch snap-x snap-mandatory scroll-px-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:mx-0 lg:px-0 lg:overflow-visible lg:pb-0 no-scrollbar">
            <div data-scroll-item data-index="0" className={`rounded-2xl p-6 h-auto flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center snap-always flex flex-col card-surface transition-all duration-300 ${activeIndex === 0 ? 'border-primary' : 'lg:hover:border-primary/25 lg:hover:shadow-lg'}`}>
              <div className="text-xs font-semibold tracking-wide text-muted uppercase mb-4">How I work</div>
              <div className="text-lg font-semibold text-theme-primary mb-2">Calm, structured execution</div>
              <div className="text-sm text-muted leading-relaxed">
                Simple, consistent, and intentional.
              </div>
            </div>

            <div data-scroll-item data-index="1" className={`rounded-2xl p-6 h-auto flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center snap-always flex flex-col card-surface transition-all duration-300 ${activeIndex === 1 ? 'border-primary' : 'lg:hover:border-primary/25 lg:hover:shadow-lg'}`}>
              <div className="text-xs font-semibold tracking-wide text-muted uppercase mb-4">Core Values</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full chip-surface text-sm font-medium text-theme-primary">Clarity</span>
                <span className="px-3 py-1.5 rounded-full chip-surface text-sm font-medium text-theme-primary">Consistency</span>
                <span className="px-3 py-1.5 rounded-full chip-surface text-sm font-medium text-theme-primary">Empathy</span>
                <span className="px-3 py-1.5 rounded-full chip-surface text-sm font-medium text-theme-primary">Detail</span>
              </div>
            </div>

            <div data-scroll-item data-index="2" className={`rounded-2xl p-6 h-auto flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center snap-always flex flex-col card-surface transition-all duration-300 ${activeIndex === 2 ? 'border-primary' : 'lg:hover:border-primary/25 lg:hover:shadow-lg'}`}>
              <div className="text-xs font-semibold tracking-wide text-muted uppercase mb-4">What you get</div>
              <div className="text-lg font-semibold text-theme-primary mb-2">Reliable partner</div>
              <div className="text-sm text-muted leading-relaxed">
                Problem solving, easy collaboration, and rapid learning.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Characteristics;
