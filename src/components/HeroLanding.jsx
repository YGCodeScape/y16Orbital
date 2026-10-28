import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 7 Cards Configuration Dataset
 * - targetX, targetY, targetRotate: Hero fanned-out arc coordinates.
 * - heroZIndex: Symmetrical card deck layering (Delulu on top, wings tuck behind).
 * - stepX, stepY: Section 2 diagonal staircase cascade coordinates.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const HERO_CARD_CONFIG = [
  {
    id: 0,
    title: 'Wild',
    img: '/art/art-7.jpg',
    targetX: -350,
    targetY: 16,
    targetRotate: -20,
    heroZIndex: 10,
    stepX: -255,
    stepY: -90,
  },
  {
    id: 1,
    title: 'Sound',
    img: '/art/art-1.jpg',
    targetX: -230,
    targetY: 0,
    targetRotate: -15,
    heroZIndex: 15,
    stepX: -170,
    stepY: -60,
  },
  {
    id: 3,
    title: 'Text Poster',
    img: '/art/art-2.jpg',
    targetX: -110,
    targetY: -12,
    targetRotate: -14,
    heroZIndex: 20,
    stepX: -85,
    stepY: -30,
  },
  {
    id: 2,
    title: 'Delulu',
    img: '/art/art-3.jpg',
    targetX: 0,
    targetY: -2,
    targetRotate: 0,
    isCenter: true,
    heroZIndex: 30, // Front centerpiece
    stepX: 0,
    stepY: 0,
  },
  {
    id: 4,
    title: 'Nike',
    img: '/art/art-4.jpg',
    targetX: 110,
    targetY: -10,
    targetRotate: 10,
    heroZIndex: 20,
    stepX: 85,
    stepY: 30,
  },
  {
    id: 5,
    title: 'Water Glass',
    img: '/art/art-5.jpg',
    targetX: 230,
    targetY: -10,
    targetRotate: 15,
    heroZIndex: 15, // Tucked behind Nike
    stepX: 170,
    stepY: 60,
  },
  {
    id: 6,
    title: 'Car Driff',
    img: '/art/art-6.jpg',
    targetX: 360,
    targetY: 0,
    targetRotate: 16,
    heroZIndex: 10, // Tucked behind Water Glass
    stepX: 255,
    stepY: 90,
  },
];

