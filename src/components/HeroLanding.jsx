import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Deck layout dataset representing the 5 art cards
 * Target values dictate the fan-out arc coordinates
 */
const HERO_CARD_CONFIG = [
 {
    id: 0,
    title: 'Wild',
    img: '/art/art-7.jpg',
    targetX: -350,
    targetY: 16,
    targetRotate: -20,
  },
  {
    id: 1,
    title: 'Sound',
    img: '/art/art-1.jpg',
    targetX: -230,
    targetY: 0,
    targetRotate: -15,
  },
  {
    id: 2,
    title: 'Delulu',
    img: '/art/art-3.jpg',
    targetX: 0,
    targetY: -2,
    targetRotate: 0,
    isCenter: true,
  },
  {
    id: 3,
    title: 'Text Poster',
    img: '/art/art-2.jpg',
    targetX: -110,
    targetY: -12,
    targetRotate: -14,
  },
  {
    id: 4,
    title: 'Nike',
    img: '/art/art-4.jpg',
    targetX: 110,
    targetY: -10,
    targetRotate: 10,
  },
  {
    id: 5,
    title: 'Water Glass',
    img: '/art/art-5.jpg',
    targetX: 230,
    targetY: -10,
    targetRotate: 15,
  },
    {
    id: 6,
    title: 'Car Driff',
    img: '/art/art-6.jpg',
    targetX: 360,
    targetY: 0,
    targetRotate: 16,
  },
];

/**
 * HeroLanding Component
 * Implements the 3-phase opening hero sequence of Y16Orbital.
 * Uses a hybrid architecture: Tailwind classes for semantics + Inline styles for metrics.
 */
export default function HeroLanding() {
  const heroContainerRef = useRef(null);
  const cardNodesRef = useRef([]);

  useGSAP(() => {
    const centerCard = cardNodesRef.current[2];
    const flankCards = cardNodesRef.current.filter((_, idx) => idx !== 2);

    // Initial positioning setup
    gsap.set(centerCard, {
      y: 220,
      scale: 0.6,
      rotation: -14,
      opacity: 0,
    });

    gsap.set(flankCards, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8,
      opacity: 0,
    });

    // Master Hero Timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // Phase 1: Unveil the central card and initial title phrase (0.0s - 1.4s)
    tl.fromTo('.hero-prefix',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.15 }
    )
    .to(centerCard, {
      y: 0,
      scale: 1,
      rotation: -6,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.15)',
    }, '-=0.6');

    // Phase 2: Complete the headline & fan out surrounding cards (1.4s - 2.4s)
    tl.fromTo('.hero-suffix',
      { opacity: 0, filter: 'blur(10px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 0.7 },
      '-=0.3'
    )
    .to(cardNodesRef.current, {
      x: (index) => HERO_CARD_CONFIG[index].targetX,
      y: (index) => HERO_CARD_CONFIG[index].targetY,
      rotation: (index) => HERO_CARD_CONFIG[index].targetRotate,
      scale: (index) => (HERO_CARD_CONFIG[index].isCenter ? 1.10 : 0.92),
      opacity: 1,
      duration: 1.1,
      stagger: 0.04,
      ease: 'power4.out',
    }, '-=0.4');

    // Phase 3: Pop floating badges & reveal bottom CTA group (2.4s - 3.2s)
    tl.fromTo('.floating-social-badge',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(2)' },
      '-=0.5'
    )
    .fromTo('.hero-footer-cta',
      { y: 25, opacity: 0 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    );

  }, { scope: heroContainerRef });

  return (
    <section ref={heroContainerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none "
      style={{ paddingTop: '90px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', }} >

      {/* Main Headline */}
      <div className="text-center max-w-3xl z-20 " >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 leading-[1] capitalize ">
          <span className="hero-prefix inline-block">A place to</span>{' '}
          <span className="hero-suffix inline-block ">display your masterpiece.</span>
        </h1>
      </div>

      {/* Center Fan-Out Card Deck */}
      <div 
        className="relative my-auto flex items-center justify-center z-10"
        style={{ width: '200px', height: '270px' }}
      >
        {HERO_CARD_CONFIG.map((card, index) => (
          <div key={card.id}
            ref={(node) => (cardNodesRef.current[index] = node)}
            className="absolute rounded-2xl overflow-hidden shadow-2xl origin-bottom transition-shadow duration-300 hover:shadow-cyan-500/20 bg-neutral-200 border-2 border-white/70 cursor-pointer"
            style={{ width: '180px',height: '230px', zIndex: card.isCenter ? 20 : 10 - Math.abs(index - 2), }}  >
            <div className={`w-full h-full relative`}>
              <img 
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Subtitle & Action Links */}
      <div 
        className="hero-footer-cta opacity-0 flex flex-col items-center z-20 max-w-md text-center"
        style={{ gap: '16px' }}
      >
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Artists can display their masterpiece, and voters can vote to there favorite artist and make them hold the top positions on Y16Orbital.
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
            See the Designers
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
    </section>
  );
}
