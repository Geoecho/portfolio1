import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/scrollMotion';

export function useLenis() {
    const instance = useRef<Lenis | null>(null);
    useEffect(() => {
        // Only enable Lenis on desktop (not on touch devices)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) return;

        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let lenis: Lenis | null = null;
        const tick = (seconds: number) => lenis?.raf(seconds * 1000);
        const stop = () => {
            gsap.ticker.remove(tick);
            lenis?.off('scroll', ScrollTrigger.update);
            lenis?.destroy();
            lenis = null;
            instance.current = null;
        };
        const updatePreference = () => {
            stop();
            if (preference.matches) return;
            lenis = new Lenis({
                anchors: true,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            });
            instance.current = lenis;
            // Share one clock with the scroll scenes so smooth scrolling and pins agree.
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(tick);
        };
        updatePreference();
        preference.addEventListener('change', updatePreference);

        // Cleanup
        return () => {
            preference.removeEventListener('change', updatePreference);
            stop();
        };
    }, []);
    return useCallback(() => {
        if (instance.current) instance.current.scrollTo(0, { duration: .8, force: true });
        else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }, []);
}
