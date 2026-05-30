import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { Search, User, Wallet, Plus, Bell, Shield, LogOut, ArrowRightLeft, Crown } from 'lucide-react';

const BrandLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(5, 196, 139, 0.5))' }}>
    <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="var(--brand-emerald)" strokeWidth="2.5" fill="rgba(5, 196, 139, 0.1)"/>
    <path d="M11 9H16C18.5 9 20 10.5 20 12.5C20 14.5 18.5 16 16 16H11V23" stroke="var(--brand-yellow)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="21" y1="9" x2="21" y2="23" stroke="var(--brand-emerald)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default function Header({ activeTab, setActiveTab, onOpenDeposit, onOpenAuth, currentView, setCurrentView, apiStatus, isLiveApi }) {
  const { user, logoutUser, balance, selectedFiat, setSelectedFiat, fiatSymbol, cryptoBalances, vipInfo } = useBet();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setCurrentView('dashboard');
    setShowDropdown(false);
  };

  return (
    <header className="app-header" style={{
      background: 'linear-gradient(135deg, var(--brand-teal-deep) 0%, #080a0f 100%)',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 10,
      position: 'sticky',
      top: 0
    }}>
      {/* Brand & Main Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div 
          onClick={() => setCurrentView('dashboard')}
          style={{ 
            color: 'var(--brand-yellow)', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '1.3rem', 
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BrandLogo />
          <span className="logo-text">
            PREDICTO<span style={{ color: 'var(--brand-emerald)' }}>11</span>
          </span>
          <span className="logo-badge" style={{ 
            fontSize: '0.55rem', 
            color: '#080a0f', 
            background: 'var(--brand-yellow)',
            padding: '2px 4px',
            borderRadius: '3px',
            fontWeight: 'bold',
            marginLeft: '2px',
            letterSpacing: 'normal'
          }}>CRYPTO</span>

          {apiStatus && (
            <span style={{
              fontSize: '0.6rem',
              color: isLiveApi ? 'var(--brand-emerald)' : 'rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.05)',
              border: isLiveApi ? '1.2px solid var(--brand-emerald)' : '1px solid rgba(255,255,255,0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 800,
              marginLeft: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }} title={`API Status: ${apiStatus}`}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isLiveApi ? 'var(--brand-emerald)' : 'var(--live-red)',
                display: 'inline-block'
              }} />
              {isLiveApi ? 'LIVE API' : 'SIMULATION'}
            </span>
          )}
        </div>

        {currentView !== 'admin' && (
          <nav className="header-nav">
            {['Sports', 'In-Play', 'Casino'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentView('dashboard'); }}
                  style={{
                    background: isActive ? 'var(--brand-teal-nav)' : 'transparent',
                    color: isActive ? 'var(--brand-yellow)' : '#ffffff',
                    border: 'none',
                    padding: '0 16px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-display)',
                    height: '100%',
                    borderBottom: isActive ? '3px solid var(--brand-emerald)' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Utilities & User Info */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div className="header-search">
          <Search size={16} style={{ color: 'rgba(255,255,255,0.4)', position: 'absolute', left: '10px' }} />
          <input
            type="text"
            placeholder="Search matches..."
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '6px 12px 6px 32px',
              color: '#ffffff',
              fontSize: '0.8rem',
              outline: 'none',
              width: '150px',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.width = '200px';
              e.target.style.borderColor = 'var(--brand-emerald)';
            }}
            onBlur={(e) => {
              e.target.style.width = '150px';
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          />
        </div>

        {/* Currency Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="currency-label">CURRENCY:</span>
          <select
            value={selectedFiat}
            onChange={(e) => setSelectedFiat(e.target.value)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '4px 6px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="INR" style={{ background: '#121212' }}>INR (₹)</option>
            <option value="USD" style={{ background: '#121212' }}>USD ($)</option>
            <option value="EUR" style={{ background: '#121212' }}>EUR (€)</option>
          </select>
        </div>

        {/* User Account OR Login/Register Buttons */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            {/* Admin toggle if applicable */}
            {user.isAdmin && (
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'dashboard' : 'admin')}
                style={{
                  backgroundColor: currentView === 'admin' ? '#ab47bc' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Shield size={14} style={{ color: currentView === 'admin' ? '#ffffff' : '#ab47bc' }} />
                {currentView === 'admin' ? 'Exit Admin' : 'Admin Panel'}
              </button>
            )}

            {/* Wallet Widget */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'rgba(0,0,0,0.35)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Wallet size={15} style={{ color: 'var(--brand-emerald)', flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* INR Balance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>INR:</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-yellow)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                    {fiatSymbol}{balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>|</span>
                
                {/* USDT Balance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>USDT:</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--brand-emerald)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                    ${cryptoBalances.usdt.toFixed(1)}
                  </span>
                </div>

                {/* BTC Balance (Hidden on Small Screens via CSS class) */}
                <span className="desktop-only-divider" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>|</span>
                
                <div className="desktop-only-btc" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>BTC:</span>
                  <span style={{ fontSize: '0.85rem', color: '#ff9800', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                    {cryptoBalances.btc.toFixed(4)}
                  </span>
                </div>
              </div>
              <button 
                onClick={onOpenDeposit}
                title="Deposit Crypto Assets"
                style={{
                  background: 'var(--brand-emerald)',
                  border: 'none',
                  borderRadius: '4px',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  color: '#080a0f',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(5, 196, 139, 0.3)',
                  flexShrink: 0
                }}
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Profile Dropdown Toggle */}
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid ' + (vipInfo?.color || 'var(--border-color)')
              }}>
                <Crown size={14} style={{ color: vipInfo?.color || '#ffffff' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>{user.username}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: '900', color: vipInfo?.color || 'var(--brand-yellow)', letterSpacing: '0.5px' }}>
                  {vipInfo?.tier}
                </span>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '180px',
                backgroundColor: 'rgba(16, 21, 30, 0.98)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: 20
              }}>
                {/* VIP Indicator Progress */}
                <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>VIP Loyalty Club</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <Crown size={12} style={{ color: vipInfo?.color }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', color: vipInfo?.color }}>
                      {vipInfo?.tier} MEMBER
                    </span>
                  </div>
                </div>

                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.email} <br /> {user.mobile}
                </div>

                {/* Withdraw Link */}
                <button 
                  onClick={() => { onOpenDeposit('withdraw'); setShowDropdown(false); }}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <ArrowRightLeft size={13} style={{ color: 'var(--brand-emerald)' }} /> Withdraw Funds
                </button>

                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--live-red)',
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 62, 108, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={13} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onOpenAuth}
              className="header-login-btn"
            >
              Log In
            </button>
            <button 
              onClick={onOpenAuth}
              className="header-join-btn"
            >
              Join Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
