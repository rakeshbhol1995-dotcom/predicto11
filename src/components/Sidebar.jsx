import React, { useState, useEffect, useRef } from 'react';
import { SPORTS_LIST } from '../data/mockData';
import { Flame, Award, Trophy, Users, MessageSquare, Send, Crown, CheckCircle2 } from 'lucide-react';
import { useBet } from '../context/BetContext';

const BOT_USERNAMES = [
  'LuckyStriker', 'BTC_HODLer', 'AviatorGod', 'CricketGuru', 
  'DegenKing', 'EmeraldPrincess', 'CryptoShark', 'MaxWager',
  'SlotMaster', 'Rakesh_P2P', 'TRX_Whale', 'BettingBeast'
];

const BOT_VIP_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

const BOT_VIP_COLORS = {
  BRONZE: '#cd7f32',
  SILVER: '#a0a0a0',
  GOLD: 'var(--brand-gold)',
  PLATINUM: '#c084fc',
  DIAMOND: '#00e5ff'
};

const BOT_COMMENTS = {
  match: [
    "MI is crushing it in the live overs! Free money!",
    "Arsenal draw odds are looking super juicy right now, tempted to hedge",
    "CSK spin bowlers did absolute magic. Odds are fluctuating crazy!",
    "Tennis match is tight! Break point opportunity is high value",
    "IPL super boosts are giving insane margins today, placed my accumulator!",
    "Chelsea is playing defense, under 2.5 goals looks like a lock."
  ],
  slots: [
    "OMG, just hit triple diamonds on Jackpot Slots! 50x payout reached! 🎉",
    "Double matching stars on slots! Safe 1.5x profit back in the wallet.",
    "Jackpot slots are spitting today! Wager volume growing fast.",
    "Cherries matched! Slots is definitely my lucky game today."
  ],
  roulette: [
    "Always bet on Black! 2x chip payout secured! ⚫",
    "WHOA! Number 17 just hit! 35x payout to the moon! 🔴",
    "Green Zero hit! House edge is real, but I'm going back in!",
    "Roulette board is heating up. Red numbers running hot."
  ],
  crash: [
    "Yo! Aviator jet hit 14.5x just now! Who held till the end?",
    "Crashed at 1.08x... absolute rip, plane flew away too fast 😭",
    "Double stake slips in Aviator is an elite strategy. Hedge at 1.5x, let the other run to 10x!",
    "Synthesized flight sound speeds up my heart rate, Aviator is intense!",
    "Casinded out at 5.4x right before crash at 5.5x! My reflexes are god tier!"
  ],
  withdraw: [
    "Admin Bunty approved my withdrawal in less than 2 mins! Elite speed!",
    "Just received my 45 USDT payout directly in my TRC20 wallet address. Clean!",
    "P2P settlement ledger is so transparent. Ledger updates instant.",
    "Withdrawal approved and credited. VIP Silver rank is totally worth it!"
  ]
};

