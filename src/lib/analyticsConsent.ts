export const ANALYTICS_CONSENT_KEY = 'portfolio.analytics-consent';
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;

export interface AnalyticsConsent {
  version: 1;
  allowed: boolean;
  updatedAt: number;
  expiresAt: number;
}

export function parseConsent(value: string | null, now = Date.now()): AnalyticsConsent | null {
  try {
    const record = JSON.parse(value ?? 'null');
    if (record?.version !== 1 || typeof record.allowed !== 'boolean' ||
      !Number.isFinite(record.updatedAt) || !Number.isFinite(record.expiresAt) ||
      record.updatedAt > now || record.expiresAt <= now ||
      record.expiresAt - record.updatedAt !== CONSENT_DURATION) return null;
    return record;
  } catch { return null; }
}

// Storage can be disabled in private browsers. In that case, remember only this visit.
export function createConsentStore(getStorage: () => Pick<Storage, 'getItem' | 'setItem'>, now = Date.now) {
  let memory: string | null = null;
  let memoryOnly = false;
  return {
    read() {
      if (!memoryOnly) {
        try { memory = getStorage().getItem(ANALYTICS_CONSENT_KEY); }
        catch { memoryOnly = true; }
      }
      return parseConsent(memory, now());
    },
    save(allowed: boolean) {
      const updatedAt = now();
      const record: AnalyticsConsent = { version: 1, allowed, updatedAt, expiresAt: updatedAt + CONSENT_DURATION };
      memory = JSON.stringify(record);
      try { getStorage().setItem(ANALYTICS_CONSENT_KEY, memory); }
      catch { memoryOnly = true; }
      return record;
    },
  };
}

export const analyticsConsent = createConsentStore(() => window.localStorage);

export function filterAnalyticsEvent<T extends { type: string; url: string }>(event: T): T | null {
  // The SDK keeps its listeners after unmounting. Check the current choice on every event.
  if (!analyticsConsent.read()?.allowed || event.type !== 'pageview') return null;
  try {
    const url = new URL(event.url);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.href };
  } catch { return null; }
}
