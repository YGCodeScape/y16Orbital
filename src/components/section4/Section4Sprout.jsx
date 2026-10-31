import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register both plugins
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 6 Cards Dataset with 2-Stage Coordinates:
 * 
 * Stage 1 (Initial Sprout - Frame 1):
 * - Cards are standing upright (rotation: 0)
 * - They step outward along the right diagonal (x increases, y ascends upward/back)
 * - Front blue card (id: 5) is forward-most and prominent
 * - Each card behind it is scaled down and steps up-right (+x, -y)
 * 
 * Stage 2 (Tilted Fan Deck - Frame 2):
 * - Cards fan out with a pivot point near the bottom/center
 * - Leftmost/back cards fan out to negative rotations (-24deg to -14deg)
 * - Rightmost/front cards fan toward positive rotations (e.g. +8deg to +14deg)
 * ─────────────────────────────────────────────────────────────────────────────
 */
const STACK_CARDS = [
  {
    id: 0,
    title: 'Text Poster Graphic',
    img: '/bannersec/bannerTop3.jpg',
    // Stage 1: Furthest top-right card in line
    initialX: 68,
    initialY: -75,
    initialRotate: 0,
    initialScale: 0.88,
    zIndex: 10,
    // Stage 2: Fanned far to the left
    finalX: -36,
    finalY: -22,
    finalRotate: -24,
    finalScale: 0.94,
  },
  {
    id: 1,
    title: 'Editorial Sound',
    img: '/bannersec/bannerTop4.jpg',
    initialX: 52,
    initialY: -58,
    initialRotate: 0,
    initialScale: 0.90,
    zIndex: 12,
    finalX: -28,
    finalY: -16,
    finalRotate: -17,
    finalScale: 0.95,
  },
  {
    id: 2,
    title: 'Vintage Cinema',
    img: '/bannersec/bannerTop5.jpg',
    initialX: 38,
    initialY: -42,
    initialRotate: 0,
    initialScale: 0.93,
    zIndex: 14,
    finalX: -18,
    finalY: -10,
    finalRotate: -10,
    finalScale: 0.97,
  },
  {
    id: 3,
    title: 'Delulu Synthetic',
    img: '/art/art-3.jpg',
    initialX: 24,
    initialY: -28,
    initialRotate: 0,
    initialScale: 0.96,
    zIndex: 16,
    finalX: -6,
    finalY: -4,
    finalRotate: -2,
    finalScale: 0.98,
  },
  {
    id: 4,
    title: 'Vibrant Neon',
    img: '/bannersec/bannerTop1.jpg',
    initialX: 12,
    initialY: -14,
    initialRotate: 0,
    initialScale: 0.98,
    zIndex: 18,
    finalX: 6,
    finalY: 4,
    finalRotate: 6,
    finalScale: 1.0,
  },
  {
    id: 5,
    title: 'Azure Cloud 7 Feet',
    img: '/bannersec/bannerTop2.jpg',
    isFront: true,
    // Stage 1: Front and center
    initialX: 0,
    initialY: 0,
    initialRotate: 0,
    initialScale: 1.0,
    zIndex: 20,
    // Stage 2: Front card angled slightly to the right
    finalX: 18,
    finalY: 10,
    finalRotate: 13,
    finalScale: 1.02,
  },
];

