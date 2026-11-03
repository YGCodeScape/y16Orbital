import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BRAND_NAMES = [
  'Linear',
  'Remote',
  'Miro',
  'Databricks',
  'Mercury',
  'Figma',
  'Circus',
  'Stripe',
  'Notion',
  'Acne Studios',
  'Ray-Ban',
  'Moncler',
];

/**
 * BrandsMarquee Component
 * Natural document-flow element with its own local ScrollTrigger.
 */
export default function BrandsMarquee() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useGSAP(() => {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. "Trusted by the best." WORD-BY-WORD REVEAL
    // Uses local anchor to headlineRef without arbitrary pixel offsets.
    // ─────────────────────────────────────────────────────────────────────────
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.brand-reveal-word');

      gsap.fromTo(
        words,
        {
          opacity: 0,
          filter: 'blur(14px)',
          y: 24,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec3-brands-reveal',
            trigger: headlineRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. INFINITE SEAMLESS BRAND TICKER
    // Continuous loop independent of scroll progress.
    // ─────────────────────────────────────────────────────────────────────────
    if (marqueeTrackRef.current) {
      gsap.to(marqueeTrackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 28,
        repeat: -1,
      });
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="sec3-brands-section w-full">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADLINE (Word-by-word blur & opacity reveal)            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="sec3-brands-header flex flex-col items-center text-center">
        <h3
          ref={headlineRef}
          className="sec3-brands-title font-medium tracking-tight text-neutral-900"
        >
          <span className="brand-reveal-word inline-block mr-2.5">Trusted</span>
          <span className="brand-reveal-word inline-block mr-2.5">by</span>
          <span className="brand-reveal-word inline-block mr-2.5">the</span>
          <span className="brand-reveal-word inline-block font-semibold">best.</span>
        </h3>
        <p className="sec3-brands-subtitle text-neutral-500">
          Powering synthetic commercial campaigns for iconic brands and modern creators.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. INFINITE AUTO-SCROLLING BRAND NAMES MARQUEE                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        className="sec3-marquee-container relative w-full overflow-hidden select-none"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div
          ref={marqueeTrackRef}
          className="sec3-marquee-track flex items-center whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Duplicated twice for seamless, infinite looping */}
          {[...BRAND_NAMES, ...BRAND_NAMES].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="sec3-brand-item flex items-center"
            >
              <span className="sec3-brand-name font-semibold tracking-wide text-neutral-400 hover:text-neutral-900 transition-colors duration-200">
                {brand}
              </span>
              <span className="sec3-brand-dot text-neutral-300 font-light">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
