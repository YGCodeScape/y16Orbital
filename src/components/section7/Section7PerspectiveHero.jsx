import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 15 Background Mini Cards in a 3-Row x 5-Column Perspective Matrix
 * Coordinates define the spread around the center hero (targetX, targetY).
 * Horizontal scale is dynamically calculated based on available viewport width.
 */
const BG_CARDS = [
  // ROW 1 (Top 5 cards)
  { id: 1, img: '/works/work1.jpg', targetX: -460, targetY: -200, rotX: 14, rotY: -16, rotZ: -3 },
  { id: 2, img: '/works/work2.jpg', targetX: -230, targetY: -215, rotX: 16, rotY: -8,  rotZ: -1 },
  { id: 3, img: '/works/work3.jpg', targetX: 0,    targetY: -225, rotX: 18, rotY: 0,   rotZ: 0 },
  { id: 4, img: '/works/work4.jpg', targetX: 230,  targetY: -215, rotX: 16, rotY: 8,   rotZ: 1 },
  { id: 5, img: '/works/work5.jpg', targetX: 460,  targetY: -200, rotX: 14, rotY: 16,  rotZ: 3 },

  // ROW 2 (Middle 5 cards - Flanking the center hero)
  { id: 6,  img: '/works/work6.jpg',  targetX: -480, targetY: 0, rotX: 0, rotY: -20, rotZ: -2 },
  { id: 7,  img: '/works/work7.jpg',  targetX: -250, targetY: 0, rotX: 0, rotY: -12, rotZ: -1 },
  { id: 8,  img: '/works/work8.jpg',  targetX: 0,    targetY: 0, rotX: 0, rotY: 0,   rotZ: 0 },
  { id: 9,  img: '/works/work9.jpg',  targetX: 250,  targetY: 0, rotX: 0, rotY: 12,  rotZ: 1 },
  { id: 10, img: '/works/work10.jpg', targetX: 480,  targetY: 0, rotX: 0, rotY: 20,  rotZ: 2 },

  // ROW 3 (Bottom 5 cards)
  { id: 11, img: '/works/work11.jpg', targetX: -460, targetY: 200, rotX: -14, rotY: -16, rotZ: 2 },
  { id: 12, img: '/works/work12.jpg', targetX: -230, targetY: 215, rotX: -16, rotY: -8,  rotZ: 1 },
  { id: 13, img: '/works/work13.jpg', targetX: 0,    targetY: 225, rotX: -18, rotY: 0,   rotZ: 0 },
  { id: 14, img: '/works/work14.jpg', targetX: 230,  targetY: 215, rotX: -16, rotY: 8,   rotZ: -1 },
  { id: 15, img: '/works/work15.jpg', targetX: 460,  targetY: 200, rotX: -14, rotY: 16,  rotZ: -2 },
];

