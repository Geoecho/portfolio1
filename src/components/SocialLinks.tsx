import { Instagram, Linkedin } from './AnimatedIcons';

export default function SocialLinks({ labels = false }: { labels?: boolean }) {
  return <div className={`social-links ${labels ? 'with-labels' : ''}`}>
    <a href="https://instagram.com/hristijanbr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link"><Instagram size={21} />{labels && <span>Instagram</span>}</a>
    <a href="https://www.linkedin.com/in/hristijan-bristi%C4%87-94482b197" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link"><Linkedin size={21} />{labels && <span>LinkedIn</span>}</a>
  </div>;
}
