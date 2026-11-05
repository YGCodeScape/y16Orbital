import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, ArrowUpRight, X, Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Pricing configuration & live calculation
const MONTHLY_BASE = 1200;
const DISCOUNT_PERCENT = 20;
const YEARLY_MONTHLY_RATE = Math.round(MONTHLY_BASE * (1 - DISCOUNT_PERCENT / 100)); // 960
const YEARLY_TOTAL = YEARLY_MONTHLY_RATE * 12; // 11,520
const ANNUAL_SAVINGS = (MONTHLY_BASE * 12) - YEARLY_TOTAL; // 2,880

export default function Section8Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activeOverlay, setActiveOverlay] = useState(null); // null | 'campaign' | 'membership'

  const sectionRef = useRef(null);
  const headlineLinesRef = useRef([]);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const bottomStripRef = useRef(null);

  const handleCustomProjectClick = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo('#contact', { duration: 1.4 });
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headlineLines = headlineLinesRef.current.filter(Boolean);

    if (prefersReducedMotion) {
      if (headlineLines.length > 0) {
        gsap.set(headlineLines, { opacity: 1, y: 0 });
      }
      if (card1Ref.current && card2Ref.current) {
        gsap.set([card1Ref.current, card2Ref.current], { opacity: 1, y: 0, scale: 1 });
      }
      if (bottomStripRef.current) {
        const stripElements = bottomStripRef.current.querySelectorAll('.sec8-strip-stagger');
        gsap.set(stripElements, { opacity: 1, y: 0 });
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. EDITORIAL HEADLINE: Line-by-line subtle upward movement
    // ─────────────────────────────────────────────────────────────────────────
    if (headlineLines.length > 0) {
      gsap.fromTo(
        headlineLines,
        {
          opacity: 0,
          y: 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec8-headline-trigger',
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. PRICING CARDS: Single Campaign enters first, Membership shortly follows
    // ─────────────────────────────────────────────────────────────────────────
    if (card1Ref.current && card2Ref.current) {
      gsap.fromTo(
        [card1Ref.current, card2Ref.current],
        {
          opacity: 0,
          y: 45,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec8-cards-trigger',
            trigger: card1Ref.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. CUSTOM PROJECT STRIP: Staggered reveal of thumbnails and copy
    // ─────────────────────────────────────────────────────────────────────────
    if (bottomStripRef.current) {
      const stripElements = bottomStripRef.current.querySelectorAll('.sec8-strip-stagger');
      gsap.fromTo(
        stripElements,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'sec8-strip-trigger',
            trigger: bottomStripRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="sec8-pricing-section relative w-full min-h-screen flex flex-col justify-between bg-[#FAF9F6] text-neutral-900 overflow-hidden selection:bg-neutral-900 selection:text-white"
    >
      {/* Ambient Peach/Coral Background Glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, rgba(254, 215, 170, 0.12) 50%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, rgba(253, 186, 116, 0.1) 50%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between">
        
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* MAIN ROW: TIGHTLY ALIGNED HEADLINE + 2 BALANCED EQUAL CARDS        */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="sec8-grid-container w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 flex-1">
          
          {/* 1. LEFT EDITORIAL HEADLINE */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col justify-center">
            <h2 className="sec8-headline text-4xl sm:text-5xl lg:text-[54px] font-bold text-neutral-900 tracking-tight leading-[1.08]">
              <span
                ref={(el) => { headlineLinesRef.current[0] = el; }}
                className="block will-change-transform"
              >
                Turn ideas
              </span>
              <span
                ref={(el) => { headlineLinesRef.current[1] = el; }}
                className="block will-change-transform"
              >
                into iconic
              </span>
              <span
                ref={(el) => { headlineLinesRef.current[2] = el; }}
                className="block font-serif italic font-normal text-neutral-800 will-change-transform"
              >
                campaigns.
              </span>
            </h2>

            <p
              ref={(el) => { headlineLinesRef.current[3] = el; }}
              className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-sm will-change-transform"
            >
              Flexible options. Transparent pricing.
              <br />
              Built for brands that create more.
            </p>
          </div>

          {/* 2. RIGHT EQUAL-SIZED PRICING CARDS */}
          <div className="sec8-cards-grid w-full flex-1 max-w-[720px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* ───────────────────────────────────────────────────────────── */}
            {/* CARD 1: SINGLE CAMPAIGN (₹777)                                */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div
              ref={card1Ref}
              id="start-a-campaign"
              className="sec8-plan-card h-full min-h-[500px] bg-white rounded-[28px] border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-visible transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] will-change-transform group"
            >
              {/* TOP RIGHT "SEE ALL" CIRCULAR BUTTON */}
              <button
                type="button"
                onClick={() => setActiveOverlay('campaign')}
                aria-label="See all features and terms for Single Campaign"
                className="sec8-see-all-btn group/btn absolute w-8 h-8 md:w-9 md:h-9 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white/95 hover:bg-neutral-900 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs cursor-pointer z-10"
              >
                <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover/btn:text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>

              {/* CARD MAIN FACE CONTENT */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="sec8-card-label text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    01 / SINGLE CAMPAIGN
                  </p>
                  <h3 className="sec8-card-title text-2xl font-bold text-neutral-900 leading-tight">
                    One idea.
                    <br />
                    One project.
                  </h3>
                  <p className="sec8-card-desc text-neutral-500 text-xs sm:text-sm leading-relaxed">
                    Bring your vision to life with a standalone high-impact commercial campaign.
                  </p>

                  {/* Price Block: ₹777 */}
                  <div className="sec8-price-block border-t border-neutral-100">
                    <span className="sec8-starting-label text-xs text-neutral-400 font-medium block">
                      Starting at
                    </span>
                    <div className="sec8-price-row flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                        ₹777
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        / project
                      </span>
                    </div>
                  </div>

                  {/* Core Feature Highlights */}
                  <ul className="space-y-2.5 my-4">
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5] shrink-0" />
                      <span>Ultra-HD 4K Commercial Visuals</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5] shrink-0" />
                      <span>Bespoke Virtual Talent & Casting</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5] shrink-0" />
                      <span>Full Commercial Buyout License</span>
                    </li>
                  </ul>
                </div>

                {/* Card Feature Teaser Pill */}
                <div
                  onClick={() => setActiveOverlay('campaign')}
                  className="sec8-feature-teaser w-full rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 cursor-pointer transition-colors flex items-center justify-between text-xs text-neutral-700 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Inclusions, SLAs & Terms</span>
                  </div>
                  <span className="text-[11px] font-bold text-neutral-900 flex items-center gap-0.5">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <button
                type="button"
                onClick={() => setActiveOverlay('campaign')}
                className="sec8-card-btn w-full rounded-full bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center group cursor-pointer"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* ─────────────────────────────────────────────────────────── */}
              {/* CIRCULAR EXPANDING OVERLAY (Features, Terms & Conditions)   */}
              {/* ─────────────────────────────────────────────────────────── */}
              <div
                className={`absolute inset-0 rounded-[28px] overflow-hidden bg-neutral-950 text-white z-30 flex flex-col justify-between transition-all duration-500 ease-out ${
                  activeOverlay === 'campaign'
                    ? 'opacity-100 pointer-events-auto [clip-path:circle(150%_at_calc(100%-36px)_36px)]'
                    : 'opacity-0 pointer-events-none [clip-path:circle(0%_at_calc(100%-36px)_36px)]'
                }`}
              >
                <div className="sec8-overlay-body flex-1 overflow-y-auto">
                  {/* Overlay Header with Dismiss Button */}
                  <div className="sec8-overlay-header flex items-start justify-between border-b border-neutral-800">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                        01 / INCLUSIONS & TERMS
                      </p>
                      <h4 className="text-lg font-bold text-white">
                        Single Campaign Scope
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveOverlay(null)}
                      aria-label="Close feature details"
                      className="w-8 h-8 rounded-full border border-neutral-700 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Full Feature Checklist */}
                  <div className="sec8-overlay-features">
                    <p className="sec8-overlay-subtitle text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Included Assets
                    </p>
                    <ul className="sec8-overlay-list text-xs text-neutral-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Ultra-HD Master Visuals (4K PNG & TIFF)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Proprietary Virtual Talent & Casting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Full Creative Direction & Prompt Engineering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>2 Comprehensive Revision Rounds</span>
                      </li>
                    </ul>
                  </div>

                  {/* Production & Commercial Terms */}
                  <div className="sec8-overlay-terms border-t border-neutral-800/80">
                    <p className="sec8-overlay-subtitle text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Commercial Terms
                    </p>
                    <div className="sec8-terms-list text-[11px] text-neutral-400 leading-relaxed">
                      <p className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span>100% Perpetual commercial buyout license across all global media.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span>Guaranteed 48-hour first-draft delivery SLA.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sec8-overlay-footer border-t border-neutral-800 bg-neutral-900/60">
                  <button
                    type="button"
                    onClick={() => setActiveOverlay(null)}
                    className="sec8-overlay-close-btn w-full rounded-full bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* CARD 2: STUDIO MEMBERSHIP (₹1,200/mo - Most Popular)          */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div
              ref={card2Ref}
              className="sec8-plan-card h-full min-h-[500px] bg-white rounded-[28px] border border-neutral-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between relative overflow-visible transition-all duration-300 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] will-change-transform group"
            >
              {/* TOP FLOATING BADGE */}
              <div className="sec8-popular-badge absolute -top-3.5 left-7 bg-neutral-900 text-white text-[11px] font-bold rounded-full shadow-md flex items-center gap-1.5 z-20">
                <Sparkles className="w-3 h-3 text-orange-400 fill-orange-400" />
                Most Popular
              </div>

              {/* TOP RIGHT "SEE ALL" CIRCULAR BUTTON */}
              <button
                type="button"
                onClick={() => setActiveOverlay('membership')}
                aria-label="See all features and terms for Studio Membership"
                className="sec8-see-all-btn group/btn absolute w-8 h-8 md:w-9 md:h-9 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white/95 hover:bg-neutral-900 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs cursor-pointer z-10"
              >
                <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover/btn:text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>

              {/* CARD MAIN FACE CONTENT */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="sec8-card-label text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    02 / STUDIO MEMBERSHIP
                  </p>
                  <h3 className="sec8-card-title text-2xl font-bold text-neutral-900 leading-tight">
                    Your creative partner.
                  </h3>
                  <p className="sec8-card-desc text-neutral-500 text-xs sm:text-sm leading-relaxed">
                    Ongoing access to premium generative creative production on demand.
                  </p>

                  {/* Billing Toggle: Monthly vs Yearly */}
                  <div className="sec8-billing-toggle relative inline-flex items-center rounded-full bg-neutral-100 border border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`sec8-toggle-btn rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`sec8-toggle-btn rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        billingCycle === 'yearly'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Yearly
                      <span className="sec8-save-pill text-[10px] font-bold text-orange-600 bg-orange-100 rounded-full">
                        Save {DISCOUNT_PERCENT}%
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Price Display with ZERO Height Shift Container */}
                  <div className="sec8-price-block border-t border-neutral-100">
                    <span className="sec8-starting-label text-xs text-neutral-400 font-medium block">
                      Starting at
                    </span>
                    <div className="sec8-price-row flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight transition-all">
                        ₹{billingCycle === 'yearly' ? YEARLY_MONTHLY_RATE : MONTHLY_BASE}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        / month
                      </span>
                    </div>

                    {/* Fixed Height Slot: Never causes card height or page jump */}
                    <div className="h-5 flex items-center">
                      <p
                        className={`sec8-savings-text text-[11px] text-emerald-600 font-semibold transition-opacity duration-200 ${
                          billingCycle === 'yearly' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        Billed ₹{YEARLY_TOTAL.toLocaleString('en-IN')}/yr (Save ₹{ANNUAL_SAVINGS.toLocaleString('en-IN')} annually)
                      </p>
                    </div>
                  </div>

                  {/* Core Feature Highlights */}
                  <ul className="space-y-2.5 my-4">
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#E8590C] stroke-[2.5] shrink-0" />
                      <span>12 Monthly Creative Credits (Roll over 60d)</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#E8590C] stroke-[2.5] shrink-0" />
                      <span>Priority 48-Hour Turnaround SLA</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#E8590C] stroke-[2.5] shrink-0" />
                      <span>Full Virtual Talent Roster & Models</span>
                    </li>
                  </ul>
                </div>

                {/* Card Feature Teaser Pill */}
                <div
                  onClick={() => setActiveOverlay('membership')}
                  className="sec8-feature-teaser w-full rounded-2xl bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/80 cursor-pointer transition-colors flex items-center justify-between text-xs text-neutral-800 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#E8590C]" />
                    <span>Inclusions, SLAs & Terms</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#E8590C] flex items-center gap-0.5">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <button
                type="button"
                onClick={() => setActiveOverlay('membership')}
                className="sec8-card-btn w-full rounded-full bg-[#E8590C] hover:bg-[#d64f09] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group cursor-pointer"
              >
                Become a Member
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* ─────────────────────────────────────────────────────────── */}
              {/* CIRCULAR EXPANDING OVERLAY (Features, Terms & Conditions)   */}
              {/* ─────────────────────────────────────────────────────────── */}
              <div
                className={`absolute inset-0 rounded-[28px] overflow-hidden bg-neutral-950 text-white z-30 flex flex-col justify-between transition-all duration-500 ease-out ${
                  activeOverlay === 'membership'
                    ? 'opacity-100 pointer-events-auto [clip-path:circle(150%_at_calc(100%-36px)_36px)]'
                    : 'opacity-0 pointer-events-none [clip-path:circle(0%_at_calc(100%-36px)_36px)]'
                }`}
              >
                <div className="sec8-overlay-body flex-1 overflow-y-auto">
                  {/* Overlay Header with Dismiss Button */}
                  <div className="sec8-overlay-header flex items-start justify-between border-b border-neutral-800">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">
                        02 / MEMBERSHIP POLICY & CREDITS
                      </p>
                      <h4 className="text-lg font-bold text-white">
                        Studio Membership Rules
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveOverlay(null)}
                      aria-label="Close feature details"
                      className="w-8 h-8 rounded-full border border-neutral-700 hover:border-white text-neutral-400 hover:text-white flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Included Features */}
                  <div className="sec8-overlay-features">
                    <p className="sec8-overlay-subtitle text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Included Privileges
                    </p>
                    <ul className="sec8-overlay-list text-xs text-neutral-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>12 Monthly Creative Credits (Generations & Animations)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Priority GPU Queue with 48hr turnaround guarantee</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Exclusive proprietary virtual talent roster</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Dedicated Slack/Discord private channel with Art Director</span>
                      </li>
                    </ul>
                  </div>

                  {/* Credit Expiration & Production Limits */}
                  <div className="sec8-overlay-terms border-t border-neutral-800/80">
                    <p className="sec8-overlay-subtitle text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Credits & Limits Policy
                    </p>
                    <div className="sec8-terms-list text-[11px] text-neutral-400 leading-relaxed">
                      <p className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span><strong>Credit Rollover:</strong> Unused credits automatically roll over for up to 60 days before expiration.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span><strong>Credit Valuation:</strong> 1 credit = 1 final commercial 4K visual; 4 credits = 1 short-form video scene.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span><strong>Concurrency Limit:</strong> Up to 3 active production requests simultaneously. Cancel anytime with 1 click.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sec8-overlay-footer border-t border-neutral-800 bg-neutral-900/60">
                  <button
                    type="button"
                    onClick={() => setActiveOverlay(null)}
                    className="sec8-overlay-close-btn w-full rounded-full bg-[#E8590C] text-white font-bold text-xs hover:bg-[#d64f09] transition-colors cursor-pointer"
                  >
                    Got It, Return to Plan
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* BOTTOM STRIP: SLEEK ROUNDED-FULL BIGGER VISION BAR                 */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div
          ref={bottomStripRef}
          className="sec8-bottom-strip w-full bg-white/90 backdrop-blur-md rounded-full border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between"
        >
          {/* Left Elements: Star + 4-Card Stack + Vertical Divider + Copy */}
          <div className="sec8-strip-stagger flex items-center flex-wrap sm:flex-nowrap">
            {/* Orange 4-point sparkle star */}
            <span className="text-[#E8590C] text-lg sm:text-xl font-black shrink-0">✦</span>

            {/* Fanned 4-Card Mini Art Stack */}
            <div className="relative w-20 h-10 shrink-0 flex items-center">
              {/* Card 1: Cyberpunk portrait */}
              <div
                className="absolute w-7 h-9 rounded-md overflow-hidden shadow-xs border border-white bg-indigo-500 transition-transform duration-300 hover:-translate-y-1"
                style={{ transform: 'rotate(-12deg) translateX(0px)' }}
              >
                <img
                  src="/works/work14.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              {/* Card 2: Orange background sunglasses model */}
              <div
                className="absolute w-7 h-9 rounded-md overflow-hidden shadow-xs border border-white bg-orange-500 transition-transform duration-300 hover:-translate-y-1"
                style={{ transform: 'rotate(-4deg) translateX(16px)' }}
              >
                <img
                  src="/bannersec/banner2.png"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              {/* Card 3: Artistic character */}
              <div
                className="absolute w-7 h-9 rounded-md overflow-hidden shadow-xs border border-white bg-purple-500 transition-transform duration-300 hover:-translate-y-1"
                style={{ transform: 'rotate(4deg) translateX(32px)' }}
              >
                <img
                  src="/works/work4.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              {/* Card 4: Metallic 3D sphere */}
              <div
                className="absolute w-7 h-9 rounded-md overflow-hidden shadow-xs border border-white bg-neutral-200 flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
                style={{ transform: 'rotate(12deg) translateX(48px)' }}
              >
                <img
                  src="/works/work6.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />           
              </div>
            </div>

            {/* Vertical Divider Line */}
            <div className="sec8-strip-divider hidden sm:block h-6 w-[1px] bg-neutral-300 shrink-0" />

            {/* Copy */}
            <div className="sec8-strip-copy flex items-center flex-wrap text-left">
              <span className="font-bold text-neutral-900 text-sm sm:text-base">
                Have a bigger vision?
              </span>
              <span className="text-neutral-500 text-xs sm:text-sm">
                Let's create something custom together.
              </span>
            </div>
          </div>

          {/* Right Action: Underlined Discuss a Custom Project Link */}
          <div className="sec8-strip-stagger shrink-0">
            <a
              href="#contact"
              onClick={handleCustomProjectClick}
              className="sec8-custom-link inline-flex items-center text-xs sm:text-sm font-semibold text-neutral-900 hover:text-[#E8590C] transition-colors whitespace-nowrap group cursor-pointer"
            >
              <span className="underline decoration-neutral-300 underline-offset-4 group-hover:decoration-[#E8590C]">
                Discuss a Custom Project
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