// Target text for all 3 kinetic lines
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
    const textLines = textGroupRef.current ? textGroupRef.current.querySelectorAll('.sprout-line') : [];

    // ─────────────────────────────────────────────────────────────────────────
    // 1. INITIAL RESTING STATE
    // Lines start with opacity 0, blur, and slight translation
    // ─────────────────────────────────────────────────────────────────────────
    gsap.set(textLines, {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
    });

    // Cards start small (scale 0), blurred, entering from slightly below
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
    // 2. TIMELINE: SCRAMBLE TEXT ON KINETIC LINES + CARDS SPROUT
    // ─────────────────────────────────────────────────────────────────────────
    const entranceTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    });

    // Step 1: Line 1 ScrambleText reveal
    if (textLines[0]) {
      entranceTl.to(textLines[0], {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.85,
        scrambleText: {
          text: KINETIC_LINES[0],
          chars: 'lowerCase',
          speed: 0.45,
          revealDelay: 0.1,
        },
      });
    }

    // Step 2: Cards emerge from scale 0 into upright stepping cascade (Frame 1)
    entranceTl.to(cards, {
      opacity: 1,
      filter: 'blur(0px)',
      x: (i) => STACK_CARDS[i].initialX,
      y: (i) => STACK_CARDS[i].initialY,
      rotation: (i) => STACK_CARDS[i].initialRotate,
      scale: (i) => STACK_CARDS[i].initialScale,
      duration: 1.1,
      stagger: 0.12,
      ease: 'back.out(1.2)',
    }, '-=0.4');

    // Step 3: Line 2 ScrambleText reveal
    if (textLines[1]) {
      entranceTl.to(textLines[1], {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        scrambleText: {
          text: KINETIC_LINES[1],
          chars: 'lowerCase',
          speed: 0.45,
          revealDelay: 0.1,
        },
      }, '-=0.5');
    }

    // Step 4: Line 3 ScrambleText reveal
    if (textLines[2]) {
      entranceTl.to(textLines[2], {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        scrambleText: {
          text: KINETIC_LINES[2],
          chars: 'lowerCase',
          speed: 0.45,
          revealDelay: 0.1,
        },
      }, '-=0.4');
    }

    // Step 5: Cards pivot together into tilted fanned deck (Frame 2)
    entranceTl.to(cards, {
      x: (i) => STACK_CARDS[i].finalX,
      y: (i) => STACK_CARDS[i].finalY,
      rotation: (i) => STACK_CARDS[i].finalRotate,
      scale: (i) => STACK_CARDS[i].finalScale,
      duration: 1.0,
      stagger: 0.04,
      ease: 'power2.inOut',
    }, '-=0.2');

    // ─────────────────────────────────────────────────────────────────────────
    // 3. ACCURATE SCROLLTRIGGER ATTACHMENT
    // Using top+=1600px pin offset ensures the trigger fires exactly when
    // user scrolls down and lands on Section 4!
    // ─────────────────────────────────────────────────────────────────────────
    ScrollTrigger.create({
      id: 'sec4-sprout-direct',
      trigger: containerRef.current,
      start: 'top+=1600px 75%',
      end: 'bottom 25%',
      toggleActions: 'play none none reverse',
      onEnter: () => entranceTl.play(),
      onLeaveBack: () => entranceTl.reverse(),
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="sec4-sprout-section relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#f8f7f5] select-none"
      style={{
        paddingTop: '100px',
        paddingBottom: '120px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div className="sec4-stage-container relative w-full max-w-6xl mx-auto flex items-center justify-center">
        
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. BACKGROUND KINETIC TEXT (With ScrambleText Effect)              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div
          ref={textGroupRef}
          className="sec4-text-group w-full text-center flex flex-col items-center pointer-events-none z-10"
          style={{ gap: '14px', marginTop: '109px', }}
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
        {/* 2. THE 6 CARDS STAGE (Floats in center right over the text)       */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div
          className="sec4-cards-deck-wrapper absolute inset-0 flex top-[-40px] justify-center pointer-events-none z-20"
        >
          <div
            className="relative flex items-center justify-center pointer-events-auto"
            style={{ width: '220px', height: '290px' }}
          >
            {STACK_CARDS.map((card, index) => (
              <div
                key={card.id}
                ref={(node) => { cardNodesRef.current[index] = node; }}
                className="sec4-stack-card absolute cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
                style={{
                  width: '210px',
                  height: '275px',
                  transformOrigin: '50% 85%',
                }}
              >
                {/* Card Container */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl  bg-neutral-900">
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
