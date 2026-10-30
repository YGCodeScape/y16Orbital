import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from './components/Nav';
import HeroLanding from './components/HeroLanding';
import Section3Gateway from './components/section3/Section3Gateway';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

/**
 * Root Application Component
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE GLOBAL DELAYED REFRESH:
 * HeroLanding uses ScrollTrigger pin (end: +=1600), which inserts 1600px of
 * virtual scroll space into the document. This happens asynchronously as GSAP
 * processes the pin after React's first paint.
 *
 * Section3Gateway's ScrollTriggers register at the same time (or earlier),
 * measuring Section 3's DOM position BEFORE the 1600px pin space is added.
 * As a result, every Section 3 trigger fires 1600px too early — inside Section 2.
 *
 * Fix: After ALL components have mounted and all useGSAP hooks have run,
 * call ScrollTrigger.refresh() with a 350ms timeout. This gives HeroLanding's
 * pin enough time to fully commit its virtual scroll space into the layout,
 * and then forces a global recalculation of ALL trigger positions.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function App() {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll runtime
    const lenis = new Lenis({
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Make lenis accessible globally for programmatic scrolling
    window.__lenis = lenis;

    // 2. Synchronize Lenis scroll positions with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const handleGsapTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(handleGsapTick);
    gsap.ticker.lagSmoothing(0);

    // 3. Global ScrollTrigger refresh after all components have fully mounted.
    //    350ms is enough for HeroLanding's pin (+=1600) to register its virtual
    //    scroll space, so Section 3 triggers recalculate to the correct position.
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(refreshTimer);
      window.__lenis = null;
      lenis.destroy();
      gsap.ticker.remove(handleGsapTick);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Global Y16Orbital Navigation */}
      <Nav />

      {/* Main Experience Stream */}
      <main className="w-full">
        <HeroLanding />
        <Section3Gateway />
      </main>
    </div>
  );
}
