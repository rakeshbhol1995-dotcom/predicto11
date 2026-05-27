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
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(5,196,139,0.18) 0%, transparent 70%)',
        top: '15%',
        left: '5%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(255,193,7,0.12) 0%, transparent 70%)',
        bottom: '15%',
        right: '5%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Animation Container */}
      <div className="preloader-animation-box" style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {/* Bats & Ball SVG Graphic */}
        <svg width="200" height="200" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          {/* Defs for gradients, patterns, and shadows */}
          <defs>
            {/* 3D Wood Face Gradients */}
            <linearGradient id="woodFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eed0ad" />
              <stop offset="25%" stopColor="#dfbd96" />
              <stop offset="60%" stopColor="#d2aa7c" />
              <stop offset="85%" stopColor="#c59969" />
              <stop offset="100%" stopColor="#b68a57" />
            </linearGradient>

            {/* Fine Wood Grain Overlay Pattern */}
            <pattern id="woodGrains" width="12" height="120" patternUnits="userSpaceOnUse">
              <line x1="2" y1="0" x2="2" y2="120" stroke="#785329" strokeWidth="0.4" opacity="0.18" />
              <line x1="5" y1="0" x2="5" y2="120" stroke="#5c3c18" strokeWidth="0.3" opacity="0.25" />
              <line x1="9" y1="0" x2="9" y2="120" stroke="#482e10" strokeWidth="0.5" opacity="0.12" />
            </pattern>

            {/* Rubber Grip Gradient with highlights */}
            <linearGradient id="gripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="35%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="65%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Holographic Sticker Gradient */}
            <linearGradient id="stickerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff85" />
              <stop offset="30%" stopColor="#00b4d8" />
              <stop offset="70%" stopColor="#ffb703" />
              <stop offset="100%" stopColor="#00ff85" />
            </linearGradient>

            {/* 3D Ball Spherical Gradient */}
            <radialGradient id="ball3DGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="35%" stopColor="#cc0606" />
              <stop offset="75%" stopColor="#8d0000" />
              <stop offset="100%" stopColor="#470000" />
            </radialGradient>

            {/* Ball Lacquer Specular Shine */}
            <radialGradient id="shineGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Impact Flash Glow */}
            <radialGradient id="impactFlashGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#00ff85" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#00ff85" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00ff85" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dynamic Collision Elements (Impact Glow & Expanding Ring) */}
          <circle className="impact-flash" cx="60" cy="80" r="22" fill="url(#impactFlashGrad)" />
          <circle className="impact-ring" cx="60" cy="80" r="2" stroke="#00ff85" strokeWidth="2" fill="none" />

          {/* Spark Particles (8 Exploding Lines) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
            <g key={index} className="spark-group" style={{ transform: `translate(60px, 80px) rotate(${angle}deg)` }}>
              <line className="spark-line" x1="0" y1="0" x2="0" y2="-20" stroke="#00ff85" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))}

          {/* Cricket Ball Group (Path, 3D shading, Curved Seam & Spin) */}
          <g className="loading-cricket-ball-group">
            <g className="ball-spin-container">
              {/* Ball shadow on itself */}
              <circle cx="0" cy="0" r="9" fill="url(#ball3DGrad)" />
              
              {/* Curving Leather Seam (Stitch Shadows, Base & Thread dashes) */}
              <path d="M -8.2 -4.2 Q 0 5 8.2 5" stroke="#2a0000" strokeWidth="1.5" fill="none" opacity="0.65" />
              <path d="M -8 -4 Q 0 4 8 4" stroke="#ffb3b3" strokeWidth="1.2" fill="none" />
              <path d="M -8 -4 Q 0 4 8 4" stroke="#ffffff" strokeWidth="0.9" strokeDasharray="1.8 1.4" fill="none" />
              
              {/* Spherical specular highlight (Shiny Lacquer) */}
              <ellipse cx="-2.8" cy="-2.8" rx="4.2" ry="2.2" transform="rotate(-30 -2.8 -2.8)" fill="url(#shineGrad)" opacity="0.7" />
            </g>
          </g>

          {/* Cricket Bat Group (Centered & Swung from top-handle pivot) */}
          <g className="loading-cricket-bat" style={{ transformOrigin: '60px 20px' }}>
            {/* Grip handle cap */}
            <ellipse cx="60" cy="18" rx="2.2" ry="0.8" fill="#0f172a" />
            
            {/* Textured neon accent Rubber Grip */}
            <rect x="58" y="18" width="4" height="32" rx="1.2" fill="url(#gripGrad)" />
            {/* Handle wrapped rings for grip lines */}
            {[23, 27, 31, 35, 39, 43, 47].map((y) => (
              <line key={y} x1="58" y1={y} x2="62" y2={y} stroke="#000000" strokeWidth="0.4" opacity="0.35" />
            ))}
            
            {/* Handle collar/transition */}
            <rect x="57.5" y="49.5" width="5" height="1.2" rx="0.4" fill="#0f172a" />

            {/* Wooden Blade base */}
            <path d="M57,50 Q52,52 52,56 L52,100 Q52,104 60,104 Q68,104 68,100 L68,56 Q68,52 63,50 Z" fill="url(#woodFaceGrad)" />
            {/* Wood Grain textures */}
            <path d="M57,50 Q52,52 52,56 L52,100 Q52,104 60,104 Q68,104 68,100 L68,56 Q68,52 63,50 Z" fill="url(#woodGrains)" />

            {/* 3D Spine / Dark Side Shading (Right) */}
            <path d="M60,50 L63,50 Q68,52 68,56 L68,100 Q68,104 60,104 Z" fill="#000000" opacity="0.16" style={{ mixBlendMode: 'multiply' }} />
            {/* 3D Edge Highlight (Left) */}
            <path d="M60,50 L57,50 Q52,52 52,56 L52,100 Q52,104 60,104 Z" fill="#ffffff" opacity="0.12" style={{ mixBlendMode: 'overlay' }} />

            {/* Holographic Sticker */}
            <rect x="58.2" y="55" width="3.6" height="30" rx="0.8" fill="url(#stickerGrad)" />
            
            {/* Dynamic Moving Shiny Sheen across the sticker */}
            <path d="M58.2,65 L61.8,60 M58.2,75 L61.8,70" stroke="#ffffff" strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />

            {/* Micro branding inside the sticker */}
            <text x="60" y="64" fill="#ffffff" fontSize="2.8" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif" letterSpacing="0.2">P</text>
            <text x="60" y="71" fill="#ffffff" fontSize="2.8" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif" letterSpacing="0.2">1</text>
            <text x="60" y="78" fill="#ffffff" fontSize="2.8" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif" letterSpacing="0.2">1</text>
          </g>
        </svg>

        {/* Orbit ring around the loader */}
        <div style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          border: '1px dashed rgba(5,196,139,0.18)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(5,196,139,0.03)',
          animation: 'rotateOrbit 10s linear infinite',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Branding Info */}
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
        textTransform: 'uppercase'
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

        .preloader-animation-box {
          animation: shakeScreen 1.8s cubic-bezier(.36,.07,.19,.97) infinite;
        }

        .loading-cricket-bat {
          animation: swingBat 1.8s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        .loading-cricket-ball-group {
          animation: flyBall 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        .ball-spin-container {
          animation: spinBall 1.8s linear infinite;
        }

        .impact-flash {
          animation: flashEffect 1.8s ease-out infinite;
        }

        .impact-ring {
          animation: ringEffect 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .spark-group {
          animation: sparksEffect 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        @keyframes swingBat {
          0% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(-55deg); /* Professional wind-up backlift */
          }
          38% {
            transform: rotate(-55deg); /* Hold backlift briefly */
          }
          45% {
            transform: rotate(8deg); /* Downswing and impact frame */
          }
          58% {
            transform: rotate(40deg); /* High follow-through */
          }
          80% {
            transform: rotate(0deg); /* Return to stance */
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes flyBall {
          0%, 8% {
            transform: translate(130px, 15px) scale(0.1);
            opacity: 0;
            filter: blur(1.5px);
          }
          12% {
            transform: translate(130px, 15px) scale(0.2);
            opacity: 0.9;
            filter: blur(0px);
          }
          45% {
            transform: translate(60px, 80px) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          46% {
            transform: translate(56px, 83px) scale(1.05);
            opacity: 1;
            filter: blur(0px);
          }
          68% {
            transform: translate(-30px, 140px) scale(5);
            opacity: 0;
            filter: blur(8px); /* Zoom and camera motion blur */
          }
          100% {
            transform: translate(-30px, 140px) scale(5);
            opacity: 0;
          }
        }

        @keyframes spinBall {
          0%, 10% {
            transform: rotate(0deg);
          }
          45% {
            transform: rotate(-240deg); /* Spin in flight */
          }
          68% {
            transform: rotate(-960deg); /* Spin faster after off-bat deflection */
          }
          100% {
            transform: rotate(-960deg);
          }
        }

        @keyframes flashEffect {
          0%, 44% {
            opacity: 0;
            transform: scale(0.2);
          }
          45% {
            opacity: 1;
            transform: scale(1);
          }
          47% {
            opacity: 0.8;
            transform: scale(1.3);
          }
          56% {
            opacity: 0;
            transform: scale(1.8);
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes ringEffect {
          0%, 44% {
            opacity: 0;
            transform: scale(0.1);
          }
          45% {
            opacity: 1;
            transform: scale(0.5);
            stroke-width: 2.5px;
          }
          56% {
            opacity: 0;
            transform: scale(3.5);
            stroke-width: 0.2px;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes sparksEffect {
          0%, 44% {
            opacity: 0;
            transform: scale(0);
          }
          45% {
            opacity: 1;
            transform: scale(0.4);
          }
          54% {
            opacity: 0;
            transform: scale(1.4);
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes shakeScreen {
          0%, 44.5% {
            transform: translate(0, 0) rotate(0deg);
          }
          45% {
            transform: translate(-2px, 1.5px) rotate(-0.5deg);
          }
          46% {
            transform: translate(2px, -1.5px) rotate(0.5deg);
          }
          47% {
            transform: translate(-1.5px, -2px) rotate(0deg);
          }
          48% {
            transform: translate(1.5px, 1.5px) rotate(0.3deg);
          }
          49% {
            transform: translate(-1px, 0.5px) rotate(-0.2deg);
          }
          50% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
      `}} />
    </div>
  );
}

