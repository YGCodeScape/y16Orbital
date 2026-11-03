import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Featured Showcase Projects
 * High-fidelity AI commercial campaigns mapping to the visual reference.
 */
const FEATURED_PROJECTS = [
  {
    id: 'connect-commerce',
    eyebrow: 'VIRTUAL COUTURE & TALENT',
    title: 'Connect, Create, Commerce',
    description: 'Offering buyers a chance to own a piece of that narrative through bespoke AI talent and high-fashion capsules.',
    actionLabel: 'How it works?',
    cardTheme: 'light', // light card container
    type: 'stacked-cards',
    frontImage: '/works/work14.jpg',
    backImages: ['/works/work2.jpg', '/works/work7.jpg'],
    pills: [
      { text: 'Play Video', icon: 'play', position: 'top-left' },
      { text: '@robin', icon: 'tag', position: 'top-right' },
    ],
  },
  {
    id: 'art-breathes-commerce',
    eyebrow: 'SURREAL 3D STAGING',
    title: 'Where Art Breathes Commerce',
    description: 'Artistic spirit with commercial viability, providing platform credibility and cinematic spatial renders.',
    actionLabel: 'Read more',
    cardTheme: 'blue', // vibrant electric cobalt container
    type: 'electric-blue',
    image: '/works/work16.jpg',
    pills: [
      { text: 'CGI Render', icon: 'sparkle', position: 'top-right' },
    ],
  },
  {
    id: 'spin-art-gold',
    eyebrow: 'GEN-AI BRAND ACCELERATION',
    title: 'Spin Your Art into Gold',
    description: 'Unleash your artistic potential, where innovation and creativity converge into viral brand narratives.',
    actionLabel: 'Join us now',
    cardTheme: 'vibrant',
    type: 'wide-banner',
    image: '/works/work4.jpg',
    tags: ['Generative Studio', 'Commercial Direction', 'Multi-channel'],
  },
  {
    id: 'axen-power-wrist',
    eyebrow: 'HARDWARE & LUXURY TECH',
    title: 'Axen Power at Your Wrist',
    description: 'Zero physical camera shoots, infinite fidelity. Hyper-realistic mechanical rendering and lighting for next-generation tech.',
    actionLabel: 'Explore project',
    cardTheme: 'dark', // sleek obsidian card
    type: 'dark-sleek',
    image: '/works/work3.jpg',
    tags: ['Mechanical CGI', '4K Commercial'],
  },
];

const HEADLINE_WORDS = ['Every', 'piece', 'of', 'art', 'tells', 'a', 'story.'];

