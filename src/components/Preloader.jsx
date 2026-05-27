import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [destroy, setDestroy] = useState(false);

  useEffect(() => {
    // Fade out after 2.8 seconds
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2800);

    // Destroy node after fade completes (300ms transition)
    const destroyTimer = setTimeout(() => {
      setDestroy(true);
    }, 3100);

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
      backgroundColor: '#05070a',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Background Stadium Grid & Lighting */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 50% 30%, rgba(13, 35, 29, 0.4) 0%, transparent 65%),
          radial-gradient(circle at 50% 70%, rgba(8, 12, 19, 0.9) 0%, #030406 100%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Spotlight effect */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.4
      }}>
        <defs>
          <linearGradient id="spotlightGrad" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#00ff85" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,0 200,0 600,1000 0,1000" fill="url(#spotlightGrad)" />
      </svg>

      {/* 3D Scene Wrapper */}
      <div className="preloader-scene" style={{
        position: 'relative',
        width: '320px',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        zIndex: 2
      }}>
        {/* SVG containing the wickets, ball, impact, and particle sparks */}
        <svg width="280" height="280" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            {/* Wooden Texture for Stumps */}
            <linearGradient id="stumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e3af7d" />
              <stop offset="30%" stopColor="#d19962" />
              <stop offset="70%" stopColor="#b57a44" />
              <stop offset="100%" stopColor="#8d5624" />
            </linearGradient>

            {/* Specular Shine for Wood Varnish */}
            <linearGradient id="woodVarnish" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
            </linearGradient>

            {/* Ball Shading (3D Spherical Leather Red) */}
            <radialGradient id="leatherRed" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff5757" />
              <stop offset="30%" stopColor="#e61f1f" />
              <stop offset="75%" stopColor="#9c0909" />
              <stop offset="100%" stopColor="#4f0202" />
            </radialGradient>

            {/* High-speed motion blur trail gradient */}
            <linearGradient id="ballTrail" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#00ff85" stopOpacity="0.8" />
              <stop offset="20%" stopColor="#00ff85" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#ffc107" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Neon Flash Glow */}
            <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#00ff85" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#00ff85" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00ff85" stopOpacity="0" />
            </radialGradient>

            {/* Ground Shadow Gradient */}
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Crease line & Pitch Plane */}
          <path d="M 10 120 L 150 120" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 10 120 L 40 160 M 150 120 L 120 160" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

          {/* Stumps Base Shadows */}
          <g className="shadow-group">
            <ellipse cx="50" cy="120" rx="9" ry="2" fill="url(#groundShadow)" />
            <ellipse cx="80" cy="120" rx="9" ry="2" fill="url(#groundShadow)" />
            <ellipse cx="110" cy="120" rx="9" ry="2" fill="url(#groundShadow)" />
          </g>

          {/* Stumps & Bails 3D Wicket Group */}
          <g className="wicket-group">
            {/* Left Stump (Leg) */}
            <g className="stump stump-left" style={{ transformOrigin: '50px 120px' }}>
              <rect x="46" y="50" width="8" height="70" rx="3" fill="url(#stumpWood)" />
              <rect x="46" y="50" width="8" height="70" rx="3" fill="url(#woodVarnish)" />
              {/* Top dome of stump */}
              <ellipse cx="50" cy="50" rx="4" ry="1.5" fill="#fcd2a4" />
            </g>

            {/* Middle Stump */}
            <g className="stump stump-middle" style={{ transformOrigin: '80px 120px' }}>
              <rect x="76" y="50" width="8" height="70" rx="3" fill="url(#stumpWood)" />
              <rect x="76" y="50" width="8" height="70" rx="3" fill="url(#woodVarnish)" />
              <ellipse cx="80" cy="50" rx="4" ry="1.5" fill="#fcd2a4" />
            </g>

            {/* Right Stump (Off) */}
            <g className="stump stump-right" style={{ transformOrigin: '110px 120px' }}>
              <rect x="106" y="50" width="8" height="70" rx="3" fill="url(#stumpWood)" />
              <rect x="106" y="50" width="8" height="70" rx="3" fill="url(#woodVarnish)" />
              <ellipse cx="110" cy="50" rx="4" ry="1.5" fill="#fcd2a4" />
            </g>

            {/* Left Bail */}
            <g className="bail bail-left" style={{ transformOrigin: '65px 47px' }}>
              <rect x="47" y="44" width="31" height="5" rx="1.5" fill="url(#stumpWood)" />
              <rect x="47" y="44" width="31" height="5" rx="1.5" fill="url(#woodVarnish)" />
              <rect x="45" y="45.5" width="2" height="2" rx="0.5" fill="#8d5624" />
              <rect x="78" y="45.5" width="2" height="2" rx="0.5" fill="#8d5624" />
            </g>

            {/* Right Bail */}
            <g className="bail bail-right" style={{ transformOrigin: '95px 47px' }}>
              <rect x="82" y="44" width="31" height="5" rx="1.5" fill="url(#stumpWood)" />
              <rect x="82" y="44" width="31" height="5" rx="1.5" fill="url(#woodVarnish)" />
              <rect x="80" y="45.5" width="2" height="2" rx="0.5" fill="#8d5624" />
              <rect x="113" y="45.5" width="2" height="2" rx="0.5" fill="#8d5624" />
            </g>
          </g>

          {/* Impact Flash Elements */}
          <circle className="impact-blast-glow" cx="80" cy="55" r="28" fill="url(#impactGlow)" />
          <circle className="impact-shockwave" cx="80" cy="55" r="2" stroke="#00ff85" strokeWidth="2.5" fill="none" />

          {/* Flying Sparks (Exploding Neon Particles) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
            <g key={index} className="neon-spark-group" style={{ transform: `translate(80px, 55px) rotate(${angle}deg)` }}>
              <line className="neon-spark-line" x1="0" y1="0" x2="0" y2="-25" stroke="#00ff85" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}

          {/* Ball Group (Speed Trail + 3D Leather Spinning Ball) */}
          <g className="delivery-ball-group">
            {/* Speed tail trailing ball path */}
            <path className="ball-trail-path" d="M -150 -100 L 0 0" stroke="url(#ballTrail)" strokeWidth="16" strokeLinecap="round" />
            
            {/* 3D Ball Container */}
            <g className="ball-sphere-group">
              <circle cx="0" cy="0" r="10" fill="url(#leatherRed)" />
              
              {/* White stitching seam with spin */}
              <path d="M -9.2 -3 Q 0 5 9.2 3" stroke="#220000" strokeWidth="1.8" fill="none" opacity="0.6" />
              <path d="M -9 -2.5 Q 0 4.5 9 2.5" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="1.5 1.5" fill="none" />
              
              {/* Specular Gloss Spec */}
              <ellipse cx="-3.2" cy="-3.2" rx="4.5" ry="2.2" transform="rotate(-25 -3.2 -3.2)" fill="white" opacity="0.45" />
            </g>
          </g>
        </svg>
      </div>

      {/* Loading Info Text */}
      <h2 style={{
        fontFamily: "'Outfit', 'Inter', sans-serif",
        fontWeight: 900,
        fontSize: '2rem',
        letterSpacing: '3px',
        color: '#ffffff',
        margin: '0 0 8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textTransform: 'uppercase',
        zIndex: 2
      }}>
        PREDICTO<span style={{ color: 'var(--brand-emerald)', filter: 'drop-shadow(0 0 10px rgba(0, 255, 133, 0.5))' }}>11</span>
      </h2>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        margin: 0,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontWeight: 600,
        zIndex: 2
      }}>
        Next-Level Matchday Loading...
      </p>

      {/* Embedded Animations CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        /* 3-Second Loop Timeline */
        
        .delivery-ball-group {
          animation: deliverBall 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        .ball-sphere-group {
          animation: spinLeather 3s linear infinite;
        }

        .wicket-group {
          animation: shakeBase 3s ease-out infinite;
        }

        .stump-left {
          animation: flyLeftStump 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .stump-middle {
          animation: flyMiddleStump 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .stump-right {
          animation: flyRightStump 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .bail-left {
          animation: flyLeftBail 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .bail-right {
          animation: flyRightBail 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .shadow-group {
          animation: fadeShadows 3s ease-out infinite;
        }

        .impact-blast-glow {
          animation: triggerFlash 3s ease-out infinite;
        }

        .impact-shockwave {
          animation: triggerShockwave 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .neon-spark-group {
          animation: triggerSparks 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        /* Keyframes Definitions */

        /* 1. Ball Delivery Motion Path & Physics Scaling */
        @keyframes deliverBall {
          0% {
            transform: translate(145px, 20px) scale(0.1);
            opacity: 0;
          }
          10% {
            transform: translate(145px, 20px) scale(0.15);
            opacity: 0.9;
          }
          32% {
            transform: translate(80px, 55px) scale(1);
            opacity: 1;
          }
          33% {
            transform: translate(72px, 52px) scale(1.05); /* Slight compression on impact */
            opacity: 1;
          }
          45% {
            transform: translate(30px, 90px) scale(1.6); /* Deflected path */
            opacity: 0;
          }
          100% {
            transform: translate(30px, 90px) scale(1.6);
            opacity: 0;
          }
        }

        /* 2. Ball spin around axes */
        @keyframes spinLeather {
          0% {
            transform: rotate(0deg);
          }
          32% {
            transform: rotate(-360deg);
          }
          100% {
            transform: rotate(-720deg);
          }
        }

        /* 3. Screen/Wicket Base Shake */
        @keyframes shakeBase {
          0%, 31% {
            transform: translate(0, 0);
          }
          32% {
            transform: translate(-1.5px, 1px);
          }
          34% {
            transform: translate(1.5px, -1px);
          }
          36% {
            transform: translate(-1px, 0.5px);
          }
          38% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        /* 4. Left Stump (Leg) - Shakes and leans heavily */
        @keyframes flyLeftStump {
          0%, 31% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
          33% {
            transform: rotate(-15deg) translate(-2px, 0px);
            opacity: 1;
          }
          50% {
            transform: rotate(-22deg) translate(-5px, 1px);
            opacity: 1;
          }
          85% {
            transform: rotate(-22deg) translate(-5px, 1px);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
        }

        /* 5. Middle Stump - Blown backwards and spins vertically (using 3D transforms) */
        @keyframes flyMiddleStump {
          0%, 31% {
            transform: rotate(0deg) translate(0, 0) scale(1);
            opacity: 1;
          }
          32% {
            transform: rotate(-45deg) translate(-8px, -15px) scale(0.95);
            opacity: 1;
          }
          55% {
            transform: rotate(-180deg) translate(-28px, -45px) scale(0.85);
            opacity: 0.8;
          }
          75% {
            transform: rotate(-240deg) translate(-35px, -55px) scale(0.7);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0) scale(1);
            opacity: 0;
          }
        }

        /* 6. Right Stump (Off) - Flung outward to the right */
        @keyframes flyRightStump {
          0%, 31% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
          32% {
            transform: rotate(35deg) translate(8px, -8px);
            opacity: 1;
          }
          55% {
            transform: rotate(95deg) translate(35px, -25px);
            opacity: 0.8;
          }
          75% {
            transform: rotate(120deg) translate(50px, -35px);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
        }

        /* 7. Left Bail - Launches high up leftwards, spinning rapidly */
        @keyframes flyLeftBail {
          0%, 31% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
          32% {
            transform: rotate(-120deg) translate(-15px, -35px);
            opacity: 1;
          }
          55% {
            transform: rotate(-540deg) translate(-45px, -65px);
            opacity: 0.7;
          }
          75% {
            transform: rotate(-720deg) translate(-60px, -75px);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
        }

        /* 8. Right Bail - Launches high up rightwards, spinning rapidly */
        @keyframes flyRightBail {
          0%, 31% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
          32% {
            transform: rotate(120deg) translate(15px, -35px);
            opacity: 1;
          }
          55% {
            transform: rotate(540deg) translate(45px, -65px);
            opacity: 0.7;
          }
          75% {
            transform: rotate(720deg) translate(60px, -75px);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
        }

        /* 9. Stump Shadows fading during deflection */
        @keyframes fadeShadows {
          0%, 31% {
            opacity: 1;
          }
          33% {
            opacity: 0.45;
          }
          60% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        /* 10. Glowing Impact Flash */
        @keyframes triggerFlash {
          0%, 31% {
            opacity: 0;
            transform: scale(0.2);
          }
          32% {
            opacity: 1;
            transform: scale(1);
          }
          34% {
            opacity: 0.8;
            transform: scale(1.2);
          }
          45% {
            opacity: 0;
            transform: scale(1.6);
          }
          100% {
            opacity: 0;
          }
        }

        /* 11. Circular expanding shockwave ring */
        @keyframes triggerShockwave {
          0%, 31% {
            opacity: 0;
            transform: scale(0.1);
          }
          32% {
            opacity: 1;
            transform: scale(0.5);
            stroke-width: 3.5px;
          }
          48% {
            opacity: 0;
            transform: scale(3.5);
            stroke-width: 0.2px;
          }
          100% {
            opacity: 0;
          }
        }

        /* 12. Sparks explosion trail */
        @keyframes triggerSparks {
          0%, 31% {
            opacity: 0;
            transform: scale(0);
          }
          32% {
            opacity: 1;
            transform: scale(0.5);
          }
          48% {
            opacity: 0;
            transform: scale(1.8);
          }
          100% {
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
