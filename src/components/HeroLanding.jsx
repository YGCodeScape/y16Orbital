import { useRef } from 'react';
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
    targetX: -330,
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
    // Using autoAlpha ensures visibility:hidden, preventing invisible elements
    // from blocking mouse pointer events on any cards!
    // =========================================================================
    gsap.set('#main-nav', { y: -30, autoAlpha: 0 });
    gsap.set('.hero-title-group', { y: 24, autoAlpha: 0 });
    gsap.set(centerCard, { y: 200, scale: 0.6, rotation: -12, autoAlpha: 0 });
    gsap.set(flankCards, { x: 0, y: 0, rotation: 0, scale: 0.75, autoAlpha: 0 });
    gsap.set('.hero-footer-cta, .scroll-down-arrow', { y: 20, autoAlpha: 0 });

    // Section 2 starts completely invisible (autoAlpha: 0 sets visibility: hidden)
    gsap.set('.sec2-container', { autoAlpha: 0 });

    // Set initial hero z-index layering so Delulu is front, wings tuck behind
    cards.forEach((cardEl, i) => {
      gsap.set(cardEl, { zIndex: HERO_CARD_CONFIG[i].heroZIndex });
    });

    // =========================================================================
    // 2. INTRO TIMELINE (Runs in sequence on first landing)
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
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
    // Step 2: Hero title reveals
    .to('.hero-title-group', {
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
    .to('.hero-footer-cta, .scroll-down-arrow', {
      y: 0,
      autoAlpha: 1,
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
    // Uses autoAlpha (opacity + visibility) so inactive sections NEVER block clicks!
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
      // STAGE A: Hero Copy Exits (autoAlpha hides it from pointer hit-testing)
      // ───────────────────────────────────────────────────────────────────────
      scrollTl
        .to('.hero-title-group, .hero-footer-cta, .scroll-down-arrow', {
          y: -40,
          autoAlpha: 0,       // Sets opacity: 0 AND visibility: hidden
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
      // STAGE B: Stack Migrates to Right Column & Section 2 Text Becomes Active
      // ───────────────────────────────────────────────────────────────────────
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

      // ───────────────────────────────────────────────────────────────────────
      // STAGE C: Cards Fan Out into Diagonal Staircase Cascade (60% -> 95%)
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
        });

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
    <section ref={containerRef}
      className="herolandsec relative h-screen w-full overflow-hidden select-none"
      style={{
        paddingTop: '90px',
        paddingBottom: '36px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      {/* =================================================================== */}
      {/* SECTION 1: HERO CONTENT                                             */}
      {/* =================================================================== */}
      <div className="hero-title-group absolute top-18 left-0 w-full text-center z-10 pointer-events-none">
        <h1 className="hero-headline-text font-medium tracking-tight text-neutral-900 capitalize">
          <span className="hero-prefix inline-block uppercase">The future of advertising,</span><br />
          <span className="hero-suffix inline-block uppercase">built without cameras.</span>
        </h1>
      </div>

      {/* Hero Footer CTA: High z-index (z-40) so buttons are 100% clickable */}
      <div className="hero-footer-cta opacity-0 absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-40 text-center pointer-events-auto"
        style={{ gap: '6px' }}>
        <p className=" hero-subtitle-text text-neutral-500 leading-relaxed">
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
          
          {/* CLICKABLE SCROLL-DOWN ARROW TRIGGER: Placed at high z-index (z-40) */}
          <button 
            type="button"
            onClick={handleScrollToSection2}
            aria-label="Scroll to next section"
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-black bg-white/70 backdrop-blur-sm flex items-center justify-center text-neutral-600 hover:text-black transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer animate-bounce pointer-events-auto"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
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
            Next Gen Advertising<br />
            <span style={{ color: '#842323' }}>& virtual photo-shoots </span> <br />
            crafted for your brand.
          </h2>
        </div>

        {/* Subtitle & Buttons */}
        <div style={{ marginTop: '20px' }}>
          <p className="sec2-subtitle-text text-neutral-500 leading-relaxed">
            Craft hyper-detailed print campaigns, digital billboards, and dynamic commercial visuals. Your brand gets an exclusive synthetic face that never ages, travels, or books another client.
          </p>

          <div className="sec2-buttons-group flex items-center" style={{ gap: '14px', marginTop: '24px' }} >
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
              className=" card-d absolute origin-bottom cursor-pointer group"
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
