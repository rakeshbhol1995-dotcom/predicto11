import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { X, LogIn, UserPlus, AlertCircle, Phone, Mail, Lock, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { loginUser, registerUser } = useBet();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setLoginId('');
    setLoginPassword('');
    setRegUsername('');
    setRegEmail('');
    setRegMobile('');
    setRegPassword('');
    setRegConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const res = loginUser(loginId, loginPassword);
    if (res.success) {
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const res = registerUser(regUsername, regEmail, regMobile, regPassword);
    if (res.success) {
      setSuccess('Registration successful! Account created.');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        {/* Toggle tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', height: '48px' }}>
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              flex: 1,
              background: activeTab === 'login' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              color: activeTab === 'login' ? 'var(--brand-yellow)' : 'var(--text-muted)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'var(--font-display)',
              borderBottom: activeTab === 'login' ? '2.5px solid var(--brand-emerald)' : 'none'
            }}
          >
            <LogIn size={16} /> Log In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              flex: 1,
              background: activeTab === 'register' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              color: activeTab === 'register' ? 'var(--brand-yellow)' : 'var(--text-muted)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'var(--font-display)',
              borderBottom: activeTab === 'register' ? '2.5px solid var(--brand-emerald)' : 'none'
            }}
          >
            <UserPlus size={16} /> Join Now
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 62, 108, 0.12)',
              border: '1px solid var(--live-red)',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              <AlertCircle size={16} style={{ color: 'var(--live-red)' }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(0, 255, 170, 0.12)',
              border: '1px solid var(--live-green)',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              <span>{success}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Username or Email</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your User ID or Email"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '10px',
                  backgroundColor: 'var(--brand-emerald)',
                  color: '#080a0f',
                  boxShadow: '0 4px 12px rgba(5, 196, 139, 0.2)'
                }}
              >
                Log In
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo account: **Bunty** / **password123**
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>User ID (Username)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Create Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    style={{ paddingLeft: '32px', padding: '8px 12px 8px 32px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email ID</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '32px', padding: '8px 12px 8px 32px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mobile Number</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter mobile number"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    required
                    style={{ paddingLeft: '32px', padding: '8px 12px 8px 32px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '32px', padding: '8px 12px 8px 32px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirm Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '32px', padding: '8px 12px 8px 32px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  backgroundColor: 'var(--brand-emerald)',
                  color: '#080a0f',
                  boxShadow: '0 4px 12px rgba(5, 196, 139, 0.2)'
                }}
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
