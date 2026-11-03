import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 6 Cards Dataset with 3 Explicit Visual States:
 * 
 * 1. initial (State 1: Sprout):
 *    Cards emerge upright along the right diagonal
 * 
 * 2. stacked (State 2: Compact Fan):
 *    Cards pivot into the compact tilted fan deck with blue card prominent
 * 
 * 3. expanded (State 3: Expanded Diagonal Cascade):
 *    Cards separate, scale down gracefully, and spread diagonally across
 *    the entire viewport from top-left to bottom-right, fitting both
 *    screen width and screen height without edge clipping.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const STACK_CARDS = [
  {
    id: 0,
    title: 'Text Poster Graphic',
    img: '/bannersec/bannerTop3.jpg',
    zIndex: 10,
    initial: { x: 68, y: -75, rotation: 0, scale: 0.88 },
    stacked: { x: -36, y: -22, rotation: -24, scale: 0.94 },
    expanded: {
      x: -420,
      y: -80,
      rotation: 0,
      scale: 1.1,
      mobileX: -95,
      mobileY: -150,
      mobileScale: 0.60,
    },
  },
  {
    id: 1,
    title: 'Editorial Sound',
    img: '/bannersec/bannerTop4.jpg',
    zIndex: 12,
    initial: { x: 52, y: -58, rotation: 0, scale: 0.90 },
    stacked: { x: -28, y: -16, rotation: -17, scale: 0.95 },
    expanded: {
      x: -230,
      y: -10,
      rotation: 0,
      scale: 1.1,
      mobileX: -55,
      mobileY: -90,
      mobileScale: 0.62,
    },
  },
  {
    id: 2,
    title: 'Vintage Cinema',
    img: '/bannersec/bannerTop5.jpg',
    zIndex: 14,
    initial: { x: 38, y: -42, rotation: 0, scale: 0.93 },
    stacked: { x: -18, y: -10, rotation: -10, scale: 0.97 },
    expanded: {
      x: -45,
      y: 30,
      rotation: 0,
      scale: 1.1,
      mobileX: -18,
      mobileY: -30,
      mobileScale: 0.64,
    },
  },
  {
    id: 3,
    title: 'Color synthetic',
    img: '/works/work14.jpg',
    zIndex: 16,
    initial: { x: 24, y: -28, rotation: 0, scale: 0.96 },
    stacked: { x: -6, y: -4, rotation: -2, scale: 0.98 },
    expanded: {
      x: 140,
      y: 75,
      rotation: 0,
      scale: 1.1,
      mobileX: 20,
      mobileY: 30,
      mobileScale: 0.66,
    },
  },
  {
    id: 4,
    title: 'Vibrant Neon',
    img: '/bannersec/bannerTop1.jpg',
    zIndex: 18,
    initial: { x: 12, y: -14, rotation: 0, scale: 0.98 },
    stacked: { x: 6, y: 4, rotation: 6, scale: 1.0 },
    expanded: {
      x: 325,
      y: 130,
      rotation: 0,
      scale: 1.1,
      mobileX: 60,
      mobileY: 90,
      mobileScale: 0.68,
    },
  },
  {
    id: 5,
    title: 'Azure Cloud 7 Feet',
    img: '/bannersec/bannerTop2.jpg',
    isFront: true,
    zIndex: 20,
    initial: { x: 0, y: 0, rotation: 0, scale: 1.0 },
    stacked: { x: 18, y: 10, rotation: 13, scale: 1.02 },
    expanded: {
      x: 510,
      y: 175,
      rotation: 0,
      scale: 1.1,
      mobileX: 100,
      mobileY: 150,
      mobileScale: 0.70,
    },
  },
];

const KINETIC_LINES = [
  "Whether you're a brand seeking iconic campaigns",
  "/ or creator directing synthetic actors 🎬 connects",
  "you to the future of high-impact 🏷️ advertising.",
];

