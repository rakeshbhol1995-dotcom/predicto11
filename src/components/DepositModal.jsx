import React, { useState } from 'react';
import { useBet, EXCHANGE_RATES } from '../context/BetContext';
import { X, Copy, Check, Coins, ArrowRightLeft } from 'lucide-react';

export default function DepositModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { selectedFiat, fiatSymbol, depositCrypto } = useBet();
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const getMockAddress = (asset) => {
    if (asset === 'USDT') return '0x71C...6974 (ERC20)';
    if (asset === 'BTC') return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    return '0x291...384d (Arbitrum One)';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMockAddress(selectedAsset));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert entered crypto amount to active fiat
  const rate = EXCHANGE_RATES[selectedAsset][selectedFiat];
  const convertedFiat = amount ? parseFloat((parseFloat(amount) * rate).toFixed(2)) : 0;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const res = depositCrypto(selectedAsset, amount);
    if (res) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0px' }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-teal-nav) 0%, var(--brand-teal-deep) 100%)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <Coins size={20} style={{ color: 'var(--brand-emerald)' }} />
            Crypto Deposit Network
          </h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: 'none', 
              borderRadius: '50%', 
              color: '#ffffff', 
              width: '28px', 
              height: '28px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Success Alert */}
        {success ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 196, 139, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-emerald)',
              border: '2px solid var(--brand-emerald)',
              fontSize: '1.5rem',
              animation: 'bounce 0.5s'
            }}>
              ✓
            </div>
            <h4 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Deposit Confirmed!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Added {amount} {selectedAsset} (~{fiatSymbol}{convertedFiat.toLocaleString()} {selectedFiat}) to your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDepositSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Asset Tabs */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Select Crypto Currency
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['USDT', 'BTC', 'ETH'].map((asset) => {
                  const isSel = selectedAsset === asset;
                  return (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => { setSelectedAsset(asset); setAmount(''); }}
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        backgroundColor: isSel ? 'rgba(5, 196, 139, 0.15)' : 'var(--bg-card)',
                        border: isSel ? '2px solid var(--brand-emerald)' : '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: isSel ? 'var(--brand-emerald)' : '#ffffff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>
                        {asset === 'USDT' ? '🟢' : asset === 'BTC' ? '🪙' : '🔷'}
                      </span>
                      <span style={{ fontSize: '0.8rem' }}>{asset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QR Code and Address */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {/* Simulated QR Code */}
              <div style={{
                width: '72px',
                height: '72px',
                border: '2px solid var(--brand-emerald)',
                borderRadius: '6px',
                padding: '4px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'radial-gradient(#10211a 30%, transparent 35%)',
                  backgroundSize: '8px 8px'
                }} />
              </div>

              {/* Address details */}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Deposit Address
                </span>
                <p style={{ 
                  color: '#ffffff', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  marginTop: '2px'
                }}>
                  {getMockAddress(selectedAsset)}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-emerald)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '6px',
                    fontWeight: 600
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>

            {/* Input Calculator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Amount to Deposit
                </label>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Rate: 1 {selectedAsset} = {fiatSymbol}{rate.toLocaleString()} {selectedFiat}
                </span>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  step="any"
                  placeholder={`0.00 ${selectedAsset}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-emerald)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
                <span style={{ position: 'absolute', right: '14px', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--brand-emerald)' }}>
                  {selectedAsset}
                </span>
              </div>
            </div>

            {/* Conversion Display */}
            {amount && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'rgba(5, 196, 139, 0.08)',
                border: '1px dashed var(--brand-emerald)',
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <ArrowRightLeft size={14} style={{ color: 'var(--brand-emerald)' }} />
                  <span>Convert equivalent:</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--brand-emerald)', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>
                  {fiatSymbol}{convertedFiat.toLocaleString()} {selectedFiat}
                </span>
              </div>
            )}

            {/* Action Submit */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.95rem',
                backgroundColor: 'var(--brand-emerald)',
                color: '#080a0f',
                boxShadow: '0 4px 14px rgba(5, 196, 139, 0.25)',
                fontWeight: 700
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 20px rgba(5, 196, 139, 0.4)'}
              onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 14px rgba(5, 196, 139, 0.25)'}
            >
              Deposit Converted Balance
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
