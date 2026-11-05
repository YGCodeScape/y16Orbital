import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import OrbitLogo from './OrbitLogo';

const NAV_LINKS = [
  { href: '#showcase', label: 'Showcase' },
  { href: '#virtual-cast', label: 'Virtual Cast' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#production', label: 'Production' },
  { href: '#start-a-campaign', label: 'Start a Campaign' },
];

/**
 * Global Navigation Header
 * - Brand on left, all navigation tags aligned to the right.
 * - Interactive hover rotation: tags tilt slightly upwards when hovered.
 * - Full-screen responsive dropdown menu for mobile devices.
 * - All responsive breakpoint rules managed externally in media.css.
 */
export default function Nav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Prevent background scroll when mobile menu is open without clobbering existing inline styles
  useEffect(() => {
    if (!isMobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    if (href === '#') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { duration: 1.4, offset: -20 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        id="main-nav"
        className="fixed top-0 left-0 w-full z-40 transition-all duration-300 backdrop-blur-[16px] border-b border-neutral-200/40"
        style={{ paddingTop: '18px', paddingBottom: '10px' }}
      >
        <div
          className="w-full mx-auto flex items-center justify-between"
          style={{ paddingLeft: '32px', paddingRight: '32px' }}
        >
          {/* Brand Identity with Abstract Orbit Mark (Left) */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="wordmark flex items-center group select-none gap-[2px]"
          >
            <span className="font-bold text-[17px] uppercase tracking-[2px] text-neutral-900">Y16</span>

            <div
              className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ width: '28px', height: '28px' }}
            >
              <OrbitLogo size={28} className="text-neutral-900 group-hover:text-black transition-colors" />
            </div>

            <span className="font-bold text-[17px] uppercase tracking-[4px] text-neutral-900">
              rbital
            </span>
          </a>

          {/* Desktop Navigation Links Aligned Right (responsive styles in media.css) */}
          <nav
            className="nav-desktop-links items-center text-[13px] font-medium text-neutral-600 ml-auto"
            style={{ gap: '28px' }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative inline-flex items-center text-neutral-600 hover:text-black transition-transform duration-200 ease-out origin-bottom-left hover:-translate-y-1 hover:-rotate-3 select-none"
                style={{ paddingTop: '4px', paddingBottom: '4px', paddingLeft: '6px', paddingRight: '6px' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Icon Button (responsive styles in media.css) */}
          <div className="nav-mobile-btn-wrap items-center">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open Mobile Navigation Menu"
              className="rounded-full flex items-center justify-center text-neutral-800 transition-colors cursor-pointer"
              style={{ width: '38px', height: '38px' }}
            >
              <Menu style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Dropdown Menu (responsive styles in media.css) */}
      <div
        className={`nav-mobile-overlay fixed inset-0 z-50 bg-[#f8f7f5] flex-col justify-between transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
        style={{
          paddingTop: '20px',
          paddingBottom: '36px',
          paddingLeft: '32px',
          paddingRight: '32px',
        }}
      >
        {/* Top Header inside Full Screen Menu */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center" style={{ gap: '11px' }}>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#')}
              className="wordmark flex items-center group select-none gap-[2px]"
            >
              <span className="font-bold text-[17px] uppercase tracking-[2px] text-neutral-900">Y16</span>

              <div
                className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ width: '28px', height: '28px' }}
              >
                <OrbitLogo size={28} className="text-neutral-900 group-hover:text-black transition-colors" />
              </div>

              <span className="font-bold text-[17px] uppercase tracking-[4px] text-neutral-900">
                rbital
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close Mobile Navigation Menu"
            className="rounded-full flex items-center justify-center text-neutral-800 transition-colors cursor-pointer"
            style={{ width: '38px', height: '38px' }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Navigation Tags List */}
        <nav
          className="flex flex-col items-start my-auto w-full"
          style={{ gap: '20px' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="mobile-nav-link font-medium tracking-tight text-neutral-800 hover:text-black transition-transform duration-200 ease-out origin-bottom-left hover:-translate-y-1 hover:-rotate-3 inline-flex items-center"
              style={{
                paddingTop: '6px',
                paddingBottom: '6px',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom Menu Footer */}
        <div
          className="w-full flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-200/80"
          style={{ paddingTop: '20px' }}
        >
          <span>© 2026 Y16 Orbital</span>
          <span className="text-neutral-400">AI Creative Production Studio</span>
        </div>
      </div>
    </>
  );
}
