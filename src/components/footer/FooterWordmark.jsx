import OrbitLogo from '../OrbitLogo';

/**
 * Massive Editorial Y16ORBITAL Brand Wordmark
 * Positioned in lower left with responsive clamp sizing.
 */
export default function FooterWordmark() {
  return (
    <div className="footer-wordmark-wrap select-none pointer-events-auto will-change-transform">
      <div className="footer-WM flex items-center text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.3)] leading-none "
         style={{fontFamily: ' "K2D", sans-serif', letterSpacing: '0.2em' }}
        >
        <span>Y16</span>
        {/* Orbital Geometric Icon */}
        <div className="footer-orbit-icon-wrap inline-flex items-center justify-center shrink-0" style={{ width: '0.86em', height: '0.86em' }}>
          <OrbitLogo
            className="text-white w-full h-full stroke-[1.8]"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <span>RBITAL</span>
      </div>
    </div>
  );
}
