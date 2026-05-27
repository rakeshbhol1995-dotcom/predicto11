import React from 'react';
import { SPORTS_LIST } from '../data/mockData';
import { Flame, Award, TrendingUp, Trophy } from 'lucide-react';

export default function Sidebar({ selectedSport, setSelectedSport }) {
  return (
    <aside className="left-sidebar">
      {/* Popular Events Section */}
      <div>
        <h4 style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          padding: '0 16px',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Popular Sections
        </h4>
        <ul style={{ listStyle: 'none' }}>
          <li>
            <button
              onClick={() => setSelectedSport('All')}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: selectedSport === 'All' ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: 'none',
                borderLeft: selectedSport === 'All' ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                color: selectedSport === 'All' ? 'var(--brand-yellow)' : 'var(--text-main)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedSport !== 'All') e.target.style.background = 'rgba(255,255,255,0.02)';
              }}
              onMouseLeave={(e) => {
                if (selectedSport !== 'All') e.target.style.background = 'transparent';
              }}
            >
              <Trophy size={16} />
              <span>All Sports Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedSport('Cricket')}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: selectedSport === 'Cricket' ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: 'none',
                borderLeft: selectedSport === 'Cricket' ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                color: selectedSport === 'Cricket' ? 'var(--brand-yellow)' : 'var(--text-main)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedSport !== 'Cricket') e.target.style.background = 'rgba(255,255,255,0.02)';
              }}
              onMouseLeave={(e) => {
                if (selectedSport !== 'Cricket') e.target.style.background = 'transparent';
              }}
            >
              <Flame size={16} style={{ color: '#ff5722' }} />
              <span>IPL Super Odds Boost</span>
            </button>
          </li>
        </ul>
      </div>

      {/* A-Z Sports List */}
      <div>
        <h4 style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          padding: '0 16px',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          A-Z Sports
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {SPORTS_LIST.map((sport) => {
            const isSelected = selectedSport === sport.name;
            return (
              <li key={sport.name}>
                <button
                  onClick={() => setSelectedSport(sport.name)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: 'none',
                    borderLeft: isSelected ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                    color: isSelected ? 'var(--brand-yellow)' : 'var(--text-main)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 600 : 400,
                    transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-body)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.background = 'rgba(255,255,255,0.02)';
                      e.target.style.paddingLeft = '18px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.background = 'transparent';
                      e.target.style.paddingLeft = '16px';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.15rem' }}>{sport.icon}</span>
                    <span>{sport.name}</span>
                  </div>
                  {sport.liveCount > 0 && (
                    <span style={{
                      backgroundColor: 'rgba(0, 255, 133, 0.12)',
                      color: 'var(--live-green)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 255, 133, 0.2)'
                    }}>
                      {sport.liveCount} LIVE
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Helpful Links */}
      <div style={{ marginTop: 'auto', padding: '0 16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Award size={20} style={{ color: 'var(--brand-yellow)', marginBottom: '6px' }} />
          <h5 style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Responsible Gaming</h5>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Keep it fun. Play responsibly.</p>
        </div>
      </div>
    </aside>
  );
}
