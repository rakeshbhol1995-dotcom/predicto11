import React, { useState, useMemo } from 'react';
import { PROMOTIONS } from '../data/mockData';
import { useBet } from '../context/BetContext';
import { Flame, Clock, Radio, PlayCircle, ChevronRight, ShoppingBag, CheckCircle } from 'lucide-react';

const SPORT_PILLS = [
  { name: 'All', icon: '🔥' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Soccer', icon: '⚽' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Esports', icon: '🎮' },
];

export default function MainDashboard({ matches, selectedSport, setSelectedSport, activeTab, oddsFlash, onSelectMatch, selectedMatch, onOddsAdded }) {
  const { selections, toggleSelection } = useBet();
  const [toast, setToast] = useState(null); // { type: 'added'|'removed', team, odd }

  // Handle odds click with toast + mobile navigation
  const handleOddsClick = (match, outcomeName, oddValue) => {
    if (oddValue === null) return;
    const alreadySelected = selections.some(
      s => s.matchId === match.id && s.outcomeName === outcomeName
    );
    toggleSelection(match, outcomeName, oddValue);

    if (!alreadySelected) {
      // Show toast
      const teamLabel = outcomeName === 'Home' ? match.homeTeam
        : outcomeName === 'Away' ? match.awayTeam : 'Draw';
      setToast({ type: 'added', team: teamLabel, odd: oddValue });
      setTimeout(() => setToast(null), 2500);
      // Navigate to slip on mobile
      if (onOddsAdded) onOddsAdded();
    } else {
      setToast({ type: 'removed', team: outcomeName });
      setTimeout(() => setToast(null), 1500);
    }
  };

  // Filter matches
  const filteredMatches = useMemo(() => matches.filter((match) => {
    const matchSport = selectedSport === 'All' ? true : match.sport === selectedSport;
    const matchStatus = activeTab === 'In-Play' ? match.status === 'live' : true;
    return matchSport && matchStatus;
  }), [matches, selectedSport, activeTab]);

  // Active sports for pills
  const activeSports = useMemo(() => {
    const base = activeTab === 'In-Play'
      ? matches.filter(m => m.status === 'live')
      : matches;
    const names = new Set(base.map(m => m.sport));
    return SPORT_PILLS.filter(p => p.name === 'All' || names.has(p.name));
  }, [matches, activeTab]);

  // Group by sport for In-Play All view
  const groupedMatches = useMemo(() => {
    if (activeTab !== 'In-Play' || selectedSport !== 'All') return null;
    const groups = {};
    filteredMatches.forEach(m => {
      if (!groups[m.sport]) groups[m.sport] = [];
      groups[m.sport].push(m);
    });
    return groups;
  }, [filteredMatches, activeTab, selectedSport]);

  const getFlashClass = (matchId, key) => {
    if (!oddsFlash || !oddsFlash[matchId]) return '';
    const dir = oddsFlash[matchId][key];
    if (dir === 'up') return 'flash-up';
    if (dir === 'down') return 'flash-down';
    return '';
  };

  const isSelected = (matchId, outcomeName) =>
    selections.some((sel) => sel.matchId === matchId && sel.outcomeName === outcomeName);

  const sportIcon = (sport) => {
    const found = SPORT_PILLS.find(p => p.name === sport);
    return found ? found.icon : '🏅';
  };

  const renderMatch = (match) => (
    <div
      key={match.id}
      className="match-card"
      style={{
        background: selectedMatch?.id === match.id
          ? 'rgba(5, 196, 139, 0.04)'
          : 'rgba(18, 26, 38, 0.65)',
        border: selectedMatch?.id === match.id
          ? '1px solid rgba(5, 196, 139, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '8px',
        marginBottom: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={() => onSelectMatch(match)}
    >
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem' }}>{sportIcon(match.sport)}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {match.league}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {match.status === 'live' ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(0, 255, 133, 0.12)',
              border: '1px solid rgba(0, 255, 133, 0.25)',
              borderRadius: '4px',
              padding: '2px 7px',
              fontSize: '0.58rem', fontWeight: 800, color: 'var(--live-green)',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'var(--live-green)',
                boxShadow: '0 0 5px var(--live-green)',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }} />
              LIVE · {match.time}
            </span>
          ) : (
            <span style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '4px',
              padding: '2px 7px',
              fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)'
            }}>
              {match.time}
            </span>
          )}
          <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Card Content Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
        {/* Left Side: Teams & Scores */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '12px' }}>
          {/* Home Team */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.homeTeam}</span>
            {match.status === 'live' && (
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-yellow)', fontFamily: 'var(--font-display)', marginLeft: '8px' }}>
                {match.homeScore}
              </span>
            )}
          </div>
          {/* Away Team */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.awayTeam}</span>
            {match.status === 'live' && (
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'rgba(198,255,0,0.75)', fontFamily: 'var(--font-display)', marginLeft: '8px' }}>
                {match.awayScore}
              </span>
            )}
          </div>
          {/* Live Action Ticker / Upcoming status */}
          {match.status === 'live' && match.eventStatus ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px',
            }}>
              <PlayCircle size={8} style={{ color: 'var(--live-green)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {match.eventStatus}
              </span>
            </div>
          ) : null}
        </div>

        {/* Right Side: Odds Columns */}
        <div className="match-odds-row" style={{ display: 'flex', gap: '4px', width: '150px', flexShrink: 0, marginTop: 0, paddingBottom: 0 }} onClick={(e) => e.stopPropagation()}>
          <button
            className={`odds-btn ${isSelected(match.id, 'Home') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'home')}`}
            onClick={() => handleOddsClick(match, 'Home', match.odds.home)}
            style={{ height: '38px', borderRadius: '4px' }}
          >
            <span className="odds-label" style={{ fontSize: '0.55rem' }}>1</span>
            <span className="odds-value" style={{ fontSize: '0.8rem' }}>{match.odds.home ? match.odds.home.toFixed(2) : '-'}</span>
          </button>

          {match.odds.draw !== null ? (
            <button
              className={`odds-btn ${isSelected(match.id, 'Draw') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'draw')}`}
              onClick={() => handleOddsClick(match, 'Draw', match.odds.draw)}
              style={{ height: '38px', borderRadius: '4px' }}
            >
              <span className="odds-label" style={{ fontSize: '0.55rem' }}>X</span>
              <span className="odds-value" style={{ fontSize: '0.8rem' }}>{match.odds.draw ? match.odds.draw.toFixed(2) : '-'}</span>
            </button>
          ) : (
            <div style={{ flex: 1, height: '38px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '4px' }} />
          )}

          <button
            className={`odds-btn ${isSelected(match.id, 'Away') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'away')}`}
            onClick={() => handleOddsClick(match, 'Away', match.odds.away)}
            style={{ height: '38px', borderRadius: '4px' }}
          >
            <span className="odds-label" style={{ fontSize: '0.55rem' }}>2</span>
            <span className="odds-value" style={{ fontSize: '0.8rem' }}>{match.odds.away ? match.odds.away.toFixed(2) : '-'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="dashboard-main">

      {/* ===== TOAST NOTIFICATION ===== */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          background: toast.type === 'added'
            ? 'linear-gradient(135deg, #082d25, #051915)'
            : 'rgba(30,20,10,0.95)',
          border: toast.type === 'added'
            ? '1px solid var(--brand-emerald)'
            : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: toast.type === 'added'
            ? '0 4px 20px rgba(5,196,139,0.35)'
            : '0 4px 16px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.25s ease',
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
        }}>
          {toast.type === 'added' ? (
            <>
              <CheckCircle size={15} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                {toast.team} <span style={{ color: 'var(--brand-emerald)' }}>@{toast.odd?.toFixed(2)}</span> added
              </span>
              <span style={{ color: 'var(--brand-emerald)', fontSize: '0.75rem', fontWeight: 700, marginLeft: '4px' }}>
                → Bet Slip ✓
              </span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Selection removed</span>
            </>
          )}
        </div>
      )}

      {/* Promo Cards — Sports tab only */}
      {activeTab === 'Sports' && (
        <section className="promos-grid" style={{ marginBottom: '4px' }}>
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              style={{
                background: promo.color,
                borderRadius: '10px',
                padding: '14px 16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '110px'
              }}
            >
              <div style={{ position: 'absolute', right: '-8px', top: '-8px', fontSize: '4rem', opacity: 0.1, userSelect: 'none' }}>
                {promo.image}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--brand-yellow)', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Flame size={12} /> Promo
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                  {promo.title}
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.3', maxWidth: '90%' }}>
                  {promo.description}
                </p>
              </div>
              <button
                style={{
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px', color: '#fff', fontSize: '0.72rem',
                  padding: '4px 10px', width: 'fit-content', cursor: 'pointer',
                  fontWeight: 600, marginTop: '8px', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--brand-yellow)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >
                Bet Now →
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Matches Section */}
      <section style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Section Header */}
        <div style={{
          background: 'var(--brand-teal-nav)',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '8px 8px 0 0',
        }}>
          <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '7px', color: '#fff' }}>
            <Radio size={14} style={{ color: 'var(--live-green)', animation: activeTab === 'In-Play' ? 'pulse 1.5s infinite' : 'none' }} />
            {activeTab === 'In-Play' ? '⚡ Live In-Play Markets' : `${selectedSport === 'All' ? 'All Sports' : selectedSport} Schedule`}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            {filteredMatches.length} matches
          </span>
        </div>

        {/* Sport Filter Pills */}
        <div className="sport-pills-container">
          {activeSports.map((pill) => {
            const isActive = selectedSport === pill.name;
            return (
              <button
                key={pill.name}
                onClick={() => setSelectedSport && setSelectedSport(pill.name)}
                className={`sport-pill ${isActive ? 'sport-pill-active' : ''}`}
              >
                <span style={{ fontSize: '0.85rem' }}>{pill.icon}</span>
                <span>{pill.name}</span>
              </button>
            );
          })}
        </div>

        {/* Matches List */}
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
          {filteredMatches.length === 0 ? (
            <div style={{
              padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '2rem' }}>📭</span>
              <span style={{ fontSize: '0.9rem' }}>
                No {activeTab === 'In-Play' ? 'live' : ''} matches for {selectedSport === 'All' ? 'this category' : selectedSport}
              </span>
              <span style={{ fontSize: '0.75rem' }}>Try a different sport filter above</span>
            </div>
          ) : groupedMatches ? (
            Object.entries(groupedMatches).map(([sport, sportMatches]) => (
              <div key={sport} style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 0', marginBottom: '6px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)'
                }}>
                  <span style={{ fontSize: '1rem' }}>{sportIcon(sport)}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-yellow)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sport}</span>
                  <span style={{
                    background: 'rgba(0,255,133,0.12)', color: 'var(--live-green)',
                    fontSize: '0.6rem', fontWeight: 700, padding: '1px 6px',
                    borderRadius: '8px', border: '1px solid rgba(0,255,133,0.2)'
                  }}>{sportMatches.length} LIVE</span>
                </div>
                {sportMatches.map(renderMatch)}
              </div>
            ))
          ) : (
            filteredMatches.map(renderMatch)
          )}
        </div>
      </section>
    </main>
  );
}
