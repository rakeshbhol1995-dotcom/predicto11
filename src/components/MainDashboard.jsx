import React, { useState, useMemo } from 'react';
import { PROMOTIONS } from '../data/mockData';
import { useBet } from '../context/BetContext';
import { Flame, Clock, Radio, PlayCircle, ChevronRight } from 'lucide-react';

const SPORT_PILLS = [
  { name: 'All', icon: '🔥' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Soccer', icon: '⚽' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Esports', icon: '🎮' },
];

export default function MainDashboard({ matches, selectedSport, setSelectedSport, activeTab, oddsFlash, onSelectMatch, selectedMatch }) {
  const { selections, toggleSelection } = useBet();

  // Filter matches based on active tab and sidebar/pill selection
  const filteredMatches = useMemo(() => matches.filter((match) => {
    const matchSport = selectedSport === 'All' ? true : match.sport === selectedSport;
    const matchStatus = activeTab === 'In-Play' ? match.status === 'live' : true;
    return matchSport && matchStatus;
  }), [matches, selectedSport, activeTab]);

  // Get which sports actually have matches (for pill display)
  const activeSports = useMemo(() => {
    const base = activeTab === 'In-Play'
      ? matches.filter(m => m.status === 'live')
      : matches;
    const names = new Set(base.map(m => m.sport));
    return SPORT_PILLS.filter(p => p.name === 'All' || names.has(p.name));
  }, [matches, activeTab]);

  // In-Play: group by sport
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
          ? 'rgba(5, 196, 139, 0.05)'
          : 'rgba(16, 21, 30, 0.6)',
        border: selectedMatch?.id === match.id
          ? '1px solid rgba(5, 196, 139, 0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        marginBottom: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={() => onSelectMatch(match)}
    >
      {/* Card Header - Sport + League + Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem' }}>{sportIcon(match.sport)}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
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
              fontSize: '0.6rem', fontWeight: 800, color: 'var(--live-green)',
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
              fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)'
            }}>
              {match.time}
            </span>
          )}
          <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Teams + Scores */}
      <div style={{ padding: '10px 12px 6px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
              {match.homeTeam}
            </span>
            {match.status === 'live' && (
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-yellow)', fontFamily: 'var(--font-display)' }}>
                {match.homeScore}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)' }}>
              {match.awayTeam}
            </span>
            {match.status === 'live' && (
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'rgba(198, 255, 0, 0.75)', fontFamily: 'var(--font-display)' }}>
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Event Status */}
        {match.status === 'live' && match.eventStatus && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.68rem', color: 'var(--text-muted)',
            marginBottom: '8px',
          }}>
            <PlayCircle size={9} style={{ color: 'var(--live-green)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {match.eventStatus}
            </span>
          </div>
        )}

        {/* Odds Buttons */}
        <div
          className="match-odds-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Home */}
          <button
            className={`odds-btn ${isSelected(match.id, 'Home') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'home')}`}
            onClick={() => toggleSelection(match, 'Home', match.odds.home)}
          >
            <span className="odds-label">1</span>
            <span className="odds-value">{match.odds.home ? match.odds.home.toFixed(2) : '-'}</span>
          </button>

          {/* Draw */}
          {match.odds.draw !== null ? (
            <button
              className={`odds-btn ${isSelected(match.id, 'Draw') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'draw')}`}
              onClick={() => toggleSelection(match, 'Draw', match.odds.draw)}
            >
              <span className="odds-label">X</span>
              <span className="odds-value">{match.odds.draw ? match.odds.draw.toFixed(2) : '-'}</span>
            </button>
          ) : (
            <div style={{ flex: 1 }} /> /* spacer for 2-way markets */
          )}

          {/* Away */}
          <button
            className={`odds-btn ${isSelected(match.id, 'Away') ? 'odds-btn-selected' : ''} ${getFlashClass(match.id, 'away')}`}
            onClick={() => toggleSelection(match, 'Away', match.odds.away)}
          >
            <span className="odds-label">2</span>
            <span className="odds-value">{match.odds.away ? match.odds.away.toFixed(2) : '-'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="dashboard-main">
      {/* Promo Cards - only show on Sports tab */}
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
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  width: 'fit-content',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginTop: '8px',
                  transition: 'all 0.2s ease'
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
          marginBottom: '0',
        }}>
          <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '7px', color: '#fff' }}>
            <Radio size={14} style={{ color: 'var(--live-green)', animation: activeTab === 'In-Play' ? 'pulse 1.5s infinite' : 'none' }} />
            {activeTab === 'In-Play' ? '⚡ Live In-Play Markets' : `${selectedSport === 'All' ? 'All Sports' : selectedSport} Schedule`}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            {filteredMatches.length} matches
          </span>
        </div>

        {/* Sport Filter Pills - horizontal scroll on mobile */}
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
              padding: '40px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '2rem' }}>📭</span>
              <span style={{ fontSize: '0.9rem' }}>No {activeTab === 'In-Play' ? 'live' : ''} matches for {selectedSport === 'All' ? 'this category' : selectedSport}</span>
              <span style={{ fontSize: '0.75rem' }}>Try a different sport filter above</span>
            </div>
          ) : groupedMatches ? (
            // In-Play grouped by sport
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
                    background: 'rgba(0,255,133,0.12)',
                    color: 'var(--live-green)',
                    fontSize: '0.6rem', fontWeight: 700,
                    padding: '1px 6px', borderRadius: '8px',
                    border: '1px solid rgba(0,255,133,0.2)'
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
