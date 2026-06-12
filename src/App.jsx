import React, { useState, useEffect } from 'react';
import { BetProvider, useBet } from './context/BetContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import MatchTracker from './components/MatchTracker';
import BetSlip from './components/BetSlip';
import DepositModal from './components/DepositModal';
import AuthModal from './components/AuthModal';
import MatchDetailView from './components/MatchDetailView';
import AdminPanel from './components/AdminPanel';
import LiveChat from './components/LiveChat';
import Preloader from './components/Preloader';
import { INITIAL_MATCHES } from './data/mockData';
import { Shield, Home, PlayCircle, ShoppingBag, User, Crown } from 'lucide-react';

const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || "9a2e7922e00027abb0051b99528d6d69";

function WinnersScrollTicker() {
  const [tickerItems, setTickerItems] = useState([
    { id: 1, user: 'LuckyStriker', game: 'Aviator', amount: '234 USDT', multiplier: '5.2x' },
    { id: 2, user: 'MaxWager', game: 'Roulette', amount: '8,400 INR', multiplier: '35x' },
    { id: 3, user: 'CryptoShark', game: 'Slots', amount: '150 USDT', multiplier: '50x' },
    { id: 4, user: 'DegenKing', game: 'CSK vs MI', amount: '1,200 INR', multiplier: '1.95x' },
    { id: 5, user: 'TRX_Whale', game: 'Aviator', amount: '75 USDT', multiplier: '2.5x' }
  ]);

  useEffect(() => {
    const games = ['Aviator', 'Slots', 'Roulette', 'CSK vs MI', 'Arsenal vs Chelsea', 'Natus Vincere Match'];
    const users = ['LuckyFlight', 'BettingBeast', 'CoinKing', 'EthSpinner', 'SlotJackpot', 'WdrMaster', 'DegenGuru', 'VipGold_1'];
    
    const interval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      
      let amountStr = '45 USDT';
      let multStr = '2x';
      if (randomGame === 'Aviator') {
        const mult = (Math.random() * 8 + 1.2).toFixed(2);
        const usdt = Math.floor(Math.random() * 80 + 5);
        amountStr = `${usdt} USDT`;
        multStr = `${mult}x`;
      } else if (randomGame === 'Slots') {
        const isJackpot = Math.random() < 0.25;
        const usdt = isJackpot ? 150 : 15;
        amountStr = `${usdt} USDT`;
        multStr = isJackpot ? '50x' : '1.5x';
      } else if (randomGame === 'Roulette') {
        const isNum = Math.random() < 0.3;
        const usdt = isNum ? 350 : 20;
        amountStr = `${usdt} USDT`;
        multStr = isNum ? '35x' : '2x';
      } else {
        const odds = (Math.random() * 1.5 + 1.4).toFixed(2);
        const inr = Math.floor(Math.random() * 1500 + 200);
        amountStr = `${inr} INR`;
        multStr = `${odds}x`;
      }

      const newItem = {
        id: Date.now(),
        user: randomUser,
        game: randomGame,
        amount: amountStr,
        multiplier: multStr
      };

      setTickerItems((prev) => [...prev.slice(1), newItem]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const doubleList = [...tickerItems, ...tickerItems];

  return (
    <div className="winners-ticker-wrap">
      <div className="winners-ticker-badge">
        <span className="pulse-dot" />
        Live Winners Ticker
      </div>
      <div className="winners-ticker-track">
        {doubleList.map((item, idx) => (
          <div className="ticker-item" key={`${item.id}-${idx}`}>
            🎉 Player <span className="ticker-item-user">{item.user}</span> won <span className="ticker-item-amount">{item.amount}</span> on <span className="ticker-item-game">{item.game}</span> ({item.multiplier})
          </div>
        ))}
      </div>
    </div>
  );
}

function MainAppContent() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedSport, setSelectedSport] = useState('All');
  const [activeTab, setActiveTab] = useState('Sports'); // 'Sports' or 'In-Play' or 'Casino'
  const [selectedMatch, setSelectedMatch] = useState(INITIAL_MATCHES[0]); // Default to first match
  const [oddsFlash, setOddsFlash] = useState({});
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositModalTab, setDepositModalTab] = useState('deposit');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiStatus, setApiStatus] = useState('Disconnected');
  const [apiRateLimited, setApiRateLimited] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  
  // Views: 'dashboard' | 'match-detail' | 'admin' | 'mobile-slip' | 'mobile-mybets'
  const [currentView, setCurrentView] = useState('dashboard');

  const { user, placedBets, setPlacedBets } = useBet();

  // Initialize bookmaker selections on mount for Odds-API.io
  useEffect(() => {
    if (ODDS_API_KEY) {
      fetch(`https://api.odds-api.io/v3/bookmakers/selected/select?bookmakers=Bet365,Betfair Exchange&apiKey=${ODDS_API_KEY}`, {
        method: 'PUT'
      })
      .then(res => res.json())
      .then(data => console.log("Odds-API.io bookmaker selection initialized:", data))
      .catch(err => console.error("Error initializing bookmakers:", err));
    }
  }, []);

  // Keep selectedMatch updated with the latest state of matches
  useEffect(() => {
    if (selectedMatch) {
      const updated = matches.find(m => m.id === selectedMatch.id);
      if (updated) setSelectedMatch(updated);
    }
  }, [matches]);

  // Define EntitySport Token
  const ENTITY_SPORT_TOKEN = import.meta.env.VITE_ENTITY_SPORT_TOKEN || "5717631d2f48dc84c89999441a762463";

  // Helper to map EntitySport matches to our unified match schema
  const mapEntitySportMatch = (item) => {
    const homeTeam = item.teama?.name || "Team A";
    const awayTeam = item.teamb?.name || "Team B";
    
    // In EntitySport, the teama/teamb object holds the scores and scores_full
    const homeScore = item.teama?.scores || "0";
    const awayScore = item.teamb?.scores || "0";
    
    const status = item.status === 3 ? "live" : "upcoming";
    
    let timeStr = "Scheduled";
    if (item.status === 3) {
      if (item.teama?.overs) {
        timeStr = `${item.teama.overs} Ov`;
      } else if (item.teamb?.overs) {
        timeStr = `${item.teamb.overs} Ov`;
      } else {
        timeStr = "Live";
      }
    } else {
      timeStr = item.date_start_ist ? item.date_start_ist.split(' ')[0] : "Upcoming";
    }

    const isLive = status === "live";
    const odds = {
      home: isLive ? 1.85 : 1.95,
      draw: 25.00,
      away: isLive ? 1.95 : 1.80
    };

    return {
      id: `entity-${item.match_id}`,
      sport: "Cricket",
      league: item.competition?.title || "International Cricket",
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      homeScore: homeScore,
      awayScore: awayScore,
      time: timeStr,
      status: status,
      eventStatus: item.status_note || item.live || item.toss?.text || "Match Scheduled",
      isEntitySport: true,
      stats: {
        possession: [50, 50],
        shots: [0, 0],
        corners: [0, 0]
      },
      odds: odds
    };
  };

  // 1. Fetch events list once on mount and every 10 minutes
  useEffect(() => {
    if (!ODDS_API_KEY) return;

    const fetchEvents = async () => {
      try {
        console.log("Fetching sports events list from Odds-API.io...");
        const sportsList = ['football', 'basketball', 'tennis'];
        let rateLimitHit = false;
        const eventPromises = sportsList.map(sportSlug =>
          fetch(`https://api.odds-api.io/v3/events?sport=${sportSlug}&apiKey=${ODDS_API_KEY}`)
            .then(res => {
              if (res.status === 429) rateLimitHit = true;
              return res.ok ? res.json() : [];
            })
            .catch(() => [])
        );

        const eventsResults = await Promise.all(eventPromises);
        if (rateLimitHit) {
          setApiRateLimited(true);
        } else if (eventsResults.some(r => r.length > 0)) {
          setApiRateLimited(false);
        }

        let allEvents = [];
        eventsResults.forEach(eventList => {
          if (Array.isArray(eventList)) {
            allEvents = [...allEvents, ...eventList];
          }
        });

        // Filter for active/upcoming events
        const active = allEvents.filter(e => e.status === 'live' || e.status === 'pending' || e.status === 'scheduled');
        
        // Sort live events first, then by date
        active.sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (a.status !== 'live' && b.status === 'live') return 1;
          return new Date(a.date) - new Date(b.date);
        });

        setEventsList(active);
        console.log(`Updated Odds-API.io events list: ${active.length} active events cached.`);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 240000); // Fetch list every 4 minutes (rate limit safe)
    return () => clearInterval(interval);
  }, []);

  // 2. Poll odds for the cached events list every 90 seconds
  useEffect(() => {
    setApiStatus('Connecting...');

    const fetchOddsAndMerged = async () => {
      let oddsMatches = [];
      let entityMatches = [];
      let oddsSuccess = false;
      let entitySuccess = false;

      // Fetch Cricket from EntitySport API
      try {
        const liveRes = await fetch(`https://restapi.entitysport.com/v2/matches/?status=3&token=${ENTITY_SPORT_TOKEN}`);
        const liveData = await liveRes.json();
        
        const upcomingRes = await fetch(`https://restapi.entitysport.com/v2/matches/?status=1&token=${ENTITY_SPORT_TOKEN}&per_page=20`);
        const upcomingData = await upcomingRes.json();

        const liveItems = liveData.response?.items || [];
        const upcomingItems = upcomingData.response?.items || [];

        entityMatches = [...liveItems, ...upcomingItems].map(mapEntitySportMatch);
        entitySuccess = true;
      } catch (err) {
        console.error("EntitySport API error:", err.message);
      }

      // Fetch Odds for top 10 cached events
      if (ODDS_API_KEY && eventsList.length > 0) {
        try {
          const targetEvents = eventsList.slice(0, 10);
          const eventIds = targetEvents.map(e => e.id).join(',');
          
          console.log(`Polling live odds for ${targetEvents.length} events: ${eventIds}`);
          const oddsRes = await fetch(`https://api.odds-api.io/v3/odds/multi?eventIds=${eventIds}&bookmakers=Bet365,Betfair Exchange&apiKey=${ODDS_API_KEY}`);
          
          if (oddsRes.ok) {
            const oddsData = await oddsRes.json();
            if (Array.isArray(oddsData)) {
              oddsMatches = oddsData.map(event => {
                let sport = "Soccer";
                const slug = event.sport?.slug || "";
                if (slug.includes("tennis")) sport = "Tennis";
                else if (slug.includes("basketball")) sport = "Basketball";
                else if (slug.includes("football") || slug.includes("soccer")) sport = "Soccer";
                else sport = event.sport?.name || "Soccer";

                let oddsHome = 1.90;
                let oddsAway = 1.90;
                let oddsDraw = null;

                const bookmakersObj = event.bookmakers || {};
                const bookmakerName = Object.keys(bookmakersObj).find(name => name === 'Bet365' || name === 'Betfair Exchange') || Object.keys(bookmakersObj)[0];
                
                if (bookmakerName) {
                  const markets = bookmakersObj[bookmakerName] || [];
                  const h2hMarket = markets.find(m => m.name === 'ML' || m.name === 'Match Winner' || m.name === 'Match Odds');
                  if (h2hMarket && h2hMarket.odds && h2hMarket.odds.length > 0) {
                    const outcome = h2hMarket.odds[0];
                    if (outcome.home) oddsHome = parseFloat(outcome.home);
                    if (outcome.away) oddsAway = parseFloat(outcome.away);
                    if (outcome.draw) oddsDraw = parseFloat(outcome.draw);
                  }
                }

                let homeScore = "0";
                let awayScore = "0";

                // Merge real-time score from cached eventsList (which contains scores)
                const matchingEvent = eventsList.find(e => e.id === event.id);
                const scoreObj = event.scores || matchingEvent?.scores;

                if (scoreObj) {
                  if (sport === 'Tennis') {
                    // Tennis score format: sets won | games in current set
                    const homeSets = scoreObj.home !== undefined ? scoreObj.home : 0;
                    const awaySets = scoreObj.away !== undefined ? scoreObj.away : 0;
                    
                    let homeGames = 0;
                    let awayGames = 0;
                    if (scoreObj.periods) {
                      const pKeys = Object.keys(scoreObj.periods).sort();
                      if (pKeys.length > 0) {
                        const currentPeriodKey = pKeys[pKeys.length - 1];
                        const currentPeriod = scoreObj.periods[currentPeriodKey];
                        homeGames = currentPeriod.home !== undefined ? currentPeriod.home : 0;
                        awayGames = currentPeriod.away !== undefined ? currentPeriod.away : 0;
                      }
                    }
                    homeScore = `${homeSets} | ${homeGames}`;
                    awayScore = `${awaySets} | ${awayGames}`;
                  } else {
                    homeScore = scoreObj.home !== undefined ? scoreObj.home.toString() : "0";
                    awayScore = scoreObj.away !== undefined ? scoreObj.away.toString() : "0";
                  }
                }
                
                const isLive = event.status === "live";
                const status = isLive ? "live" : "upcoming";
                
                let time = "Scheduled";
                if (isLive) {
                  time = "Live";
                } else {
                  const eventDate = new Date(event.date);
                  time = eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
                         eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                }

                let eventStatus = isLive ? "Game Play in Progress" : "Scheduled Match";

                return {
                  id: event.id,
                  sport: sport,
                  league: event.league?.name || "International League",
                  homeTeam: event.home,
                  awayTeam: event.away,
                  homeScore: homeScore,
                  awayScore: awayScore,
                  time: time,
                  status: status,
                  eventStatus: eventStatus,
                  stats: {
                    possession: [50, 50],
                    shots: [0, 0],
                    corners: [0, 0]
                  },
                  odds: {
                    home: oddsHome,
                    draw: oddsDraw || (sport === 'Soccer' ? 3.40 : null),
                    away: oddsAway
                  }
                };
              });
              oddsSuccess = true;
              setApiRateLimited(false);
            }
          } else if (oddsRes.status === 429) {
            console.warn("Odds-API.io rate limit (429) hit. Falling back to simulator.");
            setApiRateLimited(true);
          }
        } catch (err) {
          console.error("Odds-API.io Error:", err.message);
        }
      } else if (eventsList.length === 0) {
        // If eventsList is not loaded yet, do not trigger a success flag but let it fetch
        oddsSuccess = false;
      }

      // Merge and update matches state
      let merged = [];
      if (entitySuccess && entityMatches.length > 0) {
        merged = [...entityMatches];
      }
      if (oddsSuccess && oddsMatches.length > 0) {
        merged = [...merged, ...oddsMatches];
      }

      console.log("Debug FetchAll:", {
        ODDS_API_KEY_EXISTS: !!ODDS_API_KEY,
        ENTITY_SPORT_TOKEN_EXISTS: !!ENTITY_SPORT_TOKEN,
        oddsSuccess,
        entitySuccess,
        oddsMatchesCount: oddsMatches.length,
        entityMatchesCount: entityMatches.length,
        mergedCount: merged.length
      });

      if (merged.length > 0) {
        const combined = [
          ...merged,
          ...INITIAL_MATCHES.filter(im => 
            !merged.some(m => 
              m.homeTeam.toLowerCase() === im.homeTeam.toLowerCase() && m.awayTeam.toLowerCase() === im.awayTeam.toLowerCase()
            ) &&
            !(oddsSuccess && (im.sport === 'Soccer' || im.sport === 'Tennis' || im.sport === 'Basketball')) &&
            !(entitySuccess && im.sport === 'Cricket')
          )
        ];
        
        console.log("Combined matches to render:", combined.map(m => `${m.sport} - ${m.homeTeam} vs ${m.awayTeam} (${m.status})`));
        setMatches(combined);
        setIsLiveApi(true);
        setApiStatus(entitySuccess && oddsSuccess ? 'Live Active' : (entitySuccess ? 'Cricket Live' : 'Odds Live'));
      } else {
        console.log("No live data merged. Falling back to simulator.");
        setApiStatus(apiRateLimited ? 'Rate Limited' : 'Failed - Using Simulator');
        setIsLiveApi(false);
      }
    };

    fetchOddsAndMerged();
    const interval = setInterval(fetchOddsAndMerged, 120000); // Poll odds every 2 minutes (rate limit safe)
    return () => clearInterval(interval);
  }, [eventsList]);


  // Simulation Engine Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const liveMatches = matches.filter(m => m.status === 'live');
      if (liveMatches.length === 0) return;
      
      const randomMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      const newFlash = {};

      const updatedMatches = matches.map((match) => {
        if (match.id !== randomMatch.id) return match;
        // Skip simulation for real live API matches
        if (typeof match.id === 'number' || match.id.toString().startsWith('entity-')) return match;

        const newOdds = { ...match.odds };
        const flashState = {};

        const fluctuate = (val, key) => {
          if (val === null) return null;
          const change = (Math.random() - 0.5) * 0.15;
          const newVal = Math.max(1.01, parseFloat((val + change).toFixed(2)));
          if (newVal > val) flashState[key] = 'up';
          else if (newVal < val) flashState[key] = 'down';
          return newVal;
        };

        newOdds.home = fluctuate(newOdds.home, 'home');
        if (newOdds.draw !== null) newOdds.draw = fluctuate(newOdds.draw, 'draw');
        newOdds.away = fluctuate(newOdds.away, 'away');

        newFlash[match.id] = flashState;

        let newTime = match.time;
        let newHomeScore = match.homeScore;
        let newAwayScore = match.awayScore;
        let newEventStatus = match.eventStatus;
        const roll = Math.random();

        if (match.sport === 'Soccer') {
          const parts = match.time.split(':');
          if (parts.length === 2) {
            let min = parseInt(parts[0]);
            let sec = parseInt(parts[1]) + 20;
            if (sec >= 60) {
              min += 1;
              sec -= 60;
            }
            if (min >= 90) {
              min = 90;
              sec = 0;
            }
            newTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
          }

          if (roll < 0.05) {
            const isHomeGoal = Math.random() > 0.5;
            if (isHomeGoal) {
              newHomeScore = parseInt(newHomeScore) + 1;
              newEventStatus = `GOAL! ${match.homeTeam} scores! (${newHomeScore}-${newAwayScore})`;
            } else {
              newAwayScore = parseInt(newAwayScore) + 1;
              newEventStatus = `GOAL! ${match.awayTeam} scores! (${newHomeScore}-${newAwayScore})`;
            }
          } else {
            const commentaries = [
              "Ball in midfield - contested play",
              "Dangerous Attack by Chelsea",
              "Shot saved by Manchester goalkeeper",
              "Corner Kick awarded",
              "Yellow card shown for slide tackle"
            ];
            newEventStatus = commentaries[Math.floor(Math.random() * commentaries.length)];
          }
        } else if (match.sport === 'Cricket') {
          if (!match.isEntitySport) {
            const ovParts = match.time.split(' ');
            if (ovParts.length > 0) {
              const balls = ovParts[0].split('.');
              let ov = parseInt(balls[0]);
              let ball = parseInt(balls[1]) + 1;
              if (ball >= 6) {
                ov += 1;
                ball = 0;
              }
              newTime = `${ov}.${ball} Ov`;
            }

            const cricketHomeParts = match.homeScore.split('/');
            let runs = parseInt(cricketHomeParts[0]);
            let wkts = parseInt(cricketHomeParts[1]);

            if (roll < 0.08) {
              wkts = Math.min(10, wkts + 1);
              newEventStatus = `WICKET! CSK bowler takes crucial wicket of Mumbai!`;
            } else {
              const runScored = [0, 1, 1, 2, 4, 6][Math.floor(Math.random() * 6)];
              runs += runScored;
              if (runScored === 4) newEventStatus = `FOUR RUNS! Excellent boundary by batsman.`;
              else if (runScored === 6) newEventStatus = `SIX RUNS! Massive shot over deep midwicket!`;
              else newEventStatus = `Single run taken. Batsmen rotating strike.`;
            }
            newHomeScore = `${runs}/${wkts}`;
          }
        } else if (match.sport === 'Tennis') {
          const setParts = (match.homeScore || "0 | 0").toString().split('|');
          let currentSet = parseInt(setParts[0]?.trim() || "0");
          let points = setParts[1]?.trim() || "0";

          const scoreSequence = ["0", "15", "30", "40", "Ad"];
          let ptsIdx = scoreSequence.indexOf(points);

          if (roll < 0.1) {
            ptsIdx += 1;
            if (ptsIdx >= scoreSequence.length) {
              ptsIdx = 0;
              currentSet += 1;
              newEventStatus = `Game won by ${match.homeTeam}!`;
            } else {
              newEventStatus = `Ace serve from ${match.homeTeam}!`;
            }
            newHomeScore = `${currentSet} | ${scoreSequence[ptsIdx]}`;
          }
        }

        return {
          ...match,
          odds: newOdds,
          time: newTime,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          eventStatus: newEventStatus
        };
      });

      setMatches(updatedMatches);
      setOddsFlash(newFlash);
      
      setTimeout(() => {
        setOddsFlash({});
      }, 1500);

      if (placedBets.length > 0) {
        const updatedBets = placedBets.map((bet) => {
          if (bet.status !== 'active') return bet;
          const fluctuation = (Math.random() - 0.5) * 0.15;
          const newCashOut = Math.max(0.10, parseFloat((bet.cashOutValueUsdt + fluctuation).toFixed(4)));
          return { ...bet, cashOutValueUsdt: newCashOut };
        });
        setPlacedBets(updatedBets);
      }

    }, 5000);

    return () => clearInterval(interval);
  }, [matches, placedBets]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setCurrentView('match-detail');
  };

  return (
    <div className="app-container">
      <Preloader />
      {/* Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenDeposit={(tabType = 'deposit') => { setDepositModalTab(tabType); setIsDepositOpen(true); }} 
        onOpenAuth={() => setIsAuthOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        apiStatus={apiStatus}
        isLiveApi={isLiveApi}
      />

      {/* Global Winners Scroll Ticker */}
      <WinnersScrollTicker />

      {/* Main Grid Layout */}
      <div className="main-layout">
        {/* Left: Sidebar (visible on dashboard, details, and casino) */}
        {currentView !== 'admin' && (
          <Sidebar 
            selectedSport={selectedSport} 
            setSelectedSport={setSelectedSport} 
            matches={matches} 
            activeTab={activeTab}
          />
        )}

        {/* Center: Main View Controller */}
        <main style={{
          backgroundColor: '#0a0d14',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: (currentView === 'admin') ? '1 / span 2' : undefined
        }}>
          {currentView === 'admin' ? (
            <AdminPanel matches={matches} onUpdateMatches={setMatches} />
          ) : currentView === 'match-detail' ? (
            <MatchDetailView 
              match={selectedMatch} 
              onBack={() => setCurrentView('dashboard')} 
              oddsFlash={oddsFlash}
              onOddsAdded={() => {
                if (window.innerWidth <= 768) {
                  setCurrentView('mobile-slip');
                }
              }}
            />
          ) : currentView === 'mobile-slip' || currentView === 'mobile-mybets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Mobile Bet Slip header with back button */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--brand-teal-nav)',
                borderBottom: '1px solid var(--border-color)',
                flexShrink: 0,
              }}>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '5px 12px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}
                >
                  ← Back to Matches
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentView === 'mobile-slip' ? 'Bet Slip' : 'My Bets'}
                </span>
              </div>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <BetSlip initialTab={currentView === 'mobile-mybets' ? 'mybets' : 'slip'} />
              </div>
            </div>
          ) : (
            <MainDashboard
              matches={matches}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              activeTab={activeTab}
              oddsFlash={oddsFlash}
              onSelectMatch={handleSelectMatch}
              selectedMatch={selectedMatch}
              onOddsAdded={() => {
                if (window.innerWidth <= 768) {
                  setCurrentView('mobile-slip');
                }
              }}
            />
          )}
        </main>

        {/* Right Sidebar: Match Tracker and Bet Slip */}
        {currentView !== 'mobile-slip' && currentView !== 'mobile-mybets' && (
          <div className="right-sidebar">
            {/* Top: Match Tracker (only if not viewing mobile drawers) */}
            {currentView !== 'mobile-slip' && currentView !== 'mobile-mybets' && (
              <div style={{ flex: '0 0 auto', padding: '12px 12px 6px 12px', borderBottom: '1.5px solid var(--border-color)' }}>
                <MatchTracker match={selectedMatch} />
              </div>
            )}

            {/* Bottom: Bet Slip */}
            <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
              <BetSlip />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Tabs for Mobile Resizing */}
      <div className="mobile-bottom-nav">
        <button 
          onClick={() => { setCurrentView('dashboard'); setActiveTab('Sports'); }} 
          style={{ background: 'none', border: 'none', color: currentView === 'dashboard' && activeTab === 'Sports' ? 'var(--brand-yellow)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
        >
          <Home size={18} /> Sports
        </button>
        <button 
          onClick={() => { setCurrentView('dashboard'); setActiveTab('In-Play'); }} 
          style={{ background: 'none', border: 'none', color: currentView === 'dashboard' && activeTab === 'In-Play' ? 'var(--brand-yellow)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
        >
          <PlayCircle size={18} /> In-Play
        </button>
        <button 
          onClick={() => setCurrentView('mobile-slip')} 
          style={{ background: 'none', border: 'none', color: currentView === 'mobile-slip' ? 'var(--brand-yellow)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
        >
          <ShoppingBag size={18} /> Bet Slip
        </button>
        {user ? (
          <button 
            onClick={() => setCurrentView('mobile-mybets')} 
            style={{ background: 'none', border: 'none', color: currentView === 'mobile-mybets' ? 'var(--brand-yellow)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
          >
            <User size={18} /> My Bets
          </button>
        ) : (
          <button 
            onClick={() => setIsAuthOpen(true)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
          >
            <User size={18} /> Login
          </button>
        )}
      </div>

      {/* Crypto Deposit Modal */}
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        defaultTabType={depositModalTab}
      />

      {/* LogIn/Register Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {/* Floating Live Chatbot Support */}
      <LiveChat matches={matches} />
    </div>
  );
}

export default function App() {
  return (
    <BetProvider>
      <MainAppContent />
    </BetProvider>
  );
}
