import { ArrowUp } from 'lucide-react';

/**
 * Footer Bottom Legal, Manifesto & Back-to-Top Bar
 * 3-Column layout on desktop, neatly stacked on mobile.
 */
export default function FooterBottomBar() {
  const handleScrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="footer-bottom-row w-full flex flex-col md:flex-row items-start md:items-end justify-between text-white/80 text-[16px] font-medium pointer-events-auto will-change-transform">
      {/* 1. Copyright & Legal */}
      <div className="footer-legal-col flex flex-col">
        <p className="text-white/90">© 2026 Y16 Orbital</p>
        <div className="footer-legal-links flex items-center text-white/70">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <span>·</span>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </a>
        </div>
      </div>

      {/* 2. Company Manifesto Statement */}
      <div className="text-left md:text-center text-white/75 leading-relaxed">
        <p>AI-powered creative production.</p>
        <p>Built for the next generation of advertising.</p>
      </div>

      {/* 3. Back to Top Interactive Trigger */}
      <div className="text-left md:text-right">
        <button
          type="button"
          onClick={handleScrollToTop}
          className="footer-back-to-top group inline-flex items-center text-white/90 hover:text-white transition-colors cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  );
}
