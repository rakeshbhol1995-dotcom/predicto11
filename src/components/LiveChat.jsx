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

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello Bunty! Welcome to Predicto11 Live Help Chat.' },
    { sender: 'agent', text: "How can I help you? Try typing keywords like 'deposit', 'fiat', 'withdraw', or 'bets' for instant responses!" }
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
      let botResponse = "Thank you for reaching out! A support operator will be online shortly. You can try typing keywords like 'deposit', 'fiat', or 'bets'.";
      const normalized = userText.toLowerCase();

      if (normalized.includes('deposit')) {
        botResponse = "To deposit crypto: 1. Click the '+' button in your balance widget. 2. Select USDT, BTC, or ETH. 3. Enter the amount to preview converted fiat. 4. Confirm deposit to credit your account instantly!";
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
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--live-green)',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffffff' }}>Predicto11 Live Chat Support</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={16} />
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
