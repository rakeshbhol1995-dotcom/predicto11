import React, { useState, useEffect } from 'react';
import { useBet } from '../context/BetContext';
import { Trophy, HelpCircle, AlertTriangle, Disc, RefreshCw } from 'lucide-react';

const CasinoCustomLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(156, 39, 176, 0.6))' }}>
    <circle cx="16" cy="16" r="14" stroke="var(--brand-purple)" strokeWidth="2" strokeDasharray="4 2"/>
    <path d="M7 22L10 11L16 17L22 11L25 22H7Z" fill="var(--brand-gold)" stroke="var(--brand-gold)" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="11" r="1.5" fill="var(--brand-gold)"/>
    <circle cx="7" cy="20" r="1.5" fill="var(--brand-gold)"/>
    <circle cx="25" cy="20" r="1.5" fill="var(--brand-gold)"/>
  </svg>
);

export default function CasinoLobby() {
  const { user, balance, fiatSymbol, convertFiatToUsdt, convertUsdtToFiat, adjustCryptoBalance } = useBet();
  
  const [activeGame, setActiveGame] = useState('lobby'); // 'lobby' | 'slots' | 'roulette'
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Slots States
  const slotItems = ["🍒", "🍋", "🍊", "💎", "⭐", "🔔"];
  const [slots, setSlots] = useState(["🍒", "🍒", "🍒"]);
  const [slotsSpinning, setSlotsSpinning] = useState(false);
  const [slotsStake, setSlotsStake] = useState('100');

  // 2. Roulette States
  const [rouletteBetType, setRouletteBetType] = useState('red'); // 'red' | 'black' | 'number'
  const [rouletteBetNumber, setRouletteBetNumber] = useState('17');
  const [rouletteStake, setRouletteStake] = useState('100');
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState(null);

  // Red numbers on European roulette wheel
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const triggerSlotsSpin = () => {
    if (!user) {
      setErrorMessage("Please login or join now to play with your crypto wallet!");
      return;
    }
    setErrorMessage('');
    setFeedback('');

    const stakeVal = parseFloat(slotsStake);
    if (isNaN(stakeVal) || stakeVal <= 0) {
      setErrorMessage("Please enter a valid stake amount.");
      return;
    }

    const stakeUsdt = convertFiatToUsdt(stakeVal);
    
    // Attempt to deduct balance
    const successDeduct = adjustCryptoBalance(stakeUsdt, 'deduct');
    if (!successDeduct) {
      setErrorMessage("Insufficient balance in your wallet.");
      return;
    }

    setSlotsSpinning(true);
    let counter = 0;
    
    const spinInterval = setInterval(() => {
      setSlots([
        slotItems[Math.floor(Math.random() * slotItems.length)],
        slotItems[Math.floor(Math.random() * slotItems.length)],
        slotItems[Math.floor(Math.random() * slotItems.length)]
      ]);
      counter++;
      if (counter > 15) {
        clearInterval(spinInterval);
        
        // Final outcome
        const finalSlots = [
          slotItems[Math.floor(Math.random() * slotItems.length)],
          slotItems[Math.floor(Math.random() * slotItems.length)],
          slotItems[Math.floor(Math.random() * slotItems.length)]
        ];
        
        setSlots(finalSlots);
        setSlotsSpinning(false);
        calculateSlotsPayout(finalSlots, stakeUsdt);
      }
    }, 85);
  };

  const calculateSlotsPayout = (finalReels, stakeUsdt) => {
    const [r1, r2, r3] = finalReels;
    let multiplier = 0;
    let winMsg = '';

    if (r1 === r2 && r2 === r3) {
      if (r1 === '💎') {
        multiplier = 50; // Grand Jackpot
        winMsg = "JACKPOT! Triple Diamonds!";
      } else if (r1 === '⭐') {
        multiplier = 25;
        winMsg = "SUPER WIN! Triple Stars!";
      } else {
        multiplier = 8;
        winMsg = `BIG WIN! Three of a kind (${r1})`;
      }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      multiplier = 1.5; // Small win
      winMsg = "Nice! Double match!";
    }

    if (multiplier > 0) {
      const payoutUsdt = stakeUsdt * multiplier;
      adjustCryptoBalance(payoutUsdt, 'credit');
      const payoutFiat = convertUsdtToFiat(payoutUsdt);
      setFeedback(`🎉 ${winMsg} Won ${fiatSymbol}${payoutFiat.toLocaleString()}`);
    } else {
      setFeedback("Better luck next spin!");
    }
  };

  const triggerRouletteSpin = () => {
    if (!user) {
      setErrorMessage("Please login or join now to play with your crypto wallet!");
      return;
    }
    setErrorMessage('');
    setFeedback('');
    setRouletteResult(null);

    const stakeVal = parseFloat(rouletteStake);
    if (isNaN(zoom => rouletteStake)) {
      setErrorMessage("Please enter a valid stake amount.");
      return;
    }

    if (rouletteBetType === 'number') {
      const numVal = parseInt(rouletteBetNumber);
      if (isNaN(numVal) || numVal < 0 || numVal > 36) {
        setErrorMessage("Please select a number between 0 and 36.");
        return;
      }
    }

    const stakeUsdt = convertFiatToUsdt(stakeVal);
    const successDeduct = adjustCryptoBalance(stakeUsdt, 'deduct');
    if (!successDeduct) {
      setErrorMessage("Insufficient balance in your wallet.");
      return;
    }

    setRouletteSpinning(true);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      let winningColor = 'black';
      if (winningNumber === 0) {
        winningColor = 'green';
      } else if (redNumbers.includes(winningNumber)) {
        winningColor = 'red';
      }

      const result = { number: winningNumber, color: winningColor };
      setRouletteResult(result);
      setRouletteSpinning(false);
      calculateRoulettePayout(result, stakeUsdt);
    }, 2000);
  };

  const calculateRoulettePayout = (result, stakeUsdt) => {
    let multiplier = 0;
    let won = false;

    if (rouletteBetType === 'red' && result.color === 'red') {
      multiplier = 2;
      won = true;
    } else if (rouletteBetType === 'black' && result.color === 'black') {
      multiplier = 2;
      won = true;
    } else if (rouletteBetType === 'number' && result.number === parseInt(rouletteBetNumber)) {
      multiplier = 35;
      won = true;
    }

    if (won) {
      const payoutUsdt = stakeUsdt * multiplier;
      adjustCryptoBalance(payoutUsdt, 'credit');
      const payoutFiat = convertUsdtToFiat(payoutUsdt);
      setFeedback(`🎉 Winning Slot: ${result.number} ${result.color.toUpperCase()}! Won ${fiatSymbol}${payoutFiat.toLocaleString()}`);
    } else {
      setFeedback(`Winning Slot: ${result.number} ${result.color.toUpperCase()}. Better luck next round!`);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Dynamic Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1f0c2e 0%, #050308 100%)',
        border: '1.5px solid var(--brand-purple)',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(156, 39, 176, 0.2)'
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'var(--brand-purple)', filter: 'blur(50px)', opacity: 0.4 }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CasinoCustomLogo />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Predicto11 Live Casino</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Spin classic video reels or test your strategy in live European roulette wheel tables.</p>
          </div>
        </div>
      </div>

      {/* Navigation sub-bar */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button
          onClick={() => { setActiveGame('lobby'); setErrorMessage(''); setFeedback(''); }}
          style={{
            backgroundColor: activeGame === 'lobby' ? 'var(--brand-purple)' : 'rgba(255,255,255,0.03)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Lobby Grid
        </button>
        <button
          onClick={() => { setActiveGame('slots'); setErrorMessage(''); setFeedback(''); }}
          style={{
            backgroundColor: activeGame === 'slots' ? 'var(--brand-purple)' : 'rgba(255,255,255,0.03)',
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
          🎰 Jackpot Slots
        </button>
        <button
          onClick={() => { setActiveGame('roulette'); setErrorMessage(''); setFeedback(''); }}
          style={{
            backgroundColor: activeGame === 'roulette' ? 'var(--brand-purple)' : 'rgba(255,255,255,0.03)',
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
          <Disc size={14} /> Live Roulette
        </button>
      </div>

      {/* Global Alerts inside games */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 62, 108, 0.12)',
          border: '1px solid var(--live-red)',
          borderRadius: '6px',
          padding: '10px',
          fontSize: '0.82rem',
          color: '#ffffff'
        }}>
          <AlertTriangle size={16} style={{ color: 'var(--live-red)' }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {feedback && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(198, 255, 0, 0.08)',
          border: '1px solid var(--brand-yellow)',
          borderRadius: '6px',
          padding: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#ffffff'
        }}>
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. LOBBY VIEW */}
      {activeGame === 'lobby' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Game 1 card */}
          <div className="card-panel" style={{
            position: 'relative',
            height: '240px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(156, 39, 176, 0.25)',
            background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <span style={{ fontSize: '2rem' }}>🎰</span>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '8px', fontWeight: 800 }}>Predicto Jackpot Slots</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Match diamonds, stars, or cherries. Payouts up to **50x** multiplier on matching sets!
              </p>
            </div>
            <button
              onClick={() => setActiveGame('slots')}
              className="btn-primary"
              style={{ alignSelf: 'flex-start', backgroundColor: 'var(--brand-purple)', color: '#ffffff', boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)' }}
            >
              Play Now
            </button>
          </div>

          {/* Game 2 card */}
          <div className="card-panel" style={{
            position: 'relative',
            height: '240px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(156, 39, 176, 0.25)',
            background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <span style={{ fontSize: '2rem' }}>🎡</span>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '8px', fontWeight: 800 }}>Live European Roulette</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Bet on Red/Black or input your lucky numbers (0-36) for potential **35x** jackpot returns.
              </p>
            </div>
            <button
              onClick={() => setActiveGame('roulette')}
              className="btn-primary"
              style={{ alignSelf: 'flex-start', backgroundColor: 'var(--brand-purple)', color: '#ffffff', boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)' }}
            >
              Play Now
            </button>
          </div>
        </div>
      )}

      {/* 2. JACKPOT SLOTS GAME PANEL */}
      {activeGame === 'slots' && (
        <div className="card-panel" style={{
          padding: '30px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(16, 21, 30, 0.9) 0%, rgba(5, 7, 10, 0.95) 100%)'
        }}>
          <h3 style={{ color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <Trophy size={18} /> PREDICTO GRAND SLOTS
          </h3>

          {/* Slots Reels Row */}
          <div style={{ display: 'flex', gap: '16px', margin: '10px 0' }}>
            {slots.map((symbol, idx) => (
              <div
                key={idx}
                style={{
                  width: '90px',
                  height: '110px',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  border: '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(156,39,176,0.1)'
                }}
                className={slotsSpinning ? 'slots-reel-spinning' : ''}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Slot Stakes Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '300px', width: '100%' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>STAKE ({fiatSymbol}):</label>
            <input
              type="number"
              className="form-input"
              value={slotsStake}
              onChange={(e) => setSlotsStake(e.target.value)}
              disabled={slotsSpinning}
              style={{ textAlign: 'center', fontWeight: 'bold' }}
            />
          </div>

          <button
            onClick={triggerSlotsSpin}
            disabled={slotsSpinning}
            className="btn-primary"
            style={{
              width: '100%',
              maxWidth: '220px',
              padding: '12px',
              backgroundColor: slotsSpinning ? 'rgba(255,255,255,0.05)' : 'var(--brand-purple)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)'
            }}
          >
            <RefreshCw size={16} className={slotsSpinning ? 'slots-reel-spinning' : ''} />
            {slotsSpinning ? "SPINNING..." : "SPIN REELS"}
          </button>
        </div>
      )}

      {/* 3. LIVE ROULETTE GAME PANEL */}
      {activeGame === 'roulette' && (
        <div className="card-panel roulette-grid" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(16, 21, 30, 0.9) 0%, rgba(5, 7, 10, 0.95) 100%)'
        }}>
          {/* Left: Roulette Wheel board representation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '8px solid var(--brand-purple)',
              background: 'radial-gradient(circle, #0c0814 20%, #170d24 70%, #050308 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(156,39,176,0.3)'
            }}
              className={rouletteSpinning ? 'roulette-spinning' : ''}
            >
              {/* Spinner Needle */}
              <div style={{
                position: 'absolute',
                top: '10px',
                bottom: '10px',
                width: '2px',
                background: 'rgba(255,255,255,0.3)',
                transform: 'rotate(45deg)'
              }} />
              <div style={{
                position: 'absolute',
                left: '10px',
                right: '10px',
                height: '2px',
                background: 'rgba(255,255,255,0.3)',
                transform: 'rotate(-45deg)'
              }} />

              {/* Inner Dial */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-dark)',
                border: '3px solid var(--brand-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
              }}>
                {rouletteSpinning ? (
                  <span style={{ fontSize: '0.65rem', color: 'var(--brand-gold)', fontWeight: 'bold' }}>SPINNING</span>
                ) : rouletteResult ? (
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: 900, 
                    color: rouletteResult.color === 'red' ? 'var(--live-red)' : rouletteResult.color === 'green' ? 'var(--live-green)' : '#ffffff' 
                  }}>
                    {rouletteResult.number}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>READY</span>
                )}
              </div>
            </div>

            {rouletteResult && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Result: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{rouletteResult.number} ({rouletteResult.color.toUpperCase()})</span>
              </div>
            )}
          </div>

          {/* Right: Bet controls panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              Place Roulette Chips
            </h4>

            {/* Bet Type buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '8px' }}>
              <button
                onClick={() => setRouletteBetType('red')}
                style={{
                  backgroundColor: rouletteBetType === 'red' ? 'var(--live-red)' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'red' ? '2px solid #ffffff' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔴 RED (2x)
              </button>
              <button
                onClick={() => setRouletteBetType('black')}
                style={{
                  backgroundColor: rouletteBetType === 'black' ? '#121212' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'black' ? '2px solid var(--brand-purple)' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ⚫ BLACK (2x)
              </button>
              <button
                onClick={() => setRouletteBetType('number')}
                style={{
                  backgroundColor: rouletteBetType === 'number' ? 'var(--brand-gold)' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'number' ? '2px solid #ffffff' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: rouletteBetType === 'number' ? '#080a0f' : '#ffffff',
                  padding: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔢 NUMBER (35x)
              </button>
            </div>

            {/* Number Selector input */}
            {rouletteBetType === 'number' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CHOOSE NUMBER (0 - 36):</label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  className="form-input"
                  value={rouletteBetNumber}
                  onChange={(e) => setRouletteBetNumber(e.target.value)}
                  style={{ width: '80px', textAlign: 'center' }}
                />
              </div>
            )}

            {/* Stake Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CHIP STAKE ({fiatSymbol}):</label>
              <input
                type="number"
                className="form-input"
                value={rouletteStake}
                onChange={(e) => setRouletteStake(e.target.value)}
                disabled={rouletteSpinning}
              />
            </div>

            <button
              onClick={triggerRouletteSpin}
              disabled={rouletteSpinning}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--brand-purple)',
                color: '#ffffff',
                padding: '10px',
                marginTop: '6px',
                fontSize: '0.8rem',
                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)'
              }}
            >
              {rouletteSpinning ? "SPINNING TABLE..." : "SPIN WHEEL"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
