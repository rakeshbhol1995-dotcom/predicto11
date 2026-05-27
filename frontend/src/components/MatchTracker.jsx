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
          <>
            <div style={{
              position: 'absolute',
              width: '90%',
              height: '90%',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              width: '24px',
              height: '80px',
              backgroundColor: '#e6a46e', // Wicket Pitch color
              border: '1px solid rgba(255,255,255,0.2)',
              transform: 'rotate(90deg)'
            }} />
          </>
        )}

        {match.sport === 'Tennis' && (
          <>
            <div style={{
              position: 'absolute',
              width: '80%',
              height: '70%',
              border: '2px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ height: '100%', borderLeft: '2px solid rgba(255,255,255,0.25)' }} />
              <div style={{ position: 'absolute', width: '100%', borderBottom: '1.5px solid rgba(255,255,255,0.25)' }} />
            </div>
          </>
        )}

        {/* Dynamic Ball Position Tracker */}
        <div style={{
          position: 'absolute',
          left: `${ballPos.x}%`,
          top: `${ballPos.y}%`,
          width: '12px',
          height: '12px',
          backgroundColor: match.sport === 'Tennis' ? '#ccff00' : '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 10px 4px rgba(255,255,255,0.4)',
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 4
        }} />

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

      {/* Match Statistics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
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
            <span>{match.sport === 'Cricket' ? 'Runs / Overs' : match.sport === 'Tennis' ? 'Aces' : 'Dangerous Attacks'}</span>
            <span>{homeShots} vs {awayShots}</span>
          </div>
          <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${homeShotsPercent}%`, backgroundColor: 'var(--brand-teal-nav)', transition: 'width 0.5s ease' }} />
            <div style={{ width: `${100 - homeShotsPercent}%`, backgroundColor: '#757575', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Corners */}
        {match.sport !== 'Tennis' && match.sport !== 'Cricket' && (
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
      </div>
    </div>
  );
}
