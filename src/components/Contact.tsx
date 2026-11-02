import { useState, FormEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, Loader2 } from './AnimatedIcons';
import { reveal } from './SectionIntro';
import SocialLinks from './SocialLinks';
const Contact = ({ onOpenPrivacy }: { onOpenPrivacy: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [heading, setHeading] = useState('');
  const [message, setMessage] = useState('');
  const openPrivacy = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onOpenPrivacy();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      const payload = {
        access_key: 'd6cbadbf-da77-4dc1-9315-6db51265b7f0',
        email,
        subject: heading,
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

        return;
      }

      setStatus('success');
      setErrorMessage(null);
      setEmail('');
      setHeading('');
      setMessage('');


    } catch (error) {
      console.error('Error sending email', error);
      setErrorMessage('Network error. Check your connection and try again.');
      setStatus('error');

    }
  };

  return <section id="contact" className="editorial-section contact-section">
    <motion.div {...reveal} className="contact-layout">
      <div className="contact-copy"><h2>Let’s work<br />together<span>.</span></h2><p>Tell me what you’re making and where you want to take it.</p><div className="contact-socials"><SocialLinks labels /></div></div>
      <div className="contact-form-wrap"><AnimatePresence mode="wait">
        {status === 'success' ? <motion.div className="contact-success" key="success" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status"><motion.span className="success-mark" initial={{ scale: .7 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}><Check size={30} /></motion.span><h3>Message sent.</h3><p>Thanks for reaching out. I'll get back to you by email.</p><button type="button" onClick={() => setStatus('idle')} className="text-link">Send another message <ArrowUpRight size={18} /></button></motion.div>
        : <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="contact-form" aria-busy={status === 'loading'}>
          <label htmlFor="contact-email">Your email<input id="contact-email" type="email" name="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} /></label>
          <label htmlFor="contact-subject">What are you working on?<input id="contact-subject" name="subject" type="text" required placeholder="A website, an app, an idea…" value={heading} onChange={event => setHeading(event.target.value)} /></label>
          <label htmlFor="contact-message">A little about your project<textarea id="contact-message" name="message" required rows={4} placeholder="The idea, the challenge, and where you'd like to take it." value={message} onChange={event => setMessage(event.target.value)} /></label>
          <AnimatePresence>{status === 'error' && <motion.p role="alert" className="form-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>{errorMessage}</motion.p>}</AnimatePresence>
          <motion.button disabled={status === 'loading'} type="submit" className="contact-send" whileHover={{ y: -2 }} whileTap={{ scale: .98 }}><span>{status === 'loading' ? 'Sending…' : status === 'error' ? 'Try again' : 'Send message'}</span>{status === 'loading' ? <Loader2 size={18} className="loading-spinner" /> : <ArrowUpRight size={20} />}</motion.button><p className="form-footnote">Your details are used to respond to your enquiry. <a href="/privacy" onClick={openPrivacy}>Privacy policy</a>.</p>
        </motion.form>}
      </AnimatePresence></div>
    </motion.div>
    <footer className="portfolio-footer"><p>Hristijan Bristić</p><div className="footer-links"><a className="text-link" href="/privacy" onClick={openPrivacy}>Privacy policy</a></div></footer>
  </section>;
};

export default Contact;
