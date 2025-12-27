import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [heading, setHeading] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      // Create the payload for Web3Forms
      // IMPORTANT: You need to obtain an Access Key from https://web3forms.com/
      // and replace 'YOUR_ACCESS_KEY_HERE' below.
      const payload = {
        access_key: 'd6cbadbf-da77-4dc1-9315-6db51265b7f0',
        email,
        subject: heading, // Map 'heading' to 'subject' for clarity in email
        message,
        from_name: 'Portfolio Contact Form',
        botcheck: false, // Hidden field to prevent spam
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        setErrorMessage(data.message || 'Failed to send. Try again.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }

      setStatus('success');
      setErrorMessage(null);
      setEmail('');
      setHeading('');
      setMessage('');

      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending email', error);
      setErrorMessage('Network error. Check your connection and try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-[100dvh] flex flex-col justify-center items-center text-center scroll-mt-[40px] pt-20 pb-36 lg:pb-48"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full max-w-2xl px-4 sm:px-0">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Contact</h2>
          <p className="text-muted mb-12 max-w-xl mx-auto">
            Feel free to contact me at any time.
          </p>

          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-4 py-3 rounded-lg input-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Heading"
                className="w-full px-4 py-3 rounded-lg input-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div>
              <textarea
                placeholder="Type your message here..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg input-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form) {
                      form.requestSubmit();
                    }
                  }
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={status === 'idle' ? { scale: 1.02, y: -1 } : {}}
              whileTap={status === 'idle' ? { scale: 0.98, y: 0 } : {}}
              animate={
                status === 'success'
                  ? { scale: 1, backgroundColor: 'rgb(255, 107, 107)', color: '#FFFFFF' }
                  : status === 'error'
                    ? { scale: 1, backgroundColor: 'rgb(255, 107, 107)', color: '#FFFFFF' }
                    : status === 'loading'
                      ? { scale: 0.98, opacity: 0.9 }
                      : { scale: 1, opacity: 1, backgroundColor: 'rgb(255, 107, 107)', color: '#FFFFFF' }
              }
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors relative overflow-hidden"
            >
              {status === 'loading' && (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-sm font-medium">Sending</span>
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                  />
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="text-sm font-semibold tracking-wide">Sent</span>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-sm font-semibold">{errorMessage ?? 'Failed to send. Try again.'}</span>
                </motion.div>
              )}
              {status === 'idle' && (
                <span className="text-sm font-medium">Submit</span>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
