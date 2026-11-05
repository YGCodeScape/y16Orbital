import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 7 Interactive Cards Configuration:
 * - Card 3 ("Delulu - The Synthetic Face") is the true center anchor.
 * - Cards 0, 1, 2 fan to the left; Cards 4, 5, 6 fan to the right.
 * - Target rotation, horizontal/vertical translation, and staircase steps are calibrated.
 */
const HERO_CARD_CONFIG = [
  {
    id: 0,
    title: 'into wild',
    img: '/art/art-0.jpg',
    targetX: -360,
    targetY: 0,
    targetRotate: -16,
    heroZIndex: 10, // Tucked behind Soda
    stepX: -255,
    stepY: -90,
  },
  {
    id: 1,
    title: 'Futuristic Soda',
    img: '/art/art-1.jpg',
    targetX: -240,
    targetY: -10,
    targetRotate: -14,
    heroZIndex: 15, // Tucked behind Luxury Watch
    stepX: -170,
    stepY: -60,
  },
  {
    id: 2,
    title: 'Luxury Watch',
    img: '/art/art-2.jpg',
    targetX: -120,
    targetY: -14,
    targetRotate: -7,
    heroZIndex: 20, // Tucked behind Delulu
    stepX: -85,
    stepY: -30,
  },
  {
    id: 3,
    title: 'Delulu Synthetic Face',
    img: '/art/art-3.jpg',
    targetX: 0,
    targetY: -2,
    targetRotate: 0,
    heroZIndex: 30, // Front Center Kingpin
    isCenter: true,
    stepX: 0,
    stepY: 0,
  },
  {
    id: 4,
    title: 'Nike Air Concept',
    img: '/art/art-4.jpg',
    targetX: 120,
    targetY: -14,
    targetRotate: 8,
    heroZIndex: 20, // Tucked behind Delulu
    stepX: 85,
    stepY: 30,
  },
  {
    id: 5,
    title: 'Water Glass Refraction',
    img: '/art/art-5.jpg',
    targetX: 240,
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

    // Explicitly select navigation element outside containerRef scope
    const mainNav = document.getElementById('main-nav');

    // =========================================================================
    // 1. INITIAL RESTING / HIDDEN STATE BEFORE ENTRANCE
    // Using autoAlpha ensures visibility:hidden, preventing invisible elements
    // from blocking mouse pointer events on any cards!
    // =========================================================================
    if (mainNav) {
      gsap.set(mainNav, { y: -30, autoAlpha: 0 });
    }
    gsap.set('.hero-title-group', { y: 24, autoAlpha: 0 });
    gsap.set(centerCard, { y: 200, scale: 0.6, rotation: -12, autoAlpha: 0 });
    gsap.set(flankCards, { x: 0, y: 0, rotation: 0, scale: 0.75, autoAlpha: 0 });
    gsap.set('.hero-footer-cta-inner', { y: 20, autoAlpha: 0 });

    // Section 2 starts completely invisible (autoAlpha: 0 sets visibility: hidden)
    gsap.set('.sec2-container', { autoAlpha: 0 });

    // Set initial hero z-index layering so Delulu is front, wings tuck behind
    cards.forEach((cardEl, i) => {
      gsap.set(cardEl, { zIndex: HERO_CARD_CONFIG[i].heroZIndex });
    });

    // =========================================================================
    // 2. PINNED SCROLL TRIGGER TIMELINE (Hero <-> Section 2)
    // Rule 2: HeroLanding pins for 1600px of virtual scroll space.
    // Created immediately during component mount so layout space is locked.
    // Invalidate() is called when intro completes to dynamically bind starting
    // coordinates to the fanned-out hero arc without any visual jumps.
    // =========================================================================
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

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE A: Hero Copy Exits & Cards Collapse to Center Stack
    // ─────────────────────────────────────────────────────────────────────────
    scrollTl
      .to('.hero-title-group, .hero-footer-cta-inner', {
        y: -40,
        autoAlpha: 0,
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

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE B: Stack Migrates to Right Column & Section 2 Text Becomes Active
    // ─────────────────────────────────────────────────────────────────────────
      .to('.cards-stage-wrapper', {
        x: '20vw',
        y: '6vh',
        duration: 1.1,
        ease: 'power2.inOut',
      })
      .fromTo('.sec2-container',
        { autoAlpha: 0, y: 35 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '<0.2'
      )
      // Timeline label marking the exact point where Section 2 is fully visible
      .addLabel('section2')

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE C: Cards Fan Out into Diagonal Staircase Cascade (60% -> 95%)
    // ─────────────────────────────────────────────────────────────────────────
      .to(cards, {
        x: (i) => HERO_CARD_CONFIG[i].stepX,
        y: (i) => HERO_CARD_CONFIG[i].stepY,
        rotation: 0,
        scale: 0.94,
        zIndex: (i) => 10 + i, // Ascending sequential staircase stacking
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.03,
      });

    // =========================================================================
    // 3. INTRO TIMELINE (Runs in sequence on first landing)
    // =========================================================================
    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Re-read starting DOM values so scrollTl's Stage A starts seamlessly
        // from the completed fanned-out positions
        scrollTl.invalidate();
      },
    });

    // Step 1: Nav slides down
    if (mainNav) {
      introTl.to(mainNav, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Step 2: Hero title reveals
    introTl.to('.hero-title-group', {
      y: 0,
      autoAlpha: 1,
      duration: 0.7,
    }, '-=0.2')
    // Step 3: Delulu rises to center
    .to(centerCard, {
      y: -2,
      scale: 1.10,
      rotation: 0,
      autoAlpha: 1,
      duration: 1.0,
      ease: 'back.out(1.15)',
    }, '-=0.4')
    // Step 4: The other 6 cards fan out from behind Delulu
    .to(cards, {
      x: (i) => HERO_CARD_CONFIG[i].targetX,
      y: (i) => HERO_CARD_CONFIG[i].targetY,
      rotation: (i) => HERO_CARD_CONFIG[i].targetRotate,
      scale: (i) => (HERO_CARD_CONFIG[i].isCenter ? 1.10 : 0.92),
      autoAlpha: 1,
      duration: 1.0,
      stagger: 0.04,
      ease: 'power4.out',
    }, '-=0.5')
    // Step 5: Subtitle, CTAs, and arrow reveal
    .to('.hero-footer-cta-inner', {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
    }, '-=0.3');

    // If already scrolled (e.g. browser refresh midway down page), complete intro immediately
    if (window.scrollY > 20) {
      introTl.progress(1);
      scrollTl.invalidate();
    }

    // If a visitor touches wheel or touch before intro finishes, complete intro cleanly
    const handleEarlyScroll = () => {
      if (introTl.isActive()) {
        introTl.progress(1);
        scrollTl.invalidate();
      }
    };
    window.addEventListener('wheel', handleEarlyScroll, { passive: true });
    window.addEventListener('touchmove', handleEarlyScroll, { passive: true });

    // Strict cleanup for event listeners and timeline references
    return () => {
      window.removeEventListener('wheel', handleEarlyScroll);
      window.removeEventListener('touchmove', handleEarlyScroll);
      scrollTlRef.current = null;
      if (mainNav) {
        gsap.set(mainNav, { clearProps: 'transform,opacity,visibility' });
      }
    };
  }, { scope: containerRef });

  return (
    <section  ref={containerRef} className="herolandsec relative h-screen w-full overflow-hidden select-none"
      style={{ paddingTop: '90px', paddingBottom: '36px', paddingLeft: '20px', paddingRight: '20px', marginBottom: '80px' }}
    >
      {/* =================================================================== */}
      {/* SECTION 1: HERO CONTENT                                             */}
      {/* =================================================================== */}
      <div className="hero-title-group absolute top-[72px] sm:top-[76px] left-0 w-full text-center z-10 pointer-events-none">
        <h1 className="hero-headline-text font-medium tracking-tight text-neutral-900 capitalize">
          <span className="hero-prefix inline-block uppercase">The future of advertising,</span><br />
          <span className="hero-suffix inline-block uppercase">built without cameras.</span>
        </h1>
      </div>

      {/* Hero Footer CTA:
          Outer container handles horizontal center positioning (-translate-x-1/2) and responsive bottom placement.
          Inner container handles vertical GSAP animations (y: 20 -> y: 0 -> y: -40), avoiding CSS transform collision. */}
      <div className="hero-footer-cta absolute left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="hero-footer-cta-inner flex flex-col items-center text-center opacity-0" style={{ gap: '6px' }}>
          <p className="hero-subtitle-text text-neutral-500 leading-relaxed">
            Y16Orbital is a synthetic ad studio replacing multi-million dollar shoots with custom generative intelligence. Tailored AI actors, surreal product staging, and cinematic posters on demand.
          </p>

          <div className="flex items-center" style={{ gap: '16px', marginTop: '4px' }}>
            <button 
              type="button"
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer pointer-events-auto"
              style={{ padding: '10px 24px' }}
            >
              Explore Showroom
            </button>
            
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: SYNTHETIC PRODUCTION / E-COMMERCE CONTENT                */}
      {/* Responsive layout rules managed in media.css                       */}
      {/* =================================================================== */}
      <div 
        className="sec2-container sec2-container-layout opacity-0 absolute z-40 pointer-events-auto"
        style={{ paddingRight: '20px' }}
      >
        {/* Main Headline */}
        <div>
          <h2 className="sec2-headline-text font-bold tracking-tight text-neutral-900">
            Next Generation<br />
            <span style={{ color: '#842323' }}>Advertising </span> <br />
            Without Limits.
          </h2>
        </div>

        {/* Subtitle & Buttons */}
        <div style={{ marginTop: '20px' }}>
          <p className="sec2-subtitle-text text-neutral-500 leading-relaxed">
            camera free campaigns, Virtual talent, Entire worlds crafted around your brand.
          </p>

          <div className="sec2-buttons-group flex items-center" style={{ gap: '14px', marginTop: '24px' }}>
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
              Request Treatment
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
              Read Manifesto
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SHARED 7-CARD STAGE (At z-20 so footer CTAs at z-40 can be clicked) */}
      {/* =================================================================== */}
      <div className="cards-stage-wrapper absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div 
          className="hero-cards-stage relative flex items-center justify-center pointer-events-auto"
          style={{ width: '200px', height: '270px' }}
        >
          {/* The 7 Interactive Cards */}
          {HERO_CARD_CONFIG.map((card, index) => (
            <div 
              key={card.id}
              ref={(node) => { cardNodesRef.current[index] = node; }}
              className="card-d absolute origin-bottom cursor-pointer group"
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
