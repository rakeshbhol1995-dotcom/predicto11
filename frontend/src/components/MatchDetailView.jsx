import React from 'react';
import { useBet } from '../context/BetContext';
import { ArrowLeft, Play, Clock, BarChart2 } from 'lucide-react';

export default function MatchDetailView({ match, onBack, oddsFlash }) {
  if (!match) return null;

  const { toggleSelection, selections, user } = useBet();

  const isSelected = (outcomeName, marketName = "Match Winner") => {
    return selections.some(
      (sel) => sel.matchId === match.id && sel.outcomeName === outcomeName && sel.market === marketName
    );
  };

  const getFlashClass = (outcomeKey) => {
    if (!oddsFlash || !oddsFlash[match.id]) return '';
    const direction = oddsFlash[match.id][outcomeKey];
    if (direction === 'up') return 'flash-up';
    if (direction === 'down') return 'flash-down';
    return '';
  };

  // Mock secondary markets based on primary odds to keep them reactive
  const hOdds = match.odds.home || 1.80;
  const aOdds = match.odds.away || 2.10;

  const markets = {
    handicap: [
      { outcome: `${match.homeTeam} -1.5`, odd: parseFloat((hOdds * 1.5).toFixed(2)) },
      { outcome: `${match.awayTeam} +1.5`, odd: parseFloat((aOdds * 0.75 + 0.5).toFixed(2)) }
    ],
    overUnder: [
      { outcome: 'Over 2.5 Goals', odd: parseFloat((1.55 + (hOdds * 0.1)).toFixed(2)) },
      { outcome: 'Under 2.5 Goals', odd: parseFloat((2.20 - (hOdds * 0.1)).toFixed(2)) }
    ],
    doubleChance: [
      { outcome: '1X (Home/Draw)', odd: parseFloat((1.10 + (hOdds * 0.05)).toFixed(2)) },
      { outcome: '12 (Home/Away)', odd: 1.25 },
      { outcome: 'X2 (Draw/Away)', odd: parseFloat((1.15 + (aOdds * 0.05)).toFixed(2)) }
    ],
    correctScore: [
      { outcome: '1 - 0', odd: 6.50 },
      { outcome: '2 - 0', odd: 8.00 },
      { outcome: '2 - 1', odd: 9.50 },
      { outcome: '0 - 0', odd: 11.00 },
      { outcome: '1 - 1', odd: 7.00 },
      { outcome: '0 - 1', odd: 7.50 }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', height: '100%', overflowY: 'auto' }}>
      {/* Breadcrumbs / Back Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: '#ffffff',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={14} /> Back to Schedule
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {match.sport} • {match.league}
        </span>
      </div>

      {/* Main Game Banner Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-teal-nav) 0%, #0c1815 100%)',
        border: '1.5px solid var(--brand-emerald)',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(5, 196, 139, 0.15)'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: 'var(--brand-emerald)',
          filter: 'blur(50px)',
          opacity: 0.3
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 'bold', 
            backgroundColor: match.status === 'live' ? 'var(--live-red)' : 'rgba(255,255,255,0.1)', 
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {match.status === 'live' && <Play size={10} fill="#ffffff" />}
            {match.status === 'live' ? 'IN-PLAY' : 'UPCOMING'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {match.time}
          </span>
        </div>

        {/* Scores & Team Names */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '12px 0' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{match.homeTeam}</h2>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '8px 24px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-yellow)' }}>{match.homeScore}</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>VS</span>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-yellow)' }}>{match.awayScore}</span>
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{match.awayTeam}</h2>
          </div>
        </div>

        {/* Live event action text ticker */}
        <div style={{ 
          marginTop: '16px', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          padding: '8px 12px', 
          borderRadius: '6px', 
          fontSize: '0.8rem',
          textAlign: 'center',
          color: 'var(--brand-emerald)',
          borderLeft: '3px solid var(--brand-emerald)'
        }}>
          ⚽ Event Update: **{match.eventStatus}**
        </div>
      </div>

      {/* Expanded Markets Section */}
      {!user && (
        <div style={{
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid #ff9800',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          🔒 Please **Log In** or **Join** Predicto11 to enable odds betting cards.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
          Available Markets
        </h3>

        {/* Market 1: Match Winner */}
        <div className="card-panel" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Full Time Match Winner (1X2)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div 
              className={`odds-cell ${isSelected(match.homeTeam) ? 'selected' : ''} ${getFlashClass('home')}`}
              onClick={() => toggleSelection(match, match.homeTeam, match.odds.home)}
              style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
            >
              <span className="odds-lbl">1 (Home Win)</span>
              <span className="odds-val">{match.odds.home?.toFixed(2) || 'LOCKED'}</span>
            </div>

            {match.odds.draw !== null ? (
              <div 
                className={`odds-cell ${isSelected('Draw') ? 'selected' : ''} ${getFlashClass('draw')}`}
                onClick={() => toggleSelection(match, 'Draw', match.odds.draw)}
                style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
              >
                <span className="odds-lbl">X (Draw)</span>
                <span className="odds-val">{match.odds.draw?.toFixed(2)}</span>
              </div>
            ) : (
              <div className="odds-cell" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <span className="odds-lbl">X (Draw)</span>
                <span className="odds-val">—</span>
              </div>
            )}

            <div 
              className={`odds-cell ${isSelected(match.awayTeam) ? 'selected' : ''} ${getFlashClass('away')}`}
              onClick={() => toggleSelection(match, match.awayTeam, match.odds.away)}
              style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
            >
              <span className="odds-lbl">2 (Away Win)</span>
              <span className="odds-val">{match.odds.away?.toFixed(2) || 'LOCKED'}</span>
            </div>
          </div>
        </div>

        {/* Market 2: Asian Handicap */}
        <div className="card-panel" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Asian Handicap Spread</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {markets.handicap.map((opt, i) => (
              <div
                key={i}
                className={`odds-cell ${isSelected(opt.outcome, 'Asian Handicap') ? 'selected' : ''}`}
                onClick={() => toggleSelection(match, opt.outcome, opt.odd, 'Asian Handicap')}
                style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
              >
                <span className="odds-lbl">{opt.outcome}</span>
                <span className="odds-val">{opt.odd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market 3: Goals Over/Under */}
        <div className="card-panel" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Total Goals (Over / Under 2.5)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {markets.overUnder.map((opt, i) => (
              <div
                key={i}
                className={`odds-cell ${isSelected(opt.outcome, 'Over/Under Goals') ? 'selected' : ''}`}
                onClick={() => toggleSelection(match, opt.outcome, opt.odd, 'Over/Under Goals')}
                style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
              >
                <span className="odds-lbl">{opt.outcome}</span>
                <span className="odds-val">{opt.odd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market 4: Double Chance */}
        <div className="card-panel" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Double Chance</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {markets.doubleChance.map((opt, i) => (
              <div
                key={i}
                className={`odds-cell ${isSelected(opt.outcome, 'Double Chance') ? 'selected' : ''}`}
                onClick={() => toggleSelection(match, opt.outcome, opt.odd, 'Double Chance')}
                style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
              >
                <span className="odds-lbl">{opt.outcome}</span>
                <span className="odds-val">{opt.odd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market 5: Correct Score */}
        <div className="card-panel" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Correct Game Score</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {markets.correctScore.map((opt, i) => (
              <div
                key={i}
                className={`odds-cell ${isSelected(opt.outcome, 'Correct Score') ? 'selected' : ''}`}
                onClick={() => toggleSelection(match, opt.outcome, opt.odd, 'Correct Score')}
                style={{ opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
              >
                <span className="odds-lbl">Score: {opt.outcome}</span>
                <span className="odds-val">{opt.odd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
