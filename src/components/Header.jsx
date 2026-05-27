import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { Search, User, Wallet, Plus, Bell, Shield, LogOut } from 'lucide-react';

const BrandLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(5, 196, 139, 0.5))' }}>
    <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="var(--brand-emerald)" strokeWidth="2.5" fill="rgba(5, 196, 139, 0.1)"/>
    <path d="M11 9H16C18.5 9 20 10.5 20 12.5C20 14.5 18.5 16 16 16H11V23" stroke="var(--brand-yellow)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="21" y1="9" x2="21" y2="23" stroke="var(--brand-emerald)" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default function Header({ activeTab, setActiveTab, onOpenDeposit, onOpenAuth, currentView, setCurrentView }) {
  const { user, logoutUser, balance, selectedFiat, setSelectedFiat, fiatSymbol, cryptoBalances } = useBet();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setCurrentView('dashboard');
    setShowDropdown(false);
  };

  return (
    <header style={{
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
          <span>
            PREDICTO<span style={{ color: 'var(--brand-emerald)' }}>11</span>
          </span>
          <span style={{ 
            fontSize: '0.55rem', 
            color: '#080a0f', 
            background: 'var(--brand-yellow)',
            padding: '2px 4px',
            borderRadius: '3px',
            fontWeight: 'bold',
            marginLeft: '2px',
            letterSpacing: 'normal'
          }}>CRYPTO</span>
        </div>

        {currentView !== 'admin' && (
          <nav style={{ display: 'flex', gap: '4px', height: '56px' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CURRENCY:</span>
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
              background: 'rgba(0,0,0,0.3)', 
              padding: '4px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Wallet size={16} style={{ color: 'var(--brand-emerald)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>FIAT BALANCE</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--brand-yellow)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                  {fiatSymbol}{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '-1px' }}>
                  USDT: {cryptoBalances.usdt.toFixed(2)} | BTC: {cryptoBalances.btc.toFixed(4)}
                </span>
              </div>
              <button 
                onClick={onOpenDeposit}
                title="Deposit Crypto Assets"
                style={{
                  background: 'var(--brand-emerald)',
                  border: 'none',
                  borderRadius: '4px',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '6px',
                  color: '#080a0f',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(5, 196, 139, 0.3)'
                }}
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            {/* Profile Dropdown Toggle */}
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
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
                border: '1px solid var(--border-color)'
              }}>
                <User size={14} style={{ color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#ffffff' }}>{user.username}</span>
            </div>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '160px',
                backgroundColor: 'rgba(16, 21, 30, 0.95)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 20
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.email} <br /> {user.mobile}
                </div>
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
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onOpenAuth}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px 16px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Log In
            </button>
            <button 
              onClick={onOpenAuth}
              style={{
                backgroundColor: 'var(--brand-emerald)',
                border: 'none',
                borderRadius: '6px',
                color: '#080a0f',
                padding: '7px 16px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 10px rgba(5, 196, 139, 0.25)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#04b27d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brand-emerald)'}
            >
              Join Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