export default function Section6ProjectShowcase() {
  const containerRef = useRef(null);
  const headlineWordsRef = useRef([]);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Headline Scrubbed Reveal (Blur + Opacity + Y)
    // As seen in the reference, scrolling smoothly reveals each word with blur removal
    // ─────────────────────────────────────────────────────────────────────────
    const words = headlineWordsRef.current.filter(Boolean);
    if (words.length > 0) {
      gsap.fromTo(
        words,
        {
          opacity: 0.15,
          filter: 'blur(8px)',
          y: 24,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            id: 'sec6-headline-scrub',
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Row 1 Entrance (Cards 1 & 2 enter smoothly as visitor scrolls)
    // ─────────────────────────────────────────────────────────────────────────
    if (row1Ref.current) {
      const row1Cards = row1Ref.current.querySelectorAll('.sec6-project-card');
      gsap.fromTo(
        row1Cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec6-row1-trigger',
            trigger: row1Ref.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Row 2 Entrance (Cards 3 & 4 reveal sequentially on natural scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (row2Ref.current) {
      const row2Cards = row2Ref.current.querySelectorAll('.sec6-project-card');
      gsap.fromTo(
        row2Cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec6-row2-trigger',
            trigger: row2Ref.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Subtle Floating Animation on Card 1 Pill Badges & Stack Tilt
    // ─────────────────────────────────────────────────────────────────────────
    const floatPills = containerRef.current.querySelectorAll('.sec6-float-pill');
    if (floatPills.length > 0) {
      gsap.to(floatPills, {
        y: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef}
      className="sec6-showcase-section relative w-full text-neutral-900 overflow-hidden"
    >
      {/* Background Decorative Ambient Radial Gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 20%, rgba(230, 235, 248, 0.65), transparent 75%)',
        }}
      />

      <div className="sec6-inner-container max-w-7xl mx-auto">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Header Block: Eyebrow + Staggered Blur Headline */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="sec6-header-block text-center">

          <h2 className="sec6-headline text-3xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 max-w-4xl mx-auto leading-[1.12]">
            {HEADLINE_WORDS.map((word, idx) => (
              <span
                key={idx}
                ref={(el) => { headlineWordsRef.current[idx] = el; }}
                className="sec6-headline-word inline-block will-change-[transform,opacity,filter]"
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Projects Grid: Asymmetrical Layout Matching Reference */}
        {/* ─────────────────────────────────────────────────────────────────── */}

        {/* ROW 1: Card 1 (Stack + Pills) & Card 2 (Electric Cobalt 3D) */}
        <div ref={row1Ref}
          className="sec6-row1-grid grid grid-cols-1 lg:grid-cols-12 items-stretch"
        >
          {/* CARD 1: Connect, Create, Commerce (5 or 6 cols) */}
          <div className="sec6-project-card lg:col-span-6 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
            {/* Visual Top Stage: Interactive Card Stack & Floating Badges */}
            <div className="sec6-card-stage relative w-full h-[280px] sm:h-[340px] bg-[#F4F4F6] rounded-2xl overflow-hidden flex items-center justify-center">

              {/* Floating Pill Top Right: @robin */}
              <div className="sec6-float-pill absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#2563EB] text-white rounded-full text-xs font-semibold"
                style={{paddingInline: '12px', paddingBlock: '6px' }}>
                <span>@Y16</span>
              </div>

              {/* Center Card Fan Stack */}
              <div className="relative w-[150px] sm:w-[175px] h-[200px] sm:h-[235px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {/* Back Under Card (Left rotated) */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden shadow-md border border-white/80 bg-neutral-300 transition-transform duration-500 group-hover:-translate-x-6 group-hover:-rotate-12"
                  style={{ transform: 'rotate(-7deg) translate(-14px, 4px)' }}
                >
                  <img
                    src={FEATURED_PROJECTS[0].backImages[0]}
                    alt="AI Lookbook talent"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Back Under Card (Right rotated) */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden shadow-md border border-white/80 bg-neutral-300 transition-transform duration-500 group-hover:translate-x-6 group-hover:rotate-12"
                  style={{ transform: 'rotate(8deg) translate(14px, 6px)' }}
                >
                  <img
                    src={FEATURED_PROJECTS[0].backImages[1]}
                    alt="AI Lookbook talent 2"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Front Main Card (Prada Lookbook) */}
                <div
                  className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-white bg-neutral-900 transition-transform duration-500 group-hover:-translate-y-2"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <img
                    src={FEATURED_PROJECTS[0].frontImage}
                    alt="Prada AI lookbook"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Prada Branding Pill Overlay */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black/45 backdrop-blur-sm text-white text-[10px] tracking-widest font-black uppercase rounded-full"
                     style={{paddingInline: '6px', paddingBlock: '6px' }}>
                    PRADA
                  </div>
                </div>
              </div>
            </div>

            {/* Content Bottom Area */}
            <div className="sec6-card-content">
              <p className="sec6-card-eyebrow text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                {FEATURED_PROJECTS[0].eyebrow}
              </p>
              <h3 className="sec6-card-title text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                {FEATURED_PROJECTS[0].title}
              </h3>
              <p className="sec6-card-desc text-neutral-500 text-sm leading-relaxed">
                {FEATURED_PROJECTS[0].description}
              </p>
              <div className="sec6-card-btn inline-flex items-center gap-1.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                {FEATURED_PROJECTS[0].actionLabel}
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            </div>
          </div>

          {/* CARD 2: Where Art Breathes Commerce (Cobalt 3D Staging) */}
          <div className="sec6-project-card lg:col-span-6 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
            {/* Visual Top Stage: Electric Blue 3D Studio Visual */}
            <div className="sec6-card-stage relative w-full h-[280px] sm:h-[340px] bg-[#1D4ED8] rounded-2xl overflow-hidden flex items-center justify-center">
              {/* Glowing Ambient Light Streaks & Motion Trails */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#3B82F6]" />
              <div
                className="absolute w-48 h-8 rounded-full bg-white/25 blur-md"
                style={{ top: '65%', transform: 'rotate(-2deg)' }}
              />
              <div className="absolute w-32 h-6 rounded-full bg-white/20 blur-md"
                style={{ top: '75%', transform: 'rotate(1deg)' }}
              />

              {/* CGI Render Tag Top Right */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-medium"
                style={{paddingInline: '12px', paddingBlock: '6px' }}>
                <Sparkles className="w-3 h-3 text-white" />
                CGI Concept
              </div>

              {/* 3D Geometric Art Artwork */}
              <div className="relative z-10 w-[400px] h-64 rounded-2xl overflow-hidden border-2 border-white/40 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img
                  src={FEATURED_PROJECTS[1].image}
                  alt="Where Art Breathes Commerce"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content Bottom Area */}
            <div className="sec6-card-content">
              <p className="sec6-card-eyebrow text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                {FEATURED_PROJECTS[1].eyebrow}
              </p>
              <h3 className="sec6-card-title text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                {FEATURED_PROJECTS[1].title}
              </h3>
              <p className="sec6-card-desc text-neutral-500 text-sm leading-relaxed">
                {FEATURED_PROJECTS[1].description}
              </p>
              <div className="sec6-card-btn inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                {FEATURED_PROJECTS[1].actionLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Card 3 (Wide Expressive Art Banner) & Card 4 (Obsidian Luxury Tech) */}
        <div ref={row2Ref}
          className="sec6-row2-grid grid grid-cols-1 lg:grid-cols-12 items-stretch"
        >
          {/* CARD 3: Spin Your Art into Gold (7 cols) */}
          <div className="sec6-project-card lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
            {/* Visual Top Stage: High-Energy Pop AI Portrait with Swirls */}
            <div className="sec6-card-stage relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 group-hover:shadow-md transition-shadow">
              <img
                src={FEATURED_PROJECTS[2].image}
                alt="Spin Your Art into Gold"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Badges / Category pills */}
              <div className="sec6-tags-group absolute bottom-4 left-4 flex flex-wrap">
                {FEATURED_PROJECTS[2].tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="sec6-tag-pill bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-semibold rounded-full shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Bottom Area */}
            <div className="sec6-card-content">
              <p className="sec6-card-eyebrow text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                {FEATURED_PROJECTS[2].eyebrow}
              </p>
              <h3 className="sec6-card-title text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                {FEATURED_PROJECTS[2].title}
              </h3>
              <p className="sec6-card-desc text-neutral-500 text-sm leading-relaxed">
                {FEATURED_PROJECTS[2].description}
              </p>
              <div className="sec6-card-btn inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                {FEATURED_PROJECTS[2].actionLabel}
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* CARD 4: Axen Power at Your Wrist (5 cols, Obsidian Black) */}
          <div className="sec6-project-card lg:col-span-5 bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] group">
            {/* Visual Top Stage: Sleek Dark Render */}
            <div className="sec6-card-stage relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center border border-neutral-800">
              <img
                src={FEATURED_PROJECTS[3].image}
                alt="Axen Power at Your Wrist"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

              {/* Next Project Circular Arrow Button (matching reference) */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Content Bottom Area */}
            <div className="sec6-card-content">
              <p className="sec6-card-eyebrow text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                {FEATURED_PROJECTS[3].eyebrow}
              </p>
              <h3 className="sec6-card-title text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {FEATURED_PROJECTS[3].title}
              </h3>
              <p className="sec6-card-desc text-neutral-400 text-sm leading-relaxed">
                {FEATURED_PROJECTS[3].description}
              </p>
              <div className="sec6-card-btn inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">
                {FEATURED_PROJECTS[3].actionLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
