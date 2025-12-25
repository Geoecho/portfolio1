import { type SVGProps } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const FigmaIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" fill="currentColor" />
      <path d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" fill="currentColor" />
      <path d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" fill="currentColor" />
      <path d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" fill="currentColor" />
      <path d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" fill="currentColor" />
    </svg>
  );
};

const PhotoshopIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 240 234" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M54,164.1V61.2c0-0.7,0.3-1.1,1-1.1c1.7,0,3.3,0,5.6-0.1c2.4-0.1,4.9-0.1,7.6-0.2c2.7-0.1,5.6-0.1,8.7-0.2 c3.1-0.1,6.1-0.1,9.1-0.1c8.2,0,15,1,20.6,3.1c5,1.7,9.6,4.5,13.4,8.2c3.2,3.2,5.7,7.1,7.3,11.4c1.5,4.2,2.3,8.5,2.3,13 c0,8.6-2,15.7-6,21.3c-4,5.6-9.6,9.8-16.1,12.2c-6.8,2.5-14.3,3.4-22.5,3.4c-2.4,0-4,0-5-0.1c-1-0.1-2.4-0.1-4.3-0.1v32.1 c0.1,0.7-0.4,1.3-1.1,1.4c-0.1,0-0.2,0-0.4,0H55.2C54.4,165.4,54,165,54,164.1z M75.8,79.4V113c1.4,0.1,2.7,0.2,3.9,0.2H85 c3.9,0,7.8-0.6,11.5-1.8c3.2-0.9,6-2.8,8.2-5.3c2.1-2.5,3.1-5.9,3.1-10.3c0.1-3.1-0.7-6.2-2.3-8.9c-1.7-2.6-4.1-4.6-7-5.7 c-3.7-1.5-7.7-2.1-11.8-2c-2.6,0-4.9,0-6.8,0.1C77.9,79.2,76.5,79.3,75.8,79.4L75.8,79.4z" fill="currentColor" />
      <path d="M192,106.9c-3-1.6-6.2-2.7-9.6-3.4c-3.7-0.8-7.4-1.3-11.2-1.3c-2-0.1-4.1,0.2-6,0.7c-1.3,0.3-2.4,1-3.1,2 c-0.5,0.8-0.8,1.8-0.8,2.7c0,0.9,0.4,1.8,1,2.6c0.9,1.1,2.1,2,3.4,2.7c2.3,1.2,4.7,2.3,7.1,3.3c5.4,1.8,10.6,4.3,15.4,7.3 c3.3,2.1,6,4.9,7.9,8.3c1.6,3.2,2.4,6.7,2.3,10.3c0.1,4.7-1.3,9.4-3.9,13.3c-2.8,4-6.7,7.1-11.2,8.9c-4.9,2.1-10.9,3.2-18.1,3.2 c-4.6,0-9.1-0.4-13.6-1.3c-3.5-0.6-7-1.7-10.2-3.2c-0.7-0.4-1.2-1.1-1.1-1.9v-17.4c0-0.3,0.1-0.7,0.4-0.9 c0.3-0.2,0.6-0.1,0.9,0.1c3.9,2.3,8,3.9,12.4,4.9c3.8,1,7.8,1.5,11.8,1.5c3.8,0,6.5-0.5,8.3-1.4c1.6-0.7,2.7-2.4,2.7-4.2 c0-1.4-0.8-2.7-2.4-4c-1.6-1.3-4.9-2.8-9.8-4.7c-5.1-1.8-9.8-4.2-14.2-7.2c-3.1-2.2-5.7-5.1-7.6-8.5c-1.6-3.2-2.4-6.7-2.3-10.2 c0-4.3,1.2-8.4,3.4-12.1c2.5-4,6.2-7.2,10.5-9.2c4.7-2.4,10.6-3.5,17.7-3.5c4.1,0,8.3,0.3,12.4,0.9c3,0.4,5.9,1.2,8.6,2.3 c0.4,0.1,0.8,0.5,1,0.9c0.1,0.4,0.2,0.8,0.2,1.2v16.3c0,0.4-0.2,0.8-0.5,1C192.9,107.1,192.4,107.1,192,106.9z" fill="currentColor" />
    </svg>
  );
};

const IllustratorIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M122.11,66.15h-37.41l-42.97,115.62h33.48l5.58-17.27h42.98l5.58,17.27h34.5l-41.73-115.62ZM102.27,135.65h-12.17l12.17-37.69,12.17,37.69h-12.17Z" fill="currentColor" />
      <rect x="168.12" y="90.74" width="30.98" height="91.03" fill="currentColor" />
      <path d="M200.12,74.28c.09,8.49-6.78,14.49-16.5,14.41-9.73.08-16.59-5.92-16.5-14.41-.09-8.49,6.78-14.49,16.5-14.41,9.73-.08,16.59,5.92,16.5,14.41Z" fill="currentColor" />
    </svg>
  );
};

const LightroomIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 256.4 250" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M134.6,176.7H66.9c-1.2,0-1.7-0.6-1.7-1.9V65.6c-0.1-0.7,0.4-1.4,1.2-1.5c0.1,0,0.2,0,0.4,0h20.9 c0.5-0.1,1.2,0.3,1.2,0.9c0,0.1,0,0.2,0,0.3V155h49.4c1.1,0,1.4,0.5,1.2,1.5l-3.1,18.6c0,0.5-0.3,1-0.6,1.3 C135.4,176.6,135,176.7,134.6,176.7z" fill="currentColor" />
      <path d="M151.7,91.2h18.7c1.1,0,1.9,0.7,2.2,1.7c0.4,0.7,0.7,1.6,0.9,2.5c0.2,1.1,0.4,2.2,0.5,3.3 c0.1,1.2,0.2,2.5,0.2,3.8c3.2-3.7,7.1-6.8,11.4-9.2c4.9-2.7,10.4-4,15.9-3.8c0.7-0.1,1.4,0.4,1.5,1.2c0,0.1,0,0.2,0,0.4V112 c0,0.9-0.5,1.2-1.7,1.2c-6.9-0.4-13.9,0.9-20.2,3.6c-2.1,1-4.2,2.2-5.8,4v54.5c0,1.1-0.4,1.5-1.4,1.5h-20.8 c-0.9,0.1-1.6-0.4-1.7-1.3c0-0.1,0-0.3,0-0.4v-59.2c0-2.6,0-5.2-0.1-8c-0.1-2.8-0.1-5.6-0.2-8.3c-0.1-2.4-0.3-4.7-0.6-7.1 c-0.1-0.5,0.2-1.1,0.7-1.2C151.4,91.1,151.5,91.1,151.7,91.2L151.7,91.2z" fill="currentColor" />
    </svg>
  );
};

const WindsurfIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z" fill="currentColor" />
    </svg>
  );
};

const Skills = () => {

  // Data points: x = time (0-1000), y = proficiency (1000-0 where 0 is top)
  const skillsData = [
    {
      name: 'Figma',
      icon: FigmaIcon,
      isSvg: true,
      type: 'Design Tool',
      description: 'UI/UX workflows, components, and design systems.',
      level: 5,
    },
    {
      name: 'Photoshop',
      icon: PhotoshopIcon,
      isSvg: true,
      type: 'Raster Editing',
      description: 'Compositing, retouching, and visual edits.',
      level: 3,
    },
    {
      name: 'Illustrator',
      icon: IllustratorIcon,
      isSvg: true,
      type: 'Vector Design',
      description: 'Logos, icons, and scalable graphics.',
      level: 4,
    },
    {
      name: 'Lightroom',
      icon: LightroomIcon,
      isSvg: true,
      type: 'Photo Workflow',
      description: 'Color grading, presets, and batch editing.',
      level: 5,
    },
    {
      name: 'Windsurf',
      icon: WindsurfIcon,
      isSvg: true,
      type: 'Vibe Coding',
      description: 'Prototyping and iteration with AI-assisted flow.',
      level: 3,
    },
    {
      name: 'HTML & CSS',
      icon: Code,
      isSvg: false,
      type: 'Frontend',
      description: 'Layout, responsiveness, and polished UI.',
      level: 4,
    }
  ];

  return (
    <motion.section
      id="skills"
      className="py-16 sm:py-[60px] relative overflow-hidden"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section - Matching Projects/Characteristics style */}
      <div className="mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Technical Skills</h2>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          My proficiency in design tools has evolved into a robust skillset.
          Over the years, I've transitioned from traditional image editing to
          mastering modern UI/UX workflows, with <span className="font-bold text-primary">Figma</span> becoming my primary driver.
        </p>
      </div>

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">

        <div className="overflow-x-auto overflow-y-hidden px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 no-scrollbar">
          <div className="grid grid-rows-2 grid-flow-col lg:grid-rows-none lg:grid-flow-row lg:grid-cols-3 gap-4 min-w-max lg:min-w-0 pr-8 sm:pr-10 lg:pr-0">
            {skillsData.map((skill, idx) => {
              // Simpler card design
              const SkillIcon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="w-[280px] sm:w-[320px] lg:w-full flex items-center gap-4 p-4 rounded-2xl card-surface border border-black/5 dark:border-white/5"
                >
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    {skill.isSvg ? (
                      <SkillIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <SkillIcon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-theme-primary">{skill.name}</h3>
                    <p className="text-sm text-muted/80 truncate">{skill.type}</p>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs font-medium text-muted">
                    {skill.level}/5
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
