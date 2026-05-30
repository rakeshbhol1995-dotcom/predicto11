import React, { useState, useEffect, useRef } from 'react';
import { useBet } from '../context/BetContext';
import { Trophy, HelpCircle, AlertTriangle, Disc, RefreshCw, Volume2, VolumeX, Plane, Star, Coins, Zap, RefreshCcw } from 'lucide-react';

const playCasinoSound = (type, soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'spin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.002, audioCtx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.15);
      });
    } else if (type === 'lose') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'cashout') {
      // Satisfying ascending chime
      const notes = [587.33, 659.25, 880.00, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.06);
        osc.stop(audioCtx.currentTime + idx * 0.06 + 0.12);
      });
    } else if (type === 'wheel_tick') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } else if (type === 'aviator_crash') {
      // Deep dramatic bass rumble explosion
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, audioCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    }
  } catch (e) {
    console.warn(e);
  }
};

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
  const { 
    user, balance, fiatSymbol, convertFiatToUsdt, convertUsdtToFiat, 
    adjustCryptoBalance, addWagerVolume, spinDailyWheel, lastSpinTimestamp 
  } = useBet();
  
  const [activeGame, setActiveGame] = useState('lobby'); // 'lobby' | 'slots' | 'roulette' | 'crash' | 'fortune'
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Red numbers on European roulette wheel
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

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

  // 3. Aviator Crash Game States & Engine refs
  const [crashState, setCrashState] = useState('idle'); // 'idle' | 'betting' | 'flying' | 'crashed'
  const [multiplier, setMultiplier] = useState(1.00);
  const [countdown, setCountdown] = useState(5.0);
  const [crashHistory, setCrashHistory] = useState([1.45, 3.20, 1.08, 12.44, 2.10, 1.95, 24.11, 1.15]);

  // Dual Bet Stakes
  const [slip1, setSlip1] = useState({ stake: '100', betPlaced: false, cashedOut: false, autoCashout: false, autoValue: '2.00', payout: 0 });
  const [slip2, setSlip2] = useState({ stake: '200', betPlaced: false, cashedOut: false, autoCashout: false, autoValue: '3.00', payout: 0 });

  const crashTargetRef = useRef(1.00);
  const timeElapsedRef = useRef(0);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const flightHumAudioRef = useRef(null);
  const particlesRef = useRef([]);
  const starParticlesRef = useRef([]);

  // 4. Fortune Wheel States
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [cooldownPassBypass, setCooldownPassBypass] = useState(false);
  const [remainingCooldownText, setRemainingCooldownText] = useState('');

  // ----------------------------------------------------
  // Audio oscillator logic for continuous flight engine hum
  // ----------------------------------------------------
  const startFlightHum = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth'; // gives a rich jet drone sound
      osc.frequency.setValueAtTime(80, audioCtx.currentTime); // low start hum
      
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime); // soft background drone
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      
      flightHumAudioRef.current = { audioCtx, osc, gainNode };
    } catch (e) {
      console.warn("Could not start Web Audio API hum:", e);
    }
  };

  const updateFlightHum = (currMult) => {
    if (flightHumAudioRef.current) {
      const { osc, gainNode, audioCtx } = flightHumAudioRef.current;
      // Frequency ramps up smoothly matching speed of flight!
      const targetFreq = 80 + currMult * 20;
      osc.frequency.setValueAtTime(Math.min(300, targetFreq), audioCtx.currentTime);
      // Volume increases slightly as it speeds up
      gainNode.gain.setValueAtTime(Math.min(0.03, 0.015 + (currMult * 0.002)), audioCtx.currentTime);
    }
  };

  const stopFlightHum = () => {
    if (flightHumAudioRef.current) {
      try {
        const { osc } = flightHumAudioRef.current;
        osc.stop();
      } catch (e) {}
      flightHumAudioRef.current = null;
    }
  };

  // ----------------------------------------------------
  // SLOT SPINS PAYOUT
  // ----------------------------------------------------
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
    const successDeduct = adjustCryptoBalance(stakeUsdt, 'deduct');
    if (!successDeduct) {
      setErrorMessage("Insufficient balance in your wallet.");
      return;
    }

    // Credits wager volume for VIP rewards
    addWagerVolume(stakeUsdt);

    setSlotsSpinning(true);
    playCasinoSound('spin', soundEnabled);
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
        multiplier = 50; 
        winMsg = "JACKPOT! Triple Diamonds!";
      } else if (r1 === '⭐') {
        multiplier = 25;
        winMsg = "SUPER WIN! Triple Stars!";
      } else {
        multiplier = 8;
        winMsg = `BIG WIN! Three of a kind (${r1})`;
      }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      multiplier = 1.5; 
      winMsg = "Nice! Double match!";
    }

    if (multiplier > 0) {
      const payoutUsdt = stakeUsdt * multiplier;
      adjustCryptoBalance(payoutUsdt, 'credit');
      const payoutFiat = convertUsdtToFiat(payoutUsdt);
      setFeedback(`🎉 ${winMsg} Won ${fiatSymbol}${payoutFiat.toLocaleString()}`);
      playCasinoSound('win', soundEnabled);
    } else {
      setFeedback("Better luck next spin!");
      playCasinoSound('lose', soundEnabled);
    }
  };

  // ----------------------------------------------------
  // EUROPEAN ROULETTE PAYOUT
  // ----------------------------------------------------
  const triggerRouletteSpin = () => {
    if (!user) {
      setErrorMessage("Please login or join now to play with your crypto wallet!");
      return;
    }
    setErrorMessage('');
    setFeedback('');
    setRouletteResult(null);

    const stakeVal = parseFloat(rouletteStake);
    if (isNaN(stakeVal) || stakeVal <= 0) {
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

    // Credits wager volume for VIP rewards
    addWagerVolume(stakeUsdt);

    setRouletteSpinning(true);
    playCasinoSound('spin', soundEnabled);

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
      playCasinoSound('win', soundEnabled);
    } else {
      setFeedback(`Winning Slot: ${result.number} ${result.color.toUpperCase()}. Better luck next round!`);
      playCasinoSound('lose', soundEnabled);
    }
  };

  // ----------------------------------------------------
  // AVIATOR CRASH PHYSICS ENGINE & LOOP
  // ----------------------------------------------------
  useEffect(() => {
    if (activeGame !== 'crash') {
      stopFlightHum();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    // Initialize betting countdown
    setCrashState('betting');
    setCountdown(5.0);
    setMultiplier(1.00);

    // Dual slips cleanups
    setSlip1(prev => ({ ...prev, betPlaced: false, cashedOut: false, payout: 0 }));
    setSlip2(prev => ({ ...prev, betPlaced: false, cashedOut: false, payout: 0 }));

    return () => {
      stopFlightHum();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeGame]);

  // Handle betting countdown countdown
  useEffect(() => {
    if (activeGame !== 'crash' || crashState !== 'betting') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          startFlightPhase();
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activeGame, crashState]);

  const startFlightPhase = () => {
    setCrashState('flying');
    setMultiplier(1.00);
    timeElapsedRef.current = 0;
    
    // Choose dynamic crash target using house edge formula
    // 9% instant crash at 1.00 - 1.05x, else exponential curve up to 100x
    const instantCrash = Math.random() < 0.09;
    if (instantCrash) {
      crashTargetRef.current = parseFloat((1.00 + Math.random() * 0.05).toFixed(2));
    } else {
      const roll = Math.random();
      // Weighted distribution: 60% stay under 3x, 30% go 3x-15x, 10% explode to 15x-80x
      if (roll < 0.60) {
        crashTargetRef.current = parseFloat((1.05 + Math.random() * 2.0).toFixed(2));
      } else if (roll < 0.90) {
        crashTargetRef.current = parseFloat((3.0 + Math.random() * 12.0).toFixed(2));
      } else {
        crashTargetRef.current = parseFloat((15.0 + Math.random() * 65.0).toFixed(2));
      }
    }

    startFlightHum();
    runFlightLoop();
  };

  const runFlightLoop = () => {
    if (activeGame !== 'crash') return;
    
    timeElapsedRef.current += 1.6; // step duration
    const timeSec = timeElapsedRef.current / 100;
    
    // Exponential climbing function: multiplier rises faster the longer it flies!
    const currMult = parseFloat(Math.pow(1.065, timeSec).toFixed(2));
    setMultiplier(currMult);
    updateFlightHum(currMult);

    // Auto-cashouts triggers
    setSlip1(prev => {
      if (prev.betPlaced && !prev.cashedOut && prev.autoCashout && currMult >= parseFloat(prev.autoValue)) {
        triggerAutoCashout(1, currMult, prev.stake);
        return { ...prev, cashedOut: true, payout: parseFloat((convertFiatToUsdt(parseFloat(prev.stake)) * currMult).toFixed(4)) };
      }
      return prev;
    });

    setSlip2(prev => {
      if (prev.betPlaced && !prev.cashedOut && prev.autoCashout && currMult >= parseFloat(prev.autoValue)) {
        triggerAutoCashout(2, currMult, prev.stake);
        return { ...prev, cashedOut: true, payout: parseFloat((convertFiatToUsdt(parseFloat(prev.stake)) * currMult).toFixed(4)) };
      }
      return prev;
    });

    // Check for crash event
    if (currMult >= crashTargetRef.current) {
      triggerCrash(currMult);
    } else {
      drawCanvas(currMult);
      animationFrameRef.current = requestAnimationFrame(runFlightLoop);
    }
  };

  const triggerAutoCashout = (slipNum, multVal, stakeFiat) => {
    const stakeUsdt = convertFiatToUsdt(parseFloat(stakeFiat));
    const winAmtUsdt = stakeUsdt * multVal;
    adjustCryptoBalance(winAmtUsdt, 'credit');
    playCasinoSound('cashout', soundEnabled);
  };

  const triggerCrash = (finalMult) => {
    stopFlightHum();
    playCasinoSound('aviator_crash', soundEnabled);
    setCrashState('crashed');
    setCrashHistory(prev => [finalMult, ...prev.slice(0, 8)]);
    drawCanvas(finalMult, true);

    // End round: wait 3 seconds, then reset to bettingcountdown
    setTimeout(() => {
      if (activeGame === 'crash') {
        setCrashState('betting');
        setCountdown(5.0);
        setMultiplier(1.00);
        setSlip1(prev => ({ ...prev, betPlaced: false, cashedOut: false, payout: 0 }));
        setSlip2(prev => ({ ...prev, betPlaced: false, cashedOut: false, payout: 0 }));
      }
    }, 3500);
  };

  // Cashout manually trigger
  const handleCashout = (slipNum) => {
    if (crashState !== 'flying') return;
    
    if (slipNum === 1) {
      if (!slip1.betPlaced || slip1.cashedOut) return;
      const stakeUsdt = convertFiatToUsdt(parseFloat(slip1.stake));
      const winnings = stakeUsdt * multiplier;
      adjustCryptoBalance(winnings, 'credit');
      playCasinoSound('cashout', soundEnabled);
      setSlip1(prev => ({ ...prev, cashedOut: true, payout: parseFloat(winnings.toFixed(4)) }));
    } else {
      if (!slip2.betPlaced || slip2.cashedOut) return;
      const stakeUsdt = convertFiatToUsdt(parseFloat(slip2.stake));
      const winnings = stakeUsdt * multiplier;
      adjustCryptoBalance(winnings, 'credit');
      playCasinoSound('cashout', soundEnabled);
      setSlip2(prev => ({ ...prev, cashedOut: true, payout: parseFloat(winnings.toFixed(4)) }));
    }
  };

  // Place bet slip triggers
  const handlePlaceAviatorBet = (slipNum) => {
    if (!user) {
      setErrorMessage("Please login or join now to play Aviator with crypto!");
      return;
    }
    if (crashState !== 'betting') return;
    setErrorMessage('');

    if (slipNum === 1) {
      const stakeVal = parseFloat(slip1.stake);
      if (isNaN(stakeVal) || stakeVal <= 0) return;
      const usdt = convertFiatToUsdt(stakeVal);
      const success = adjustCryptoBalance(usdt, 'deduct');
      if (success) {
        addWagerVolume(usdt);
        setSlip1(prev => ({ ...prev, betPlaced: true }));
      } else {
        setErrorMessage("Insufficient balance in your wallet for Stake Slip 1.");
      }
    } else {
      const stakeVal = parseFloat(slip2.stake);
      if (isNaN(stakeVal) || stakeVal <= 0) return;
      const usdt = convertFiatToUsdt(stakeVal);
      const success = adjustCryptoBalance(usdt, 'deduct');
      if (success) {
        addWagerVolume(usdt);
        setSlip2(prev => ({ ...prev, betPlaced: true }));
      } else {
        setErrorMessage("Insufficient balance in your wallet for Stake Slip 2.");
      }
    }
  };

  // Draw glowing canvas curve of Aviator Flight
  const drawCanvas = (currMult, isCrashed = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Initialize cosmic stars if empty
    if (starParticlesRef.current.length === 0) {
      const stars = [];
      for (let i = 0; i < 25; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * (H - 40),
          size: Math.random() * 1.5 + 0.5,
          speedMultiplier: Math.random() * 0.8 + 0.4
        });
      }
      starParticlesRef.current = stars;
    }

    // Dynamic flight velocity progress mapping
    const progress = Math.min(1.0, (currMult - 1.00) / 10);

    // 1. Update and Draw Parallax Starfield & Cosmic Speed Dust Trails
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    starParticlesRef.current.forEach(star => {
      // Cosmic stars fly backward faster as the flight gains speed!
      const speedX = star.speedMultiplier * (2 + progress * 7);
      const speedY = star.speedMultiplier * (0.8 + progress * 3);
      
      star.x -= speedX;
      star.y += speedY;
      
      // Infinite wrap around screen boundaries
      if (star.x < 0 || star.y > H - 40) {
        star.x = W + Math.random() * 30;
        star.y = Math.random() * (H - 60);
      }
      
      // Render beautiful purple speed trails for high velocity feel!
      ctx.beginPath();
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * star.speedMultiplier * (1 + progress)})`;
      ctx.lineWidth = star.size * 1.5;
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(star.x + speedX * 1.8, star.y - speedY * 1.8);
      ctx.stroke();
      
      // Draw cosmic dot itself
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Grid Lines moving velocity
    const timeOffset = timeElapsedRef.current ? (timeElapsedRef.current * 0.12) % 40 : 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    
    for (let x = -timeOffset; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H - 40);
      ctx.stroke();
    }
    for (let y = timeOffset; y < H - 40; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Draw bottom border axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H - 40);
    ctx.lineTo(W, H - 40);
    ctx.stroke();

    // Map base flight path coordinates
    const startX = 45;
    const startY = H - 40;
    const jetX = startX + progress * (W - 120);
    const jetY = startY - Math.pow(progress, 1.8) * (H - 120);

    // Apply high-frequency turbulence shake that intensifies as multiplier grows!
    const turbulence = (crashState === 'flying' && !isCrashed) ? (Math.random() - 0.5) * (0.8 + progress * 2.5) : 0;
    const shakenJetX = jetX + turbulence * 0.7;
    const shakenJetY = jetY + turbulence;

    if (currMult > 1.00) {
      // 1. Draw glowing translucent gradient under flight curve path
      const grad = ctx.createLinearGradient(0, shakenJetY, 0, startY);
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo((startX + shakenJetX) / 2, startY, shakenJetX, shakenJetY);
      ctx.lineTo(shakenJetX, startY);
      ctx.closePath();
      ctx.fill();

      // 2. Draw flight line path itself with neon red glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff477e';
      ctx.strokeStyle = '#ff477e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo((startX + shakenJetX) / 2, startY, shakenJetX, shakenJetY);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }

    const flightAngle = -Math.atan2(startY - shakenJetY, shakenJetX - startX) * 0.7;

    // 2. Spawn and Draw Engine Exhaust Smoke / Fire particles
    if (crashState === 'flying' && !isCrashed) {
      // Find exact engine coordinate at rear of the fuselage
      const engineX = shakenJetX - Math.cos(flightAngle) * 15;
      const engineY = shakenJetY - Math.sin(flightAngle) * 15;
      
      // Spawn new thruster particles in each frame
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: engineX,
          y: engineY,
          vx: -Math.cos(flightAngle + (Math.random() - 0.5) * 0.35) * (Math.random() * 2.5 + 1.2),
          vy: -Math.sin(flightAngle + (Math.random() - 0.5) * 0.35) * (Math.random() * 2.5 + 1.2),
          size: Math.random() * 4.5 + 2.0,
          color: Math.random() < 0.35 ? '#ff3e6c' : Math.random() < 0.75 ? '#ff8800' : '#ffd700',
          alpha: 1.0,
          decay: Math.random() * 0.04 + 0.025
        });
      }
    }

    // Update, render, and filter active exhaust smoke particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      
      if (p.alpha <= 0) return false;
      
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      // Bright neon glowing particles
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
      return true;
    });

    // 3. Draw Supersconic Thruster Engine Fire Cone
    if (!isCrashed && crashState === 'flying') {
      ctx.save();
      ctx.translate(shakenJetX, shakenJetY);
      ctx.rotate(flightAngle);
      
      // Bright jittering engine fire
      const flameLength = 16 + Math.random() * 10;
      const gradFlame = ctx.createLinearGradient(-12, 0, -12 - flameLength, 0);
      gradFlame.addColorStop(0, '#ffffff');
      gradFlame.addColorStop(0.2, '#ffd700');
      gradFlame.addColorStop(0.5, '#ff8800');
      gradFlame.addColorStop(1, 'rgba(255, 62, 108, 0)');
      
      ctx.fillStyle = gradFlame;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff8800';
      
      ctx.beginPath();
      ctx.moveTo(-11, -4.5);
      ctx.lineTo(-11 - flameLength, 0);
      ctx.lineTo(-11, 4.5);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }

    // 4. Draw custom vector supersonic jet silhouette (replaces unreliable system emoji fonts)
    if (!isCrashed) {
      ctx.save();
      ctx.translate(shakenJetX, shakenJetY);
      ctx.rotate(flightAngle);
      
      // Neon thruster glow shadow
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#c6ff00';
      
      // Swept back wings (fiery orange trims)
      ctx.fillStyle = '#ff8800';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      
      // Left swept wing
      ctx.beginPath();
      ctx.moveTo(-2, -3);
      ctx.lineTo(-12, -18);
      ctx.lineTo(-18, -18);
      ctx.lineTo(-8, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right swept wing
      ctx.beginPath();
      ctx.moveTo(-2, 3);
      ctx.lineTo(-12, 18);
      ctx.lineTo(-18, 18);
      ctx.lineTo(-8, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tail Stabilizer wings
      ctx.fillStyle = '#c6ff00';
      ctx.beginPath();
      ctx.moveTo(-12, -3);
      ctx.lineTo(-18, -9);
      ctx.lineTo(-20, -9);
      ctx.lineTo(-16, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-12, 3);
      ctx.lineTo(-18, 9);
      ctx.lineTo(-20, 9);
      ctx.lineTo(-16, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Main Fuselage body (glowing golden shell)
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(16, 0); // supersonic nose tip pointing forward
      ctx.quadraticCurveTo(8, -5, -12, -4);
      ctx.lineTo(-15, 0); // rear engine nozzle
      ctx.lineTo(-12, 4);
      ctx.quadraticCurveTo(8, 5, 16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing glass cockpit windshield (cyan fluorescent)
      ctx.fillStyle = '#00ffaa';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00ffaa';
      ctx.beginPath();
      ctx.ellipse(3, 0, 4, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else {
      // Draw massive boom explosion wave
      ctx.save();
      ctx.translate(shakenJetX, shakenJetY);
      ctx.font = '42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💥', 0, 0);
      ctx.restore();
    }
  };

  // Initial draw loop for betting counting/idle state
  useEffect(() => {
    if (activeGame === 'crash' && crashState === 'betting') {
      const canvas = canvasRef.current;
      if (canvas) {
        drawCanvas(1.00);
      }
    }
  }, [activeGame, crashState]);

  // ----------------------------------------------------
  // VIP DAILY SPIN WHEEL ACTIONS
  // ----------------------------------------------------
  useEffect(() => {
    if (activeGame !== 'fortune') return;

    // Refresh remaining cooldown text
    const checkCooldown = () => {
      const now = Date.now();
      const COOLDOWN_MS = 24 * 60 * 60 * 1000;
      if (lastSpinTimestamp && (now - lastSpinTimestamp < COOLDOWN_MS)) {
        const remaining = COOLDOWN_MS - (now - lastSpinTimestamp);
        const hrs = Math.floor(remaining / (3600 * 1000));
        const mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
        const secs = Math.floor((remaining % (60 * 1000)) / 1000);
        setRemainingCooldownText(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setRemainingCooldownText('');
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [activeGame, lastSpinTimestamp]);

  const spinFortuneWheel = () => {
    if (!user) {
      setErrorMessage("Please login to claim your VIP Loyalty daily spins reward!");
      return;
    }
    setErrorMessage('');
    setFeedback('');

    if (wheelSpinning) return;

    // If cooldown exists and developer bypass cheat is NOT checked
    const now = Date.now();
    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    if (!cooldownPassBypass && lastSpinTimestamp && (now - lastSpinTimestamp < COOLDOWN_MS)) {
      setErrorMessage("Daily reward is locked. Use the cheat code below to pass 24h instantly!");
      return;
    }

    setWheelSpinning(true);
    playCasinoSound('spin', soundEnabled);

    // Call context spin daily wheel
    const result = spinDailyWheel(cooldownPassBypass);

    // Map result prize to wheel rotation sector
    // 6 sectors clockwise in wheel:
    // Sector 0 (0-60 deg): $50 USDT (Red)
    // Sector 1 (60-120 deg): $20 USDT (Teal)
    // Sector 2 (120-180 deg): $15 USDT (Gold)
    // Sector 3 (180-240 deg): $10 USDT (Blue)
    // Sector 4 (240-300 deg): $5 USDT (Emerald)
    // Sector 5 (300-360 deg): $0 USDT (Slate)
    
    let prizeAngle = 0; // angle to align center of sector under pointer (top pointer is at 0 deg)
    switch(result.prize) {
      case 50:
        prizeAngle = 30; // sector 0
        break;
      case 20:
        prizeAngle = 330; // sector 5 (reversed clockwise calculation)
        break;
      case 15:
        prizeAngle = 270; // sector 4
        break;
      case 10:
        prizeAngle = 210; // sector 3
        break;
      case 5:
        prizeAngle = 150; // sector 2
        break;
      default:
        prizeAngle = 90; // sector 1 ($0)
        break;
    }

    // Set rotation degrees: spin 5 full times (1800 deg) plus slice angle offset
    const randomFudge = (Math.random() - 0.5) * 20; // add slight offset inside slice for realism
    const targetDeg = wheelRotation + 1800 + (360 - prizeAngle) + randomFudge;
    
    // Simulate peg clicking ticking sound effects
    let tickCount = 0;
    const ticksInterval = setInterval(() => {
      tickCount++;
      if (tickCount < 20) {
        playCasinoSound('wheel_tick', soundEnabled);
      } else {
        clearInterval(ticksInterval);
      }
    }, 180);

    setWheelRotation(targetDeg);

    setTimeout(() => {
      setWheelSpinning(false);
      clearInterval(ticksInterval);
      
      if (result.success) {
        setFeedback(result.message);
        playCasinoSound(result.prize > 0 ? 'win' : 'lose', soundEnabled);
      } else {
        setErrorMessage(result.message);
      }
    }, 4100);
  };

  return (
    <div className="casino-lobby-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', height: '100%' }}>
      
      {/* Premium Gradient Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1f0c2e 0%, #050308 100%)',
        border: '1.5px solid var(--brand-purple)',
        borderRadius: '12px',
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(156, 39, 176, 0.2)',
        flexShrink: 0
      }}>
        {/* Glow grid background */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'var(--brand-purple)', filter: 'blur(50px)', opacity: 0.4 }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyB: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CasinoCustomLogo />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Predicto11 Live Casino</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multiply your crypto assets. Play classic Slots, Live Roulette, Aviator Crash, or claim VIP Daily Wheels!</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              const nextSound = !soundEnabled;
              setSoundEnabled(nextSound);
              playCasinoSound('click', nextSound);
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              color: soundEnabled ? 'var(--brand-gold)' : 'var(--text-muted)',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              marginLeft: 'auto'
            }}
            title={soundEnabled ? "Mute Game Sound FX" : "Unmute Game Sound FX"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs Sub-bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', flexShrink: 0, scrollbarWidth: 'none' }} className="sport-pills-container">
        {[
          { id: 'lobby', label: '🏛️ Lobby Grid' },
          { id: 'slots', label: '🎰 Jackpot Slots' },
          { id: 'roulette', label: '🎡 Live Roulette' },
          { id: 'crash', label: '✈️ Aviator Crash' },
          { id: 'fortune', label: '🎁 VIP Daily Wheel' }
        ].map((tab) => {
          const isActive = activeGame === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveGame(tab.id);
                setErrorMessage('');
                setFeedback('');
                playCasinoSound('click', soundEnabled);
              }}
              style={{
                backgroundColor: isActive ? 'var(--brand-purple)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Global error banner */}
      {errorMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(255, 62, 108, 0.12)', border: '1px solid var(--live-red)',
          borderRadius: '6px', padding: '10px', fontSize: '0.8rem', color: '#ffffff', flexShrink: 0
        }}>
          <AlertTriangle size={15} style={{ color: 'var(--live-red)' }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Global feedback banner */}
      {feedback && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(198, 255, 0, 0.08)', border: '1px solid var(--brand-yellow)',
          borderRadius: '6px', padding: '10px', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', flexShrink: 0
        }}>
          <span>{feedback}</span>
        </div>
      )}

      {/* =================================-------------------
          1. LOBBY VIEW GRID
          =================================------------------- */}
      {activeGame === 'lobby' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          
          <div className="card-panel" style={{
            height: '210px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: '1px solid rgba(156, 39, 176, 0.25)', background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <span style={{ fontSize: '1.8rem' }}>🎰</span>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginTop: '6px', fontWeight: 800 }}>Jackpot Slots</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                Spin the premium Predicto Reels. Match Diamonds or Stars to trigger the grand 50x payout rewards!
              </p>
            </div>
            <button onClick={() => setActiveGame('slots')} className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '6px 14px', backgroundColor: 'var(--brand-purple)', color: '#ffffff' }}>
              Play Slots
            </button>
          </div>

          <div className="card-panel" style={{
            height: '210px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: '1px solid rgba(156, 39, 176, 0.25)', background: 'linear-gradient(135deg, rgba(20, 10, 30, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <span style={{ fontSize: '1.8rem' }}>🎡</span>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginTop: '6px', fontWeight: 800 }}>European Roulette</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                Bet Red, Black, or input your exact lucky numbers for high yielding 35x payouts on winning sector stops.
              </p>
            </div>
            <button onClick={() => setActiveGame('roulette')} className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '6px 14px', backgroundColor: 'var(--brand-purple)', color: '#ffffff' }}>
              Play Roulette
            </button>
          </div>

          <div className="card-panel" style={{
            height: '210px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: '1px solid rgba(244, 63, 94, 0.3)', background: 'linear-gradient(135deg, rgba(30, 10, 20, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.8rem' }}>✈️</span>
                <span style={{ backgroundColor: '#ff3e6c', color: '#fff', fontSize: '0.55rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 900 }}>HOT</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginTop: '6px', fontWeight: 800 }}>Aviator Crash</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                Jet climbs exponentially! Cash out your crypto stakes before the plane crashes or flies away. Features dual hedging betting slips.
              </p>
            </div>
            <button onClick={() => setActiveGame('crash')} className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '6px 14px', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.3)' }}>
              Play Aviator
            </button>
          </div>

          <div className="card-panel" style={{
            height: '210px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: '1px solid rgba(192, 132, 252, 0.3)', background: 'linear-gradient(135deg, rgba(20, 9, 36, 0.8) 0%, rgba(5, 7, 10, 0.9) 100%)'
          }}>
            <div>
              <span style={{ fontSize: '1.8rem' }}>🎁</span>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginTop: '6px', fontWeight: 800 }}>VIP Daily Wheel</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                Claim your wager-based VIP Loyalty rewards. Spin the fortune wheel every 24h for free USDT credits up to $50 USDT.
              </p>
            </div>
            <button onClick={() => setActiveGame('fortune')} className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '6px 14px', backgroundColor: '#a855f7', color: '#ffffff', border: 'none', boxShadow: '0 4px 10px rgba(168, 85, 247, 0.3)' }}>
              Claim Spin
            </button>
          </div>

        </div>
      )}

      {/* =================================-------------------
          2. JACKPOT SLOTS GAME PANEL
          =================================------------------- */}
      {activeGame === 'slots' && (
        <div className="card-panel" style={{
          padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          background: 'linear-gradient(135deg, rgba(16, 21, 30, 0.9) 0%, rgba(5, 7, 10, 0.95) 100%)'
        }}>
          <h3 style={{ color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
            <Trophy size={16} /> PREDICTO GRAND JACKPOT SLOTS
          </h3>

          <div style={{ display: 'flex', gap: '12px', margin: '10px 0' }}>
            {slots.map((symbol, idx) => (
              <div
                key={idx}
                style={{
                  width: '80px', height: '100px', backgroundColor: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(156,39,176,0.1)'
                }}
                className={slotsSpinning ? 'slots-reel-spinning' : ''}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '280px', width: '100%' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>STAKE ({fiatSymbol}):</label>
            <input
              type="number"
              className="form-input"
              value={slotsStake}
              onChange={(e) => setSlotsStake(e.target.value)}
              disabled={slotsSpinning}
              style={{ textAlign: 'center', fontWeight: 'bold' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {[100, 500, 1000, 5000].map((val) => {
              const isSelected = slotsStake === val.toString();
              return (
                <button
                  key={val}
                  type="button"
                  disabled={slotsSpinning}
                  onClick={() => {
                    playCasinoSound('click', soundEnabled);
                    setSlotsStake(val.toString());
                  }}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--brand-purple)' : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected ? '2px solid var(--brand-gold)' : '1px dashed rgba(255, 255, 255, 0.2)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                  }}
                >
                  <span>{fiatSymbol}{val >= 1000 ? `${val/1000}k` : val}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={triggerSlotsSpin}
            disabled={slotsSpinning}
            className="btn-primary"
            style={{
              width: '100%', maxWidth: '200px', padding: '10px',
              backgroundColor: slotsSpinning ? 'rgba(255,255,255,0.05)' : 'var(--brand-purple)',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)'
            }}
          >
            <RefreshCw size={14} className={slotsSpinning ? 'slots-reel-spinning' : ''} />
            {slotsSpinning ? "SPINNING..." : "SPIN REELS"}
          </button>
        </div>
      )}

      {/* =================================-------------------
          3. LIVE ROULETTE GAME PANEL
          =================================------------------- */}
      {activeGame === 'roulette' && (
        <div className="card-panel roulette-grid" style={{
          padding: '20px', background: 'linear-gradient(135deg, rgba(16, 21, 30, 0.9) 0%, rgba(5, 7, 10, 0.95) 100%)',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%', border: '8px solid var(--brand-purple)',
              background: 'radial-gradient(circle, #0c0814 20%, #170d24 70%, #050308 100%)',
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(156,39,176,0.3)'
            }}
              className={rouletteSpinning ? 'roulette-spinning' : ''}
            >
              <div style={{ position: 'absolute', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.3)', transform: 'rotate(45deg)' }} />
              <div style={{ position: 'absolute', left: '10px', right: '10px', height: '2px', background: 'rgba(255,255,255,0.3)', transform: 'rotate(-45deg)' }} />

              <div style={{
                width: '55px', height: '55px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)',
                border: '3px solid var(--brand-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
              }}>
                {rouletteSpinning ? (
                  <span style={{ fontSize: '0.55rem', color: 'var(--brand-gold)', fontWeight: 'bold' }}>SPINNING</span>
                ) : rouletteResult ? (
                  <span style={{ 
                    fontSize: '0.95rem', fontWeight: 900, 
                    color: rouletteResult.color === 'red' ? 'var(--live-red)' : rouletteResult.color === 'green' ? 'var(--live-green)' : '#ffffff' 
                  }}>
                    {rouletteResult.number}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>READY</span>
                )}
              </div>
            </div>

            {rouletteResult && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Result: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{rouletteResult.number} ({rouletteResult.color.toUpperCase()})</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--brand-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              Place Roulette Chips
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '6px' }}>
              <button
                onClick={() => setRouletteBetType('red')}
                style={{
                  backgroundColor: rouletteBetType === 'red' ? 'var(--live-red)' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'red' ? '2px solid #ffffff' : '1px solid var(--border-color)',
                  borderRadius: '6px', color: '#ffffff', padding: '6px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                🔴 RED (2x)
              </button>
              <button
                onClick={() => setRouletteBetType('black')}
                style={{
                  backgroundColor: rouletteBetType === 'black' ? '#121212' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'black' ? '2px solid var(--brand-purple)' : '1px solid var(--border-color)',
                  borderRadius: '6px', color: '#ffffff', padding: '6px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                ⚫ BLACK (2x)
              </button>
              <button
                onClick={() => setRouletteBetType('number')}
                style={{
                  backgroundColor: rouletteBetType === 'number' ? 'var(--brand-gold)' : 'rgba(255,255,255,0.03)',
                  border: rouletteBetType === 'number' ? '2px solid #ffffff' : '1px solid var(--border-color)',
                  borderRadius: '6px', color: rouletteBetType === 'number' ? '#080a0f' : '#ffffff', padding: '6px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                🔢 NUM (35x)
              </button>
            </div>

            {rouletteBetType === 'number' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CHOOSE NUMBER (0 - 36):</label>
                <input
                  type="number"
                  min="0"
                  max="36"
                  className="form-input"
                  value={rouletteBetNumber}
                  onChange={(e) => setRouletteBetNumber(e.target.value)}
                  style={{ width: '70px', textAlign: 'center', padding: '4px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>STAKE ({fiatSymbol}):</label>
              <input
                type="number"
                className="form-input"
                value={rouletteStake}
                onChange={(e) => setRouletteStake(e.target.value)}
                disabled={rouletteSpinning}
                style={{ padding: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-start' }}>
              {[100, 500, 1000, 5000].map((val) => {
                const isSelected = rouletteStake === val.toString();
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={rouletteSpinning}
                    onClick={() => {
                      playCasinoSound('click', soundEnabled);
                      setRouletteStake(val.toString());
                    }}
                    style={{
                      flex: 1, padding: '5px 0', borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--brand-purple)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid var(--brand-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '0.62rem', fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    {fiatSymbol}{val >= 1000 ? `${val/1000}k` : val}
                  </button>
                );
              })}
            </div>

            <button
              onClick={triggerRouletteSpin}
              disabled={rouletteSpinning}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--brand-purple)', color: '#ffffff', padding: '8px',
                marginTop: '4px', fontSize: '0.75rem', boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)'
              }}
            >
              {rouletteSpinning ? "SPINNING TABLE..." : "SPIN WHEEL"}
            </button>
          </div>
        </div>
      )}

      {/* =================================-------------------
          4. AVIATOR CRASH GAME VIEW
          =================================------------------- */}
      {activeGame === 'crash' && (
        <div className="aviator-game-container">
          
          {/* History index ribbon */}
          <div className="aviator-top-stats">
            {crashHistory.map((mult, idx) => (
              <span 
                key={idx} 
                className={`aviator-history-pill ${mult < 1.5 ? 'low' : mult < 3.0 ? 'mid' : 'high'}`}
              >
                {mult.toFixed(2)}x
              </span>
            ))}
          </div>

          {/* Interactive flight canvas container */}
          <div className="aviator-canvas-panel">
            {/* Live indicator tag */}
            <div className="aviator-canvas-badge">
              <Zap size={10} style={{ fill: 'currentColor' }} />
              Live Flight
            </div>

            <canvas 
              ref={canvasRef} 
              width={520} 
              height={270} 
              style={{ width: '100%', height: 'auto', aspectRatio: '520 / 270', display: 'block', backgroundColor: 'transparent' }}
            />

            {/* Central massive multiplier readout */}
            <div className="aviator-canvas-multiplier">
              {crashState === 'betting' && (
                <>
                  <div className="aviator-canvas-multiplier-value" style={{ color: 'var(--brand-yellow)', fontSize: '2.5rem' }}>
                    {countdown > 0 ? `00:${countdown.toFixed(1).replace('.', ':')}` : 'TAKING OFF'}
                  </div>
                  <div className="aviator-canvas-multiplier-label idle">Next flight starting</div>
                </>
              )}
              {crashState === 'flying' && (
                <>
                  <div className="aviator-canvas-multiplier-value">
                    {multiplier.toFixed(2)}x
                  </div>
                  <div className="aviator-canvas-multiplier-label flying">Climbing High</div>
                </>
              )}
              {crashState === 'crashed' && (
                <>
                  <div className="aviator-canvas-multiplier-value crashed">
                    FLEW AWAY
                  </div>
                  <div className="aviator-canvas-multiplier-label crashed" style={{ fontSize: '1rem', fontWeight: 900 }}>
                    Crashed @ {multiplier.toFixed(2)}x
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dual Betting Stake Slips */}
          <div className="aviator-dual-bet-container">
            
            {/* Bet Slip 1 */}
            <div className="aviator-bet-slip-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-emerald)' }}>STAKE SLIP A</span>
                
                {/* Auto cashout checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={slip1.autoCashout}
                    onChange={(e) => setSlip1(prev => ({ ...prev, autoCashout: e.target.checked }))}
                    disabled={slip1.betPlaced && crashState === 'flying'}
                  />
                  Auto Cashout
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Amount ({fiatSymbol}):</label>
                  <input
                    type="number"
                    className="form-input"
                    value={slip1.stake}
                    onChange={(e) => setSlip1(prev => ({ ...prev, stake: e.target.value }))}
                    disabled={slip1.betPlaced}
                    style={{ fontSize: '0.8rem', padding: '6px' }}
                  />
                </div>
                
                {slip1.autoCashout && (
                  <div style={{ width: '80px' }}>
                    <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>At Mult:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={slip1.autoValue}
                      onChange={(e) => setSlip1(prev => ({ ...prev, autoValue: e.target.value }))}
                      disabled={slip1.betPlaced}
                      style={{ fontSize: '0.8rem', padding: '6px', textAlign: 'center' }}
                    />
                  </div>
                )}
              </div>

              {/* Stake Quick Chips */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    disabled={slip1.betPlaced}
                    onClick={() => { playCasinoSound('click', soundEnabled); setSlip1(prev => ({ ...prev, stake: val.toString() })) }}
                    style={{
                      flex: 1, padding: '4px 0', fontSize: '0.62rem', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', cursor: 'pointer', color: '#fff'
                    }}
                  >
                    +{val}
                  </button>
                ))}
              </div>

              {/* Slip 1 Action Button */}
              {slip1.betPlaced ? (
                slip1.cashedOut ? (
                  <button className="aviator-bet-btn waiting" disabled>
                    <span style={{ fontSize: '0.75rem' }}>CASHED OUT</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--brand-yellow)' }}>+{fiatSymbol}{convertUsdtToFiat(slip1.payout).toFixed(2)}</span>
                  </button>
                ) : crashState === 'flying' ? (
                  <button 
                    onClick={() => handleCashout(1)}
                    className="aviator-bet-btn cash-out"
                  >
                    <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>CASH OUT</span>
                    <span style={{ fontSize: '0.95rem' }}>{(convertFiatToUsdt(parseFloat(slip1.stake)) * multiplier).toFixed(4)} USDT</span>
                  </button>
                ) : (
                  <button className="aviator-bet-btn waiting" disabled>
                    <span>BET PLACED</span>
                    <span style={{ fontSize: '0.65rem' }}>Waiting for flight</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => handlePlaceAviatorBet(1)}
                  disabled={crashState !== 'betting'}
                  className={`aviator-bet-btn ${crashState === 'betting' ? 'place-bet' : 'waiting'}`}
                >
                  <span>PLACE BET</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{fiatSymbol}{slip1.stake}</span>
                </button>
              )}
            </div>

            {/* Bet Slip 2 */}
            <div className="aviator-bet-slip-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-purple)' }}>STAKE SLIP B</span>
                
                {/* Auto cashout checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={slip2.autoCashout}
                    onChange={(e) => setSlip2(prev => ({ ...prev, autoCashout: e.target.checked }))}
                    disabled={slip2.betPlaced && crashState === 'flying'}
                  />
                  Auto Cashout
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Amount ({fiatSymbol}):</label>
                  <input
                    type="number"
                    className="form-input"
                    value={slip2.stake}
                    onChange={(e) => setSlip2(prev => ({ ...prev, stake: e.target.value }))}
                    disabled={slip2.betPlaced}
                    style={{ fontSize: '0.8rem', padding: '6px' }}
                  />
                </div>
                
                {slip2.autoCashout && (
                  <div style={{ width: '80px' }}>
                    <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>At Mult:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={slip2.autoValue}
                      onChange={(e) => setSlip2(prev => ({ ...prev, autoValue: e.target.value }))}
                      disabled={slip2.betPlaced}
                      style={{ fontSize: '0.8rem', padding: '6px', textAlign: 'center' }}
                    />
                  </div>
                )}
              </div>

              {/* Stake Quick Chips */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    disabled={slip2.betPlaced}
                    onClick={() => { playCasinoSound('click', soundEnabled); setSlip2(prev => ({ ...prev, stake: val.toString() })) }}
                    style={{
                      flex: 1, padding: '4px 0', fontSize: '0.62rem', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', cursor: 'pointer', color: '#fff'
                    }}
                  >
                    +{val}
                  </button>
                ))}
              </div>

              {/* Slip 2 Action Button */}
              {slip2.betPlaced ? (
                slip2.cashedOut ? (
                  <button className="aviator-bet-btn waiting" disabled>
                    <span style={{ fontSize: '0.75rem' }}>CASHED OUT</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--brand-yellow)' }}>+{fiatSymbol}{convertUsdtToFiat(slip2.payout).toFixed(2)}</span>
                  </button>
                ) : crashState === 'flying' ? (
                  <button 
                    onClick={() => handleCashout(2)}
                    className="aviator-bet-btn cash-out"
                  >
                    <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>CASH OUT</span>
                    <span style={{ fontSize: '0.95rem' }}>{(convertFiatToUsdt(parseFloat(slip2.stake)) * multiplier).toFixed(4)} USDT</span>
                  </button>
                ) : (
                  <button className="aviator-bet-btn waiting" disabled>
                    <span>BET PLACED</span>
                    <span style={{ fontSize: '0.65rem' }}>Waiting for flight</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => handlePlaceAviatorBet(2)}
                  disabled={crashState !== 'betting'}
                  className={`aviator-bet-btn ${crashState === 'betting' ? 'place-bet' : 'waiting'}`}
                >
                  <span>PLACE BET</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{fiatSymbol}{slip2.stake}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* =================================-------------------
          5. VIP FORTUNE WHEEL SPIN VIEW
          =================================------------------- */}
      {activeGame === 'fortune' && (
        <div className="card-panel fortune-wheel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '380px' }}>
            <h3 style={{ color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '1.2rem' }}>
              <Star size={16} style={{ fill: 'currentColor' }} /> VIP Loyalty Fortune Wheel
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Spin once every 24 hours. Level up your sportsbook wagers to earn massive daily bonuses up to <b>$50 USDT</b> instantly!
            </p>
          </div>

          {/* Interactive Wheel structure */}
          <div className="fortune-wheel-wrap">
            <div className="fortune-wheel-peg" />
            
            {/* SVG Wheel segments */}
            <svg 
              className="fortune-wheel-svg" 
              viewBox="0 0 200 200"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <g transform="translate(100, 100)">
                {/* 6 beautiful segments */}
                {[
                  { label: '$50 USDT', color: '#ff3e6c', rot: 0 },
                  { label: '$0 USDT', color: '#1e293b', rot: 60 },
                  { label: '$5 USDT', color: '#05c48b', rot: 120 },
                  { label: '$10 USDT', color: '#3b82f6', rot: 180 },
                  { label: '$15 USDT', color: '#eab308', rot: 240 },
                  { label: '$20 USDT', color: '#06b6d4', rot: 300 }
                ].map((sec, idx) => (
                  <g key={idx} transform={`rotate(${sec.rot})`}>
                    {/* Pie Wedge Path */}
                    <path 
                      d="M 0,0 L 0,-100 A 100,100 0 0,1 86.6,-50 Z" 
                      fill={sec.color}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1.5"
                    />
                    
                    {/* Glowing gold dot borders */}
                    <circle cx="86.6" cy="-50" r="2.5" fill="#ffd700" />

                    {/* Sector Text */}
                    <text 
                      x="40" 
                      y="-70" 
                      fill="#ffffff" 
                      fontSize="9" 
                      fontWeight="900"
                      textAnchor="middle"
                      transform="rotate(30, 40, -70)"
                      style={{ letterSpacing: '0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      {sec.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            {/* Core center click peg pin */}
            <div 
              className="fortune-wheel-center-pin"
              onClick={spinFortuneWheel}
              style={{ cursor: wheelSpinning ? 'not-allowed' : 'pointer' }}
            >
              SPIN
            </div>
          </div>

          {/* Cooldown Lock Display */}
          {remainingCooldownText && !cooldownPassBypass && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '8px 16px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600
            }}>
              🔒 Next reward releases in: <span style={{ color: 'var(--brand-yellow)', fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>{remainingCooldownText}</span>
            </div>
          )}

          {/* Cheat code dev simulator bypass controls */}
          <div style={{
            marginTop: '10px', padding: '10px 14px', border: '1px dashed rgba(192, 132, 252, 0.3)',
            borderRadius: '8px', background: 'rgba(192, 132, 252, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', color: '#c084fc', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              🧪 DEVELOPER TESTING BYPASS
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#fff', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={cooldownPassBypass}
                onChange={(e) => {
                  setCooldownPassBypass(e.target.checked);
                  playCasinoSound('click', soundEnabled);
                }}
              />
              Bypass 24h Spin Cooldown Lock
            </label>
          </div>

        </div>
      )}

    </div>
  );
}
