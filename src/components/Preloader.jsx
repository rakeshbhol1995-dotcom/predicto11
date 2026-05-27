import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [destroy, setDestroy] = useState(false);

  useEffect(() => {
    // Fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    // Destroy node after fade completes (300ms transition)
    const destroyTimer = setTimeout(() => {
      setDestroy(true);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(destroyTimer);
    };
  }, []);

  if (destroy) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#070a0f',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(5,196,139,0.15) 0%, transparent 70%)',
        top: '20%',
        left: '10%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
        bottom: '20%',
        right: '10%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Animation Container */}
      <div className="preloader-animation-box" style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {/* Bats & Ball SVG Graphic */}
        <svg width="160" height="160" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="batGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a373" />
              <stop offset="50%" stopColor="#a98467" />
              <stop offset="100%" stopColor="#604a3f" />
            </linearGradient>
            <linearGradient id="ballGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff85" />
              <stop offset="100%" stopColor="#009688" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff85" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00ff85" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing Aura for Ball */}
          <circle className="ball-aura" cx="50" cy="50" r="14" fill="url(#glow)" />

          {/* Cricket Ball */}
          <circle className="loading-cricket-ball" cx="50" cy="50" r="6" fill="url(#ballGrad)" />
          {/* Ball Seam */}
          <path className="loading-cricket-ball" d="M47 50C48.5 48.5 51.5 48.5 53 50M47 50C48.5 51.5 51.5 51.5 53 50" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="1.5 1" fill="none" />

          {/* Cricket Bat */}
          <g className="loading-cricket-bat" style={{ transformOrigin: '20px 80px' }}>
            {/* Grip handle */}
            <rect x="18" y="70" width="3" height="15" rx="1.5" fill="#e91e63" />
            {/* Handle wrap design */}
            <line x1="18" y1="74" x2="21" y2="74" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="18" y1="78" x2="21" y2="78" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="18" y1="82" x2="21" y2="82" stroke="#ffffff" strokeWidth="0.8" />
            {/* Wooden blade */}
            <path d="M20 71.5L38 42C39 40.5 41 40 42.5 41C44 42 44.5 44 43.5 45.5L25.5 75C24.5 76.5 22.5 77 21 76C19.5 75 19 73 20 71.5Z" fill="url(#batGrad)" stroke="#523a28" strokeWidth="0.5" />
            {/* Bat sweet spot glow line */}
            <path d="M28 60L38 44" stroke="#00ff85" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Hitting ripple circles */}
          <circle className="impact-ripple" cx="44" cy="44" r="2" stroke="#00ff85" strokeWidth="1" fill="none" />
        </svg>

        {/* Orbit ring around the loader */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          border: '1.5px dashed rgba(5,196,139,0.2)',
          borderRadius: '50%',
          animation: 'rotateOrbit 8s linear infinite'
        }} />
      </div>

      {/* Branding Info */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: '2rem',
        letterSpacing: '3px',
        color: '#ffffff',
        margin: '0 0 8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textTransform: 'uppercase'
      }}>
        PREDICTO<span style={{ color: 'var(--brand-emerald)', filter: 'drop-shadow(0 0 10px rgba(0, 255, 133, 0.4))' }}>11</span>
      </h2>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        margin: 0,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: 600
      }}>
        Loading Premium Sportsbook...
      </p>

      {/* Styled inline keyframes to keep the preloader completely modular */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rotateOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-cricket-bat {
          animation: swingBat 1.6s ease-in-out infinite;
        }

        .loading-cricket-ball {
          animation: bounceBall 1.6s ease-in-out infinite;
        }

        .ball-aura {
          animation: bounceBallAura 1.6s ease-in-out infinite;
        }

        .impact-ripple {
          animation: triggerRipple 1.6s ease-in-out infinite;
        }

        @keyframes swingBat {
          0% {
            transform: rotate(0deg);
          }
          35% {
            transform: rotate(-15deg); /* Pull back */
          }
          45% {
            transform: rotate(20deg); /* Swing forward and hit */
          }
          65% {
            transform: rotate(5deg); /* Follow through */
          }
          100% {
            transform: rotate(0deg); /* Return */
          }
        }

        @keyframes bounceBall {
          0% {
            transform: translate(35px, 20px);
          }
          35% {
            transform: translate(25px, 15px); /* Move towards bat */
          }
          45% {
            transform: translate(-6px, -6px); /* Impact point */
          }
          65% {
            transform: translate(-30px, -28px); /* Fly off after hit */
          }
          100% {
            transform: translate(35px, 20px); /* Reset back to right */
          }
        }

        @keyframes bounceBallAura {
          0% {
            transform: translate(35px, 20px) scale(0.8);
            opacity: 0.3;
          }
          35% {
            transform: translate(25px, 15px) scale(1);
            opacity: 0.5;
          }
          45% {
            transform: translate(-6px, -6px) scale(1.8);
            opacity: 0.9;
          }
          65% {
            transform: translate(-30px, -28px) scale(0.6);
            opacity: 0.2;
          }
          100% {
            transform: translate(35px, 20px) scale(0.8);
            opacity: 0.3;
          }
        }

        @keyframes triggerRipple {
          0%, 43% {
            transform: scale(0.5);
            opacity: 0;
          }
          45% {
            transform: scale(1);
            opacity: 1;
          }
          60%, 100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
