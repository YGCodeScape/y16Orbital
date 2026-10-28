import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from './components/Nav';
import HeroLanding from './components/HeroLanding';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

/**
 * Root Application Component
 * Initializes the Lenis smooth-scroll runtime and synchronizes it with GSAP's animation ticker.
 * Exposes Lenis globally (window.__lenis) for smooth scroll-to triggers.
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

    return () => {
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
      </main>
    </div>
  );
}
