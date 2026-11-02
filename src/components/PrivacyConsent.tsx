import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ANALYTICS_CONSENT_KEY, analyticsConsent, filterAnalyticsEvent } from '../lib/analyticsConsent';

const PrivacyContext = createContext<{
  allowed: boolean | null;
  choose: (allowed: boolean) => void;
  openSettings: () => void;
} | null>(null);

export function usePrivacyConsent() {
  const context = useContext(PrivacyContext);
  if (!context) throw new Error('Privacy controls require PrivacyConsentProvider');
  return context;
}

export function PrivacyChoices() {
  const { allowed, choose } = usePrivacyConsent();
  return <div className="privacy-choice-buttons">
    <button type="button" className="privacy-allow" aria-pressed={allowed === true} onClick={() => choose(true)}>Allow analytics</button>
    <button type="button" className="privacy-decline" aria-pressed={allowed === false} onClick={() => choose(false)}>No thanks</button>
  </div>;
}

export default function PrivacyConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState(() => analyticsConsent.read());
  const [open, setOpen] = useState(() => !analyticsConsent.read() && !/^\/privacy\/?$/.test(window.location.pathname));
  const [notice, setNotice] = useState('');
  const opener = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const openSettings = useCallback(() => {
    opener.current = document.activeElement as HTMLElement;
    setOpen(true);
    // An automatic notice never steals focus. Settings opened by the visitor do.
    requestAnimationFrame(() => panel.current?.querySelector('button')?.focus({ preventScroll: true }));
  }, []);
  const choose = useCallback((allowed: boolean) => {
    setConsent(analyticsConsent.save(allowed));
    setOpen(false);
    setNotice(allowed ? 'Analytics allowed. You can change this in Privacy settings.' : 'Analytics off. Your preference has been saved for this browser, when storage is available.');
    if (panel.current?.contains(document.activeElement)) opener.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const sync = () => {
      const current = analyticsConsent.read();
      setConsent(previous => previous?.updatedAt === current?.updatedAt && previous?.allowed === current?.allowed ? previous : current);
      if (!current && !/^\/privacy\/?$/.test(window.location.pathname)) setOpen(true);
    };
    const storage = (event: StorageEvent) => { if (event.key === null || event.key === ANALYTICS_CONSENT_KEY) sync(); };
    window.addEventListener('storage', storage);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    const expiry = window.setInterval(sync, 60_000);
    return () => {
      window.removeEventListener('storage', storage);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
      window.clearInterval(expiry);
    };
  }, []);
  const openPolicy = () => {
    if (/^\/privacy\/?$/.test(window.location.pathname)) return;
    window.dispatchEvent(new Event('portfolio:privacy-policy'));
  };
  return <PrivacyContext.Provider value={{ allowed: consent?.allowed ?? null, choose, openSettings }}>
    {children}
    {consent?.allowed && <Analytics beforeSend={filterAnalyticsEvent} />}
    <AnimatePresence>{open && <motion.aside ref={panel} className="privacy-consent" aria-labelledby="consent-title" initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 12 }} transition={{ duration: reduced ? 0 : .25 }}>
      <div className="privacy-consent-heading"><h2 id="consent-title">Your privacy.</h2><a href="/privacy" onClick={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!/^\/privacy\/?$/.test(window.location.pathname)) { event.preventDefault(); openPolicy(); }
      }}>Privacy policy</a></div>
      <p>Optional, cookieless Vercel analytics measure visits, device type, and approximate location to help improve this portfolio. Change your choice anytime in Privacy settings.</p>
      <PrivacyChoices />
      {consent && <button type="button" className="privacy-keep" onClick={() => { setOpen(false); opener.current?.focus({ preventScroll: true }); }}>Keep current choice</button>}
    </motion.aside>}</AnimatePresence>
    <span className="sr-only" role="status">{notice}</span>
  </PrivacyContext.Provider>;
}
