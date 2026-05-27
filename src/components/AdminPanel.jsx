import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { Settings, Award, FileText, Users, Play, PenTool, Landmark } from 'lucide-react';

const AdminCustomLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(171, 71, 188, 0.5))' }}>
    <rect x="6" y="12" width="20" height="14" rx="3" stroke="#ab47bc" strokeWidth="2.5" fill="rgba(171, 71, 188, 0.1)"/>
    <path d="M11 12V8C11 5.2 13.2 3 16 3C18.8 3 21 5.2 21 8V12" stroke="#ab47bc" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="19" r="2.5" fill="var(--brand-yellow)"/>
  </svg>
);

export default function AdminPanel({ matches, onUpdateMatches }) {
  const { usersList, placedBets, fiatSymbol, convertUsdtToFiat, depositRequests, approveDepositRequest, rejectDepositRequest } = useBet();
  const [activeSubTab, setActiveSubTab] = useState('matches'); // 'matches' | 'users' | 'bets' | 'deposits'

  // Match edit state
  const [editingId, setEditingId] = useState(null);
  const [editHomeScore, setEditHomeScore] = useState('');
  const [editAwayScore, setEditAwayScore] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editOddsH, setEditOddsH] = useState('');
  const [editOddsD, setEditOddsD] = useState('');
  const [editOddsA, setEditOddsA] = useState('');
  const [editCommentary, setEditCommentary] = useState('');

  const startEdit = (match) => {
    setEditingId(match.id);
    setEditHomeScore(match.homeScore);
    setEditAwayScore(match.awayScore);
    setEditTime(match.time);
    setEditStatus(match.status);
    setEditOddsH(match.odds.home || '');
    setEditOddsD(match.odds.draw || '');
    setEditOddsA(match.odds.away || '');
    setEditCommentary(match.eventStatus);
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

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Title Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1f1435 0%, #0d0a14 100%)',
        border: '1.5px solid #ab47bc',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(171, 71, 188, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AdminCustomLogo />
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Predicto11 Backoffice</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin dashboard to override live match events, monitor balances and view placed bets.</p>
          </div>
        </div>
        <span style={{ fontSize: '0.65rem', backgroundColor: '#ab47bc', color: '#ffffff', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
          ADMINISTRATOR ROOT
        </span>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveSubTab('matches')}
          style={{
            backgroundColor: activeSubTab === 'matches' ? '#ab47bc' : 'rgba(255,255,255,0.03)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Play size={14} /> Live Match Manager
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          style={{
            backgroundColor: activeSubTab === 'users' ? '#ab47bc' : 'rgba(255,255,255,0.03)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Users size={14} /> Registered Users
        </button>
        <button
          onClick={() => setActiveSubTab('bets')}
          style={{
            backgroundColor: activeSubTab === 'bets' ? '#ab47bc' : 'rgba(255,255,255,0.03)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileText size={14} /> Bets Ledger
        </button>
        <button
          onClick={() => setActiveSubTab('deposits')}
          style={{
            backgroundColor: activeSubTab === 'deposits' ? '#ab47bc' : 'rgba(255,255,255,0.03)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Landmark size={14} /> P2P Deposit Requests
        </button>
      </div>

      {/* Tab 1: Match Manager */}
      {activeSubTab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: '#ffffff' }}>Active Matches Scheduler</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matches.map((m) => {
              const isEditing = editingId === m.id;
              return (
                <div key={m.id} className="card-panel" style={{ padding: '16px', border: isEditing ? '1px solid #ab47bc' : '1px solid var(--border-color)' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--brand-yellow)' }}>
                          Editing: {m.homeTeam} v {m.awayTeam} ({m.sport})
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {m.id}</span>
                      </div>

                      {/* Edit Fields Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Home Score / Runs</label>
                          <input type="text" className="form-input" value={editHomeScore} onChange={(e) => setEditHomeScore(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Away Score</label>
                          <input type="text" className="form-input" value={editAwayScore} onChange={(e) => setEditAwayScore(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clock / Overs / Sets</label>
                          <input type="text" className="form-input" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Home Odds (1)</label>
                          <input type="number" step="0.01" className="form-input" value={editOddsH} onChange={(e) => setEditOddsH(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Draw Odds (X)</label>
                          <input type="number" step="0.01" className="form-input" value={editOddsD} onChange={(e) => setEditOddsD(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Away Odds (2)</label>
                          <input type="number" step="0.01" className="form-input" value={editOddsA} onChange={(e) => setEditOddsA(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</label>
                          <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ background: '#121212' }}>
                            <option value="live">Live (In-Play)</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Live Match Event commentary (flashing ticker)</label>
                        <input type="text" className="form-input" value={editCommentary} onChange={(e) => setEditCommentary(e.target.value)} />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button onClick={() => setEditingId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => saveEdit(m.id)} style={{ backgroundColor: '#ab47bc', border: 'none', color: '#ffffff', borderRadius: '4px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                          {m.homeTeam} <span style={{ color: 'var(--brand-yellow)' }}>{m.homeScore}</span> vs <span style={{ color: 'var(--brand-yellow)' }}>{m.awayScore}</span> {m.awayTeam}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {m.sport} • {m.league} • Time: **{m.time}** • Status: **{m.status.toUpperCase()}**
                        </span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', marginTop: '4px' }}>
                          Commentary: "{m.eventStatus}"
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Odds: [H: {m.odds.home || 'LOCKED'}] [D: {m.odds.draw || 'LOCKED'}] [A: {m.odds.away || 'LOCKED'}]
                        </p>
                      </div>
                      <button
                        onClick={() => startEdit(m)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-color)',
                          color: '#ffffff',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <PenTool size={12} /> Edit Match
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Registered Users */}
      {activeSubTab === 'users' && (
        <div className="card-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>Accounts Database</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>User ID</th>
                <th style={{ padding: '10px' }}>Email Address</th>
                <th style={{ padding: '10px' }}>Mobile Number</th>
                <th style={{ padding: '10px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px', color: 'var(--brand-yellow)', fontWeight: 'bold' }}>{u.username}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}>{u.mobile}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      backgroundColor: u.isAdmin ? 'rgba(171, 71, 188, 0.15)' : 'rgba(5, 196, 139, 0.15)',
                      color: u.isAdmin ? '#ab47bc' : 'var(--brand-emerald)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {u.isAdmin ? 'ADMIN' : 'PLAYER'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Bets Ledger */}
      {activeSubTab === 'bets' && (
        <div className="card-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>Placed Bets Audit Ledger</h3>
          {placedBets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No bets found in the ledger database.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Bet ID</th>
                  <th style={{ padding: '10px' }}>User</th>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th style={{ padding: '10px' }}>Details</th>
                  <th style={{ padding: '10px' }}>Stake</th>
                  <th style={{ padding: '10px' }}>Payout</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {placedBets.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.id}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{b.username}</td>
                    <td style={{ padding: '10px' }}>{b.type}</td>
                    <td style={{ padding: '10px' }}>
                      {b.selections.map((s, idx) => (
                        <div key={idx}>
                          **{s.outcomeName}** @ {s.odd.toFixed(2)} ({s.matchName})
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '10px', color: 'var(--brand-yellow)', fontWeight: 600 }}>
                      {fiatSymbol}{convertUsdtToFiat(b.totalStakeUsdt).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px', color: 'var(--brand-emerald)', fontWeight: 600 }}>
                      {fiatSymbol}{convertUsdtToFiat(b.potentialPayoutUsdt).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        backgroundColor: b.status === 'active' ? 'rgba(5, 196, 139, 0.15)' : 'rgba(255,255,255,0.08)',
                        color: b.status === 'active' ? 'var(--brand-emerald)' : 'var(--text-muted)',
                        padding: '2px 6px',
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
          )}
        </div>
      )}

      {/* Tab 4: P2P Deposits Manager */}
      {activeSubTab === 'deposits' && (
        <div className="card-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>P2P Deposit Approvals Manager</h3>
          {depositRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No deposit requests found in the ledger database.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Request ID</th>
                    <th style={{ padding: '10px' }}>User</th>
                    <th style={{ padding: '10px' }}>Method</th>
                    <th style={{ padding: '10px' }}>Amount</th>
                    <th style={{ padding: '10px' }}>Reference (UTR / TxHash)</th>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {depositRequests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{req.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{req.username}</td>
                      <td style={{ padding: '10px' }}>{req.method}</td>
                      <td style={{ padding: '10px', color: 'var(--brand-yellow)', fontWeight: 600 }}>
                        {req.method.includes('Crypto') ? `${req.amount} USDT/Token` : `${fiatSymbol}${req.amount.toLocaleString()}`}
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.7rem', color: '#ffffff', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.utr}>
                        {req.utr}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{req.date}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          backgroundColor: req.status === 'approved' ? 'rgba(5, 196, 139, 0.15)' : req.status === 'rejected' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(255, 215, 0, 0.15)',
                          color: req.status === 'approved' ? 'var(--brand-emerald)' : req.status === 'rejected' ? 'var(--live-red)' : 'var(--brand-gold)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => approveDepositRequest(req.id)}
                              style={{
                                backgroundColor: 'var(--brand-emerald)',
                                border: 'none',
                                color: '#080a0f',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectDepositRequest(req.id)}
                              style={{
                                backgroundColor: 'var(--live-red)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                              }}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Settled</span>
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
