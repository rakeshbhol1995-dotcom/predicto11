import React, { useState } from 'react';
import { useBet } from '../context/BetContext';
import { Trash2, ShoppingCart, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

export default function BetSlip() {
  const {
    selections,
    placedBets,
    removeSelection,
    updateStake,
    clearSlip,
    placeBet,
    cashOutBet,
    fiatSymbol,
    convertUsdtToFiat
  } = useBet();

  const [activeTab, setActiveTab] = useState('slip'); // 'slip' or 'mybets'
  const [isAccumulator, setIsAccumulator] = useState(false);
  const [accStake, setAccStake] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Calculate statistics (displayed in current selected fiat currency)
  const totalOdds = selections.reduce((acc, curr) => acc * curr.odd, 1);
  
  // For back bets, the cost is the stake. For lay bets, the cost is the liability: Stake * (Odd - 1)
  const totalSingleStakeOrLiability = selections.reduce((acc, curr) => {
    const stakeVal = parseFloat(curr.stake) || 0;
    if (curr.betType === 'lay') {
      return acc + (stakeVal * (curr.odd - 1));
    }
    return acc + stakeVal;
  }, 0);

  const totalPotentialReturnSingle = selections.reduce(
    (acc, curr) => acc + (parseFloat(curr.stake) || 0) * curr.odd,
    0
  );

  const hasLaySelection = selections.some(sel => sel.betType === 'lay');

  const handleQuickStake = (val, selectionId = null) => {
    // Quick stakes are in fiat units: e.g. 100 INR / 10 USD
    if (selectionId === 'acc') {
      setAccStake(val.toString());
    } else if (selectionId) {
      updateStake(selectionId, val.toString());
    } else {
      selections.forEach((sel) => updateStake(sel.id, val.toString()));
    }
  };

  const handlePlaceBet = () => {
    setLoading(true);
    setMessage(null);
    
    setTimeout(() => {
      let res;
      if (isAccumulator && selections.length > 1) {
        res = placeBet(true, accStake);
      } else {
        res = placeBet(false);
      }

      setLoading(false);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setAccStake('');
        setTimeout(() => {
          setActiveTab('mybets');
          setMessage(null);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    }, 1000);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-panel)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', height: '48px' }}>
        <button
          onClick={() => setActiveTab('slip')}
          style={{
            flex: 1,
            background: activeTab === 'slip' ? 'var(--bg-card)' : 'transparent',
            border: 'none',
            color: activeTab === 'slip' ? 'var(--brand-yellow)' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'var(--font-display)',
            borderBottom: activeTab === 'slip' ? '2.5px solid var(--brand-emerald)' : 'none'
          }}
        >
          <ShoppingCart size={14} />
          Bet Slip
          {selections.length > 0 && (
            <span style={{
              backgroundColor: 'var(--brand-yellow)',
              color: '#080a0f',
              fontSize: '0.65rem',
              fontWeight: 800,
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selections.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('mybets')}
          style={{
            flex: 1,
            background: activeTab === 'mybets' ? 'var(--bg-card)' : 'transparent',
            border: 'none',
            color: activeTab === 'mybets' ? 'var(--brand-yellow)' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'var(--font-display)',
            borderBottom: activeTab === 'mybets' ? '2.5px solid var(--brand-emerald)' : 'none'
          }}
        >
          <Briefcase size={14} />
          My Bets
          {placedBets.filter(b => b.status === 'active').length > 0 && (
            <span style={{
              backgroundColor: 'var(--live-green)',
              color: '#080a0f',
              fontSize: '0.65rem',
              fontWeight: 800,
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {placedBets.filter(b => b.status === 'active').length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column' }}>
        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: message.type === 'success' ? 'rgba(0, 255, 170, 0.1)' : 'rgba(255, 62, 108, 0.1)',
            border: `1px solid ${message.type === 'success' ? 'var(--live-green)' : 'var(--live-red)'}`,
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '12px',
            fontSize: '0.8rem',
            color: '#ffffff'
          }}>
            {message.type === 'success' ? <CheckCircle size={16} style={{ color: 'var(--live-green)' }} /> : <AlertCircle size={16} style={{ color: 'var(--live-red)' }} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Bet Slip */}
        {activeTab === 'slip' && (
          <>
            {selections.length === 0 ? (
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '200px' }}>
                <ShoppingCart size={32} style={{ strokeWidth: 1.5, marginBottom: '12px' }} />
                <span style={{ fontSize: '0.85rem' }}>Your betslip is empty</span>
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click on any odds card to add selection</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SELECTIONS</span>
                  <button onClick={clearSlip} style={{ background: 'none', border: 'none', color: 'var(--live-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Trash2 size={12} /> Clear All
                  </button>
                </div>

                {/* Individual Selections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selections.map((sel) => (
                    <div key={sel.id} style={{ 
                      backgroundColor: 'var(--bg-card)', 
                      border: '1px solid var(--border-color)', 
                      borderLeft: sel.betType === 'lay' ? '4.5px solid var(--live-red)' : '4.5px solid #00b0ff',
                      borderRadius: '8px', 
                      padding: '10px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{sel.outcomeName}</h5>
                            <span style={{
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: sel.betType === 'lay' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(3, 169, 244, 0.15)',
                              color: sel.betType === 'lay' ? '#ff80ab' : '#80d8ff',
                              border: `1px solid ${sel.betType === 'lay' ? 'rgba(255, 62, 108, 0.2)' : 'rgba(3, 169, 244, 0.2)'}`
                            }}>
                              {sel.betType === 'lay' ? 'LAY' : 'BACK'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{sel.market} • {sel.sport}</span>
                          <p style={{ fontSize: '0.75rem', color: '#ffffff', marginTop: '2px' }}>{sel.matchName}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--brand-emerald)', fontWeight: 800, fontSize: '0.95rem' }}>
                            {sel.odd.toFixed(2)}
                          </span>
                          <button onClick={() => removeSelection(sel.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Stake input */}
                      {!isAccumulator && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                              <span style={{ position: 'absolute', left: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{fiatSymbol}</span>
                              <input
                                type="number"
                                placeholder={sel.betType === 'lay' ? "Backer's Stake" : "Stake"}
                                value={sel.stake}
                                onChange={(e) => updateStake(sel.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  backgroundColor: 'var(--bg-panel)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '4px',
                                  padding: '6px 6px 6px 20px',
                                  color: '#ffffff',
                                  fontSize: '0.8rem',
                                  outline: 'none'
                                }}
                              />
                            </div>
                            {sel.stake && (
                              <span style={{ fontSize: '0.7rem', color: sel.betType === 'lay' ? 'var(--live-red)' : 'var(--live-green)', fontWeight: 600 }}>
                                {sel.betType === 'lay' 
                                  ? `Liability: ${fiatSymbol}${(parseFloat(sel.stake) * (sel.odd - 1)).toFixed(2)}`
                                  : `Return: ${fiatSymbol}${(parseFloat(sel.stake) * sel.odd).toFixed(2)}`
                                }
                              </span>
                            )}
                          </div>
                          {/* Quick Stakes */}
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                            {[100, 500, 1000, 5000].map((v) => (
                              <button key={v} onClick={() => handleQuickStake(v, sel.id)} style={{ flex: 1, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', borderRadius: '3px', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '2px 0', cursor: 'pointer' }}>
                                +{v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Accumulator Toggle (Only if more than 1 selection) */}
                {selections.length > 1 && (
                  <div style={{
                    marginTop: '8px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {hasLaySelection ? (
                      <div style={{ fontSize: '0.75rem', color: '#ff9800', backgroundColor: 'rgba(255, 152, 0, 0.1)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
                        ⚠️ Combo/Accumulator bets are not available when Lay selections are in the slip.
                      </div>
                    ) : (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={isAccumulator}
                          onChange={(e) => setIsAccumulator(e.target.checked)}
                          style={{ accentColor: 'var(--brand-emerald)' }}
                        />
                        <span>Bet as Accumulator / Combo</span>
                      </label>
                    )}

                    {isAccumulator && !hasLaySelection && (
                      <div style={{ backgroundColor: 'rgba(5, 196, 139, 0.04)', border: '1px dashed var(--brand-emerald)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span>Combined Odds:</span>
                          <span style={{ fontWeight: 800, color: 'var(--brand-emerald)' }}>{totalOdds.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fiatSymbol}</span>
                            <input
                              type="number"
                              placeholder="Acc Stake"
                              value={accStake}
                              onChange={(e) => setAccStake(e.target.value)}
                              style={{
                                width: '100%',
                                backgroundColor: 'var(--bg-panel)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                padding: '6px 6px 6px 20px',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          {accStake && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--live-green)', fontWeight: 600 }}>
                              Payout: {fiatSymbol}{(parseFloat(accStake) * totalOdds).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[500, 1000, 2500, 5000].map((v) => (
                            <button key={v} onClick={() => handleQuickStake(v, 'acc')} style={{ flex: 1, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', borderRadius: '3px', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '2px 0', cursor: 'pointer' }}>
                              +{v}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Place Bet Footer Summary */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{hasLaySelection ? "Total Stake/Liability:" : "Total Stake:"}</span>
                    <span style={{ fontWeight: 700 }}>
                      {fiatSymbol}{isAccumulator ? (parseFloat(accStake) || 0).toFixed(2) : totalSingleStakeOrLiability.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{hasLaySelection ? "Potential Return (incl. liability):" : "Potential Returns:"}</span>
                    <span style={{ fontWeight: 700, color: 'var(--live-green)' }}>
                      {fiatSymbol}{isAccumulator ? ((parseFloat(accStake) || 0) * totalOdds).toFixed(2) : totalPotentialReturnSingle.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceBet}
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: loading ? 0.7 : 1,
                      backgroundColor: 'var(--brand-emerald)',
                      color: '#080a0f',
                      boxShadow: '0 4px 14px rgba(5, 196, 139, 0.25)'
                    }}
                  >
                    {loading ? "Placing Bet..." : "Place Bet"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: My Bets */}
        {activeTab === 'mybets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {placedBets.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '200px' }}>
                <Briefcase size={32} style={{ strokeWidth: 1.5, marginBottom: '12px' }} />
                <span style={{ fontSize: '0.85rem' }}>No bets placed yet</span>
              </div>
            ) : (
              placedBets.map((bet) => (
                <div key={bet.id} style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderLeft: bet.betType === 'lay' ? '4.5px solid var(--live-red)' : '4.5px solid var(--brand-emerald)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: bet.status === 'active' ? 'rgba(5, 196, 139, 0.12)' : 'rgba(255,255,255,0.08)',
                      color: bet.status === 'active' ? 'var(--brand-emerald)' : 'var(--text-muted)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {bet.type.toUpperCase()} • {bet.betType === 'lay' ? 'LAY' : 'BACK'} • {bet.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{bet.date}</span>
                  </div>

                  {/* Selections list in this bet */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
                    {bet.selections.map((sel, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: 'var(--brand-yellow)' }}>
                            {sel.outcomeName} @ {sel.odd.toFixed(2)}
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '0.55rem',
                              fontWeight: 800,
                              padding: '1px 3px',
                              borderRadius: '2px',
                              backgroundColor: sel.betType === 'lay' ? 'rgba(255, 62, 108, 0.15)' : 'rgba(3, 169, 244, 0.15)',
                              color: sel.betType === 'lay' ? '#ff80ab' : '#80d8ff'
                            }}>
                              {sel.betType === 'lay' ? 'LAY' : 'BACK'}
                            </span>
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{sel.market}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{sel.matchName}</p>
                      </div>
                    ))}
                  </div>

                  {/* Financials details (converted to active fiat dynamically) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '8px',
                    borderRadius: '6px',
                    marginTop: '2px',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{bet.betType === 'lay' ? "Liability:" : "Stake:"}</span> <span style={{ fontWeight: 600 }}>{fiatSymbol}{convertUsdtToFiat(bet.totalStakeUsdt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Returns:</span> <span style={{ fontWeight: 600, color: 'var(--live-green)' }}>{fiatSymbol}{convertUsdtToFiat(bet.potentialPayoutUsdt).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Cash Out Action */}
                  {bet.status === 'active' && (
                    <button
                      onClick={() => cashOutBet(bet.id)}
                      style={{
                        backgroundColor: '#ff9800',
                        color: '#080a0f',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 0',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        marginTop: '6px',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f57c00'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ff9800'}
                    >
                      Cash Out: {fiatSymbol}{convertUsdtToFiat(bet.cashOutValueUsdt).toFixed(2)}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
