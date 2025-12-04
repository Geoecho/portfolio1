import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.section
      id="contact"
      className="min-h-screen py-24 flex flex-col justify-center items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl font-bold mb-6">Contact</h2>
        <p className="text-gray-400 mb-12">
          Feel free to contact me at any time.
        </p>
        
        <form className="space-y-6 w-full" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input 
              type="email" 
              placeholder="Enter your email..." 
              className="w-full px-4 py-3 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent text-white placeholder-white/40"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Heading" 
              className="w-full px-4 py-3 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent text-white placeholder-white/40"
            />
          </div>
          <div>
            <textarea 
              placeholder="Type your message here..." 
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent resize-none text-white placeholder-white/40"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-white text-dark font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Submit
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};

export default Contact;
