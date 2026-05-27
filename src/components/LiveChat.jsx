import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

const LiveChatCustomLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);

export default function LiveChat({ matches = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! Welcome to Predicto11 Live Support. Agent Bunty is online to assist you.' },
    { sender: 'agent', text: "How can I help you? Try asking me for match tips (e.g. 'csk vs mi prediction') or keywords like 'deposit', 'withdraw', 'bets'!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputValue('');

    // Bot Response Logic after 1s
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! A support operator will be online shortly. You can ask me for live match predictions (e.g. 'CSK match prediction') or details on deposits/withdrawals.";
      const normalized = userText.toLowerCase();

      // Find if user is asking about a specific team
      const matched = matches.find(m => 
        m.homeTeam.toLowerCase().includes(normalized) || 
        m.awayTeam.toLowerCase().includes(normalized) ||
        (normalized.includes('csk') && m.homeTeam.toLowerCase().includes('chennai') || m.awayTeam.toLowerCase().includes('chennai')) ||
        (normalized.includes('mi') && m.homeTeam.toLowerCase().includes('mumbai') || m.awayTeam.toLowerCase().includes('mumbai')) ||
        (normalized.includes('manchester') && m.homeTeam.toLowerCase().includes('manchester') || m.awayTeam.toLowerCase().includes('manchester')) ||
        (normalized.includes('navi') && m.homeTeam.toLowerCase().includes('natus') || m.awayTeam.toLowerCase().includes('natus'))
      );

      if (matched) {
        const homeOdds = matched.odds.home || 'N/A';
        const awayOdds = matched.odds.away || 'N/A';
        const drawOdds = matched.odds.draw || 'N/A';
        const statusText = matched.eventStatus ? ` (${matched.eventStatus})` : '';

        botResponse = `🎯 AI Match Advisor: In ${matched.homeTeam} v ${matched.awayTeam} (${matched.sport} - ${matched.league}), the live score is ${matched.homeScore} - ${matched.awayScore} at ${matched.time}${statusText}. 
Current Odds: ${matched.homeTeam} at ${homeOdds}, Draw at ${drawOdds}, ${matched.awayTeam} at ${awayOdds}. 
Based on our prediction model, we recommend a smart value bet on ${parseFloat(homeOdds) < parseFloat(awayOdds) ? matched.homeTeam : matched.awayTeam} for stable returns, or back the underdog if you want high-yield potential!`;
      } else if (normalized.includes('tip') || normalized.includes('predict') || normalized.includes('advice') || normalized.includes('win')) {
        // Find first live match
        const liveMatch = matches.find(m => m.status === 'live');
        if (liveMatch) {
          botResponse = `🔮 Predicto11 AI Tip: Look at the live match ${liveMatch.homeTeam} v ${liveMatch.awayTeam}. The score is ${liveMatch.homeScore} - ${liveMatch.awayScore} (${liveMatch.time}). 
We suggest betting on ${liveMatch.odds.home < liveMatch.odds.away ? liveMatch.homeTeam : liveMatch.awayTeam} (odds: ${liveMatch.odds.home < liveMatch.odds.away ? liveMatch.odds.home : liveMatch.odds.away}) as they have control over the current game momentum!`;
        } else {
          botResponse = "Currently, there are no live matches running in our simulation database. Please check back when matches are active!";
        }
      } else if (normalized.includes('deposit')) {
        botResponse = "To deposit: 1. Click the '+' button in your balance widget. 2. Select UPI/Bank Transfer for Indian Rupees (INR) or Crypto (USDT, BTC, ETH) for direct tokens. 3. Enter details & submit UTR code to credit your account instantly!";
      } else if (normalized.includes('fiat') || normalized.includes('currency')) {
        botResponse = "You can change display currencies between INR (₹), USD ($), and EUR (€) using the dropdown selector in the header navigation.";
      } else if (normalized.includes('withdraw')) {
        botResponse = "Withdrawals are processed securely back to your crypto address. Contact support@predicto11.com for large payouts.";
      } else if (normalized.includes('bet')) {
        botResponse = "To place a bet, make sure you are logged in. Click on any sports odds box to add the selection to your Bet Slip on the right, enter your stake, and press 'Place Bet'.";
      }

      setMessages((prev) => [...prev, { sender: 'agent', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header" style={{
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            padding: '12px 16px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  color: '#059669',
                  fontSize: '0.85rem',
                  border: '1.5px solid #ffffff'
                }}>B</div>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#34d399',
                  borderRadius: '50%',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  border: '1.5px solid #059669'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.2 }}>Agent Bunty</span>
                <span style={{ fontSize: '0.62rem', color: '#d1fae5', opacity: 0.9 }}>Support Specialist (Online)</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flexGrow: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#ffffff',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--brand-emerald)',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#080a0f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      ) : (
        <div className="chat-bubble" onClick={() => setIsOpen(true)}>
          <LiveChatCustomLogo />
        </div>
      )}
    </div>
  );
}
