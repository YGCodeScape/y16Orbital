import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveBanner from './InteractiveBanner';
import BrandsMarquee from './BrandsMarquee';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section3Gateway Component
 * Restored original blur & opacity reveal on "Gateway to synthetic talent."
 */
export default function Section3Gateway() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bannerContainerRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. NAV THEME TOGGLE (turns navbar white inside Section 3)
    // ─────────────────────────────────────────────────────────────────────────
    ScrollTrigger.create({
      id: 'sec3-nav-theme',
      trigger: sectionRef.current,
      start: 'top+=165% 72px',
      end: 'top+=220% 72px',
      toggleClass: {
        targets: '#main-nav',
        className: 'nav-theme-white',
      },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. WORD-BY-WORD TITLE BLUR & OPACITY REVEAL (RESTORED)
    // ─────────────────────────────────────────────────────────────────────────
    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.gateway-reveal-word');

      gsap.fromTo(
        words,
        {
          opacity: 0,
          filter: 'blur(16px)',
          y: 30,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec3-title-reveal',
            trigger: titleRef.current,
            start: 'top+=1650px 100%',
            end: 'top+=1650px 100%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. BANNER CONTAINER RISING ENTRANCE
    // ─────────────────────────────────────────────────────────────────────────
    if (bannerContainerRef.current) {
      gsap.fromTo(
        bannerContainerRef.current,
        { y: 60, scale: 0.98, opacity: 0.9 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            id: 'sec3-banner-rise',
            trigger: bannerContainerRef.current,
            start: 'top 88%',
            end: 'top 52%',
            scrub: 0.8,
          },
        }
      );
    }

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="sec3-section-root relative w-full flex flex-col items-center bg-[#f8f7f5]"
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. SECTION 3 PAGE TITLE (Blur & Opacity Reveal)                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="sec3-title-wrap w-full flex justify-center text-center">
        <h2
          ref={titleRef}
          className="sec3-main-title font-medium tracking-tight text-neutral-900 leading-[1.08]"
        >
          <span className="gateway-reveal-word inline-block">Gateway</span>{' '}
          <span className="gateway-reveal-word inline-block">to</span>{' '}
          <span className="gateway-reveal-word inline-block text-neutral-400">synthetic</span>{' '}
          <span className="gateway-reveal-word inline-block">talent.</span>
        </h2>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. CINEMATIC INTERACTIVE BANNER                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div
        ref={bannerContainerRef}
        className="sec3-banner-container w-full flex justify-center"
      >
        <InteractiveBanner />
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. TRUSTED BY BRANDS SECTION & MARQUEE                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="sec3-brands-wrap w-full">
        <BrandsMarquee />
      </div>
    </section>
  );
}
