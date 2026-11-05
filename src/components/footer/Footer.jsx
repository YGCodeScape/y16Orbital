import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FooterLinks from './FooterLinks';
import FooterWordmark from './FooterWordmark';
import FooterBottomBar from './FooterBottomBar';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const bgWrapRef = useRef(null);
  const bgImgRef = useRef(null);

  useGSAP(() => {
    if (!footerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. DYNAMIC NAVBAR THEME TOGGLE (turns navbar text & logo white on footer)
    // ─────────────────────────────────────────────────────────────────────────
    const getNavHeight = () => {
      return document.querySelector('#main-nav')?.getBoundingClientRect().height || 72;
    };

    ScrollTrigger.create({
      id: 'footer-nav-theme',
      trigger: footerRef.current,
      start: () => `top top+=${getNavHeight()}`,
      toggleClass: {
        targets: '#main-nav',
        className: 'nav-theme-white',
      },
      invalidateOnRefresh: true,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. PARALLAX BACKGROUND UPWARD GLIDE (Matching Section 3 & Section 7)
    // ─────────────────────────────────────────────────────────────────────────
    if (bgImgRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        bgImgRef.current,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            id: 'footer-bg-parallax',
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. INITIAL STATES SETUP
    // ─────────────────────────────────────────────────────────────────────────
    const dividers = footerRef.current.querySelectorAll('.footer-divider-line');
    const leftLinks = footerRef.current.querySelectorAll('.footer-left-group .footer-link-item');
    const rightLinks = footerRef.current.querySelectorAll('.footer-right-group .footer-link-item');
    const wordmark = footerRef.current.querySelector('.footer-wordmark-wrap');
    const bottomBar = footerRef.current.querySelector('.footer-bottom-row');

    if (prefersReducedMotion) {
      gsap.set([dividers, leftLinks, rightLinks, wordmark, bottomBar], {
        opacity: 1,
        x: 0,
        y: 0,
        scaleX: 1,
      });
      if (bgWrapRef.current) {
        gsap.set(bgWrapRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    gsap.set(dividers, { scaleX: 0 });
    gsap.set(leftLinks, { opacity: 0, x: -20 });
    gsap.set(rightLinks, { opacity: 0, x: 20 });
    gsap.set(wordmark, { opacity: 0, y: 24 });
    gsap.set(bottomBar, { opacity: 0, y: 16 });

    // ─────────────────────────────────────────────────────────────────────────
    // 4. SEQUENTIAL GSAP REVEAL TIMELINE
    // ─────────────────────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'footer-reveal-trigger',
        trigger: footerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    // STAGE 1: Background arrives (subtle opacity 0.85 -> 1, scale 1.035 -> 1 on wrapper)
    if (bgWrapRef.current) {
      tl.fromTo(
        bgWrapRef.current,
        { opacity: 0.85, scale: 1.035 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        0
      );
    }

    // STAGE 2: Divider lines draw (scaleX: 0 -> 1, duration 0.65s)
    tl.to(
      dividers,
      {
        scaleX: 1,
        duration: 0.65,
        ease: 'power2.inOut',
        stagger: 0.1,
      },
      0.5
    );

    // STAGE 3: Link groups reveal with elegant delay (left x: -20 -> 0, right x: 20 -> 0)
    tl.to(
      leftLinks,
      {
        opacity: 1,
        x: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
      },
      0.85
    );

    tl.to(
      rightLinks,
      {
        opacity: 1,
        x: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
      },
      1.0
    );

    // STAGE 4: Wordmark reveal (slight upward movement, opacity)
    if (wordmark) {
      tl.to(
        wordmark,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        1.25
      );
    }

    // STAGE 5: Bottom row appears (copyright, manifesto, back to top fade upward)
    if (bottomBar) {
      tl.to(
        bottomBar,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
        },
        1.45
      );
    }

  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="footer-section-root relative w-full min-h-screen h-screen overflow-hidden text-white flex flex-col justify-between select-none"
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* FULL BLEED BACKGROUND IMAGE WITH UPWARD GLIDING PARALLAX          */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-900 pointer-events-none">
        <div ref={bgWrapRef} className="absolute inset-0 w-full h-full will-change-transform">
          <img
            ref={bgImgRef}
            src="/bannersec/footerBanner.png"
            alt="Y16 Orbital Campaign Talent"
            className="absolute top-[-15%] left-0 w-full h-[130%] object-cover object-[center_35%] lg:object-center select-none pointer-events-none will-change-transform"
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Top gradient for nav readability */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 via-black/15 to-transparent pointer-events-none" />
        {/* Bottom gradient for legal bar & wordmark clarity */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LAYERED CONTENT CONTAINER (Grid matching reference layout)         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="footer-content-inner w-full h-full max-w-[1440px] flex-1 flex flex-col justify-between pointer-events-none">
        
        {/* TOP LAYER: UPPER LEFT (01 Work) & UPPER RIGHT (02 Studio + 03 Connect) */}
        <div className="footer-top-row w-full flex flex-col lg:flex-row justify-between items-start">
          <FooterLinks />
        </div>

        {/* BOTTOM LAYER: MASSIVE WORDMARK & BOTTOM BAR */}
        <div className="footer-bottom-layer w-full flex flex-col">
          <FooterWordmark />
          <FooterBottomBar />
        </div>

      </div>
    </footer>
  );
}
