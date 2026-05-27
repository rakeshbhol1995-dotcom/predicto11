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
import CasinoLobby from './components/CasinoLobby';
import LiveChat from './components/LiveChat';
import Preloader from './components/Preloader';
import { INITIAL_MATCHES } from './data/mockData';
import { Shield, Home, PlayCircle, ShoppingBag, User, Crown } from 'lucide-react';

const ODDS_API_KEY = "9a2e7922e00027abb0051b99528d6d69";

function MainAppContent() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedSport, setSelectedSport] = useState('All');
  const [activeTab, setActiveTab] = useState('Sports'); // 'Sports' or 'In-Play' or 'Casino'
  const [selectedMatch, setSelectedMatch] = useState(INITIAL_MATCHES[0]); // Default to first match
  const [oddsFlash, setOddsFlash] = useState({});
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiStatus, setApiStatus] = useState('Disconnected');
  
  // Views: 'dashboard' | 'match-detail' | 'admin' | 'mobile-slip' | 'mobile-mybets'
  const [currentView, setCurrentView] = useState('dashboard');

  const { user, placedBets, setPlacedBets } = useBet();

  // Keep selectedMatch updated with the latest state of matches
  useEffect(() => {
    if (selectedMatch) {
      const updated = matches.find(m => m.id === selectedMatch.id);
      if (updated) setSelectedMatch(updated);
    }
  }, [matches]);

  // Fetch real matches and odds from The Odds API on mount
  useEffect(() => {
    if (!ODDS_API_KEY) return;
    
    setApiStatus('Connecting...');
    fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${ODDS_API_KEY}&regions=eu,us&markets=h2h`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map API events to our match structure
          const mapped = data.slice(0, 15).map(event => {
            let sport = "Soccer";
            const sk = event.sport_key.toLowerCase();
            if (sk.includes("cricket")) sport = "Cricket";
            else if (sk.includes("tennis")) sport = "Tennis";
            else if (sk.includes("basketball")) sport = "Basketball";
            else if (sk.includes("soccer") || sk.includes("football")) sport = "Soccer";
            else if (sk.includes("baseball")) sport = "Baseball";
            else if (sk.includes("icehockey")) sport = "Ice Hockey";
            else sport = event.sport_title || "Soccer";

            // Find bookmaker odds (e.g. pinnacle, betsson, unibet, etc.)
            const bookmaker = event.bookmakers?.find(b => b.markets?.some(m => m.key === 'h2h')) || event.bookmakers?.[0];
            const market = bookmaker?.markets?.find(m => m.key === "h2h");
            
            let oddsHome = 1.90;
            let oddsAway = 1.90;
            let oddsDraw = null;

            if (market?.outcomes && market.outcomes.length >= 2) {
              const o1 = market.outcomes[0];
              const o2 = market.outcomes[1];
              const o3 = market.outcomes[2];

              // Fuzzy match helper
              const isMatch = (name, team) => {
                if (!name || !team) return false;
                const n = name.toLowerCase().trim();
                const t = team.toLowerCase().trim();
                return n === t || n.includes(t) || t.includes(n);
              };

              // Identify outcomes by fuzzy name check
              let homeOutcome = market.outcomes.find(o => isMatch(o.name, event.home_team));
              let awayOutcome = market.outcomes.find(o => isMatch(o.name, event.away_team));
              let drawOutcome = market.outcomes.find(o => o.name.toLowerCase() === "draw" || o.name.toLowerCase() === "tie");

              // Fallback to indices if names are inconclusive or abbreviated
              if (!homeOutcome && !awayOutcome) {
                homeOutcome = o1;
                awayOutcome = o2;
                if (market.outcomes.length === 3) {
                  drawOutcome = o3;
                }
              } else if (!homeOutcome) {
                homeOutcome = o1 === awayOutcome ? o2 : o1;
              } else if (!awayOutcome) {
                awayOutcome = o1 === homeOutcome ? o2 : o1;
              }

              if (homeOutcome) oddsHome = homeOutcome.price;
              if (awayOutcome) oddsAway = awayOutcome.price;
              if (drawOutcome) oddsDraw = drawOutcome.price;
            }

            // Set dynamic live scores and information based on sport type
            let homeScore = "0";
            let awayScore = "0";
            let status = "live";
            let time = "35:00";
            let eventStatus = "Game Play in Progress";

            if (sport === 'Cricket') {
              homeScore = "142/3";
              awayScore = "128/4";
              time = "16.1 Ov";
              eventStatus = `${event.away_team} needs 15 runs in 23 balls`;
            } else if (sport === 'Tennis') {
              homeScore = "2 | 15";
              awayScore = "1 | 30";
              time = "Set 3";
              eventStatus = "Break point opportunity";
            } else if (sport === 'Soccer') {
              homeScore = "1";
              awayScore = "0";
              time = "56:45";
              eventStatus = "Attacking possession";
            } else if (sport === 'Basketball') {
              homeScore = "88";
              awayScore = "92";
              time = "Q4 4:12";
              eventStatus = "Free throws awarded";
            } else {
              homeScore = "3";
              awayScore = "2";
              time = "Period 2";
              eventStatus = "Powerplay";
            }

            return {
              id: event.id,
              sport: sport,
              league: event.sport_title,
              homeTeam: event.home_team,
              awayTeam: event.away_team,
              homeScore: homeScore,
              awayScore: awayScore,
              time: time,
              status: status,
              eventStatus: eventStatus,
              stats: {
                possession: [52, 48],
                shots: [11, 8],
                corners: [4, 3]
              },
              odds: {
                home: oddsHome,
                draw: oddsDraw || (sport === 'Soccer' ? 3.40 : null),
                away: oddsAway
              }
            };
          });

          // Merge API matches with INITIAL_MATCHES to prevent empty sections
          const merged = [
            ...mapped,
            ...INITIAL_MATCHES.filter(im => !mapped.some(m => m.homeTeam.toLowerCase() === im.homeTeam.toLowerCase() || m.awayTeam.toLowerCase() === im.awayTeam.toLowerCase()))
          ];

          setMatches(merged);
          setSelectedMatch(merged[0]);
          setIsLiveApi(true);
          setApiStatus('Live Active');
        } else {
          throw new Error("No events returned from API");
        }
      })
      .catch(err => {
        console.error("Odds API Error:", err.message);
        setApiStatus(`Failed - Using Simulator`);
        setIsLiveApi(false);
      });
  }, []);

  // Simulation Engine Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const liveMatches = matches.filter(m => m.status === 'live');
      if (liveMatches.length === 0) return;
      
      const randomMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      const newFlash = {};

      const updatedMatches = matches.map((match) => {
        if (match.id !== randomMatch.id) return match;

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
        } else if (match.sport === 'Tennis') {
          const setParts = match.homeScore.split('|');
          let currentSet = parseInt(setParts[0].trim());
          let points = setParts[1].trim();

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
        onOpenDeposit={() => setIsDepositOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        apiStatus={apiStatus}
        isLiveApi={isLiveApi}
      />

      {/* Main Grid Layout */}
      <div className="main-layout">
        {/* Left: Sidebar (only visible on dashboard or details, and not in casino) */}
        {currentView !== 'admin' && activeTab !== 'Casino' && (
          <Sidebar selectedSport={selectedSport} setSelectedSport={setSelectedSport} matches={matches} />
        )}

        {/* Center: Main View Controller */}
        <main style={{
          backgroundColor: '#0a0d14',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: (currentView === 'admin' || activeTab === 'Casino') ? '1 / span 3' : undefined
        }}>
          {currentView === 'admin' ? (
            <AdminPanel matches={matches} onUpdateMatches={setMatches} />
          ) : activeTab === 'Casino' ? (
            <CasinoLobby />
          ) : currentView === 'match-detail' ? (
            <MatchDetailView 
              match={selectedMatch} 
              onBack={() => setCurrentView('dashboard')} 
              oddsFlash={oddsFlash}
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
              <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                <BetSlip />
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

        {/* Right Sidebar: Match Tracker and Bet Slip (hidden in admin & casino) */}
        {currentView !== 'admin' && activeTab !== 'Casino' && (
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
          onClick={() => { setCurrentView('dashboard'); setActiveTab('Casino'); }} 
          style={{ background: 'none', border: 'none', color: currentView === 'dashboard' && activeTab === 'Casino' ? 'var(--brand-purple)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem' }}
        >
          <Crown size={18} /> Casino
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
