import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * 15 Background Mini Cards arranged in a 3-Row x 5-Column Perspective Matrix
 */
const BG_CARDS = [
  // ROW 1 (Top 5 cards)
  { id: 1, img: '/works/work1.jpg', targetX: -36, targetY: -28, rotX: 12, rotY: -15, rotZ: -3 },
  { id: 2, img: '/works/work2.jpg', targetX: -18, targetY: -28, rotX: 14, rotY: -8,  rotZ: -1 },
  { id: 3, img: '/works/work3.jpg', targetX: 0,   targetY: -28, rotX: 15, rotY: 0,   rotZ: 0 },
  { id: 4, img: '/works/work4.jpg', targetX: 18,  targetY: -28, rotX: 14, rotY: 8,   rotZ: 1 },
  { id: 5, img: '/works/work5.jpg', targetX: 36,  targetY: -28, rotX: 12, rotY: 15,  rotZ: 3 },

  // ROW 2 (Middle 5 cards - Left & Right flanks)
  { id: 6,  img: '/works/work6.jpg', targetX: -36, targetY: 0, rotX: 0, rotY: -18, rotZ: -2 },
  { id: 7,  img: '/works/work7.jpg', targetX: -18, targetY: 0, rotX: 0, rotY: -10, rotZ: -1 },
  { id: 8,  img: '/works/work8.jpg', targetX: 0,   targetY: 0, rotX: 0, rotY: 0,   rotZ: 0 },
  { id: 9,  img: '/works/work9.jpg', targetX: 18,  targetY: 0, rotX: 0, rotY: 10,  rotZ: 1 },
  { id: 10, img: '/works/work10.jpg', targetX: 36, targetY: 0, rotX: 0, rotY: 18,  rotZ: 2 },

  // ROW 3 (Bottom 5 cards)
  { id: 11, img: '/works/work11.jpg', targetX: -36, targetY: 28, rotX: -12, rotY: -15, rotZ: 2 },
  { id: 12, img: '/works/work12.jpg', targetX: -18, targetY: 28, rotX: -14, rotY: -8,  rotZ: 1 },
  { id: 13, img: '/works/work13.jpg', targetX: 0,   targetY: 28, rotX: -15, rotY: 0,   rotZ: 0 },
  { id: 14, img: '/works/work14.jpg', targetX: 18,  targetY: 28, rotX: -14, rotY: 8,   rotZ: -1 },
  { id: 15, img: '/works/work15.jpg', targetX: 36,  targetY: 28, rotX: -12, rotY: 15,  rotZ: -2 },
];

export default function Section6PerspectiveHero() {
  const containerRef = useRef(null);
  const heroCardRef = useRef(null);
  const bgCardNodesRef = useRef([]);
  const metadataRef = useRef(null);
  const tagRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const bgCards = bgCardNodesRef.current.filter(Boolean);

    // Initial hidden state for 15 background cards
    gsap.set(bgCards, {
      scale: 0.1,
      opacity: 0,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      filter: 'blur(8px)',
    });

    // Initial state for hero card: sits below viewport until Section 6 reaches view
    gsap.set(heroCardRef.current, {
      y: '55vh',
      scaleX: 1.5,
      scaleY: 1.15,
      borderRadius: '36px',
    });

    // Initial hidden state for hero card badge & bottom metadata
    gsap.set([metadataRef.current, tagRef.current], {
      opacity: 0,
      y: 12,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // NATURAL PINNED SCROLL TRIGGER (Starts strictly when Section 6 reaches top)
    // Because Section 5 is completely unpinned and natural height,
    // start: 'top top' anchors exactly at the end of Section 5!
    // ─────────────────────────────────────────────────────────────────────────
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',    // Starts ONLY when user scrolls to Section 6
        end: '+=2400',       // 2400px of smooth scrub distance
        pin: true,           // Freeze section during transition
        scrub: 1,            // Smooth hand scrubbing with Lenis
        anticipatePin: 1,
      },
    });

    // FRAME 1 -> FRAME 2: Hero card rises to center & contracts to portrait card
    scrollTl.to(heroCardRef.current, {
      y: '0vh',
      scaleX: 1,
      scaleY: 1,
      duration: 1.2,
      ease: 'power2.out',
    });

    // FRAME 2 -> FRAME 3: Background mini cards zoom in from behind with 3D tilts
    scrollTl.to(bgCards, {
      scale: 1,
      opacity: 0.88,
      filter: 'blur(0px)',
      x: (i) => `${BG_CARDS[i].targetX}vw`,
      y: (i) => `${BG_CARDS[i].targetY}vh`,
      rotateX: (i) => BG_CARDS[i].rotX,
      rotateY: (i) => BG_CARDS[i].rotY,
      rotateZ: (i) => BG_CARDS[i].rotZ,
      duration: 1.4,
      stagger: 0.02,
      ease: 'power3.out',
    }, '-=0.5');

    // FRAME 3 -> FRAME 4: Grid stabilizes into clear focus, metadata & tag reveal
    scrollTl
      .to(bgCards, {
        rotateX: (i) => BG_CARDS[i].rotX * 0.4,
        rotateY: (i) => BG_CARDS[i].rotY * 0.4,
        opacity: 0.95,
        duration: 0.8,
        ease: 'power2.out',
      })
      .to([tagRef.current, metadataRef.current], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4');

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="sec6-perspective-section relative w-full h-screen overflow-hidden bg-[#f8f7f5] flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. BACKGROUND 3D PERSPECTIVE MATRIX (15 Mini Art Cards)           */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="sec6-matrix-container absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {BG_CARDS.map((card, index) => (
          <div
            key={card.id}
            ref={(node) => { bgCardNodesRef.current[index] = node; }}
            className="sec6-bg-card absolute rounded-2xl overflow-hidden shadow-xl border border-white/80 bg-neutral-900 pointer-events-auto transition-transform duration-300 hover:scale-110 hover:z-30 cursor-pointer"
            style={{
              width: '128px',
              height: '144px',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={card.img}
              alt={`AI Production ${card.id}`}
              className="w-full h-full object-cover select-none"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. FOREGROUND CENTERPIECE HERO CARD (Orange Model Banner)         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        ref={heroCardRef}
        className="sec6-hero-card relative z-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-[#e8590c] will-change-transform"
        style={{
          width: '320px',
          height: '420px',
          transformOrigin: 'center center',
        }}
      >
        {/* Main Model Artwork */}
        <img
          src="/bannersec/banner2.png"
          alt="Synthetic AI Talent Campaign"
          className="w-full h-full object-cover select-none"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Top-Right Like Badge */}
        <div
          ref={tagRef}
          className="absolute top-4 right-4 z-50 pointer-events-auto cursor-pointer"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md transition-transform hover:scale-105 active:scale-95">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>Like</span>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          ref={metadataRef}
          className="absolute bottom-4 left-4 right-4 z-50 flex items-center justify-between p-3 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-white"
        >
          <div className="flex items-center gap-2.5">
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
          <span className="text-[11px] font-medium text-orange-200">
            01 // Production
          </span>
        </div>

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>
    </section>
  );
}