export default function Sidebar({ selectedSport, setSelectedSport, matches = [], activeTab }) {
  const { user, vipInfo, submitWithdrawalRequest, cryptoBalances } = useBet();
  const [activeSidebarTab, setActiveSidebarTab] = useState('sports');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      username: 'TRX_Whale',
      vipTier: 'GOLD',
      vipColor: BOT_VIP_COLORS.GOLD,
      text: "Predicto11 crypto platform is looking clean today! Balance updates are instant.",
      time: '11:42 PM'
    },
    {
      id: 'msg-2',
      username: 'DegenKing',
      vipTier: 'DIAMOND',
      vipColor: BOT_VIP_COLORS.DIAMOND,
      text: "IPL odds boosts are massive, just backed CSK with an accumulator slip.",
      time: '11:43 PM'
    },
    {
      id: 'msg-3',
      username: 'LuckyStriker',
      vipTier: 'SILVER',
      vipColor: BOT_VIP_COLORS.SILVER,
      text: "Just hit a double bell on Jackpot Slots! Payout credited automatically.",
      time: '11:44 PM'
    },
    {
      id: 'msg-4',
      username: 'AviatorGod',
      vipTier: 'PLATINUM',
      vipColor: BOT_VIP_COLORS.PLATINUM,
      text: "Aviator flight is flying high! Hedging with dual bet stakes is the ultimate cheat code.",
      time: '11:45 PM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  // Switch to chat tab when activeTab is Casino
  useEffect(() => {
    if (activeTab === 'Casino') {
      setActiveSidebarTab('chat');
    }
  }, [activeTab]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeSidebarTab]);

  // Simulated Automated Bot Commentary
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random bot and comment type
      const botName = BOT_USERNAMES[Math.floor(Math.random() * BOT_USERNAMES.length)];
      const tier = BOT_VIP_TIERS[Math.floor(Math.random() * BOT_VIP_TIERS.length)];
      const color = BOT_VIP_COLORS[tier];
      
      const categories = ['match', 'slots', 'roulette', 'crash', 'withdraw'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const commentList = BOT_COMMENTS[cat];
      const commentText = commentList[Math.floor(Math.random() * commentList.length)];

      const newMsg = {
        id: `msg-${Date.now()}`,
        username: botName,
        vipTier: tier,
        vipColor: color,
        text: commentText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev.slice(-35), newMsg]);
    }, 11000); // Trigger every 11 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      username: user.username,
      vipTier: vipInfo.tier,
      vipColor: vipInfo.color,
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue('');
  };

  return (
    <aside className="left-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      
      {/* Tab Switcher at the top of the Sidebar (only if not in Casino) */}
      {activeTab !== 'Casino' ? (
        <div className="p2p-chat-tab-bar" style={{ flexShrink: 0 }}>
          <button 
            className={`p2p-chat-tab-btn ${activeSidebarTab === 'sports' ? 'active' : ''}`}
            onClick={() => setActiveSidebarTab('sports')}
          >
            <Trophy size={13} />
            Sports A-Z
          </button>
          <button 
            className={`p2p-chat-tab-btn ${activeSidebarTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveSidebarTab('chat')}
          >
            <Users size={13} />
            P2P Chat
            <span style={{
              width: '6px', height: '6px', backgroundColor: 'var(--live-green)',
              borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px var(--live-green)'
            }} />
          </button>
        </div>
      ) : (
        <div style={{ padding: '8px 16px 2px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
          <MessageSquare size={16} style={{ color: 'var(--brand-purple)' }} />
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.5px' }}>P2P Casino Chat</h4>
          <span style={{
            backgroundColor: 'rgba(156, 39, 176, 0.15)', color: 'var(--brand-purple)',
            fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 900
          }}>LIVE</span>
        </div>
      )}

      {/* Conditional Content Rendering */}
      {activeSidebarTab === 'sports' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1, overflowY: 'auto' }}>
          {/* Popular Events Section */}
          <div>
            <h4 style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              padding: '0 16px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Popular Sections
            </h4>
            <ul style={{ listStyle: 'none' }}>
              <li>
                <button
                  onClick={() => setSelectedSport('All')}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: selectedSport === 'All' ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: 'none',
                    borderLeft: selectedSport === 'All' ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                    color: selectedSport === 'All' ? 'var(--brand-yellow)' : 'var(--text-main)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Trophy size={14} />
                  <span>All Sports Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedSport('Cricket')}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: selectedSport === 'Cricket' ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: 'none',
                    borderLeft: selectedSport === 'Cricket' ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                    color: selectedSport === 'Cricket' ? 'var(--brand-yellow)' : 'var(--text-main)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Flame size={14} style={{ color: '#ff5722' }} />
                  <span>IPL Super Odds Boost</span>
                </button>
              </li>
            </ul>
          </div>

          {/* A-Z Sports List */}
          <div>
            <h4 style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              padding: '0 16px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              A-Z Sports
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
              {SPORTS_LIST.map((sport) => {
                const isSelected = selectedSport === sport.name;
                const liveCount = matches.filter(m => m.sport.toLowerCase() === sport.name.toLowerCase() && m.status === 'live').length;
                return (
                  <li key={sport.name}>
                    <button
                      onClick={() => setSelectedSport(sport.name)}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                        border: 'none',
                        borderLeft: isSelected ? '3px solid var(--brand-yellow)' : '3px solid transparent',
                        color: isSelected ? 'var(--brand-yellow)' : 'var(--text-main)',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 600 : 400,
                        transition: 'all 0.15s ease',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.05rem' }}>{sport.icon}</span>
                        <span>{sport.name}</span>
                      </div>
                      {liveCount > 0 && (
                        <span style={{
                          backgroundColor: 'rgba(0, 255, 133, 0.12)',
                          color: 'var(--live-green)',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 255, 133, 0.2)'
                        }}>
                          {liveCount} LIVE
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Responsible Gaming Info Card */}
          <div style={{ marginTop: 'auto', padding: '0 16px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '10px',
              textAlign: 'center'
            }}>
              <Award size={18} style={{ color: 'var(--brand-yellow)', marginBottom: '4px' }} />
              <h5 style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Responsible Gaming</h5>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Keep it fun. Play responsibly.</p>
            </div>
          </div>
        </div>
      ) : (
        /* P2P Live Chatroom Panel */
        <div className="p2p-chat-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Scrollable messages area */}
          <div className="p2p-chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p2p-chat-msg-row">
                <div className="p2p-chat-msg-user-row">
                  <span className="p2p-chat-msg-username">
                    {msg.username}
                    <span 
                      className="p2p-chat-msg-badge" 
                      style={{ 
                        backgroundColor: `${msg.vipColor}1e`,
                        color: msg.vipColor,
                        border: `1px solid ${msg.vipColor}44`
                      }}
                    >
                      <Crown size={8} style={{ marginRight: '2px', display: 'inline-block', verticalAlign: 'middle' }} />
                      {msg.vipTier}
                    </span>
                  </span>
                  <span className="p2p-chat-msg-time">{msg.time}</span>
                </div>
                <div className="p2p-chat-msg-text">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Form to submit chats */}
          <form onSubmit={handleSendChat} className="p2p-chat-input-area" style={{ flexShrink: 0 }}>
            {user ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Share a bet tip or brag wins..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{
                    flexGrow: 1,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                  maxLength={100}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  style={{
                    backgroundColor: inputValue.trim() ? 'var(--brand-yellow)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                    color: '#080a0f',
                    transition: 'all 0.15s'
                  }}
                >
                  <Send size={14} />
                </button>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '6px',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '6px',
                border: '1px dashed var(--border-color)'
              }}>
                🔒 Please log in or join now to chat
              </div>
            )}
          </form>
        </div>
      )}
    </aside>
  );
}