export default function Section4Sprout() {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const cardNodesRef = useRef([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const cards = cardNodesRef.current.slice(0, STACK_CARDS.length);
    const textLines = textGroupRef.current
      ? textGroupRef.current.querySelectorAll('.sprout-line')
      : [];

    // ─────────────────────────────────────────────────────────────────────────
    // 0. INITIAL RESTING STATE (Applied synchronously on mount)
    // ─────────────────────────────────────────────────────────────────────────
    gsap.set(textLines, {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
    });

    gsap.set(cards, {
      opacity: 0,
      scale: 0,
      x: 0,
      y: 40,
      rotation: 0,
      filter: 'blur(10px)',
      zIndex: (i) => STACK_CARDS[i].zIndex,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // PINNED 5-STAGE SCRUBBED TIMELINE
    // - Pinned duration extended to 3.8 viewport heights for ample scroll track
    // - Self-contained; pinSpacing naturally pushes Section 5
    // ─────────────────────────────────────────────────────────────────────────
    const sproutTl = gsap.timeline({
      scrollTrigger: {
        id: 'sec4-sprout-pin',
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.8)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 1 (10% Timeline Share): Headline Introduction
    // Line 1 ScrambleText reveals; cards remain hidden
    // ─────────────────────────────────────────────────────────────────────────
    if (textLines[0]) {
      sproutTl.to(textLines[0], {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.0,
        scrambleText: {
          text: KINETIC_LINES[0],
          chars: 'lowerCase',
          speed: 0.45,
          revealDelay: 0.1,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 2 (20% Timeline Share): Sprout
    // Cards emerge into upright stepping staircase; Lines 2 & 3 reveal
    // ─────────────────────────────────────────────────────────────────────────
    sproutTl.to(
      cards,
      {
        opacity: 1,
        filter: 'blur(0px)',
        x: (i) => STACK_CARDS[i].initial.x,
        y: (i) => STACK_CARDS[i].initial.y,
        rotation: (i) => STACK_CARDS[i].initial.rotation,
        scale: (i) => STACK_CARDS[i].initial.scale,
        duration: 2.0,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    if (textLines[1]) {
      sproutTl.to(
        textLines[1],
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.0,
          scrambleText: {
            text: KINETIC_LINES[1],
            chars: 'lowerCase',
            speed: 0.45,
            revealDelay: 0.1,
          },
        },
        '<0.2'
      );
    }

    if (textLines[2]) {
      sproutTl.to(
        textLines[2],
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.0,
          scrambleText: {
            text: KINETIC_LINES[2],
            chars: 'lowerCase',
            speed: 0.45,
            revealDelay: 0.1,
          },
        },
        '<0.3'
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 3 (15% Timeline Share): Compact Stack Formation
    // Cards pivot together into the tilted fan deck with natural overlapping
    // ─────────────────────────────────────────────────────────────────────────
    sproutTl.to(cards, {
      x: (i) => STACK_CARDS[i].stacked.x,
      y: (i) => STACK_CARDS[i].stacked.y,
      rotation: (i) => STACK_CARDS[i].stacked.rotation,
      scale: (i) => STACK_CARDS[i].stacked.scale,
      duration: 1.5,
      stagger: 0.03,
      ease: 'power2.inOut',
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 4 (40% Timeline Share): Card Separation & Diagonal Expansion
    // Behind text fades out completely (opacity: 0) to avoid any clash.
    // Cards scale down smoothly and expand to fill full screen width & height.
    // ─────────────────────────────────────────────────────────────────────────
    sproutTl.to(
      '.sec4-text-group',
      {
        opacity: 0,
        y: -35,
        filter: 'blur(8px)',
        duration: 1.5,
        ease: 'power2.inOut',
      },
      '+=0.1'
    );

    sproutTl.to(
      cards,
      {
        x: (i) =>
          window.innerWidth < 768
            ? STACK_CARDS[i].expanded.mobileX
            : STACK_CARDS[i].expanded.x,
        y: (i) =>
          window.innerWidth < 768
            ? STACK_CARDS[i].expanded.mobileY
            : STACK_CARDS[i].expanded.y,
        rotation: (i) => STACK_CARDS[i].expanded.rotation,
        scale: (i) =>
          window.innerWidth < 768
            ? STACK_CARDS[i].expanded.mobileScale
            : STACK_CARDS[i].expanded.scale,
        duration: 4.0,
        stagger: 0.07,
        ease: 'power2.inOut',
      },
      '<'
    );

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 5 (15% Timeline Share): Final Composition Hold
    // Expanded composition holds firmly in view before unpinning cleanly
    // ─────────────────────────────────────────────────────────────────────────
    sproutTl.to({}, { duration: 1.5 });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="services"
      className="sec4-sprout-section relative w-full h-screen flex items-center justify-center overflow-hidden select-none"
      style={{
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div className="sec4-stage-container relative w-full max-w-7xl mx-auto flex items-center justify-center">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. BACKGROUND KINETIC TEXT (With ScrambleText Effect)              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div
          ref={textGroupRef}
          className="sec4-text-group w-full text-center flex flex-col items-center pointer-events-none z-10"
          style={{ gap: '14px', marginTop: '90px' }}
        >
          {/* Line 1 */}
          <p className="sprout-line sec4-heading-line font-medium tracking-tight text-neutral-900 leading-[1.25]">
            {KINETIC_LINES[0]}
          </p>

          {/* Line 2 */}
          <p className="sprout-line sec4-heading-line font-medium tracking-tight text-neutral-900 leading-[1.25]">
            {KINETIC_LINES[1]}
          </p>

          {/* Line 3 */}
          <p className="sprout-line sec4-heading-line font-medium tracking-tight text-neutral-900 leading-[1.25]">
            {KINETIC_LINES[2]}
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. THE 6 EXPANDING CARDS (Collective Deck -> Individual Showcase) */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div
          className="sec4-cards-deck-wrapper absolute inset-0 flex justify-center items-center pointer-events-none z-20"
        >
          <div
            className="relative flex items-center justify-center pointer-events-auto"
            style={{ width: '200px', height: '260px' }}
          >
            {STACK_CARDS.map((card, index) => (
              <div
                key={card.id}
                ref={(node) => { cardNodesRef.current[index] = node; }}
                className="sec4-stack-card absolute cursor-pointer will-change-transform"
                style={{
                  width: '185px',
                  height: '245px',
                  transformOrigin: '50% 85%',
                }}
              >
                {/* Inner card container: GSAP controls outer card coordinates;
                    inner container handles hover without CSS transform collision */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/60 transition-transform duration-200 hover:scale-[1.03]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
