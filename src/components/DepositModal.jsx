import React, { useState } from 'react';
import { useBet, EXCHANGE_RATES } from '../context/BetContext';
import { X, Copy, Check, Coins, ArrowRightLeft, QrCode, Landmark, Wallet, Upload } from 'lucide-react';

export default function DepositModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { selectedFiat, fiatSymbol, submitDepositRequest } = useBet();
  const [methodTab, setMethodTab] = useState(selectedFiat === 'INR' ? 'local' : 'crypto'); // 'local' or 'crypto'
  const [localMethod, setLocalMethod] = useState('upi'); // 'upi' or 'bank'
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20'); // For crypto network
  const [amount, setAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [txHash, setTxHash] = useState(''); // Transaction Hash/TxID
  const [screenshotName, setScreenshotName] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const AGENTS = [
    { name: 'Rohit Kumar', upi: 'rohit.predicto@ybl', speed: '2 mins', rate: '100%' },
    { name: 'Sneha Patel', upi: 'sneha.predicto@paytm', speed: '5 mins', rate: '99%' },
    { name: 'Vikram Singh', upi: 'vikram.predicto@okhdfc', speed: '1 min', rate: '100%' }
  ];
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  const getMockAddress = (asset, network = 'TRC20') => {
    if (asset === 'USDT') {
      if (network === 'TRC20') return 'TY3B19fMhWnD6b3Xz8Kq10098fS2c90';
      if (network === 'ERC20') return '0x71C569743a829e1fb428e932b1cb417281facf9a1';
      return '0x2918384df9a1b1cb417281fa093c859d04b6a93e (BSC)';
    }
    if (asset === 'BTC') return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    return '0x71C569743a829e1fb428e932b1cb417281facf9a1'; // ETH
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert entered crypto amount to active fiat
  const rate = EXCHANGE_RATES[selectedAsset][selectedFiat];
  const convertedFiat = amount ? parseFloat((parseFloat(amount) * rate).toFixed(2)) : 0;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setVerifying(true);
    
    // Simulate real bank/node verification
    setTimeout(() => {
      setVerifying(false);
      
      const methodLabel = methodTab === 'local'
        ? `UPI (Agent: ${selectedAgent.name})`
        : `Crypto (${selectedAsset} - ${selectedNetwork})`;

      const refValue = methodTab === 'local' ? utrNumber : txHash;
      const res = submitDepositRequest(methodLabel, amount, refValue, screenshotName);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setAmount('');
          setUtrNumber('');
          setTxHash('');
          setScreenshotName('');
          onClose();
        }, 3000);
      }
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0px', width: '420px', maxWidth: '92%' }}
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
            Deposit Funds
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
          >
            <X size={16} />
          </button>
        </div>

        {/* Verifying Overlay */}
        {verifying && (
          <div style={{
            padding: '50px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.1)',
              borderTop: '4px solid var(--brand-emerald)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <h4 style={{ color: '#ffffff' }}>Routing to P2P Agent...</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Transmitting your deposit receipt details to the selected P2P cashier agent. Please hold on...
            </p>
          </div>
        )}

        {/* Success Alert */}
        {!verifying && success && (
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
            <h4 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Request Submitted!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Your request for {methodTab === 'local' ? `${fiatSymbol}${parseFloat(amount).toLocaleString()}` : `${amount} ${selectedAsset}`} has been sent. The agent will verify the reference and release your balance shortly.
            </p>
          </div>
        )}

        {/* Main Content Form */}
        {!verifying && !success && (
          <form onSubmit={handleDepositSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Top Method Tabs (Local Gateway vs Crypto) - Show only if INR */}
            {selectedFiat === 'INR' && (
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => { setMethodTab('local'); setAmount(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: methodTab === 'local' ? 'var(--brand-emerald)' : 'transparent',
                    color: methodTab === 'local' ? '#080a0f' : '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Landmark size={14} /> UPI / Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => { setMethodTab('crypto'); setAmount(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: methodTab === 'crypto' ? 'var(--brand-emerald)' : 'transparent',
                    color: methodTab === 'crypto' ? '#080a0f' : '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Wallet size={14} /> Crypto Deposit
                </button>
              </div>
            )}

            {/* CASE A: UPI / Bank Transfer (Indian Gateway) */}
            {methodTab === 'local' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Mode sub-selector (UPI vs Bank) */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setLocalMethod('upi')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: localMethod === 'upi' ? 'rgba(5, 196, 139, 0.1)' : 'transparent',
                      border: `1.5px solid ${localMethod === 'upi' ? 'var(--brand-emerald)' : 'var(--border-color)'}`,
                      borderRadius: '6px',
                      color: localMethod === 'upi' ? 'var(--brand-emerald)' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    UPI ID & QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalMethod('bank')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: localMethod === 'bank' ? 'rgba(5, 196, 139, 0.1)' : 'transparent',
                      border: `1.5px solid ${localMethod === 'bank' ? 'var(--brand-emerald)' : 'var(--border-color)'}`,
                      borderRadius: '6px',
                      color: localMethod === 'bank' ? 'var(--brand-emerald)' : '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    IMPS Bank Account
                  </button>
                </div>

                {/* Agent Selector Card Grid */}
                {localMethod === 'upi' && (
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                      Select Active P2P Agent
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {AGENTS.map((agent) => {
                        const isSel = selectedAgent.name === agent.name;
                        return (
                          <div
                            key={agent.name}
                            onClick={() => setSelectedAgent(agent)}
                            style={{
                              backgroundColor: isSel ? 'rgba(5, 196, 139, 0.12)' : 'var(--bg-card)',
                              border: isSel ? '1.5px solid var(--brand-emerald)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '8px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}
                          >
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isSel ? 'var(--brand-emerald)' : '#ffffff' }}>
                              {agent.name.split(' ')[0]}
                            </span>
                            <span style={{ fontSize: '0.58rem', color: 'var(--brand-yellow)' }}>
                              ⚡ {agent.speed}
                            </span>
                            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                              {agent.rate} release
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-view: UPI Scanner */}
                {localMethod === 'upi' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    
                    {/* Dynamic QR Code Drawing */}
                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Stylized QR representation */}
                      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="white"/>
                        {/* Position Markers */}
                        <rect x="5" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                        <rect x="10" y="10" width="10" height="10" fill="black"/>
                        <rect x="75" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                        <rect x="80" y="10" width="10" height="10" fill="black"/>
                        <rect x="5" y="75" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                        <rect x="10" y="80" width="10" height="10" fill="black"/>
                        {/* Mock QR dots */}
                        <path d="M35 15h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm0 10h5v5h-5zm-10 10h5v5h-5zm-10 10h5v5h-5zm20 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm0 10h5v5h-5zm-15 10h5v5h-5zm-15 10h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5z" fill="black"/>
                        <path d="M35 35h15v5H35zm0 15h10v5H35zm30 15h15v5H65zm0 10h10v5H65z" fill="black"/>
                      </svg>
                      <span style={{ fontSize: '0.55rem', color: '#333333', fontWeight: 'bold', marginTop: '4px' }}>SCAN TO PAY</span>
                    </div>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>UPI ID (Agent {selectedAgent.name}):</span>
                        <p style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedAgent.upi}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedAgent.upi)}
                        style={{ border: 'none', background: 'none', color: 'var(--brand-emerald)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, flexShrink: 0, paddingLeft: '8px' }}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 4px' }}>
                      💡 Scan QR or pay to UPI. Upload receipt & enter the 12-digit UTR below.
                    </p>
                  </div>
                ) : (
                  // Sub-view: Bank Account Details
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                    
                    {[
                      { label: 'Account Name', val: 'PREDICTO11 ENTERPRISES' },
                      { label: 'Bank Name', val: 'ICICI Bank' },
                      { label: 'Account Number', val: '100912003847' },
                      { label: 'IFSC Code', val: 'ICIC0001009' },
                      { label: 'Branch', val: 'Mumbai Corporate' }
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.val}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.val)}
                            style={{ border: 'none', background: 'none', color: 'rgba(5, 196, 139, 0.7)', cursor: 'pointer' }}
                          >
                            📄
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Amount input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Deposit Amount ({fiatSymbol})
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter amount in ${selectedFiat} (Min ${fiatSymbol}100)`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="100"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* UTR / Ref ID */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      UTR / Reference Number (12 Digits)
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UPI Ref/UTR No."
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').substring(0, 12))}
                    required
                    pattern="\d{12}"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Optional Screenshot Upload */}
                <div>
                  <label style={{
                    border: '1.5px dashed var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-emerald)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <Upload size={14} style={{ color: 'var(--brand-emerald)' }} />
                    <span>{screenshotName || 'Upload Payment Receipt (Screenshot)'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setScreenshotName(e.target.files[0]?.name || '')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

              </div>
            )}
                  {/* CASE B: Crypto Deposit Network */}
            {methodTab === 'crypto' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

                {/* Network Selection for USDT */}
                {selectedAsset === 'USDT' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                      Select Deposit Network
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['TRC20', 'ERC20', 'BSC'].map((net) => {
                        const isSel = selectedNetwork === net;
                        return (
                          <button
                            key={net}
                            type="button"
                            onClick={() => setSelectedNetwork(net)}
                            style={{
                              flex: 1,
                              padding: '6px 8px',
                              backgroundColor: isSel ? 'rgba(5, 196, 139, 0.1)' : 'transparent',
                              border: `1.5px solid ${isSel ? 'var(--brand-emerald)' : 'var(--border-color)'}`,
                              borderRadius: '6px',
                              color: isSel ? 'var(--brand-emerald)' : '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {net} {net === 'TRC20' ? '(TRON)' : net === 'ERC20' ? '(Ethereum)' : '(BNB Chain)'}
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: '0.62rem', color: 'var(--live-red)', marginTop: '4px', display: 'block' }}>
                      ⚠️ Send only USDT to this address. Sending other assets will cause permanent loss.
                    </span>
                  </div>
                )}

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
                    {/* QR Code SVG representation */}
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="white"/>
                      <rect x="5" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                      <rect x="10" y="10" width="10" height="10" fill="black"/>
                      <rect x="75" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                      <rect x="80" y="10" width="10" height="10" fill="black"/>
                      <rect x="5" y="75" width="20" height="20" stroke="black" strokeWidth="6" fill="none"/>
                      <rect x="10" y="80" width="10" height="10" fill="black"/>
                      <path d="M35 15h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm0 10h5v5h-5zm-10 10h5v5h-5zm-10 10h5v5h-5zm20 0h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5zm0 10h5v5h-5zm-15 10h5v5h-5zm-15 10h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5z" fill="black"/>
                      <path d="M35 35h15v5H35zm0 15h10v5H35zm30 15h15v5H65zm0 10h10v5H65z" fill="black"/>
                    </svg>
                  </div>

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {selectedAsset} Address ({selectedAsset === 'USDT' ? selectedNetwork : 'Native'})
                    </span>
                    <p style={{ 
                      color: '#ffffff', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      marginTop: '2px',
                      fontFamily: 'monospace'
                    }} title={getMockAddress(selectedAsset, selectedNetwork)}>
                      {getMockAddress(selectedAsset, selectedNetwork)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(getMockAddress(selectedAsset, selectedNetwork))}
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

                {/* TxID / TxHash reference */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Transaction Hash / TxID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter blockchain transaction hash / TxID"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value.trim())}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Submit Button */}
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
                fontWeight: 700,
                marginTop: '10px'
              }}
            >
              {methodTab === 'local' ? 'Confirm Payment & Verify' : 'Deposit Converted Balance'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
