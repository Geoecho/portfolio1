import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      id="intro"
      className="min-h-screen relative flex items-center overflow-hidden py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 h-full">
        {/* Centered Text Content with fade-in from top */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-12 z-20 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Beyond Pixels:
            <span className="block mt-3">
              <span className="bg-primary text-white px-2 py-1 box-decoration-clone text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-light leading-snug">A Chronicle of my Design Adventure!</span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Greetings! I'm Hristijan, a passionate 24-year-old UI/UX designer based in the city of Skopje, Macedonia.
            Imbued with a contradictory spirit, I indulge in the intricate dance of design elements.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
