import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import scribblyThumb from '../assets/scribbly-thumb.png';
import scribbly1 from '../assets/scribbly-1.png';
import scribbly2 from '../assets/scribbly-2.png';
import scribbly3 from '../assets/scribbly-3.png';
import intecThumb from '../assets/intec-thumb.png';
import intec1 from '../assets/intec-1.png';
import intec2 from '../assets/intec-2.png';
import intec3 from '../assets/intec-3.png';

const Projects = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
      name: 'Wup',
      description: 'Wup is a GPS-based alarm experience designed to help users wake up or get notified based on location.',
      longDescription:
        'Wup is a GPS-based alarm experience designed to help users wake up or get notified based on location rather than time. Instead of relying on fixed alarms, Wup triggers alerts when the user reaches a defined place, making it useful for commuting, travel, and daily routines.'
    },
    {
      id: 4,
      name: 'Project 4',
      description: 'Mobile-first design where micro-interactions guide the user through a calm, focused journey.',
      longDescription:
        'Project 4 is a mobile-first exploration where micro-interactions do the heavy lifting: guiding attention, confirming actions, and reducing cognitive load. The interface uses a simple component system with clear states, ensuring the experience remains calm even when the user moves quickly. Motion is used as feedback rather than decoration, paired with high-contrast type and touch-friendly spacing. The overall goal is a focused, frictionless journey with a premium feel.'
    },
    {
      id: 5,
      name: 'Project 5',
      description: 'Dashboard exploration balancing dense information, breathing room, and strong typographic rhythm.',
      longDescription:
        'This dashboard concept balances dense data with breathing room, so the user can understand priority and context at a glance. I experimented with grouping patterns, spacing scales, and type weights to make the interface feel organized without feeling rigid. Subtle surface contrast and consistent borders separate modules cleanly, and the layout adapts responsively to prevent “data walls” on smaller screens. The result is a system that stays readable, scalable, and visually calm.'
    },
    {
      id: 6,
      name: 'Project 6',
      description: 'Experimental concept pushing asymmetry, layered depth, and an almost editorial presentation style.',
      longDescription:
        'Project 6 is an experimental layout study focused on asymmetry, layering, and editorial composition. The concept plays with rhythm—large moments of whitespace followed by dense visual emphasis—while keeping navigation and hierarchy predictable. Depth is introduced through subtle borders, controlled blur, and carefully restrained shadow. It’s an exploration in making the interface feel designed and intentional without sacrificing clarity or usability.'
    },
  ];

  const selectedProject = projects.find(project => project.id === selectedProjectId) || null;

  // Simple scroll handler for buttons
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

  // Lock background scroll when a project modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedProjectId !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedProjectId]);

  return (
    <>
      <section
        id="projects"
        className="pt-12 pb-16 sm:py-[60px] scroll-mt-[40px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Projects</h2>
            <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore my projects: a testament to the art of minimal design
              meeting functionality. Witnesses to each interface is a narrative of
              simplicity and purpose, where every element serves a purpose.
            </p>
          </div>

          <div className="pt-2">
            <div className="hidden lg:flex justify-end mb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollByAmount('left')}
                  className="h-9 w-9 rounded-full chip-surface flex items-center justify-center transition-opacity hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Scroll projects left"
                >
                  <ChevronLeft className="h-4 w-4 text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByAmount('right')}
                  className="h-9 w-9 rounded-full chip-surface flex items-center justify-center transition-opacity hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Scroll projects right"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>

            <div className="relative">

              <div
                ref={scrollerRef}
                className="overflow-x-auto overflow-y-visible pt-3 -mx-4 px-4 snap-x snap-mandatory scroll-px-6 lg:scroll-pr-16 no-scrollbar"
              >
                <motion.div
                  className="flex flex-nowrap gap-4 sm:gap-5 lg:gap-6 pb-2 pr-12 lg:pr-16"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {projects.map((project) => (
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
                      <div className="rounded-2xl card-surface card-surface-hover transition-all duration-300 overflow-hidden">
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
                            <h3 className="text-lg font-semibold text-theme-primary group-hover:text-primary transition-colors duration-300">
                              {project.name}
                            </h3>
                          </div>
                          <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
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
            className="relative w-full max-w-5xl h-[85vh] panel-surface rounded-3xl overflow-hidden shadow-2xl z-[61] flex flex-col"
          >
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
            <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">

              {/* Left Panel: Scrollable Images */}
              <div className="w-full lg:flex-1 relative lg:overflow-hidden flex flex-col bg-black/5 dark:bg-black/20">
                <div className="w-full flex-1 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar relative snap-x snap-mandatory">
                  <div className="flex flex-row lg:flex-col p-4 sm:p-6 lg:p-8 gap-4 lg:gap-6 items-start lg:items-center">
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

                {/* Mobile Swipe Indicator Overlay */}
                {/* Mobile Swipe Indicator (Inline, below images) */}
                <div className="lg:hidden w-full flex justify-center px-4 pb-4 pointer-events-none">
                  <div className="w-full bg-white dark:bg-[#1a1a1a] py-3 rounded-xl flex items-center justify-between px-4 text-xs font-medium border border-black/5 dark:border-white/10 shadow-sm">
                    <ChevronLeft className="w-4 h-4 text-muted" />
                    <span className="uppercase tracking-widest text-muted">Swipe to view</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </div>
                </div>
              </div>

              {/* Right Panel: Content (Scrollable with parent on mobile) */}
              <div className="w-full lg:w-[420px] xl:w-[480px] bg-inherit lg:border-l border-black/10 dark:border-white/10 flex flex-col h-auto lg:h-full overflow-visible">
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
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Projects;
