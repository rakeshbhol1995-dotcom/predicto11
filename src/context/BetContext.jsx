import React, { createContext, useContext, useState } from 'react';

const BetContext = createContext();

export const useBet = () => useContext(BetContext);

export const EXCHANGE_RATES = {
  USDT: { INR: 88.50, USD: 1.00, EUR: 0.92, symbol: { INR: '₹', USD: '$', EUR: '€' } },
  BTC: { INR: 5900000, USD: 67000, EUR: 61500, symbol: { INR: '₹', USD: '$', EUR: '€' } },
  ETH: { INR: 310000, USD: 3500, EUR: 3200, symbol: { INR: '₹', USD: '$', EUR: '€' } }
};

export const FIAT_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€'
};

export const BetProvider = ({ children }) => {
  // Pre-load default administrator user
  const [usersList, setUsersList] = useState([
    {
      username: 'Bunty',
      email: 'bunty@crypto.com',
      mobile: '9876543210',
      password: 'password123',
      isAdmin: true
    }
  ]);

  // Authenticated user state (null by default)
  const [user, setUser] = useState(null);

  // Store balances in actual crypto assets
  const [cryptoBalances, setCryptoBalances] = useState({
    usdt: 120.00,
    btc: 0.0015,
    eth: 0.04
  });

  const [selectedFiat, setSelectedFiat] = useState('INR'); // Default to Indian Rupees
  const [selections, setSelections] = useState([]);
  const [placedBets, setPlacedBets] = useState([]); // Internal values stored in USDT

  // Calculate total fiat balance based on current exchange rates
  const totalBalanceFiat = 
    (cryptoBalances.usdt * EXCHANGE_RATES.USDT[selectedFiat]) +
    (cryptoBalances.btc * EXCHANGE_RATES.BTC[selectedFiat]) +
    (cryptoBalances.eth * EXCHANGE_RATES.ETH[selectedFiat]);

  // Convert a USDT value to the active fiat currency
  const convertUsdtToFiat = (usdtValue) => {
    return parseFloat((usdtValue * EXCHANGE_RATES.USDT[selectedFiat]).toFixed(2));
  };

  // Convert a Fiat value to the equivalent USDT value
  const convertFiatToUsdt = (fiatValue) => {
    return parseFloat((fiatValue / EXCHANGE_RATES.USDT[selectedFiat]).toFixed(4));
  };

  // Adjust USDT balance directly (for Casino games)
  const adjustCryptoBalance = (usdtAmount, action = 'credit') => {
    const amt = parseFloat(usdtAmount);
    if (isNaN(amt) || amt <= 0) return false;

    let success = false;
    setCryptoBalances(prev => {
      const currentUsdt = prev.usdt;
      let newUsdt = currentUsdt;
      if (action === 'credit') {
        newUsdt = parseFloat((currentUsdt + amt).toFixed(4));
        success = true;
      } else if (action === 'deduct') {
        if (currentUsdt >= amt) {
          newUsdt = parseFloat((currentUsdt - amt).toFixed(4));
          success = true;
        }
      }
      return { ...prev, usdt: newUsdt };
    });
    return success;
  };

  // User Actions: Auth
  const registerUser = (username, email, mobile, password) => {
    const exists = usersList.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: "Username or Email already registered." };
    }

    const newUser = {
      username,
      email,
      mobile,
      password,
      isAdmin: false
    };

    setUsersList([...usersList, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const loginUser = (usernameOrEmail, password) => {
    const foundUser = usersList.find(
      u => (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
            u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
           u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: "Invalid username/email or password." };
  };

  const logoutUser = () => {
    setUser(null);
    setSelections([]);
  };

  // Add or Toggle a selection in the betslip
  const toggleSelection = (match, outcomeName, oddValue, marketName = "Match Winner") => {
    if (oddValue === null) return;
    if (!user) return; // Block odds selection if logged out

    const existingIndex = selections.findIndex(
      (sel) => sel.matchId === match.id && sel.outcomeName === outcomeName
    );

    if (existingIndex > -1) {
      setSelections(selections.filter((_, i) => i !== existingIndex));
    } else {
      const newSelection = {
        id: `${match.id}-${outcomeName.replace(/\s+/g, '-').toLowerCase()}`,
        matchId: match.id,
        matchName: `${match.homeTeam} v ${match.awayTeam}`,
        sport: match.sport,
        market: marketName,
        outcomeName: outcomeName,
        odd: oddValue,
        stake: "" 
      };
      setSelections([...selections, newSelection]);
    }
  };

  const removeSelection = (id) => {
    setSelections(selections.filter((sel) => sel.id !== id));
  };

  const updateStake = (id, stake) => {
    setSelections(
      selections.map((sel) => (sel.id === id ? { ...sel, stake } : sel))
    );
  };

  const clearSlip = () => {
    setSelections([]);
  };

  // Deposit crypto asset
  const depositCrypto = (asset, amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return false;
    
    const lowerAsset = asset.toLowerCase();
    setCryptoBalances(prev => ({
      ...prev,
      [lowerAsset]: parseFloat((prev[lowerAsset] + amt).toFixed(6))
    }));
    return true;
  };

  // Place bet
  const placeBet = (isAccumulator = false, accStake = "") => {
    if (!user) return { success: false, message: "Please log in to place bets." };
    if (selections.length === 0) return { success: false, message: "No selections in bet slip." };

    if (isAccumulator) {
      const fiatStakeNum = parseFloat(accStake);
      if (isNaN(fiatStakeNum) || fiatStakeNum <= 0) {
        return { success: false, message: "Please enter a valid stake." };
      }
      
      const usdtStakeNum = convertFiatToUsdt(fiatStakeNum);
      if (usdtStakeNum > cryptoBalances.usdt) {
        return { success: false, message: "Insufficient balance." };
      }

      const totalOdds = selections.reduce((acc, curr) => acc * curr.odd, 1);
      const usdtPayout = usdtStakeNum * totalOdds;

      const newBet = {
        id: `bet-${Date.now()}`,
        type: "Accumulator",
        selections: [...selections],
        totalStakeUsdt: usdtStakeNum,
        potentialPayoutUsdt: parseFloat(usdtPayout.toFixed(4)),
        cashOutValueUsdt: parseFloat((usdtStakeNum * 0.9).toFixed(4)),
        status: "active",
        date: new Date().toLocaleTimeString(),
        username: user.username
      };

      setCryptoBalances(prev => ({
        ...prev,
        usdt: parseFloat((prev.usdt - usdtStakeNum).toFixed(4))
      }));

      setPlacedBets((prev) => [newBet, ...prev]);
      setSelections([]);
      return { success: true, message: "Accumulator bet placed successfully!" };
    } else {
      // Single Bets
      let totalRequiredUsdt = 0;
      const validSelections = [];

      for (const sel of selections) {
        const fiatStakeNum = parseFloat(sel.stake);
        if (isNaN(fiatStakeNum) || fiatStakeNum <= 0) {
          return { success: false, message: `Please enter a valid stake for: ${sel.matchName}` };
        }
        const usdtStakeNum = convertFiatToUsdt(fiatStakeNum);
        totalRequiredUsdt += usdtStakeNum;
        validSelections.push({ ...sel, usdtStakeNum });
      }

      if (totalRequiredUsdt > cryptoBalances.usdt) {
        return { success: false, message: "Insufficient balance." };
      }

      const newBets = validSelections.map((sel) => {
        const usdtPayout = sel.usdtStakeNum * sel.odd;
        return {
          id: `bet-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: "Single",
          selections: [sel],
          totalStakeUsdt: sel.usdtStakeNum,
          potentialPayoutUsdt: parseFloat(usdtPayout.toFixed(4)),
          cashOutValueUsdt: parseFloat((sel.usdtStakeNum * 0.95).toFixed(4)),
          status: "active",
          date: new Date().toLocaleTimeString(),
          username: user.username
        };
      });

      setCryptoBalances(prev => ({
        ...prev,
        usdt: parseFloat((prev.usdt - totalRequiredUsdt).toFixed(4))
      }));

      setPlacedBets((prev) => [...newBets, ...prev]);
      setSelections([]);
      return { success: true, message: "All single bets placed successfully!" };
    }
  };

  const cashOutBet = (betId) => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || bet.status !== "active") return;

    setCryptoBalances(prev => ({
      ...prev,
      usdt: parseFloat((prev.usdt + bet.cashOutValueUsdt).toFixed(4))
    }));

    setPlacedBets(
      placedBets.map((b) =>
        b.id === betId ? { ...b, status: "cashed_out", cashOutValueUsdt: 0 } : b
      )
    );
  };

  return (
    <BetContext.Provider
      value={{
        user,
        usersList,
        registerUser,
        loginUser,
        logoutUser,
        balance: totalBalanceFiat,
        cryptoBalances,
        selectedFiat,
        setSelectedFiat,
        fiatSymbol: FIAT_SYMBOLS[selectedFiat],
        convertUsdtToFiat,
        convertFiatToUsdt,
        adjustCryptoBalance,
        selections,
        placedBets,
        setPlacedBets,
        toggleSelection,
        removeSelection,
        updateStake,
        clearSlip,
        placeBet,
        cashOutBet,
        depositCrypto
      }}
    >
      {children}
    </BetContext.Provider>
  );
};
