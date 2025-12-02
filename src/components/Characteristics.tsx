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
              {/* Background shape (static or slightly rotating) */}
              <motion.path
                d="M 100 10 C 110 60 140 90 190 100 C 140 110 110 140 100 190 C 90 140 60 110 10 100 C 60 90 90 60 100 10 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.5"
                className="opacity-20"
                initial={{ pathLength: 0, rotate: 0 }}
                whileInView={{ pathLength: 1, rotate: 360 }}
                transition={{ 
                  pathLength: { duration: 2 },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              />
              
              {/* Inner shape (The data representation) - Rotated 45deg to match labels */}
              <motion.path
                d="M 100 30 C 105 65 135 95 170 100 C 135 105 105 135 100 170 C 95 135 65 105 30 100 C 65 95 95 65 100 30 Z" 
                fill="none"
                stroke="#FF6B6B" 
                strokeWidth="1.5"
                initial={{ pathLength: 0, scale: 0.8, opacity: 0, rotate: 45 }}
                whileInView={{ pathLength: 1, scale: 1, opacity: 1, rotate: 45 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              
              {/* Grid/Radar lines (Cross) - Rotated 45deg to point to labels */}
              <motion.path
                d="M 100 10 L 100 190 M 10 100 L 190 100"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ opacity: 0, rotate: 45 }}
                whileInView={{ opacity: 1, rotate: 45 }}
                transition={{ delay: 1 }}
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
