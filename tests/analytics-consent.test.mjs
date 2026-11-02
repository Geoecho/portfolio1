import test from 'node:test';
import assert from 'node:assert/strict';
import { ANALYTICS_CONSENT_KEY, CONSENT_DURATION, createConsentStore, parseConsent, filterAnalyticsEvent } from '../src/lib/analyticsConsent.ts';

test('analytics defaults off; invalid, future, and expired choices fail closed', () => {
  const now = 1000;
  const valid = { version: 1, allowed: true, updatedAt: now, expiresAt: now + CONSENT_DURATION };
  for (const value of [null, '', '{broken', '{}', JSON.stringify({ ...valid, version: 2 }), JSON.stringify({ ...valid, allowed: 'true' }), JSON.stringify({ ...valid, updatedAt: now + 1 }), JSON.stringify({ ...valid, expiresAt: now })]) {
    assert.equal(parseConsent(value, now), null);
  }
  assert.equal(parseConsent(JSON.stringify(valid), now).allowed, true);
  assert.equal(parseConsent(JSON.stringify(valid), now + CONSENT_DURATION), null);
});

test('both choices persist, expire, and reflect changes from another tab', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  let now = 1000;
  const tabA = createConsentStore(() => storage, () => now);
  const tabB = createConsentStore(() => storage, () => now);
  assert.equal(tabA.read(), null);
  tabA.save(true);
  assert.equal(tabB.read().allowed, true);
  now += 1;
  tabB.save(false);
  assert.equal(tabA.read().allowed, false);
  now += CONSENT_DURATION;
  assert.equal(tabA.read(), null);
  values.delete(ANALYTICS_CONSENT_KEY);
  assert.equal(tabB.read(), null);
});

test('blocked storage remembers only this visit and never enables by default', () => {
  const blocked = () => { throw new Error('Storage blocked'); };
  const store = createConsentStore(blocked, () => 1000);
  assert.equal(store.read(), null);
  store.save(true);
  assert.equal(store.read().allowed, true);
  store.save(false);
  assert.equal(store.read().allowed, false);
  assert.equal(createConsentStore(blocked, () => 1000).read(), null);
});

test('event guard strips query strings and fragments and blocks immediately on withdrawal', () => {
  const values = new Map();
  globalThis.window = { localStorage: { getItem: key => values.get(key) ?? null } };
  const event = { type: 'pageview', url: 'https://bristicdesign.com/?email=private@example.com#private-message' };
  assert.equal(filterAnalyticsEvent(event), null);
  const updatedAt = Date.now();
  const record = { version: 1, allowed: true, updatedAt, expiresAt: updatedAt + CONSENT_DURATION };
  values.set(ANALYTICS_CONSENT_KEY, JSON.stringify(record));
  assert.deepEqual(filterAnalyticsEvent(event), { type: 'pageview', url: 'https://bristicdesign.com/' });
  assert.equal(filterAnalyticsEvent({ ...event, type: 'event' }), null);
  values.set(ANALYTICS_CONSENT_KEY, JSON.stringify({ ...record, allowed: false }));
  assert.equal(filterAnalyticsEvent(event), null);
  delete globalThis.window;
});
