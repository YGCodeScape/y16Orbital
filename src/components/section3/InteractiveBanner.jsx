import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * High-resolution hover artwork cards provided in public/bannersec/
 */
const TRAIL_IMAGES = [
  '/bannersec/bannerTop1.jpg',
  '/bannersec/bannerTop2.jpg',
  '/bannersec/bannerTop3.jpg',
  '/bannersec/bannerTop4.jpg',
  '/bannersec/bannerTop5.jpg',
];

const POOL_SIZE = 6;       // Bounded object pool to ensure 0 memory leaks
const CARD_SIZE = 190;     // 1:1 ratio square card size in px
const SPAWN_DISTANCE = 65; // Distance in px cursor must travel to spawn next card

/**
 * InteractiveBanner Component
 * - Large cinematic billboard with smooth vertical parallax image scroll.
 * - Perfectly bounded background image (top: -15%, height: 130%) to guarantee
 *   ZERO black gaps or blank spaces at the top or bottom at any scroll position.
 * - Option 3 Interactive Trail Engine: Object-pooled 1:1 image cards that pop up
 *   directly at the mouse cursor with spring bounce and fade out automatically.
 */
export default function InteractiveBanner() {
  const bannerWrapRef = useRef(null);
  const parallaxImgRef = useRef(null);
  const cardsPoolRef = useRef([]);
  const imgNodesRef = useRef([]);

  // Internal interaction state stored in refs (no React re-renders!)
  const lastSpawnPos = useRef({ x: -999, y: -999 });
  const poolIndexRef = useRef(0);
  const imageIndexRef = useRef(0);
  const zIndexCounter = useRef(10);

  // Parallax background image glide on scroll
  useGSAP(() => {
    if (!parallaxImgRef.current || !bannerWrapRef.current) return;

    // Smooth upward gliding motion as the user scrolls down
    // (translates from +6% to -6%, moving UPWARDS with 100% full coverage)
    gsap.fromTo(
      parallaxImgRef.current,
      { yPercent: 6 },
      {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: bannerWrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }, { scope: bannerWrapRef });

  /**
   * Spawns or recycles a card from the pool at cursor coordinates
   */
  const handlePointerMove = (e) => {
    const wrap = bannerWrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Calculate distance traveled since previous card spawn
    const distance = Math.hypot(
      cursorX - lastSpawnPos.current.x,
      cursorY - lastSpawnPos.current.y
    );

    // Only spawn when cursor moves past the threshold
    if (distance < SPAWN_DISTANCE) return;

    lastSpawnPos.current = { x: cursorX, y: cursorY };

    // Advance pool and image indices round-robin
    const cardEl = cardsPoolRef.current[poolIndexRef.current];
    const imgEl = imgNodesRef.current[poolIndexRef.current];
    poolIndexRef.current = (poolIndexRef.current + 1) % POOL_SIZE;

    const imageSrc = TRAIL_IMAGES[imageIndexRef.current];
    imageIndexRef.current = (imageIndexRef.current + 1) % TRAIL_IMAGES.length;

    if (!cardEl || !imgEl) return;

    // Update image source
    imgEl.src = imageSrc;

    // Bring this newly spawned card to the very top
    zIndexCounter.current += 1;

    // Center card at cursor
    const targetLeft = cursorX - CARD_SIZE / 2;
    const targetTop = cursorY - CARD_SIZE / 2;

    // Kill any active tweens on this recycled card
    gsap.killTweensOf(cardEl);

    // GSAP Option 3 Trail Animation: Spring zoom in -> hold -> smooth zoom out
    gsap.fromTo(
      cardEl,
      {
        left: targetLeft,
        top: targetTop,
        scale: 0.35,
        rotation: gsap.utils.random(-8, 8),
        autoAlpha: 0,
        zIndex: zIndexCounter.current,
      },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.42,
        ease: 'back.out(1.4)',
        onComplete: () => {
          // Stay for a moment, then zoom out and fade away smoothly
          gsap.to(cardEl, {
            scale: 0.72,
            autoAlpha: 0,
            duration: 0.45,
            delay: 1.15,
            ease: 'power2.in',
          });
        },
      }
    );
  };

  /**
   * Reset tracking when cursor exits the banner
   */
  const handlePointerLeave = () => {
    lastSpawnPos.current = { x: -999, y: -999 };
  };

  return (
    <div ref={bannerWrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="sec3-banner-wrap relative w-full overflow-hidden select-none cursor-crosshair"
      style={{ borderRadius: '32px', backgroundColor: 'transparent', }} >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. PARALLAX BACKGROUND BANNER IMAGE (100% full frame coverage)       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          ref={parallaxImgRef}
          src="/bannersec/banner3.png"
          alt="Y16Orbital Synthetic Production Banner"
          className="sec3-banner-img absolute w-full select-none will-change-transform"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '130%',
            objectFit: 'contain',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. OBJECT-POOLED 1:1 INTERACTIVE HOVER CARDS                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {Array.from({ length: POOL_SIZE }).map((_, index) => (
        <div
          key={index}
          ref={(node) => { cardsPoolRef.current[index] = node; }}
          className="sec3-trail-card pointer-events-none absolute opacity-0 invisible will-change-transform"
          style={{
            width: `${CARD_SIZE}px`,
            height: `${CARD_SIZE}px`,
          }}
        >
          {/* Card Frame with drop-shadow and premium border */}
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/95 bg-neutral-900">
            <img
              ref={(node) => { imgNodesRef.current[index] = node; }}
              src={TRAIL_IMAGES[index % TRAIL_IMAGES.length]}
              alt="Synthetic Talent Preview"
              className="w-full h-full object-cover select-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
