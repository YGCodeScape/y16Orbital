import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from './components/Nav';
import HeroLanding from './components/HeroLanding';
import Section3Gateway from './components/section3/Section3Gateway';
import Section4Sprout from './components/section4/Section4Sprout';
// import Section5WavyShowcase from './components/section5/Section5WavyShowcase';
// import Section6PerspectiveHero from './components/section6/Section6PerspectiveHero';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

/**
 * Root Application Component
 * ─────────────────────────────────────────────────────────────────────────────
 * PRODUCTION SCROLL & TIMING ARCHITECTURE:
 * 1. Synchronous Registration:
 *    ScrollTrigger and Lenis run in a unified ticker loop with zero lag smoothing
 *    during animation, preventing desync between wheel/touch and GSAP triggers.
 * 2. Event-Driven Lifecycle Refresh:
 *    Rather than arbitrary setTimeout values, ScrollTrigger is refreshed on:
 *    - Initial component paint (requestAnimationFrame)
 *    - Complete font rendering (`document.fonts.ready`)
 *    - Full asset / window load (`window.addEventListener('load')`)
 *    - Window resize with debounce
 * 3. Strict Cleanup:
 *    Lenis event handlers are explicitly removed with `lenis.off()`,
 *    the global reference is verified before clearing, and GSAP's ticker
 *    lagSmoothing setting is cleanly restored on unmount.
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
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    const handleGsapTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(handleGsapTick);
    // Disable lag smoothing while active so Lenis and GSAP match frame-for-frame
    gsap.ticker.lagSmoothing(0);

    // 3. Event-Driven Layout Refreshes (No arbitrary timeouts)
    // A. Immediate next-frame refresh once DOM is initially committed
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // B. Refresh after web fonts finish loading (critical for text measurement)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // C. Refresh after all media assets and stylesheets have completed loading
    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    // D. Debounced resize refresh for viewport stability
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // 4. Strict Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('load', handleWindowLoad);
      window.removeEventListener('resize', handleResize);

      // Explicit event cleanup
      lenis.off('scroll', handleScroll);
      gsap.ticker.remove(handleGsapTick);

      // Restore default GSAP lag smoothing
      gsap.ticker.lagSmoothing(500, 33);

      // Reference checked before clearing
      if (window.__lenis === lenis) {
        window.__lenis = null;
      }
      lenis.destroy();
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
        <Section4Sprout />
        {/* <Section5WavyShowcase />
        <Section6PerspectiveHero /> */}
      </main>
    </div>
  );
}
