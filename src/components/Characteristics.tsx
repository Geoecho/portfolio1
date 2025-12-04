import { motion } from 'framer-motion';

const Characteristics = () => {
  return (
    <motion.section
      id="characteristics"
      className="min-h-screen py-24 flex flex-col justify-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-16 text-right flex flex-col items-end">
        <h2 className="text-4xl font-bold mb-6">Personal Characteristics</h2>
        <p className="text-gray-400 max-w-2xl">
          Within the confines of a circle oscilliator, my core personal
          characteristics to share.
        </p>
      </div>

      <div className="relative w-full h-auto">
        {/* Flex container for Chart + See More */}
        <div className="flex items-end justify-end h-full gap-4">
          {/* Chart Container */}
          <div className="relative w-full max-w-sm aspect-square flex-shrink-0">
            {/* Labels */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-10 left-0 text-sm font-bold z-10 text-right w-24 text-gray-300"
            >
              Problem<br/>Solver
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-16 -right-4 text-sm font-bold z-10 w-24 text-gray-300"
            >
              Teamplayer
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-16 -right-8 text-sm font-bold z-10 w-24 text-gray-300"
            >
              Friendly
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 left-0 text-sm font-bold z-10 text-right w-24 text-gray-300"
            >
              Quick<br/>Learner
            </motion.div>

            {/* The Shape */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
              {/* Define a glow filter for futuristic effect */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Layer - Rotating Shape + orbiting traits */}
              <motion.g
                initial={{ rotate: 0, scale: 0.65 }}
                whileInView={{ rotate: 360 }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
                style={{ transformOrigin: "100px 100px" }}
              >
                {/* Background shape - Gray */}
                <motion.path
                  d="M 100 10 C 110 60 140 90 190 100 C 140 110 110 140 100 190 C 90 140 60 110 10 100 C 60 90 90 60 100 10 Z"
                  fill="none"
                  stroke="#868585"
                  strokeWidth="0.5"
                  className="opacity-50"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ 
                    pathLength: { duration: 2 }
                  }}
                />

                {/* Traits at 4 sides, counter‑rotated so they stay horizontal while orbiting */}
                <motion.text
                  x="100" y="25"
                  textAnchor="middle"
                  fill="#868585"
                  className="text-[10px] font-bold opacity-80"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
                >
                  Creative
                </motion.text>

                <motion.text
                  x="175" y="105"
                  textAnchor="middle"
                  fill="#868585"
                  className="text-[10px] font-bold opacity-80"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
                >
                  Detail Oriented
                </motion.text>

                <motion.text
                  x="100" y="180"
                  textAnchor="middle"
                  fill="#868585"
                  className="text-[10px] font-bold opacity-80"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
                >
                  Precise
                </motion.text>

                <motion.text
                  x="25" y="105"
                  textAnchor="middle"
                  fill="#868585"
                  className="text-[10px] font-bold opacity-80"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
                >
                  Intuitive
                </motion.text>
              </motion.g>
              
              {/* Glowing Filled Indicator - Scales in after 1s - Red */}
              <motion.path
                d="M 100 30 C 105 65 135 95 170 100 C 135 105 105 135 100 170 C 95 135 65 105 30 100 C 65 95 95 65 100 30 Z" 
                fill="rgba(255, 107, 107, 0.1)"
                stroke="#FF6B6B" 
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0, rotate: 45 }}
                whileInView={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: 45 
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1,
                  ease: "easeOut"
                }}
                style={{ transformOrigin: "100px 100px" }}
              />
              
            </svg>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Characteristics;