export default function HeroLanding() {
  const containerRef = useRef(null);
  const cardNodesRef = useRef([]);
  const scrollTlRef = useRef(null);

  useGSAP(() => {
    const cards = cardNodesRef.current.slice(0, HERO_CARD_CONFIG.length);
    const centerCard = cards.find((_, i) => HERO_CARD_CONFIG[i].isCenter);
    const flankCards = cards.filter((_, i) => !HERO_CARD_CONFIG[i].isCenter);

    // =========================================================================
    // 1. INITIAL RESTING / HIDDEN STATE BEFORE ENTRANCE
    // =========================================================================
    gsap.set('#main-nav', { y: -30, opacity: 0 });
    gsap.set('.hero-title-group', { y: 24, opacity: 0 });
    gsap.set(centerCard, { y: 200, scale: 0.6, rotation: -12, opacity: 0 });
    gsap.set(flankCards, { x: 0, y: 0, rotation: 0, scale: 0.75, opacity: 0 });
    gsap.set('.hero-footer-cta, .scroll-down-arrow', { y: 20, opacity: 0 });

    // Set initial hero z-index layering so Delulu is front, wings tuck behind
    cards.forEach((cardEl, i) => {
      gsap.set(cardEl, { zIndex: HERO_CARD_CONFIG[i].heroZIndex });
    });

    // =========================================================================
    // 2. INTRO TIMELINE (Runs in pristine sequence on first landing)
    // Sequence: Nav -> Hero Title -> Center Card & Fan-Out -> Footer CTAs
    // =========================================================================
    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Initialize ScrollTrigger ONLY after intro is 100% finished
        initScrollTransition();
      },
    });

    // Step 1: Nav slides down
    introTl.to('#main-nav', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
    // Step 2: Hero title reveals
    .to('.hero-title-group', {
      y: 0,
      opacity: 1,
      duration: 0.7,
    }, '-=0.2')
    // Step 3: Delulu rises to center
    .to(centerCard, {
      y: -2,
      scale: 1.10,
      rotation: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'back.out(1.15)',
    }, '-=0.4')
    // Step 4: The other 6 cards fan out from behind Delulu
    .to(cards, {
      x: (i) => HERO_CARD_CONFIG[i].targetX,
      y: (i) => HERO_CARD_CONFIG[i].targetY,
      rotation: (i) => HERO_CARD_CONFIG[i].targetRotate,
      scale: (i) => (HERO_CARD_CONFIG[i].isCenter ? 1.10 : 0.92),
      opacity: 1,
      duration: 1.0,
      stagger: 0.04,
      ease: 'power4.out',
    }, '-=0.5')
    // Step 5: Subtitle, CTAs, and arrow reveal
    .to('.hero-footer-cta, .scroll-down-arrow', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
    }, '-=0.3');

    // If an impatient visitor touches the wheel before intro finishes, snap intro to end
    const handleEarlyScroll = () => {
      if (introTl.isActive()) {
        introTl.progress(1);
      }
    };
    window.addEventListener('wheel', handleEarlyScroll, { once: true, passive: true });
    window.addEventListener('touchmove', handleEarlyScroll, { once: true, passive: true });

    // =========================================================================
    // 3. PINNED SCROLL TRIGGER TIMELINE (Hero <-> Section 2)
    // =========================================================================
    function initScrollTransition() {
      if (scrollTlRef.current) return;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1600',       // 1600px of virtual scroll travel
          scrub: 1,            // Smooth manual hand scrubbing
          pin: true,           // Freeze viewport while cards transform
          anticipatePin: 1,
        },
      });

      scrollTlRef.current = scrollTl;

      // ───────────────────────────────────────────────────────────────────────
      // STAGE A: Hero Copy Exits & Cards Retract into Center Stack (0% -> 30%)
      // ───────────────────────────────────────────────────────────────────────
      scrollTl
        .to('.hero-title-group, .hero-footer-cta, .scroll-down-arrow', {
          y: -40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        })
        // All 7 cards collapse neatly from their fanned-out positions back to center
        .to(cards, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 0.85,
          zIndex: (i) => HERO_CARD_CONFIG[i].heroZIndex,
          duration: 0.9,
          ease: 'power2.inOut',
          stagger: 0.02,
        }, '<')

      // ───────────────────────────────────────────────────────────────────────
      // STAGE B: Stack Migrates to Right Column & Section 2 Text Enters (30% -> 60%)
      // ───────────────────────────────────────────────────────────────────────
        .to('.cards-stage-wrapper', {
          x: '20vw',
          y: '6vh',
          duration: 1.1,
          ease: 'power2.inOut',
        })
        .fromTo('.sec2-header',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '<0.2'
        )

      // ───────────────────────────────────────────────────────────────────────
      // STAGE C: Cards Fan Out into Diagonal Staircase Cascade (60% -> 95%)
      // Transitions to strictly sequential z-index so every frame is visible!
      // ───────────────────────────────────────────────────────────────────────
        .to(cards, {
          x: (i) => HERO_CARD_CONFIG[i].stepX,
          y: (i) => HERO_CARD_CONFIG[i].stepY,
          rotation: 0,
          scale: 0.94,
          zIndex: (i) => 10 + i, // Ascending sequential staircase stacking
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.03,
        })
        .fromTo('.sec2-body-group',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '<0.2'
        );

      ScrollTrigger.refresh();
    }

  }, { scope: containerRef });

  /**
   * Smoothly auto-glides the viewport down to Section 2 when arrow is clicked
   */
  const handleScrollToSection2 = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(1600, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 1600, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden select-none bg-[#f8f7f5]"
      style={{
        paddingTop: '90px',
        paddingBottom: '36px',
        paddingLeft: '20px',  // Reduced padding for optimal staircase breathing room
        paddingRight: '20px',
      }}
    >
      {/* =================================================================== */}
      {/* SECTION 1: HERO CONTENT                                             */}
      {/* =================================================================== */}
      <div className="hero-title-group absolute top-24 left-0 w-full text-center z-20 pointer-events-none">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-[1] capitalize">
          <span className="hero-prefix inline-block">A place to</span>{' '}
          <span className="hero-suffix inline-block">display your masterpiece.</span>
        </h1>
      </div>

      <div 
        className="hero-footer-cta opacity-0 absolute bottom-16 left-0 w-full flex flex-col items-center z-20 pointer-events-auto text-center"
        style={{ gap: '16px' }}
      >
        <p 
          className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md"
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
        >
          Artists can display their masterpiece, and voters can vote to their favorite artist and make them hold the top positions on Y16Orbital.
        </p>
        <div 
          className="flex items-center"
          style={{ gap: '16px', marginTop: '4px' }}
        >
          <button 
            type="button"
            className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            style={{
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            Find the Designers
          </button>
          
          <button 
            type="button"
            className="text-neutral-600 hover:text-neutral-900 text-xs font-medium tracking-wide transition hover:underline cursor-pointer"
            style={{
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            Read more
          </button>
        </div>
      </div>

      {/* CLICKABLE SCROLL-DOWN ARROW TRIGGER */}
      <div className="scroll-down-arrow opacity-0 absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto">
        <button
          type="button"
          onClick={handleScrollToSection2}
          aria-label="Scroll to next section"
          className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black bg-white/70 backdrop-blur-sm flex items-center justify-center text-neutral-600 hover:text-black transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer animate-bounce"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: E-COMMERCE MARKETPLACE CONTENT                           */}
      {/* =================================================================== */}
      <div 
        className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 max-w-md z-30 pointer-events-auto"
        style={{ paddingRight: '20px' }}
      >
        {/* Category Tag & Main Headline */}
        <div className="sec2-header opacity-0">
          <span 
            className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold block"
            style={{ marginBottom: '8px' }}
          >
            E-Commerce
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.12]">
            Showcase, Sell, <br />
            <span style={{ color: '#842323' }}>& acquire arts to</span> <br />
            our marketplace.
          </h2>
        </div>

        {/* Subtitle & Buttons */}
        <div className="sec2-body-group opacity-0" style={{ marginTop: '20px' }}>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm">
            Curated community where artists and buyers assemble, create affiliation, design together, and discover authentic digital art.
          </p>

          <div 
            className="flex items-center"
            style={{ gap: '14px', marginTop: '24px' }}
          >
            <button 
              type="button"
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold tracking-wide transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '22px',
                paddingRight: '22px',
              }}
            >
              Explore Artwork
            </button>
            <button 
              type="button"
              className="text-neutral-600 hover:text-neutral-900 text-xs font-medium tracking-wide transition hover:underline cursor-pointer"
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
            >
              Read more
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SHARED 7-CARD STAGE (Transforms from Fan-Out into Diagonal Cascade)  */}
      {/* =================================================================== */}
      <div className="cards-stage-wrapper absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div 
          className="relative flex items-center justify-center pointer-events-auto"
          style={{ width: '200px', height: '270px' }}
        >
          {/* The 7 Interactive Cards */}
          {HERO_CARD_CONFIG.map((card, index) => (
            <div 
              key={card.id}
              ref={(node) => { cardNodesRef.current[index] = node; }}
              className="absolute origin-bottom cursor-pointer group"
              style={{ 
                width: '180px',
                height: '230px',
              }}
            >
              {/* Inner card container that cleanly pops up on hover */}
              <div 
                className="w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 bg-neutral-200 transition-all duration-300 ease-out group-hover:-translate-y-3.5 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:border-white"
              >
                <div className="w-full h-full relative">
                  <img 
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover select-none"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
