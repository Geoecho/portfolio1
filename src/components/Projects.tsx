import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Projects = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const projects = [
    {
      id: 1,
      name: 'Woke',
      description: 'Concept app exploring mindful wake routines, typography, and subtle motion design.',
      longDescription:
        'Woke is a concept experience designed around calm mornings and intentional habits. The goal was to create an interface that feels quiet, confident, and supportive rather than noisy or demanding. I focused on clear hierarchy, generous spacing, and restrained motion to guide the user through the routine without adding friction. The design explores typography-led layouts, gentle transitions, and a warm visual tone that keeps the content readable while still feeling premium.'
    },
    {
      id: 2,
      name: 'Scribbly',
      description: 'A playful sketching experience focused on minimal UI, expressive strokes, and quick ideation.',
      longDescription:
        'Scribbly is a playful sketching concept built for speed and experimentation. The UI stays out of the way so the canvas always feels “ready,” with tools surfaced only when needed. I explored a minimal control system, strong empty-space composition, and expressive visual feedback for strokes and states. The concept is aimed at quick ideation: sketch, iterate, and export without the typical complexity that slows creative flow.'
    },
    {
      id: 3,
      name: 'Project 3',
      description: 'Interface study combining bold grids, soft gradients, and clear hierarchy for content-heavy layouts.',
      longDescription:
        'This interface study explores how bold grid systems can keep content-heavy screens feeling structured and easy to scan. The layout is built around strong typographic rhythm, predictable spacing, and modular surfaces that separate information without heavy visual noise. Soft gradients and subtle depth cues are used to establish hierarchy while keeping the overall presentation clean. The result is a design that reads quickly, scales well, and stays consistent across breakpoints.'
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
      <motion.section
        id="projects"
        className="pt-12 pb-16 sm:py-[60px]"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.25 }}
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
      </motion.section>

      {selectedProject && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedProjectId(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl panel-surface backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl z-[61]"
          >
            <div className="flex max-h-[82vh] flex-col">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6 md:p-8 border-b border-black/10 dark:border-white/10 panel-surface backdrop-blur-xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold">{selectedProject.name}</h3>
                  <p className="mt-2 text-muted text-sm sm:text-base max-w-xl">App Design</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(null)}
                  className="ml-2 rounded-full chip-surface h-9 w-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[0, 1, 2].map((slot) => (
                    <div
                      key={slot}
                      className="relative w-full h-[min(42vh,420px)] sm:h-[min(38vh,420px)] lg:h-[min(26vh,260px)] rounded-xl card-surface card-surface-hover overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`project-frame-${slot}`} width="24" height="24" patternUnits="userSpaceOnUse">
                              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-theme-primary/40" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#project-frame-${slot})`} />
                        </svg>
                      </div>
                      <div className="relative h-full w-full flex items-end justify-between p-3">
                        <span className="text-xs font-medium text-theme-primary">Frame {slot + 1}</span>
                        <span className="text-[10px] uppercase tracking-wide text-muted">Image slot</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 sm:px-8 pb-8">
                  <p className="text-muted text-base sm:text-lg leading-relaxed">
                    {selectedProject.longDescription ?? selectedProject.description}
                  </p>
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
