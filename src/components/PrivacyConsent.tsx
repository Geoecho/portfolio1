import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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
  const content = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const openSettings = useCallback(() => {
    opener.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);
  const choose = useCallback((allowed: boolean) => {
    setConsent(analyticsConsent.save(allowed));
    setOpen(false);
    setNotice(allowed ? 'Analytics allowed. You can change this in Privacy settings.' : 'Analytics off. Your preference has been saved for this browser, when storage is available.');
  }, []);
  const dismiss = useCallback(() => {
    if (!analyticsConsent.read()) choose(false);
    else setOpen(false);
  }, [choose]);
  useLayoutEffect(() => {
    if (!open) return;
    const page = content.current;
    const previousInert = page?.inert ?? false;
    const previousFocus = opener.current ?? document.activeElement as HTMLElement | null;
    if (page) page.inert = true;
    if (!document.getElementById('root')?.inert) panel.current?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      // The privacy policy opens above this sheet and owns focus until it closes.
      if (document.getElementById('root')?.inert) return;
      if (event.key === 'Escape') { event.preventDefault(); dismiss(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...panel.current!.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)')].filter(node => node.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      if (page) page.inert = previousInert;
      document.removeEventListener('keydown', keyboard);
      // Restore after React has finished removing the dialog's focused element.
      requestAnimationFrame(() => {
        if (!page?.inert && !document.getElementById('root')?.inert && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      });
      opener.current = null;
    };
  }, [open, dismiss]);
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
    <div ref={content} className="portfolio-content">{children}</div>
    {consent?.allowed && <Analytics beforeSend={filterAnalyticsEvent} />}
    <AnimatePresence>{open && <motion.div className="privacy-overlay" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} onClick={event => { if (event.target === event.currentTarget) dismiss(); }}>
      <motion.aside ref={panel} className="privacy-consent" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description" tabIndex={-1} initial={{ y: reduced ? 0 : 24 }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : 12 }} transition={{ duration: reduced ? 0 : .25 }}>
      <div className="privacy-consent-copy">
      <div className="privacy-consent-heading"><h2 id="consent-title">Your privacy.</h2><a href="/privacy" onClick={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!/^\/privacy\/?$/.test(window.location.pathname)) { event.preventDefault(); openPolicy(); }
      }}>Privacy policy</a></div>
      <p id="consent-description">Optional, cookieless Vercel analytics measure visits, device type, and approximate location to help improve this portfolio. Change your choice anytime in Privacy settings.</p>
      </div>
      <div className="privacy-consent-actions"><PrivacyChoices />
      {consent && <button type="button" className="privacy-keep" onClick={dismiss}>Keep current choice</button>}</div>
    </motion.aside></motion.div>}</AnimatePresence>
    <span className="sr-only" role="status">{notice}</span>
  </PrivacyContext.Provider>;
}
