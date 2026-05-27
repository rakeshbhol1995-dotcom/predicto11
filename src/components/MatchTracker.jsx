import React, { useEffect, useState } from 'react';
import { Shield, Zap, RefreshCw } from 'lucide-react';

export default function MatchTracker({ match }) {
  if (!match) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <RefreshCw size={24} style={{ marginBottom: '12px', animation: 'spin 4s linear infinite', color: 'var(--brand-yellow)' }} />
        <p style={{ fontSize: '0.85rem' }}>Select any live match to view live match tracker and real-time statistics.</p>
      </div>
    );
  }

  // Generate random movement position for the ball/puck indicator
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Animate ball position updates randomly to represent live play action
    const interval = setInterval(() => {
      setBallPos({
        x: Math.floor(Math.random() * 60) + 20, // 20% to 80%
        y: Math.floor(Math.random() * 60) + 20
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 4000);

    return () => clearInterval(interval);
  }, [match.id]);

  // Extract stats
  const homeStat = match.stats?.possession?.[0] || 50;
  const awayStat = match.stats?.possession?.[1] || 50;
  
  const homeShots = match.stats?.shots?.[0] || 0;
  const awayShots = match.stats?.shots?.[1] || 0;
  const totalShots = homeShots + awayShots || 1;
  const homeShotsPercent = Math.round((homeShots / totalShots) * 100);

  const homeCorners = match.stats?.corners?.[0] || 0;
  const awayCorners = match.stats?.corners?.[1] || 0;
  const totalCorners = homeCorners + awayCorners || 1;
  const homeCornersPercent = Math.round((homeCorners / totalCorners) * 100);

  return (
    <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <div>
          <span style={{
            fontSize: '0.65rem',
            backgroundColor: 'rgba(0, 255, 133, 0.15)',
            color: 'var(--live-green)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            LIVE MATCH TRACKER
          </span>
          <h4 style={{ fontSize: '0.9rem', marginTop: '4px' }}>{match.homeTeam} v {match.awayTeam}</h4>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-yellow)', fontFamily: 'var(--font-display)' }}>
          {match.homeScore} - {match.awayScore}
        </div>
      </div>

      {/* Visual Pitch */}
      <div className="pitch-container" style={{
        background: match.sport === 'Tennis' 
          ? 'linear-gradient(135deg, #104c64 0%, #0d384a 100%)' // Tennis Blue/Green Court
          : match.sport === 'Esports' 
          ? 'linear-gradient(135deg, #2b2e4a 0%, #1a1a2e 100%)' // Cyber Dark CS Map
          : match.sport === 'Basketball'
          ? 'linear-gradient(135deg, #bc7a3e 0%, #875122 100%)' // Hardwood Court
          : 'linear-gradient(135deg, #1d6e3d 0%, #15512b 100%)' // Cricket/Soccer Field
      }}>
        {/* Draw Pitch Markings depending on Sport */}
        {match.sport === 'Soccer' && (
          <>
            <div className="pitch-lines" />
            <div className="pitch-center-line" />
            <div className="pitch-center-circle" />
            <div className="pitch-penalty-area-l" />
            <div className="pitch-penalty-area-r" />
          </>
        )}

        {match.sport === 'Cricket' && (
          <svg width="100%" height="100%" viewBox="0 0 240 150" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
            <defs>
              <linearGradient id="stumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="wicketSoil" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b49372" />
                <stop offset="20%" stopColor="#dfbd99" />
                <stop offset="50%" stopColor="#eed0b0" />
                <stop offset="80%" stopColor="#dfbd99" />
                <stop offset="100%" stopColor="#9a7b5a" />
              </linearGradient>
            </defs>

            {/* Alternating mowed turf striping */}
            <circle cx="120" cy="75" r="70" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="18" />
            <circle cx="120" cy="75" r="50" fill="none" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="12" />

            {/* Boundary Rope with rope dashes */}
            <ellipse cx="120" cy="75" rx="104" ry="64" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" strokeDasharray="5 3" fill="none" />
            <ellipse cx="120" cy="75" rx="104.5" ry="64.5" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1" fill="none" />

            {/* 30-Yard Circle */}
            <ellipse cx="120" cy="75" rx="76" ry="46" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" strokeDasharray="3 4" fill="none" />

            {/* Pitch (turf wicket) */}
            <g transform="translate(120, 75) rotate(90)">
              {/* Clay base */}
              <rect x="-7" y="-22" width="14" height="44" fill="url(#wicketSoil)" rx="1" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
              
              {/* Crease lines */}
              <line x1="-7" y1="-16" x2="7" y2="-16" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
              <line x1="-7" y1="16" x2="7" y2="16" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
              <line x1="-4" y1="-22" x2="-4" y2="-16" stroke="#ffffff" strokeWidth="0.4" opacity="0.6" />
              <line x1="4" y1="-22" x2="4" y2="-16" stroke="#ffffff" strokeWidth="0.4" opacity="0.6" />
              <line x1="-4" y1="16" x2="-4" y2="22" stroke="#ffffff" strokeWidth="0.4" opacity="0.6" />
              <line x1="4" y1="16" x2="4" y2="22" stroke="#ffffff" strokeWidth="0.4" opacity="0.6" />

              {/* 3D Stumps */}
              {/* Top Wickets */}
              <g transform="translate(0, -18)">
                <rect x="-2.0" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="-0.2" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="1.5" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="-2.2" y="-0.6" width="4.4" height="0.2" fill="#92400e" rx="0.1" />
              </g>
              {/* Bottom Wickets */}
              <g transform="translate(0, 18)">
                <rect x="-2.0" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="-0.2" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="1.5" y="-0.4" width="0.5" height="0.8" fill="url(#stumpWood)" />
                <rect x="-2.2" y="-0.6" width="4.4" height="0.2" fill="#92400e" rx="0.1" />
              </g>
            </g>
          </svg>
        )}

        {match.sport === 'Tennis' && (
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Outer court border */}
            <rect x="10%" y="15%" width="80%" height="70%" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            {/* Singles lines */}
            <line x1="10%" y1="24%" x2="90%" y2="24%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="10%" y1="76%" x2="90%" y2="76%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            {/* Net line in the middle */}
            <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
            {/* Service boxes */}
            <line x1="28%" y1="24%" x2="28%" y2="76%" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <line x1="72%" y1="24%" x2="72%" y2="76%" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <line x1="28%" y1="50%" x2="72%" y2="50%" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
          </svg>
        )}

        {match.sport === 'Basketball' && (
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Court border */}
            <rect x="5%" y="6%" width="90%" height="88%" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            {/* Center line and circle */}
            <line x1="50%" y1="6%" x2="50%" y2="94%" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <circle cx="50%" cy="50%" r="16%" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            {/* Three point arcs */}
            <path d="M 5%,28% A 26%,26% 0 0,1 5%,72%" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            <path d="M 95%,28% A 26%,26% 0 0,0 95%,72%" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            {/* Key areas */}
            <rect x="5%" y="37%" width="16%" height="26%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            <rect x="79%" y="37%" width="16%" height="26%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
          </svg>
        )}

        {/* Dynamic Ball Position Tracker */}
        <div style={{
          position: 'absolute',
          left: `${ballPos.x}%`,
          top: `${ballPos.y}%`,
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: match.sport === 'Tennis' 
            ? 'radial-gradient(circle at 35% 35%, #e1ff26 0%, #b5ce00 45%, #768700 85%, #465100 100%)' // realistic tennis ball yellow
            : match.sport === 'Cricket'
            ? 'radial-gradient(circle at 35% 35%, #ff4d4d 0%, #cc0606 40%, #8d0000 85%, #470000 100%)' // 3D cherry red cricket ball
            : 'radial-gradient(circle at 35% 35%, #ffffff 0%, #d4d4d4 40%, #8a8a8a 85%, #444444 100%)', // 3D ball
          boxShadow: match.sport === 'Tennis'
            ? '0 0 10px 3px rgba(225,255,38,0.5)'
            : match.sport === 'Cricket'
            ? '0 0 10px 3px rgba(255,77,77,0.45)'
            : '0 0 8px 2px rgba(255,255,255,0.45)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {match.sport === 'Cricket' && (
            <div style={{
              width: '100%',
              height: '1.2px',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 0.5px 0.5px rgba(0,0,0,0.3)',
              transform: 'rotate(45deg)'
            }} />
          )}
        </div>

        {/* Event Status overlay overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: '4px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 5
        }}>
          <Zap size={14} style={{ color: 'var(--brand-yellow)', animation: pulse ? 'bounce 0.5s infinite' : 'none' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
            {match.eventStatus || "Game in progress"}
          </span>
        </div>
      </div>

      {/* Match Statistics & Sports Specific Scoreboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
        
        {/* CASE 1: Cricket Scoreboard */}
        {match.sport === 'Cricket' && (() => {
          const awayParts = match.awayScore.split('/');
          const cRuns = parseInt(awayParts[0]) || 0;
          const cWickets = parseInt(awayParts[1]) || 0;
          const cOvers = match.time || "0.0";
          const ovSplit = cOvers.split(' ')[0].split('.');
          const completedOvers = parseInt(ovSplit[0]) || 0;
          const currentBalls = parseInt(ovSplit[1]) || 0;
          const ballsBowled = (completedOvers * 6) + currentBalls;
          const crr = ballsBowled > 0 ? ((cRuns / ballsBowled) * 6).toFixed(2) : "0.00";
          
          const target = 175;
          const runsNeeded = target - cRuns;
          const ballsRemaining = Math.max(0, 120 - ballsBowled);
          const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : "0.00";

          // Generate simulated delivery sequence (last 6 balls)
          const lastBalls = [1, 4, 'W', 0, 6, 1];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Detailed Live Board */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CURRENT RUN RATE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-yellow)' }}>{crr}</div>
                </div>
                <div style={{ paddingLeft: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>REQUIRED RUN RATE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--live-red)' }}>{rrr}</div>
                </div>
              </div>

              {/* Batsmen / Bowler Board */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  <span>Batsman</span>
                  <span>R (B)</span>
                  <span>4s / 6s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--brand-yellow)' }}>R. Gaikwad *</span>
                  <span>58 (42)</span>
                  <span>4 / 2</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>S. Dube</span>
                  <span>14 (9)</span>
                  <span>1 / 1</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '8px 0 4px 0', padding: '4px 0', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  <span>Bowler</span>
                  <span>O-M-R-W</span>
                  <span>Econ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>J. Bumrah</span>
                  <span>3.2 - 0 - 24 - 2</span>
                  <span>7.20</span>
                </div>
              </div>

              {/* Delivery log */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>THIS OVER:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {lastBalls.map((b, idx) => (
                    <span key={idx} style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: b === 'W' ? 'var(--live-red)' : b === 4 || b === 6 ? 'var(--brand-emerald)' : 'rgba(255,255,255,0.1)',
                      color: b === 'W' || b === 4 || b === 6 ? '#080a0f' : '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* CASE 2: Tennis Scoreboard */}
        {match.sport === 'Tennis' && (() => {
          const homeSplit = match.homeScore.split('|');
          const p1Sets = homeSplit[0]?.trim() || "0";
          const p1Points = homeSplit[1]?.trim() || "0";

          const awaySplit = match.awayScore.split('|');
          const p2Sets = awaySplit[0]?.trim() || "0";
          const p2Points = awaySplit[1]?.trim() || "0";

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px' }}>PLAYERS</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>S1</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>S2</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>S3</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center', color: 'var(--brand-yellow)' }}>PT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--brand-emerald)', borderRadius: '50%', display: 'inline-block' }} />
                      {match.homeTeam}
                    </td>
                    <td style={{ textAlign: 'center' }}>6</td>
                    <td style={{ textAlign: 'center' }}>4</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{p1Sets}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--brand-yellow)' }}>{p1Points}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                      {match.awayTeam}
                    </td>
                    <td style={{ textAlign: 'center' }}>3</td>
                    <td style={{ textAlign: 'center' }}>6</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{p2Sets}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--brand-yellow)' }}>{p2Points}</td>
                  </tr>
                </tbody>
              </table>

              {/* Match Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span>First Serve %</span>
                    <span>68% vs 61%</span>
                  </div>
                  <div style={{ display: 'flex', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '68%', backgroundColor: 'var(--brand-emerald)' }} />
                    <div style={{ width: '32%', backgroundColor: '#666' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span>Aces / Double Faults</span>
                    <span>8 / 2 vs 5 / 4</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CASE 3: General Sport Stats (Soccer, Basketball, Esports) */}
        {match.sport !== 'Cricket' && match.sport !== 'Tennis' && (
          <>
            {/* Possession */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>Possession</span>
                <span>{homeStat}% vs {awayStat}%</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${homeStat}%`, backgroundColor: 'var(--brand-yellow)', transition: 'width 0.5s ease' }} />
                <div style={{ width: `${awayStat}%`, backgroundColor: '#e0e0e0', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Shots */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>{match.sport === 'Esports' ? 'Kills' : 'Dangerous Attacks'}</span>
                <span>{homeShots} vs {awayShots}</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${homeShotsPercent}%`, backgroundColor: 'var(--brand-teal-nav)', transition: 'width 0.5s ease' }} />
                <div style={{ width: `${100 - homeShotsPercent}%`, backgroundColor: '#757575', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Corners */}
            {match.sport === 'Soccer' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>Corners</span>
                  <span>{homeCorners} vs {awayCorners}</span>
                </div>
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ width: `${homeCornersPercent}%`, backgroundColor: 'var(--live-green)', transition: 'width 0.5s ease' }} />
                  <div style={{ width: `${100 - homeCornersPercent}%`, backgroundColor: '#9e9e9e', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
