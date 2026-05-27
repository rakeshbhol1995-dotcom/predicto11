import React from 'react';
import { PROMOTIONS } from '../data/mockData';
import { useBet } from '../context/BetContext';
import { Flame, Clock, Radio, PlayCircle } from 'lucide-react';

export default function MainDashboard({ matches, selectedSport, activeTab, oddsFlash, onSelectMatch, selectedMatch }) {
  const { selections, toggleSelection } = useBet();

  // Filter matches based on active tab and sidebar selection
  const filteredMatches = matches.filter((match) => {
    const matchSport = selectedSport === 'All' ? true : match.sport === selectedSport;
    const matchStatus = activeTab === 'Sports' 
      ? true 
      : match.status === 'live'; // 'In-Play' tab shows live matches only
    
    return matchSport && matchStatus;
  });

  const getFlashClass = (matchId, key) => {
    if (!oddsFlash || !oddsFlash[matchId]) return '';
    const dir = oddsFlash[matchId][key];
    if (dir === 'up') return 'flash-up';
    if (dir === 'down') return 'flash-down';
    return '';
  };

  const isSelected = (matchId, outcomeName) => {
    return selections.some((sel) => sel.matchId === matchId && sel.outcomeName === outcomeName);
  };

  return (
    <main style={{
      backgroundColor: 'var(--bg-dark)',
      padding: '16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Promos */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.id}
            style={{
              background: promo.color,
              borderRadius: '8px',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}
          >
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '5rem', opacity: 0.12, userSelect: 'none' }}>
              {promo.image}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-yellow)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                <Flame size={14} /> Promotional Offer
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
                {promo.title}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', maxWidth: '85%', lineHeight: '1.25' }}>
                {promo.description}
              </p>
            </div>
            <button style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '0.75rem',
              padding: '4px 10px',
              width: 'fit-content',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: '10px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--brand-yellow)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            >
              Bet Now
            </button>
          </div>
        ))}
      </section>

      {/* Main Odds Schedule */}
      <section className="card-panel" style={{ padding: '0px' }}>
        <div style={{
          backgroundColor: 'var(--brand-teal-nav)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff'
        }}>
          <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={16} style={{ color: 'var(--live-green)', animation: 'pulse 1.5s infinite' }} />
            {activeTab === 'In-Play' ? 'Live In-Play Markets' : `${selectedSport} - Sports Schedule`}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            {filteredMatches.length} Matches Found
          </span>
        </div>

        {/* Matches List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredMatches.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches currently available for this category.
            </div>
          ) : (
            filteredMatches.map((match) => (
              <div
                key={match.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: selectedMatch?.id === match.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectMatch(match)}
              >
                {/* Team Info / Live indicator */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{match.league}</span>
                    {match.status === 'live' ? (
                      <span style={{
                        color: 'var(--live-green)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(0, 255, 133, 0.1)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Clock size={10} />
                        {match.time}
                      </span>
                    ) : (
                      <span style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.65rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}>
                        {match.time}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '24px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{match.homeTeam}</span>
                      {match.status === 'live' && (
                        <span style={{ color: 'var(--brand-yellow)', fontWeight: 700, fontSize: '0.9rem' }}>{match.homeScore}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '24px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{match.awayTeam}</span>
                      {match.status === 'live' && (
                        <span style={{ color: 'var(--brand-yellow)', fontWeight: 700, fontSize: '0.9rem' }}>{match.awayScore}</span>
                      )}
                    </div>
                  </div>

                  {match.status === 'live' && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PlayCircle size={10} style={{ color: 'var(--live-green)' }} />
                      <span>{match.eventStatus}</span>
                    </div>
                  )}
                </div>

                {/* Odds Buttons Columns */}
                <div style={{ display: 'flex', gap: '8px', minWidth: '220px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                  {/* Home Win */}
                  <button
                    className={`odds-cell ${isSelected(match.id, 'Home') ? 'selected' : ''} ${getFlashClass(match.id, 'home')}`}
                    onClick={() => toggleSelection(match, 'Home', match.odds.home)}
                    style={{ width: '68px', height: '42px', border: 'none' }}
                  >
                    <span className="odds-lbl">1</span>
                    <span className="odds-val">{match.odds.home ? match.odds.home.toFixed(2) : '-'}</span>
                  </button>

                  {/* Draw (Only if Soccer/Cricket or if drawing is supported) */}
                  {match.odds.draw !== null && (
                    <button
                      className={`odds-cell ${isSelected(match.id, 'Draw') ? 'selected' : ''} ${getFlashClass(match.id, 'draw')}`}
                      onClick={() => toggleSelection(match, 'Draw', match.odds.draw)}
                      style={{ width: '68px', height: '42px', border: 'none' }}
                    >
                      <span className="odds-lbl">X</span>
                      <span className="odds-val">{match.odds.draw ? match.odds.draw.toFixed(2) : '-'}</span>
                    </button>
                  )}

                  {/* Away Win */}
                  <button
                    className={`odds-cell ${isSelected(match.id, 'Away') ? 'selected' : ''} ${getFlashClass(match.id, 'away')}`}
                    onClick={() => toggleSelection(match, 'Away', match.odds.away)}
                    style={{ width: '68px', height: '42px', border: 'none' }}
                  >
                    <span className="odds-lbl">2</span>
                    <span className="odds-val">{match.odds.away ? match.odds.away.toFixed(2) : '-'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
