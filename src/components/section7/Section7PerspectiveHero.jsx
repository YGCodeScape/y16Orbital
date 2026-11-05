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
  const heroImgRef = useRef(null);
  const bgCardNodesRef = useRef([]);
  const metadataRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current || !heroCardRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    // Dynamic scale based on actual available half-width from center
    const getStageScale = () => {
      const viewportWidth = window.innerWidth;
      const cardWidth = viewportWidth <= 768 ? 90 : 128;
      const sidePadding = 16;
      const availableHalfWidth = viewportWidth / 2 - cardWidth / 2 - sidePadding;
      return Math.min(1, Math.max(0.35, availableHalfWidth / 480));
    };

    // Full 100% Viewport Dimensions for Initial State (matching width & height)
    const initialWidth = isMobile
      ? Math.max(320, window.innerWidth - 24)
      : Math.min(window.innerWidth - 48, 1440);
    const initialHeight = isMobile
      ? Math.max(480, window.innerHeight - 24)
      : Math.max(500, window.innerHeight - 48);
    const finalWidth = isMobile ? 270 : 320;
    const finalHeight = isMobile ? 360 : 420;

    const bgCards = bgCardNodesRef.current.filter(Boolean);

    if (prefersReducedMotion) {
      gsap.set(heroCardRef.current, {
        width: finalWidth,
        height: finalHeight,
        borderRadius: 28,
      });
      if (heroImgRef.current) {
        gsap.set(heroImgRef.current, { yPercent: 0 });
      }
      if (metadataRef.current) {
        gsap.set(metadataRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INITIAL VISUAL STATES
    // ─────────────────────────────────────────────────────────────────────────

    // 1. Hero Card: Starts at FULL 100% viewport dimensions (wide cinematic billboard)
    gsap.set(heroCardRef.current, {
      width: initialWidth,
      height: initialHeight,
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: isMobile ? 24 : 32,
      transformOrigin: 'center center',
    });

    // 2. Parallax Image Initial Offset (ready for smooth upward glide)
    if (heroImgRef.current) {
      gsap.set(heroImgRef.current, {
        yPercent: 10,
      });
    }

    // 3. 15 Background Mini Cards: Placed deep in 3D behind the hero (z: -500)
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

    // 4. Metadata Bar: Hidden initially
    if (metadataRef.current) {
      gsap.set(metadataRef.current, {
        opacity: 0,
        y: 16,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. PARALLAX UPWARD GLIDE: Approaches into Section 7 (matching Section 3)
    // ─────────────────────────────────────────────────────────────────────────
    if (heroImgRef.current) {
      gsap.fromTo(
        heroImgRef.current,
        { yPercent: 10 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            id: 'sec7-img-approach',
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. SINGLE PINNED GSAP TIMELINE
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

    // CONTINUOUS PROGRESSIVE SHRINK:
    // As the user starts scrolling, the hero banner begins shrinking from 100% full size
    // into the portrait card continuously from t=0 through t=6.0
    scrollTl.to(heroCardRef.current, {
      width: finalWidth,
      height: finalHeight,
      borderRadius: 28,
      duration: 6.0,
      ease: 'power1.inOut',
    }, 0);

    // CONTINUOUS PARALLAX UPWARD GLIDE WHILE PINNED:
    // Glides smoothly from 0 to -10% as the card shrinks, giving rich cinematic depth
    if (heroImgRef.current) {
      scrollTl.to(heroImgRef.current, {
        yPercent: -10,
        ease: 'none',
        duration: 6.0,
      }, 0);
    }

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
      id="production"
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
        {/* Parallax Image Wrapper matching Section 3's height 130% top -15% coverage */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <img
            ref={heroImgRef}
            src="/bannersec/banner2.png"
            alt="Synthetic AI Talent Campaign"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute top-[-15%] left-0 w-full h-[130%] object-cover select-none pointer-events-none will-change-transform"
            style={{ objectPosition: 'center 20%' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Bottom Metadata Bar */}
        <div
          ref={metadataRef}
          className="absolute bottom-4 left-4 right-4 z-50 flex items-center justify-between p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white"
        >
          <div className="flex items-center gap-2.5 px-3 py-1.5">
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
          <span className="text-[11px] font-medium text-orange-200 pr-5">
            01 // Production
          </span>
        </div>
      </div>
    </section>
  );
}
