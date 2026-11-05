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

  const topGroup1CardsRef = useRef([]);
  const topGroup2CardsRef = useRef([]);
  const bottomGroup1CardsRef = useRef([]);
  const bottomGroup2CardsRef = useRef([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. CENTER TEXT WORD-BY-WORD BLUR & OPACITY REVEAL
    // Purely local trigger on sectionRef — no manual offsets.
    // ─────────────────────────────────────────────────────────────────────────
    const titleWords = titleRef.current
      ? titleRef.current.querySelectorAll('.sec5-reveal-word')
      : [];
    const subtitleWords = subtitleRef.current
      ? subtitleRef.current.querySelectorAll('.sec5-reveal-subword')
      : [];

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
      .to(
        subtitleWords,
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.03,
          duration: 0.6,
        },
        '-=0.3'
      );

    ScrollTrigger.create({
      id: 'sec5-text-reveal',
      trigger: sectionRef.current,
      start: 'top 75%',
      end: 'bottom 55%',
      toggleActions: 'play none none reverse',
      onEnter: () => textTl.play(),
      onLeaveBack: () => textTl.reverse(),
    });

    // If user prefers reduced motion, skip continuous marquee & sine floating
    if (prefersReducedMotion) return;

    // ─────────────────────────────────────────────────────────────────────────
    // 2. HORIZONTAL LOOP (Two identical groups, translation by -50%)
    // - Relaxed, organic speed: 42s desktop / 48s mobile
    // - Top: moves Right to Left (xPercent: 0 -> -50)
    // - Bottom: moves Left to Right (xPercent: -50 -> 0)
    // ─────────────────────────────────────────────────────────────────────────
    const loopDuration = isMobile ? 48 : 42;

    if (topTrackRef.current) {
      gsap.to(topTrackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: loopDuration,
        repeat: -1,
        force3D: true,
      });
    }

    if (bottomTrackRef.current) {
      gsap.fromTo(
        bottomTrackRef.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          ease: 'none',
          duration: loopDuration,
          repeat: -1,
          force3D: true,
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. SYNCHRONIZED SINE-WAVE MOTION
    // Both copies (Group 1 & Group 2) of each image share the exact same wave phase!
    // This eliminates any jump or discontinuity at the loop seam.
    // ─────────────────────────────────────────────────────────────────────────
    const waveDist = isMobile ? 12 : 18;
    const waveRot = isMobile ? 1.5 : 2;

    // Top Row Waves
    TOP_ROW_WORKS.forEach((_, i) => {
      const cardA = topGroup1CardsRef.current[i];
      const cardB = topGroup2CardsRef.current[i];
      const duration = 2.8 + (i % 3) * 0.28;
      const delay = (i * 0.24) % 2.4;
      const rotation = i % 2 === 0 ? waveRot : -waveRot;

      [cardA, cardB].forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          y: -waveDist,
          rotation: rotation,
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
          force3D: true,
        });
      });
    });

    // Bottom Row Waves
    BOTTOM_ROW_WORKS.forEach((_, i) => {
      const cardA = bottomGroup1CardsRef.current[i];
      const cardB = bottomGroup2CardsRef.current[i];
      const duration = 2.9 + (i % 3) * 0.28;
      const delay = (i * 0.28) % 2.5;
      const rotation = i % 2 === 0 ? -waveRot : waveRot;

      [cardA, cardB].forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          y: waveDist,
          rotation: rotation,
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
          force3D: true,
        });
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="virtual-cast"
      className="sec5-wavy-section relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none"
      style={{ paddingTop: '88px', paddingBottom: '88px', }}
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TOP ROW: Moves Right to Left with synchronized vertical sine wave  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        className="sec5-marquee-mask relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div
          ref={topTrackRef}
          className="flex items-center whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Group 1: Primary set */}
          <div className="flex items-center shrink-0">
            {TOP_ROW_WORKS.map((work, idx) => (
              <div
                key={`top-g1-${work.id}`}
                ref={(node) => { topGroup1CardsRef.current[idx] = node; }}
                className="sec5-work-card shrink-0 will-change-transform"
                style={{ width: '124px', height: '148px', marginRight: '16px'}}
              >
                {/* Inner wrapper owns hover scale — prevents competing with wave */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-[1.06]">
                  <img
                    src={work.img}
                    alt={`AI Commercial Talent ${work.id}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Group 2: Identical duplicate (hidden from screen readers) */}
          <div
            aria-hidden="true"
            className="flex items-center shrink-0"
          >
            {TOP_ROW_WORKS.map((work, idx) => (
              <div
                key={`top-g2-${work.id}`}
                ref={(node) => { topGroup2CardsRef.current[idx] = node; }}
                className="sec5-work-card shrink-0 will-change-transform"
                style={{ width: '124px', height: '148px', marginRight: '16px' }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-[1.06]">
                  <img
                    src={work.img}
                    alt=""
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                    decoding="async"
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

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CENTER COPY: AI Advertising Agency Headline with Blur & Opacity   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="sec5-center-content my-auto text-center px-6 flex flex-col items-center">
        <span className="text-sm font-serif italic text-neutral-400 mb-3 block">
          of
        </span>

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
      {/* BOTTOM ROW: Moves Left to Right with synchronized vertical sine    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div
        className="sec5-marquee-mask relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div
          ref={bottomTrackRef}
          className="flex items-center whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Group 1: Primary set */}
          <div className="flex items-center shrink-0">
            {BOTTOM_ROW_WORKS.map((work, idx) => (
              <div
                key={`bot-g1-${work.id}`}
                ref={(node) => { bottomGroup1CardsRef.current[idx] = node; }}
                className="sec5-work-card shrink-0 will-change-transform"
                style={{ width: '124px', height: '148px', marginRight: '16px' }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-[1.06]">
                  <img
                    src={work.img}
                    alt={`AI Product Showcase ${work.id}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Group 2: Identical duplicate (hidden from screen readers) */}
          <div
            aria-hidden="true"
            className="flex items-center shrink-0"
          >
            {BOTTOM_ROW_WORKS.map((work, idx) => (
              <div
                key={`bot-g2-${work.id}`}
                ref={(node) => { bottomGroup2CardsRef.current[idx] = node; }}
                className="sec5-work-card shrink-0  will-change-transform"
                style={{ width: '124px', height: '148px', marginRight: '16px' }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/80 bg-neutral-200 transition-transform duration-300 hover:scale-[1.06]">
                  <img
                    src={work.img}
                    alt=""
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                    decoding="async"
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
