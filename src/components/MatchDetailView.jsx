import React from 'react';
import { useBet } from '../context/BetContext';
import { ArrowLeft, Play, Clock, BarChart2 } from 'lucide-react';

export default function MatchDetailView({ match, onBack, oddsFlash, onOddsAdded }) {
  if (!match) return null;

  const { toggleSelection, selections, user } = useBet();

  const handleOddsClick = (outcomeName, oddValue, betType = 'back', marketName = "Match Winner") => {
    if (!user || oddValue === null) return;
    const alreadySelected = selections.some(
      (sel) => sel.matchId === match.id && sel.outcomeName === outcomeName && sel.market === marketName && sel.betType === betType
    );
    toggleSelection(match, outcomeName, oddValue, betType, marketName);
    if (!alreadySelected && onOddsAdded) {
      onOddsAdded();
    }
  };

  const isSelected = (outcomeName, betType = 'back', marketName = "Match Winner") => {
    return selections.some(
      (sel) => sel.matchId === match.id && sel.outcomeName === outcomeName && sel.market === marketName && sel.betType === betType
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
    <div className="match-detail-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', height: '100%', overflowY: 'auto' }}>
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

      {/* 📊 Head-to-Head (H2H) Analytics Dashboard */}
      <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
          <BarChart2 size={16} style={{ color: 'var(--brand-yellow)' }} />
          Head-to-Head (H2H) Analytics Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          {/* Win Probability donuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Win Probability Projection</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              
              {/* Circular SVG Donut chart for win probability */}
              <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
                <svg width="70" height="70" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3"/>
                  
                  {/* Segment 1: Home Win (58%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--brand-emerald)" strokeWidth="3.5"
                          strokeDasharray="58 42" strokeDashoffset="25"/>
                  
                  {/* Segment 2: Away Win (32%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--brand-yellow)" strokeWidth="3.5"
                          strokeDasharray="32 68" strokeDashoffset="-33"/>
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  58%
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-emerald)' }} />
                  <span>{match.homeTeam} (58%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <span>Draw / Tie (10%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-yellow)' }} />
                  <span>{match.awayTeam} (32%)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Streaks (Dots) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Recent Form Streak (Last 5 Games)</span>
            
            {/* Home Streak */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600, minWidth: '70px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={match.homeTeam}>{match.homeTeam}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['W', 'W', 'D', 'L', 'W'].map((val, idx) => (
                  <span key={idx} style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: val === 'W' ? 'rgba(5, 196, 139, 0.15)' : val === 'L' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(255,255,255,0.08)',
                    color: val === 'W' ? 'var(--brand-emerald)' : val === 'L' ? 'var(--live-red)' : 'var(--text-muted)',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} title={val === 'W' ? 'Win' : val === 'L' ? 'Loss' : 'Draw'}>
                    {val}
                  </span>
                ))}
              </div>
            </div>

            {/* Away Streak */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600, minWidth: '70px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={match.awayTeam}>{match.awayTeam}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['L', 'W', 'W', 'W', 'L'].map((val, idx) => (
                  <span key={idx} style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: val === 'W' ? 'rgba(5, 196, 139, 0.15)' : val === 'L' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(255,255,255,0.08)',
                    color: val === 'W' ? 'var(--brand-emerald)' : val === 'L' ? 'var(--live-red)' : 'var(--text-muted)',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} title={val === 'W' ? 'Win' : val === 'L' ? 'Loss' : 'Draw'}>
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Scoreboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Previous Matches Played</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Oct 2025:</span>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{match.homeTeam} 2 - 1 {match.awayTeam}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mar 2025:</span>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{match.homeTeam} 1 - 3 {match.awayTeam}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dec 2024:</span>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{match.homeTeam} 0 - 0 {match.awayTeam}</span>
              </div>
            </div>
          </div>

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
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Full Time Match Winner (1X2)</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Home Outcome Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{match.homeTeam} (1)</span>
              <div style={{ display: 'flex', gap: '6px', width: '160px' }}>
                <button 
                  className={`odds-btn odds-btn-back ${isSelected(match.homeTeam, 'back') ? 'odds-btn-selected' : ''} ${getFlashClass('home')}`}
                  onClick={() => handleOddsClick(match.homeTeam, match.odds.home, 'back')}
                  disabled={!user || !match.odds.home}
                  style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  <span className="odds-label" style={{ fontSize: '0.55rem', color: '#80d8ff' }}>Back</span>
                  <span className="odds-value" style={{ fontSize: '0.78rem' }}>{match.odds.home?.toFixed(2) || 'LOCKED'}</span>
                </button>
                <button 
                  className={`odds-btn odds-btn-lay ${isSelected(match.homeTeam, 'lay') ? 'odds-btn-selected' : ''} ${getFlashClass('home')}`}
                  onClick={() => {
                    const layOdds = match.odds.home ? parseFloat((match.odds.home + 0.05).toFixed(2)) : null;
                    handleOddsClick(match.homeTeam, layOdds, 'lay');
                  }}
                  disabled={!user || !match.odds.home}
                  style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  <span className="odds-label" style={{ fontSize: '0.55rem', color: '#ff80ab' }}>Lay</span>
                  <span className="odds-value" style={{ fontSize: '0.78rem' }}>{match.odds.home ? (match.odds.home + 0.05).toFixed(2) : 'LOCKED'}</span>
                </button>
              </div>
            </div>

            {/* Draw Outcome Row */}
            {match.odds.draw !== null && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Draw (X)</span>
                <div style={{ display: 'flex', gap: '6px', width: '160px' }}>
                  <button 
                    className={`odds-btn odds-btn-back ${isSelected('Draw', 'back') ? 'odds-btn-selected' : ''} ${getFlashClass('draw')}`}
                    onClick={() => handleOddsClick('Draw', match.odds.draw, 'back')}
                    disabled={!user}
                    style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                  >
                    <span className="odds-label" style={{ fontSize: '0.55rem', color: '#80d8ff' }}>Back</span>
                    <span className="odds-value" style={{ fontSize: '0.78rem' }}>{match.odds.draw.toFixed(2)}</span>
                  </button>
                  <button 
                    className={`odds-btn odds-btn-lay ${isSelected('Draw', 'lay') ? 'odds-btn-selected' : ''} ${getFlashClass('draw')}`}
                    onClick={() => {
                      const layOdds = parseFloat((match.odds.draw + 0.10).toFixed(2));
                      handleOddsClick('Draw', layOdds, 'lay');
                    }}
                    disabled={!user}
                    style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                  >
                    <span className="odds-label" style={{ fontSize: '0.55rem', color: '#ff80ab' }}>Lay</span>
                    <span className="odds-value" style={{ fontSize: '0.78rem' }}>{(match.odds.draw + 0.10).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Away Outcome Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{match.awayTeam} (2)</span>
              <div style={{ display: 'flex', gap: '6px', width: '160px' }}>
                <button 
                  className={`odds-btn odds-btn-back ${isSelected(match.awayTeam, 'back') ? 'odds-btn-selected' : ''} ${getFlashClass('away')}`}
                  onClick={() => handleOddsClick(match.awayTeam, match.odds.away, 'back')}
                  disabled={!user || !match.odds.away}
                  style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  <span className="odds-label" style={{ fontSize: '0.55rem', color: '#80d8ff' }}>Back</span>
                  <span className="odds-value" style={{ fontSize: '0.78rem' }}>{match.odds.away?.toFixed(2) || 'LOCKED'}</span>
                </button>
                <button 
                  className={`odds-btn odds-btn-lay ${isSelected(match.awayTeam, 'lay') ? 'odds-btn-selected' : ''} ${getFlashClass('away')}`}
                  onClick={() => {
                    const layOdds = match.odds.away ? parseFloat((match.odds.away + 0.05).toFixed(2)) : null;
                    handleOddsClick(match.awayTeam, layOdds, 'lay');
                  }}
                  disabled={!user || !match.odds.away}
                  style={{ height: '36px', borderRadius: '4px', opacity: user ? 1 : 0.6, cursor: user ? 'pointer' : 'not-allowed' }}
                >
                  <span className="odds-label" style={{ fontSize: '0.55rem', color: '#ff80ab' }}>Lay</span>
                  <span className="odds-value" style={{ fontSize: '0.78rem' }}>{match.odds.away ? (match.odds.away + 0.05).toFixed(2) : 'LOCKED'}</span>
                </button>
              </div>
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
                onClick={() => handleOddsClick(opt.outcome, opt.odd, 'Asian Handicap')}
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
                onClick={() => handleOddsClick(opt.outcome, opt.odd, 'Over/Under Goals')}
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
                onClick={() => handleOddsClick(opt.outcome, opt.odd, 'Double Chance')}
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
                onClick={() => handleOddsClick(opt.outcome, opt.odd, 'Correct Score')}
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
