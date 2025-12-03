import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Data points: x = time (0-1000), y = proficiency (1000-0 where 0 is top)
  const skillsData = [
    {
      name: 'Figma',
      color: '#FF6B6B', // Primary
      points: [
        { x: 0, y: 1000 },   // 2018: Starting
        { x: 330, y: 500 },   // 2020: Learning fast
        { x: 660, y: 150 },   // 2022: Advanced
        { x: 1000, y: 50 },   // 2024: Expert
      ]
    },
    {
      name: 'Photoshop',
      color: '#FFFFFF', // White for Dark Mode
      points: [
        { x: 0, y: 600 },    // 2018: Intermediate
        { x: 330, y: 400 },   // 2020: Improving
        { x: 660, y: 250 },   // 2022: Advanced
        { x: 1000, y: 200 },  // 2024: Very High
      ]
    },
    {
      name: 'Illustrator',
      color: '#9CA3AF', // Gray-400
      points: [
        { x: 0, y: 700 },    // 2018: Basic
        { x: 330, y: 550 },   // 2020: Intermediate
        { x: 660, y: 400 },   // 2022: Solid
        { x: 1000, y: 300 },  // 2024: Advanced
      ]
    }
  ];

  // Helper to generate smooth path
  const generatePath = (points: {x: number, y: number}[]) => {
    const d = 150; // Control point offset for tension
    return `M ${points[0].x} ${points[0].y} 
            C ${points[0].x + d} ${points[0].y}, ${points[1].x - d} ${points[1].y}, ${points[1].x} ${points[1].y}
            S ${points[2].x - d} ${points[2].y}, ${points[2].x} ${points[2].y}
            S ${points[3].x - d} ${points[3].y}, ${points[3].x} ${points[3].y}`;
  };

  return (
    <motion.section
      id="skills"
      className="min-h-screen py-24 relative overflow-hidden flex flex-col justify-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section - Matching Projects/Characteristics style */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-6">Technical Skills</h2>
        <p className="text-gray-400 max-w-2xl">
          My proficiency in design tools has evolved into a robust skillset. 
          Over the years, I've transitioned from traditional image editing to 
          mastering modern UI/UX workflows, with <span className="font-bold text-primary">Figma</span> becoming my primary driver.
        </p>
      </div>
        
      {/* Legend / Controls - Above Graph */}
      <div className="flex gap-8 mb-8 pb-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {skillsData.map((skill) => (
          <motion.button 
            key={skill.name}
              className={`group flex items-center gap-3 cursor-pointer transition-all duration-300 outline-none flex-shrink-0 ${
                hoveredSkill && hoveredSkill !== skill.name ? 'opacity-30' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => setHoveredSkill(skill.name === hoveredSkill ? null : skill.name)}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125 ${
                  hoveredSkill === skill.name ? 'scale-125' : ''
                }`}
                style={{ backgroundColor: skill.color }} 
              />
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">{skill.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="relative h-[400px] w-full bg-white/5 rounded-xl border border-white/10 p-4 md:p-8 shadow-sm overflow-hidden">
          
          {/* X Axis Labels (Years) */}
          <div className="absolute left-4 right-4 md:left-8 md:right-8 bottom-4 flex justify-between text-sm font-bold text-gray-500">
            <span>2018</span>
            <span>2020</span>
            <span>2022</span>
            <span>2024</span>
          </div>

          {/* Drawing Area */}
          <div className="absolute inset-0 left-4 right-4 top-8 bottom-12 md:left-8 md:right-8">
             {/* Grid Lines */}
             <div className="w-full h-full absolute inset-0">
                {/* Horizontal Lines */}
                <div className="w-full h-full flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-full h-px bg-white/10" />
                  ))}
                </div>
                {/* Vertical Lines */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((_, i) => (
                    <div key={i} className="h-full w-px bg-white/5" />
                  ))}
                </div>
             </div>

             {/* The Wavy Lines (SVG) */}
             <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              {skillsData.map((skill, skillIndex) => (
                <React.Fragment key={skill.name}>
                  <motion.path 
                    d={generatePath(skill.points)} 
                    fill="none" 
                    stroke={skill.color} 
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    strokeOpacity={hoveredSkill && hoveredSkill !== skill.name ? 0.1 : 1}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: skillIndex * 0.2 }}
                  />
                </React.Fragment>
              ))}
            </svg>

          </div>
        </div>
    </motion.section>
  );
};

export default Skills;
