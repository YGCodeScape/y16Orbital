import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 11 Unique AI Works for TOP Row (moving right to left)
 */
const TOP_ROW_WORKS = [
  { id: 1, img: '/works/work1.jpg' },
  { id: 2, img: '/works/work2.jpg' },
  { id: 3, img: '/works/work3.jpg' },
  { id: 4, img: '/works/work4.jpg' },
  { id: 5, img: '/works/work5.jpg' },
  { id: 6, img: '/works/work6.jpg' },
  { id: 7, img: '/works/work7.jpg' },
  { id: 8, img: '/works/work8.jpg' },
  { id: 9, img: '/works/work9.jpg' },
  { id: 10, img: '/works/work10.jpg' },
  { id: 11, img: '/works/work11.jpg' },
];

/**
 * 11 Unique AI Works for BOTTOM Row (moving left to right)
 */
const BOTTOM_ROW_WORKS = [
  { id: 12, img: '/works/work12.jpg' },
  { id: 13, img: '/works/work13.jpg' },
  { id: 14, img: '/works/work14.jpg' },
  { id: 15, img: '/works/work15.jpg' },
  { id: 16, img: '/works/work16.jpg' },
  { id: 17, img: '/works/work17.jpg' },
  { id: 18, img: '/works/work18.jpg' },
  { id: 19, img: '/works/work19.jpg' },
  { id: 20, img: '/works/work20.jpg' },
  { id: 21, img: '/works/work21.jpg' },
  { id: 22, img: '/works/work22.jpg' },
];

export default function Section5WavyShowcase() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);
  const topCardsRef = useRef([]);
  const bottomCardsRef = useRef([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. CENTER TEXT WORD-BY-WORD BLUR & OPACITY REVEAL
    // ─────────────────────────────────────────────────────────────────────────
    const titleWords = titleRef.current ? titleRef.current.querySelectorAll('.sec5-reveal-word') : [];
    const subtitleWords = subtitleRef.current ? subtitleRef.current.querySelectorAll('.sec5-reveal-subword') : [];

    gsap.set([...titleWords, ...subtitleWords], {
      opacity: 0,
      filter: 'blur(16px)',
      y: 26,
    });

    const textTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    });

    textTl
      .to(titleWords, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.08,
        duration: 0.7,
      })
      .to(subtitleWords, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.03,
        duration: 0.6,
      }, '-=0.3');

    ScrollTrigger.create({
      id: 'sec5-text-reveal',
      trigger: sectionRef.current,
      start: 'top+=1800 75%',
      end: 'bottom+=1250 55%',
      toggleActions: 'play none none reverse',
      onEnter: () => textTl.play(),
      onLeaveBack: () => textTl.reverse(),
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. HORIZONTAL AUTO-SCROLLING TRACKS (Continuous marquee loop)
    // - Top track: moves Right to Left (xPercent: 0 -> -50)
    // - Bottom track: moves Left to Right (xPercent: -50 -> 0)
    // ─────────────────────────────────────────────────────────────────────────
    if (topTrackRef.current) {
      gsap.to(topTrackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 38,
        repeat: -1,
      });
    }

    if (bottomTrackRef.current) {
      gsap.fromTo(
        bottomTrackRef.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          ease: 'none',
          duration: 38,
          repeat: -1,
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. VERTICAL SINE-WAVE MOTION (The signature organic wavy wave!)
    // Each individual card oscillates up and down with an offset phase
    // ─────────────────────────────────────────────────────────────────────────
    const topCards = topCardsRef.current.filter(Boolean);
    topCards.forEach((card, i) => {
      gsap.to(card, {
        y: -24,
        rotation: (i % 2 === 0 ? 3 : -3),
        duration: 2.2 + (i % 3) * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: (i * 0.22) % 2.2,
      });
    });

    const bottomCards = bottomCardsRef.current.filter(Boolean);
    bottomCards.forEach((card, i) => {
      gsap.to(card, {
        y: 24,
        rotation: (i % 2 === 0 ? -3 : 3),
        duration: 2.4 + (i % 3) * 0.25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: (i * 0.26) % 2.4,
      });
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="sec5-wavy-section relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#f8f7f5] select-none"
      style={{
        paddingTop: '48px',
        paddingBottom: '48px',
      }}
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TOP ROW: Moves Right to Left with wavy vertical sine float        */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        className="sec5-marquee-mask relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div
          ref={topTrackRef}
          className="flex items-center gap-6 whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Double array for seamless loop */}
          {[...TOP_ROW_WORKS, ...TOP_ROW_WORKS].map((work, idx) => (
            <div
              key={`top-${work.id}-${idx}`}
              ref={(node) => { topCardsRef.current[idx] = node; }}
              className="sec5-work-card shrink-0 rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-108"
              style={{
                width: '124px',
                height: '148px',
              }}
            >
              <img
                src={work.img}
                alt={`AI Campaign Showcase ${work.id}`}
                className="w-full h-full object-cover select-none"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CENTER COPY: AI Advertising Agency Headline with Blur & Opacity   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="sec5-center-content my-auto text-center px-6 flex flex-col items-center">
        {/* Subtle decorative glyph */}
        <span className="text-sm font-serif italic text-neutral-400 mb-3 block">
          of
        </span>

        {/* Headline */}
        <h2
          ref={titleRef}
          className="sec5-title font-medium tracking-tight text-neutral-900 leading-[1.08] max-w-4xl"
          style={{ fontSize: '3.6rem' }}
        >
          <span className="sec5-reveal-word inline-block mr-2.5">You&nbsp;</span>
          <span className="sec5-reveal-word inline-block mr-2.5">will&nbsp;</span>
          <span className="sec5-reveal-word inline-block mr-2.5">find&nbsp;</span>
          <span className="sec5-reveal-word inline-block mr-2.5">your&nbsp;</span>
          <span className="sec5-reveal-word inline-block font-semibold">brand</span>
          <br />
          <span className="sec5-reveal-word inline-block mr-2.5">among&nbsp;</span>
          <span className="sec5-reveal-word inline-block">us.</span>
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="sec5-subtitle text-neutral-500 font-normal leading-relaxed max-w-lg mt-5 text-sm sm:text-base"
        >
          {"We engineer synthetic campaigns, custom AI talent, and surreal product visuals for brands stepping into the future."
            .split(' ')
            .map((word, i) => (
              <span key={i} className="sec5-reveal-subword inline-block">
                {word}&nbsp;
              </span>
            ))}
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* BOTTOM ROW: Moves Left to Right with wavy vertical sine float     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        className="sec5-marquee-mask relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div
          ref={bottomTrackRef}
          className="flex items-center gap-6 whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Double array for seamless loop */}
          {[...BOTTOM_ROW_WORKS, ...BOTTOM_ROW_WORKS].map((work, idx) => (
            <div
              key={`bot-${work.id}-${idx}`}
              ref={(node) => { bottomCardsRef.current[idx] = node; }}
              className="sec5-work-card shrink-0 rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-108"
              style={{
                width: '124px',
                height: '148px',
              }}
            >
              <img
                src={work.img}
                alt={`AI Product Showcase ${work.id}`}
                className="w-full h-full object-cover select-none"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
