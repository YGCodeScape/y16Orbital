/**
 * Footer Navigation Links
 * - Upper Left: 01 Work with us
 * - Upper Right: 02 Studio
 * - Lower Right: 03 Connect
 * Features expanding divider lines and staggered link hover animations with smooth scroll.
 */
export default function FooterLinks() {
  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#' || href === '#about') {
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { duration: 1.5 });
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
    }
  };

  return (
    <>
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 01 WORK WITH US (Upper Left)                                      */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="footer-left-group pointer-events-auto">
        <p className="footer-group-heading text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-white/80">
          01 Work with us
        </p>

        <ul className="footer-link-list flex flex-col text-xs sm:text-[13px] font-medium text-white/90">
          <li className="footer-link-item will-change-transform">
            <a
              href="#start-a-campaign"
              onClick={(e) => handleAnchorClick(e, '#start-a-campaign')}
              className="footer-link-anchor footer-link-anchor-left hover:text-white transition-colors duration-200 inline-block cursor-pointer"
            >
              Start a Campaign
            </a>
          </li>
          <li className="footer-link-item will-change-transform">
            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="footer-link-anchor footer-link-anchor-left hover:text-white transition-colors duration-200 inline-block cursor-pointer"
            >
              Single Campaign
            </a>
          </li>
          <li className="footer-link-item will-change-transform">
            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="footer-link-anchor footer-link-anchor-left hover:text-white transition-colors duration-200 inline-block cursor-pointer"
            >
              Studio Membership
            </a>
          </li>
          <li className="footer-link-item will-change-transform">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, '#contact')}
              className="footer-link-anchor footer-link-anchor-left hover:text-white transition-colors duration-200 inline-block cursor-pointer"
            >
              Custom Production
            </a>
          </li>
        </ul>

        {/* Thin expanding divider line */}
        <div className="footer-divider-line h-[1px] w-48 sm:w-56 bg-white/40 origin-left will-change-transform" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* RIGHT GROUPS WRAPPER (Upper Right: 02 Studio, Lower Right: 03 Connect) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="footer-right-group flex flex-col pointer-events-auto text-left lg:text-right">
        
        {/* 02 Studio */}
        <div>
          <p className="footer-group-heading text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-white/80">
            02 Studio
          </p>
          <ul className="footer-link-list flex flex-col text-xs sm:text-[13px] font-medium text-white/90">
            <li className="footer-link-item will-change-transform">
              <a
                href="#about"
                onClick={(e) => handleAnchorClick(e, '#about')}
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                About Y16 Orbital
              </a>
            </li>
            <li className="footer-link-item will-change-transform">
              <a
                href="#services"
                onClick={(e) => handleAnchorClick(e, '#services')}
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                Our Approach
              </a>
            </li>
            <li className="footer-link-item will-change-transform">
              <a
                href="#production"
                onClick={(e) => handleAnchorClick(e, '#production')}
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                Creative Technology
              </a>
            </li>
          </ul>
          {/* Thin expanding divider line */}
          <div className="footer-divider-line h-[1px] w-48 sm:w-56 bg-white/40 origin-left lg:origin-right will-change-transform" />
        </div>

        {/* 03 Connect */}
        <div>
          <p className="footer-group-heading text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-white/80">
            03 Connect
          </p>
          <ul className="footer-link-list flex flex-col text-xs sm:text-[13px] font-medium text-white/90">
            <li className="footer-link-item will-change-transform">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                Instagram
              </a>
            </li>
            <li className="footer-link-item will-change-transform">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                LinkedIn
              </a>
            </li>
            <li className="footer-link-item will-change-transform">
              <a
                href="mailto:hello@y16orbital.com"
                className="footer-link-anchor footer-link-anchor-right hover:text-white transition-colors duration-200 inline-block cursor-pointer"
              >
                Email
              </a>
            </li>
          </ul>
          {/* Thin expanding divider line */}
          <div className="footer-divider-line h-[1px] w-48 sm:w-56 bg-white/40 origin-left lg:origin-right will-change-transform" />
        </div>

      </div>
    </>
  );
}
