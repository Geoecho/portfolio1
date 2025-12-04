import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const projects = [
    { id: 1, name: 'Woke' },
    { id: 2, name: 'Scibbly' },
    { id: 3, name: 'Project 3' },
    { id: 4, name: 'Project 4' },
    { id: 5, name: 'Project 5' },
    { id: 6, name: 'Project 6' },
  ];

  const startAnimation = () => {
    setActiveCard(null); // Reset first
    
    let timeouts: NodeJS.Timeout[] = [];
    
    // Animate through each card
    projects.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setActiveCard(index);
      }, (index + 1) * 800); // Start after a small delay
      timeouts.push(timeout);
    });

    // Clear all cards after the last one
    const finalTimeout = setTimeout(() => {
      setActiveCard(null);
    }, (projects.length + 1) * 800 + 1000); // Extra 1s after last card
    timeouts.push(finalTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = section.clientWidth;
      const maxTranslate = Math.max(0, totalWidth - viewportWidth);

      if (maxTranslate <= 0) return;

      const scrollDistance = maxTranslate * 1.2; // less vertical scroll needed for full horizontal travel

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Fade the section in at the start of the pin

      // Keep content static for nearly half of the pinned scroll, then move horizontally,
      // and hold the final frame a bit longer so the section doesn’t disappear instantly.
      tl.fromTo(
        track,
        { x: 0 },
        { x: -maxTranslate, ease: 'none', duration: 1 },
        0.6 // start horizontal movement after more scroll while pinned
      ).to(
        track,
        { x: -maxTranslate, duration: 0.4 },
        1.6 // short hold at the end before unpinning
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      id="projects"
      className="min-h-screen py-24 flex flex-col justify-center"
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-6">Projects</h2>
        <p className="text-gray-400 max-w-2xl">
          Explore my projects: a testament to the art of minimal design
          meeting functionality. Witnesses to each interface is a narrative of
          simplicity and purpose, where every element serves a purpose.
        </p>
      </div>

      <div className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <motion.div 
          ref={trackRef}
          className="flex flex-nowrap gap-4 sm:gap-6 lg:gap-10 pb-2"
          onViewportEnter={startAnimation}
          viewport={{ once: false, margin: "-100px" }}
        >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            whileTap={{ scale: 0.96 }}
          >
            <div className="aspect-square bg-white/5 border border-white/10 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center group-hover:shadow-md transition-all flex-shrink-0 w-64 md:w-56 lg:w-80">
               {/* Blurred Grid Background */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <svg className="w-full h-full blur-[1px]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                   <defs>
                     <pattern id={`grid-${project.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                       <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/30"/>
                     </pattern>
                     {/* Glow Filter shared with Characteristics */}
                     <filter id="glow-project" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                   </defs>
                   <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
                 </svg>
               </div>

               {/* All squares start and end white, animate to red with glow during cycle */}
               <motion.div 
                 className="w-16 h-16 rounded-lg group-hover:border-white/30 transition-colors z-10 border border-white/10"
                 initial={{ backgroundColor: "rgba(255, 255, 255, 0.1)", scale: 1 }}
                 animate={{ 
                   backgroundColor: activeCard === index ? "rgba(255, 107, 107, 0.8)" : "rgba(255, 255, 255, 0.1)",
                   scale: activeCard === index ? 1.1 : 1,
                   filter: activeCard === index ? "url(#glow-project)" : "none",
                 }}
                 transition={{ duration: 0.4, ease: "easeInOut" }}
               />
               
               <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-20" />
            </div>
            <h3 className="font-medium text-white group-hover:text-primary transition-colors">{project.name}</h3>
            <p className="text-sm text-gray-500">App Design</p>
          </motion.div>
        ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Projects;
