import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { 
  Shield, Play, Users, FileText, Landmark, PenTool, CheckCircle, XCircle, 
  Wallet, RefreshCw, BarChart2, Coins, TrendingUp, UserPlus, Clock, ArrowUpRight 
} from 'lucide-react';

const AdminCustomLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))' }}>
    <rect x="5" y="11" width="22" height="16" rx="4" stroke="#a855f7" strokeWidth="2.5" fill="rgba(168, 85, 247, 0.15)"/>
    <path d="M10 11V8C10 4.7 12.7 2 16 2C19.3 2 22 4.7 22 8V11" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="19" r="3" fill="#ffc107" />
  </svg>
);

export default function AdminPanel({ matches, onUpdateMatches }) {
  const { 
    usersList, placedBets, fiatSymbol, convertUsdtToFiat, 
    depositRequests, approveDepositRequest, rejectDepositRequest,
    cryptoBalances, updateUserBalances, user,
    totalWageredVolumeUsdt, vipInfo,
    withdrawalRequests, approveWithdrawalRequest, rejectWithdrawalRequest
  } = useBet();
  
  const [activeSubTab, setActiveSubTab] = useState('matches'); // 'matches' | 'users' | 'bets' | 'deposits' | 'withdrawals'

  // Live match editor states
  const [editingId, setEditingId] = useState(null);
  const [editHomeScore, setEditHomeScore] = useState('');
  const [editAwayScore, setEditAwayScore] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editOddsH, setEditOddsH] = useState('');
  const [editOddsD, setEditOddsD] = useState('');
  const [editOddsA, setEditOddsA] = useState('');
  const [editCommentary, setEditCommentary] = useState('');

  // Balance adjuster states
  const [adjUsdt, setAdjUsdt] = useState(cryptoBalances.usdt.toString());
  const [adjBtc, setAdjBtc] = useState(cryptoBalances.btc.toString());
  const [adjEth, setAdjEth] = useState(cryptoBalances.eth.toString());
  const [balanceMessage, setBalanceMessage] = useState('');

  const startEdit = (match) => {
    setEditingId(match.id);
    setEditHomeScore(match.homeScore);
    setEditAwayScore(match.awayScore);
    setEditTime(match.time);
    setEditStatus(match.status);
    setEditOddsH(match.odds.home || '');
    setEditOddsD(match.odds.draw || '');
    setEditOddsA(match.odds.away || '');
    setEditCommentary(match.eventStatus || '');
  };

  const saveEdit = (matchId) => {
    const updated = matches.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        homeScore: editHomeScore,
        awayScore: editAwayScore,
        time: editTime,
        status: editStatus,
        odds: {
          home: editOddsH ? parseFloat(editOddsH) : null,
          draw: editOddsD ? parseFloat(editOddsD) : null,
          away: editOddsA ? parseFloat(editOddsA) : null
        },
        eventStatus: editCommentary
      };
    });
    onUpdateMatches(updated);
    setEditingId(null);
  };

  const handleUpdateBalance = (e) => {
    e.preventDefault();
    updateUserBalances(adjUsdt, adjBtc, adjEth);
    setBalanceMessage('Player wallet balances overridden successfully!');
    setTimeout(() => setBalanceMessage(''), 3000);
  };

  // Helper stats
  const totalVolumeUsdt = placedBets.reduce((acc, b) => acc + b.totalStakeUsdt, 0);
  const pendingDepositsCount = depositRequests.filter(r => r.status === 'pending').length;
  const activeBetsCount = placedBets.filter(b => b.status === 'active').length;

  return (
    <div style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px', 
      overflowY: 'auto', 
      height: '100%',
      backgroundColor: '#05060a'
    }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 11, 40, 0.95) 0%, rgba(8, 6, 15, 0.95) 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 40px rgba(168, 85, 247, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Neon glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
          <AdminCustomLogo />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
              Command Control Center
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
              Direct override matrix for live sports scoring, crypto liquidity ledgers, and P2P agent transactions.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', zIndex: 1 }}>
          <span style={{ 
            fontSize: '0.62rem', 
            background: 'linear-gradient(90deg, #a855f7 0%, #7c3aed 100%)', 
            color: '#ffffff', 
            fontWeight: '900', 
            padding: '4px 10px', 
            borderRadius: '20px',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
            letterSpacing: '1px'
          }}>
            ROOT ADMIN
          </span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            SECURE PORT: 8443
          </span>
        </div>
      </div>

      {/* 2. Platform Analytics Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1: System Volume */}
        <div style={{
          background: 'rgba(30, 20, 50, 0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(5, 196, 139, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={20} style={{ color: 'var(--brand-emerald)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Total Bets Volume</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '2px', display: 'block' }}>
              {fiatSymbol}{convertUsdtToFiat(totalVolumeUsdt).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Metric 2: Active Bets */}
        <div style={{
          background: 'rgba(30, 20, 50, 0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart2 size={20} style={{ color: 'var(--brand-yellow)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Active Wagers</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '2px', display: 'block' }}>
              {activeBetsCount} Live Bets
            </span>
          </div>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div style={{
          background: 'rgba(30, 20, 50, 0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          position: 'relative'
        }}>
          {pendingDepositsCount > 0 && (
            <span className="pulsate-badge" style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ff3e6c',
              boxShadow: '0 0 8px #ff3e6c'
            }} />
          )}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: pendingDepositsCount > 0 ? 'rgba(255, 62, 108, 0.15)' : 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Landmark size={20} style={{ color: pendingDepositsCount > 0 ? '#ff3e6c' : 'rgba(255,255,255,0.4)' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Pending P2P Deposits</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: pendingDepositsCount > 0 ? '#ff3e6c' : '#ffffff', fontFamily: 'var(--font-display)', marginTop: '2px', display: 'block' }}>
              {pendingDepositsCount} Requests
            </span>
          </div>
        </div>

        {/* Metric 4: Platform Users */}
        <div style={{
          background: 'rgba(30, 20, 50, 0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Registered Players</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '2px', display: 'block' }}>
              {usersList.length} Active Accounts
            </span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'matches', label: 'Match Event Control', icon: Play },
          { key: 'users', label: 'Registered Players & Wallet', icon: Users },
          { key: 'bets', label: 'Bets Audit Ledger', icon: FileText },
          { key: 'deposits', label: 'P2P Payments Manager', icon: Landmark },
          { key: 'withdrawals', label: 'Withdrawal Approvals Ledger', icon: Wallet }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              style={{
                backgroundColor: isActive ? '#a855f7' : 'rgba(255,255,255,0.02)',
                color: '#ffffff',
                border: '1px solid ' + (isActive ? '#c084fc' : 'rgba(255,255,255,0.05)'),
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(168, 85, 247, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
              }}
            >
              <Icon size={14} style={{ color: isActive ? '#ffffff' : '#a855f7' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: Match Override Control */}
      {activeSubTab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 'bold' }}>Active Matches Scheduler</h3>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Real-time updates directly override customer score cards.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((m) => {
              const isEditing = editingId === m.id;
              return (
                <div 
                  key={m.id} 
                  style={{ 
                    padding: '20px', 
                    background: 'rgba(30, 20, 50, 0.25)', 
                    border: isEditing ? '1.5px solid #a855f7' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isEditing ? '0 0 20px rgba(168, 85, 247, 0.15)' : 'none'
                  }}
                >
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        borderBottom: '1px solid rgba(255,255,255,0.06)', 
                        paddingBottom: '8px' 
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--brand-yellow)' }}>
                          Editing: {m.homeTeam} v {m.awayTeam} ({m.sport})
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>ID: {m.id}</span>
                      </div>

                      {/* Edit Fields Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Home Score / Runs</label>
                          <input 
                            type="text" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editHomeScore} 
                            onChange={(e) => setEditHomeScore(e.target.value)} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Away Score</label>
                          <input 
                            type="text" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editAwayScore} 
                            onChange={(e) => setEditAwayScore(e.target.value)} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Clock / Overs / Sets</label>
                          <input 
                            type="text" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editTime} 
                            onChange={(e) => setEditTime(e.target.value)} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Home Odds (1)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editOddsH} 
                            onChange={(e) => setEditOddsH(e.target.value)} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Draw Odds (X)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editOddsD} 
                            onChange={(e) => setEditOddsD(e.target.value)} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Away Odds (2)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                            value={editOddsA} 
                            onChange={(e) => setEditOddsA(e.target.value)} 
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Status</label>
                          <select 
                            style={{ width: '100%', backgroundColor: '#090b0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none', cursor: 'pointer' }}
                            value={editStatus} 
                            onChange={(e) => setEditStatus(e.target.value)}
                          >
                            <option value="live">Live (In-Play)</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Live Commentary Ticker (flashing notice)</label>
                        <input 
                          type="text" 
                          style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none' }}
                          value={editCommentary} 
                          onChange={(e) => setEditCommentary(e.target.value)} 
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button 
                          onClick={() => setEditingId(null)} 
                          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveEdit(m.id)} 
                          style={{ backgroundColor: '#a855f7', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(168, 85, 247, 0.4)' }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '0.62rem', 
                            backgroundColor: m.status === 'live' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(255,255,255,0.08)',
                            color: m.status === 'live' ? '#ff3e6c' : 'rgba(255,255,255,0.5)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '900',
                            letterSpacing: '0.5px'
                          }}>
                            {m.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{m.sport} • {m.league}</span>
                        </div>
                        
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                          {m.homeTeam} <span style={{ color: 'var(--brand-yellow)' }}>{m.homeScore}</span> vs <span style={{ color: 'var(--brand-yellow)' }}>{m.awayScore}</span> {m.awayTeam}
                        </h4>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                            Clock: <strong style={{ color: '#ffffff' }}>{m.time}</strong>
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                            Odds: <strong style={{ color: 'var(--brand-emerald)' }}>H: {m.odds.home || 'LOCKED'} | D: {m.odds.draw || 'LOCKED'} | A: {m.odds.away || 'LOCKED'}</strong>
                          </span>
                        </div>
                        {m.eventStatus && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            backgroundColor: 'rgba(16, 185, 129, 0.05)', 
                            borderLeft: '2px solid var(--brand-emerald)', 
                            padding: '4px 8px', 
                            color: 'var(--brand-emerald)', 
                            marginTop: '8px',
                            borderRadius: '0 4px 4px 0'
                          }}>
                            Live commentary: "{m.eventStatus}"
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => startEdit(m)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '8px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = '#a855f7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                      >
                        <PenTool size={13} style={{ color: '#a855f7' }} /> 
                        Edit Live Card
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Registered Players & Wallet Adjuster */}
      {activeSubTab === 'users' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          {/* Active User Balance Overrider Drawer Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 20, 50, 0.45) 0%, rgba(10, 8, 20, 0.45) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Coins size={18} style={{ color: '#a855f7' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#ffffff' }}>
                  Live Wallet Balance Adjuster (Credit/Debit Tool)
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                  Override active session user balances directly. Real-time updates sync to the header instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateBalance} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    USDT BALANCE ($)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--brand-emerald)', fontSize: '0.8rem', fontWeight: 'bold' }}>$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px 8px 24px', color: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
                      value={adjUsdt} 
                      onChange={(e) => setAdjUsdt(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    BTC BALANCE
                  </label>
                  <input 
                    type="number" 
                    step="0.0001"
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
                    value={adjBtc} 
                    onChange={(e) => setAdjBtc(e.target.value)} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    ETH BALANCE
                  </label>
                  <input 
                    type="number" 
                    step="0.001"
                    style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
                    value={adjEth} 
                    onChange={(e) => setAdjEth(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                  {balanceMessage}
                </span>
                
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#a855f7',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  <Wallet size={13} />
                  Override Wallet Balances
                </button>
              </div>
            </form>
          </div>

          {/* Database Table Card */}
          <div style={{
            background: 'rgba(30, 20, 50, 0.2)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginBottom: '14px' }}>Accounts Database</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
                    <th style={{ padding: '12px' }}>User ID / Username</th>
                    <th style={{ padding: '12px' }}>Email Address</th>
                    <th style={{ padding: '12px' }}>Mobile Number</th>
                    <th style={{ padding: '12px' }}>Total Wagered</th>
                    <th style={{ padding: '12px' }}>VIP Membership</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Security Privilege</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u, i) => {
                    const volume = u.username.toLowerCase() === user?.username?.toLowerCase() ? totalWageredVolumeUsdt : (u.isAdmin ? 0 : 50.00);
                    const tierName = u.username.toLowerCase() === user?.username?.toLowerCase() ? vipInfo?.tier : (u.isAdmin ? 'PLATINUM' : 'BRONZE');
                    const tierColor = u.username.toLowerCase() === user?.username?.toLowerCase() ? vipInfo?.color : (u.isAdmin ? '#c084fc' : '#cd7f32');
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px', color: 'var(--brand-yellow)', fontWeight: 'bold' }}>{u.username}</td>
                        <td style={{ padding: '12px', color: '#ffffff' }}>{u.email}</td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{u.mobile}</td>
                        <td style={{ padding: '12px', color: 'var(--brand-emerald)', fontWeight: 'bold' }}>${volume.toFixed(2)}</td>
                        <td style={{ padding: '12px', color: tierColor, fontWeight: 'bold', fontSize: '0.78rem' }}>👑 {tierName}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            backgroundColor: u.isAdmin ? 'rgba(168, 85, 247, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: u.isAdmin ? '#c084fc' : 'var(--brand-emerald)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            {u.isAdmin ? 'PLATFORM ADMIN' : 'BETTING PLAYER'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Bets Ledger */}
      {activeSubTab === 'bets' && (
        <div style={{
          background: 'rgba(30, 20, 50, 0.25)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', marginBottom: '14px' }}>Placed Bets Audit Ledger</h3>
          
          {placedBets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
              No sports bets found in the registry database.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
                    <th style={{ padding: '12px' }}>Bet Reference</th>
                    <th style={{ padding: '12px' }}>Player Account</th>
                    <th style={{ padding: '12px' }}>Wager Type</th>
                    <th style={{ padding: '12px' }}>Markets & Selection Details</th>
                    <th style={{ padding: '12px' }}>Stake equivalent</th>
                    <th style={{ padding: '12px' }}>Potential Payout</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>State</th>
                  </tr>
                </thead>
                <tbody>
                  {placedBets.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{b.id}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#ffffff' }}>{b.username}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          background: b.type === 'Accumulator' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)',
                          color: b.type === 'Accumulator' ? '#c084fc' : '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>{b.type}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff' }}>
                        {b.selections.map((s, idx) => (
                          <div key={idx} style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: 'var(--brand-yellow)' }}>{s.outcomeName}</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>@</span>
                            <span style={{ color: 'var(--brand-emerald)', fontWeight: 'bold' }}>{s.odd.toFixed(2)}</span>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>({s.matchName})</span>
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--brand-yellow)', fontWeight: 'bold' }}>
                        {fiatSymbol}{convertUsdtToFiat(b.totalStakeUsdt).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--brand-emerald)', fontWeight: 'bold' }}>
                        {fiatSymbol}{convertUsdtToFiat(b.potentialPayoutUsdt).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          backgroundColor: b.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.08)',
                          color: b.status === 'active' ? 'var(--brand-emerald)' : 'rgba(255,255,255,0.4)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: P2P Deposits Manager */}
      {activeSubTab === 'deposits' && (
        <div style={{
          background: 'rgba(30, 20, 50, 0.25)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold' }}>P2P Deposit Approvals Console</h3>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Verify deposit transactions submitted by agents.</span>
          </div>

          {depositRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
              No deposit request slips found in database.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
                    <th style={{ padding: '12px' }}>Deposit ID</th>
                    <th style={{ padding: '12px' }}>Player ID</th>
                    <th style={{ padding: '12px' }}>Payment Method</th>
                    <th style={{ padding: '12px' }}>Requested Amount</th>
                    <th style={{ padding: '12px' }}>UTR / Reference Code</th>
                    <th style={{ padding: '12px' }}>Submitted Time</th>
                    <th style={{ padding: '12px' }}>Audit Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Approval Action</th>
                  </tr>
                </thead>
                <tbody>
                  {depositRequests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{req.id}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#ffffff' }}>{req.username}</td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>{req.method}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-yellow)', fontWeight: 'bold' }}>
                        {req.method.includes('Crypto') ? `${req.amount} USDT` : `${fiatSymbol}${req.amount.toLocaleString()}`}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        fontFamily: 'monospace', 
                        fontSize: '0.72rem', 
                        color: '#ffffff', 
                        maxWidth: '180px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }} title={req.utr}>
                        {req.utr}
                      </td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.4)' }}>{req.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          backgroundColor: req.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : req.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: req.status === 'approved' ? 'var(--brand-emerald)' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => approveDepositRequest(req.id)}
                              style={{
                                backgroundColor: 'var(--brand-emerald)',
                                border: 'none',
                                color: '#080a0f',
                                padding: '5px 12px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                              }}
                            >
                              <CheckCircle size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectDepositRequest(req.id)}
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <XCircle size={12} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: P2P Withdrawals Manager */}
      {activeSubTab === 'withdrawals' && (
        <div style={{
          background: 'rgba(30, 20, 50, 0.25)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 'bold' }}>P2P Withdrawal Approvals Console</h3>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Verify withdrawal address requests and release tokens.</span>
          </div>

          {withdrawalRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
              No withdrawal request slips found in database.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
                    <th style={{ padding: '12px' }}>Withdrawal ID</th>
                    <th style={{ padding: '12px' }}>Player ID</th>
                    <th style={{ padding: '12px' }}>Network / Method</th>
                    <th style={{ padding: '12px' }}>Payout Address</th>
                    <th style={{ padding: '12px' }}>USDT Value</th>
                    <th style={{ padding: '12px' }}>Submitted Time</th>
                    <th style={{ padding: '12px' }}>Audit Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Approval Action</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{req.id}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#ffffff' }}>{req.username}</td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>{req.method}</td>
                      <td style={{ 
                        padding: '12px', 
                        fontFamily: 'monospace', 
                        fontSize: '0.72rem', 
                        color: 'var(--brand-emerald)', 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }} title={req.address}>
                        {req.address}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--brand-yellow)', fontWeight: 'bold' }}>
                        ${req.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.4)' }}>{req.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          backgroundColor: req.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : req.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: req.status === 'approved' ? 'var(--brand-emerald)' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => approveWithdrawalRequest(req.id)}
                              style={{
                                backgroundColor: 'var(--brand-emerald)',
                                border: 'none',
                                color: '#080a0f',
                                padding: '5px 12px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                              }}
                            >
                              <CheckCircle size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectWithdrawalRequest(req.id)}
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <XCircle size={12} />
                              Reject (Refund)
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