export default function Section7PerspectiveHero() {
  const containerRef = useRef(null);
  const heroCardRef = useRef(null);
  const bgCardNodesRef = useRef([]);
  const metadataRef = useRef(null);
  const dockRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current || !heroCardRef.current) return;

    const isMobile = window.innerWidth <= 768;

    // Dynamic scale based on actual available half-width from center
    const getStageScale = () => {
      const viewportWidth = window.innerWidth;
      const cardWidth = viewportWidth <= 768 ? 90 : 128;
      const sidePadding = 16;
      const availableHalfWidth = viewportWidth / 2 - cardWidth / 2 - sidePadding;
      return Math.min(1, Math.max(0.35, availableHalfWidth / 480));
    };

    // Initial Large Full-Bleed Landscape Dimensions -> Final Portrait Card
    const initialWidth = isMobile
      ? Math.max(320, window.innerWidth - 24)
      : Math.min(window.innerWidth - 48, 1440);
    const initialHeight = isMobile
      ? Math.min(window.innerHeight * 0.52, 380)
      : Math.min(window.innerHeight * 0.62, 540);
    const finalWidth = isMobile ? 270 : 320;
    const finalHeight = isMobile ? 360 : 420;

    const bgCards = bgCardNodesRef.current.filter(Boolean);

    // ─────────────────────────────────────────────────────────────────────────
    // INITIAL VISUAL STATES
    // ─────────────────────────────────────────────────────────────────────────

    // 1. Hero Card: Starts at FULL width/landscape immediately in center
    gsap.set(heroCardRef.current, {
      width: initialWidth,
      height: initialHeight,
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: 24,
      transformOrigin: 'center center',
    });

    // 2. 15 Background Mini Cards: Placed deep in 3D behind the hero (z: -500)
    gsap.set(bgCards, {
      scale: 0.15,
      opacity: 0,
      x: 0,
      y: 0,
      z: -500,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      filter: 'blur(6px)',
      transformOrigin: 'center center',
    });

    // 3. Metadata Bar: Hidden initially
    if (metadataRef.current) {
      gsap.set(metadataRef.current, {
        opacity: 0,
        y: 16,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SINGLE PINNED GSAP TIMELINE
    // Smooth ~2.0 viewport heights scrub distance with continuous progressive shrink
    // ─────────────────────────────────────────────────────────────────────────
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        id: 'sec7-perspective-pin',
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 2.0)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Top Dock Pill subtle fade out as user scrolls deep into the 3D showcase
    if (dockRef.current) {
      scrollTl.to(dockRef.current, {
        opacity: 0,
        y: -16,
        duration: 1.5,
        ease: 'power1.out',
      }, 0);
    }

    // CONTINUOUS PROGRESSIVE SHRINK:
    // As the user starts scrolling, the hero banner begins shrinking from wide
    // landscape into the portrait card continuously from t=0 through t=6.0
    scrollTl.to(heroCardRef.current, {
      width: finalWidth,
      height: finalHeight,
      borderRadius: 28,
      duration: 6.0,
      ease: 'power1.inOut',
    }, 0);

    // 3D MINI CARDS EMERGENCE:
    // As the banner contracts, the 15 mini cards fly forward along the Z-axis
    // and spread into their perspective positions around the center card
    scrollTl.to(bgCards, {
      scale: isMobile ? 0.72 : 1,
      opacity: 0.92,
      filter: 'blur(0px)',
      z: 0,
      x: (i) => BG_CARDS[i].targetX * getStageScale(),
      y: (i) => BG_CARDS[i].targetY * getStageScale(),
      rotateX: (i) => BG_CARDS[i].rotX,
      rotateY: (i) => BG_CARDS[i].rotY,
      rotateZ: (i) => BG_CARDS[i].rotZ,
      duration: 4.8,
      stagger: {
        each: 0.04,
        from: 'center',
      },
      ease: 'power2.out',
    }, 1.2);

    // GRID SETTLING & STABILIZATION (t=5.8 to 7.0)
    scrollTl.to(bgCards, {
      rotateX: (i) => BG_CARDS[i].rotX * 0.45,
      rotateY: (i) => BG_CARDS[i].rotY * 0.45,
      opacity: 0.96,
      duration: 1.2,
      ease: 'power1.out',
    }, 5.8);

    // METADATA REVEAL ON HERO CARD (t=6.5 to 8.0)
    if (metadataRef.current) {
      scrollTl.to(metadataRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      }, 6.5);
    }

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="sec7-perspective-section relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. BACKGROUND 3D PERSPECTIVE MATRIX (15 Mini Art Cards)           */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        className="sec7-matrix-container absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {BG_CARDS.map((card, index) => (
          <div
            key={card.id}
            ref={(node) => { bgCardNodesRef.current[index] = node; }}
            className="sec7-bg-card absolute will-change-transform"
            style={{
              width: '128px',
              height: '144px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Inner wrapper exclusively handles CSS hover to prevent transform collision */}
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-white/80 bg-neutral-900 pointer-events-auto transition-transform duration-300">
              <img
                src={card.img}
                alt=""
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. FOREGROUND CENTERPIECE HERO CARD (Landscape -> Portrait)       */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        ref={heroCardRef}
        className="sec7-hero-card relative z-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-[#e8590c] will-change-[width,height,transform]"
        style={{
          transformOrigin: 'center center',
        }}
      >
        {/* Direct image naturally filling the card with center-top focus on the model */}
        <img
          src="/bannersec/banner2.png"
          alt="Synthetic AI Talent Campaign"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{ objectPosition: 'center 20%' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Bottom Metadata Bar */}
        <div
          ref={metadataRef}
          className="absolute bottom-4 left-4 right-4 z-50 flex items-center justify-between p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white"
        >
          <div className="flex items-center gap-2.5" style={{paddingInline: '12px', paddingBlock: '6px' }}>
            <div className="w-8 h-8 rounded-xl bg-orange-500/90 flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-xs">
              Y16
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-white/95">
                Synthetic Studio
              </span>
              <span className="text-[10px] text-white/70">
                AI Commercial Casting
              </span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-orange-200" style={{paddingRight: '20px'}}>
            01 // Production
          </span>
        </div>
      </div>
    </section>
  );
}
