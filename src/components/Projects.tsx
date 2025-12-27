import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, animate, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import scribblyThumb from '../assets/scribbly-thumb.png';
import scribbly1 from '../assets/scribbly-1.png';
import scribbly2 from '../assets/scribbly-2.png';
import scribbly3 from '../assets/scribbly-3.png';
import intecThumb from '../assets/intec-thumb.png';
import intec1 from '../assets/intec-1.png';
import intec2 from '../assets/intec-2.png';
import intec3 from '../assets/intec-3.png';
import cinepickThumb from '../assets/cinepick-thumb.png';
import cinepick1 from '../assets/cinepick-1.png';
import cinepick2 from '../assets/cinepick-2.png';
import cinepick3 from '../assets/cinepick-3.png';
import labThumb from '../assets/lab-thumb.png';
import lab1 from '../assets/lab-1.png';
import lab2 from '../assets/lab-2.png';
import lab3 from '../assets/lab-3.png';
import labNew1 from '../assets/lab-new-1.png';

const Projects = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      name: 'InTec System',
      description: 'A comprehensive website redesign for an IT solutions provider, focusing on clarifying complex services and building corporate trust.',
      longDescription:
        'The InTec System redesign transforms a standard corporate presence into a modern, conversion-focused platform. The goal was to simplify the user journey for complex IT services like virtualization and system integration. By utilizing a clean, card-based layout with generous whitespace and a confident blue color system, the design guides decision-makers clearly from problem to solution. Key trusted partners like VMware and Cisco are highlighted to build immediate credibility, while the responsive "Ideas Made Digital" section ensures the message resonates across all devices.',
      image: intecThumb,
      detailImages: [intec3, intec1, intec2]
    },
    {
      id: 2,
      name: 'Scribbly',
      description: 'A playful sketching experience focused on minimal UI, expressive strokes, and quick ideation.',
      longDescription:
        'Scribbly is a playful sketching concept built for speed and experimentation. The UI stays out of the way so the canvas always feels “ready,” with tools surfaced only when needed. I explored a minimal control system, strong empty-space composition, and expressive visual feedback for strokes and states. The concept is aimed at quick ideation: sketch, iterate, and export without the typical complexity that slows creative flow.',
      image: scribblyThumb,
      detailImages: [scribbly1, scribbly2, scribbly3]
    },
    {
      id: 3,
      name: 'Cinepick',
      description: 'A smart movie generator app that helps users find their next favorite watch through mood-based filtering and personalized discovery.',
      longDescription:
        'Cinepick is a mobile application designed to solve the "what should I watch" paralysis. Instead of endless scrolling, users can generate tailored movie recommendations based on their current mood, preferred genre, and specific filters like year or rating. The interface features a sleek dark mode aesthetic with vibrant accent colors, focusing on high-quality imagery and intuitive controls. It turns the passive act of searching into an engaging, interactive discovery process.',
      image: cinepickThumb,
      detailImages: [cinepick1, cinepick2, cinepick3]
    },
    {
      id: 4,
      name: 'Laboratorium',
      description: 'A visual identity for a cultural education center in Macedonia, blending industrial grit with retro-educational aesthetics.',
      longDescription:
        'Laboratorium is a cultural education center in Macedonia that bridges the gap between formal and informal learning. The visual identity reflects this mission by combining raw, industrial textures with a retro-educational aesthetic. Using collage-style imagery, bold typography, and a distinct red-and-black color palette, the design captures the spirit of experimentation and hands-on creativity. It’s a space where ideas are tested, and arts and crafts meet practical skills.',
      image: labThumb,
      detailImages: [labNew1, lab2, lab3]
    },
    {
      id: 5,
      name: 'Project 5',
      description: 'Dashboard exploration balancing dense information, breathing room, and strong typographic rhythm.',
      longDescription:
        'This dashboard concept balances dense data with breathing room, so the user can understand priority and context at a glance. I experimented with grouping patterns, spacing scales, and type weights to make the interface feel organized without feeling rigid. Subtle surface contrast and consistent borders separate modules cleanly, and the layout adapts responsively to prevent “data walls” on smaller screens. The result is a system that stays readable, scalable, and visually calm.'
    },
  ];

  const selectedProject = projects.find(project => project.id === selectedProjectId) || null;

  // Simple scroll handler for buttons (used on mobile)
  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstItem = el.querySelector<HTMLElement>('[data-project-card]');
    const computed = window.getComputedStyle(el);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || '0') || 0;
    const step = firstItem ? firstItem.getBoundingClientRect().width + gap : 300;

    const currentScroll = el.scrollLeft;
    const targetScroll = direction === 'left'
      ? Math.max(0, currentScroll - step)
      : Math.min(el.scrollWidth - el.clientWidth, currentScroll + step);

    animate(currentScroll, targetScroll, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.6,
      onUpdate: (v) => {
        el.scrollLeft = v;
      }
    });
  };

  // Desktop scroll animation – smoother spring effect
  const scrollByAmountAnimated = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstItem = el.querySelector<HTMLElement>('[data-project-card]');
    const computed = window.getComputedStyle(el);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || '0') || 0;
    const step = firstItem ? firstItem.getBoundingClientRect().width + gap : 300;

    const currentScroll = el.scrollLeft;
    const targetScroll = direction === 'left'
      ? Math.max(0, currentScroll - step)
      : Math.min(el.scrollWidth - el.clientWidth, currentScroll + step);

    animate(currentScroll, targetScroll, {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      onUpdate: (v) => {
        el.scrollLeft = v;
      }
    });
  };

  // Lock background scroll when a project modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedProjectId !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Reset description open state when opening a new project
      setIsDescriptionOpen(false);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedProjectId]);

  // Sync scrollbar with container
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleScroll = () => {
      // Sync scrollbar progress
      if (!isDragging) {
        const p = el.scrollLeft / (el.scrollWidth - el.clientWidth);
        setScrollProgress(Math.min(1, Math.max(0, p)));
      }

      // Calculate active centered item (Mobile Only)
      if (window.innerWidth >= 1024) {
        setActiveProjectIndex(null);
        return;
      }

      const containerRect = el.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex: number | null = null;
      let minDiff = Infinity;

      el.querySelectorAll('[data-project-card]').forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const diff = Math.abs(containerCenter - itemCenter);

        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      setActiveProjectIndex(closestIndex);
    };

    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    // Initialize on mount
    handleScroll();

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDragging]);


  // Handle dragging the scrollbar
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const bar = scrollbarRef.current;
      const content = scrollerRef.current;
      if (!bar || !content) return;

      const rect = bar.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      setScrollProgress(p);
      content.scrollLeft = p * (content.scrollWidth - content.clientWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleScrollBarMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Immediate jump on click
    const bar = scrollbarRef.current;
    const content = scrollerRef.current;
    if (bar && content) {
      const rect = bar.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      setScrollProgress(p);
      content.scrollLeft = p * (content.scrollWidth - content.clientWidth);
    }
  };

  // Auto-scroll when description opens/closes on mobile
  useEffect(() => {
    if (!mobileScrollRef.current) return;

    if (isDescriptionOpen) {
      // Scroll to bottom to show text
      setTimeout(() => {
        mobileScrollRef.current?.scrollTo({
          top: mobileScrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // Scroll back to top to show images
      mobileScrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isDescriptionOpen]);

  return (
    <>
      <section
        id="projects"
        className="pt-12 pb-16 sm:py-[60px] scroll-mt-[40px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Work</h2>
            <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore my projects: a testament to the art of minimal design
              meeting functionality. Witnesses to each interface is a narrative of
              simplicity and purpose, where every element serves a purpose.
            </p>
          </div>

          <div className="pt-2">


            <div className="relative">

              <div
                ref={scrollerRef}
                className="overflow-x-auto overflow-y-visible pt-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory lg:snap-none no-scrollbar"
              >
                <motion.div
                  className="flex flex-nowrap gap-4 sm:gap-5 lg:gap-6 pb-2 pr-4 sm:pr-6 lg:pr-32"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {projects.map((project, index) => {
                    const isActive = activeProjectIndex === index;
                    return (
                      <motion.button
                        key={project.id}
                        type="button"
                        className="group text-left flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px] snap-center snap-always"
                        data-project-card
                        onClick={() => setSelectedProjectId(project.id)}
                        initial={{ opacity: 0.8, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: false, amount: 0.6 }}
                      >
                        <div className={`rounded-2xl card-surface transition-all duration-300 overflow-hidden ${isActive ? 'border-primary ring-1 ring-primary' : 'card-surface-hover lg:hover:border-primary/50'}`}>
                          <div className="relative h-40 sm:h-44 md:h-48 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white dark:bg-[#0b0b0b]" />

                            {/* Project Image or Fallback Pattern */}
                            {(project as any).image ? (
                              <div className="absolute inset-0 p-3 sm:p-4">
                                <div className="w-full h-full relative rounded-lg overflow-hidden">
                                  <img
                                    src={(project as any).image}
                                    alt={project.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="absolute inset-0 opacity-15 pointer-events-none">
                                  <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                      <pattern id={`grid-${project.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-theme-primary/40" />
                                      </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
                                  </svg>
                                </div>

                                <div className="relative z-10">
                                  <div className="w-14 h-14 rounded-xl bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center transition-colors duration-300">
                                    <div className="w-6 h-6 rounded bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300" />
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute top-0 right-0 w-px h-6 bg-gradient-to-b from-primary/30 to-transparent" />
                              <div className="absolute top-0 right-0 w-6 h-px bg-gradient-to-l from-primary/30 to-transparent" />
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className={`text-lg font-semibold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-theme-primary group-hover:text-primary'}`}>
                                {project.name}
                              </h3>
                            </div>
                            <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Desktop Scrollbar (Bottom) */}
              <div className="hidden lg:flex flex-col w-full mt-8 px-1 gap-2">
                <span className="text-[10px] text-muted uppercase tracking-widest font-medium ml-1">Drag to Scroll</span>
                <div
                  ref={scrollbarRef}
                  className="w-full h-2.5 bg-black/5 dark:bg-white/10 rounded-full cursor-pointer relative group overflow-hidden"
                  onMouseDown={handleScrollBarMouseDown}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: '25%', left: `${scrollProgress * 75}%` }}
                    transition={{ duration: 0 }}
                  />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {selectedProject && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedProjectId(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl h-auto max-h-[85vh] lg:h-[85vh] panel-surface rounded-3xl overflow-hidden shadow-2xl z-[61] flex flex-col"
          >
            {/* Mobile Header (Visible only on small screens) */}
            {/* Mobile Header (Visible only on small screens) */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] z-20 sticky top-0">
              <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="w-8 h-8 rounded-full chip-surface flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content Wrapper */}
            <div
              ref={mobileScrollRef}
              className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row"
            >

              {/* Left Panel: Scrollable Images */}
              <div className="w-full lg:flex-1 relative lg:overflow-hidden flex flex-col bg-black/5 dark:bg-black/20">

                {/* Mobile Swipe Indicator (Static at top) */}
                <div className="lg:hidden w-full flex items-center justify-between px-4 py-2 z-10 mt-2 pointer-events-none">
                  <ChevronLeft className="w-4 h-4 text-muted" />
                  <span className="uppercase tracking-widest text-xs font-medium text-muted">Swipe to view</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>

                <div className="w-full flex-1 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar relative snap-x snap-mandatory">
                  <div className="flex flex-row lg:flex-col p-4 sm:p-6 lg:p-8 gap-2 lg:gap-6 items-start lg:items-center">
                    {[0, 1, 2].map((slot) => {
                      const hasImage = (selectedProject as any).detailImages && (selectedProject as any).detailImages[slot];
                      return (
                        <div key={slot} className="flex-shrink-0 w-fit max-w-[85vw] snap-center rounded-2xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 bg-white dark:bg-[#0b0b0b] mx-auto">
                          {hasImage ? (
                            <div className="w-full relative flex items-center justify-center bg-gray-50/50 dark:bg-zinc-900/30 p-1">
                              <img
                                src={(selectedProject as any).detailImages[slot]}
                                alt={`${selectedProject.name} detail ${slot + 1}`}
                                className="w-auto h-auto max-h-[50vh] sm:max-h-[500px] object-contain block mx-auto rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-[300px] sm:h-[400px] relative">
                              <div className="absolute inset-0 opacity-30">
                                <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <pattern id={`project-detail-${slot}`} width="24" height="24" patternUnits="userSpaceOnUse">
                                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-theme-primary/40" />
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill={`url(#project-detail-${slot})`} />
                                </svg>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-medium text-muted uppercase tracking-wider">Image Frame {slot + 1}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Spacer for horizontal scroll padding */}
                    <div className="w-4 sm:w-6 h-1 flex-shrink-0 lg:hidden" />
                  </div>
                </div>

              </div>

              {/* Mobile Read More Button (Fixed at bottom) */}
              <div className="lg:hidden w-full flex flex-col gap-3 px-4 pb-4 mt-auto z-[60] relative">
                <button
                  type="button"
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  className="w-full bg-white dark:bg-[#1a1a1a] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium border border-black/5 dark:border-white/10 shadow-sm transition-colors active:scale-[0.98]"
                >
                  <span className="uppercase tracking-widest text-muted">{isDescriptionOpen ? 'Read less' : 'Read more'}</span>
                  <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDescriptionOpen && (
                    <motion.div
                      initial={{ height: -5, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/5 dark:border-white/10 shadow-sm"
                    >
                      <div className="p-4">
                        <p className="text-muted leading-relaxed text-sm">
                          {selectedProject.longDescription ?? selectedProject.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Panel: Content (Scrollable with parent on mobile) - Hidden on mobile now as it is in dropdown */}
              <div className="hidden lg:flex w-full lg:w-[420px] xl:w-[480px] bg-inherit lg:border-l border-black/10 dark:border-white/10 flex-col h-auto lg:h-full overflow-visible">
                <div className="p-6 sm:p-8 lg:p-10 h-full flex flex-col">

                  {/* Desktop Header */}
                  <div className="hidden lg:flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                      <p className="text-muted text-lg">App Design</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(null)}
                      className="w-10 h-10 rounded-full chip-surface flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="prose dark:prose-invert prose-lg leading-relaxed text-muted">
                      <p>{selectedProject.longDescription ?? selectedProject.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div >
        </div >,
        document.body
      )}
    </>
  );
}

export default Projects;
