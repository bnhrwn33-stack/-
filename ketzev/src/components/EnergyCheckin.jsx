import { useState } from 'react';
import { energyLabels } from '../data/mockData';

export default function EnergyCheckin({ onClose, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ energy: selected, note, time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) });
      onClose();
    }, 1500);
  };

  if (submitted) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)', zIndex: 100, backdropFilter: 'blur(8px)',
      }}>
        <div className="animate-bounce-in glass" style={{
          borderRadius: 24, padding: 48, textAlign: 'center', maxWidth: 320,
        }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>
            {energyLabels[selected]?.emoji}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }} className="gradient-text">
            נרשם!
          </div>
          <div style={{ color: '#94a3b8', marginTop: 8 }}>
            {energyLabels[selected]?.label}
          </div>
          <div style={{
            marginTop: 20, fontSize: 32, fontWeight: 800,
            color: energyLabels[selected]?.color,
          }}>
            {selected}/5
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(8px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass animate-slide-up" style={{
        width: '100%', maxWidth: 500, borderRadius: '24px 24px 0 0', padding: 32,
        border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 999, margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>
            ⚡ איך האנרגיה שלך עכשיו?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>
            {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} •{' '}
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Energy buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(n => {
            const info = energyLabels[n];
            const isSelected = selected === n;
            return (
              <button
                key={n}
                onClick={() => setSelected(n)}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: 16, border: 'none',
                  cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  background: isSelected ? info.color : 'rgba(255,255,255,0.06)',
                  transform: isSelected ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
                  boxShadow: isSelected ? `0 8px 24px ${info.color}50` : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 24 }}>{info.emoji}</span>
                <span style={{
                  fontSize: 18, fontWeight: 800, color: isSelected ? '#fff' : '#94a3b8',
                }}>
                  {n}
                </span>
                <span style={{
                  fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.8)' : '#475569',
                  textAlign: 'center', lineHeight: 1.2,
                }}>
                  {info.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Energy bar */}
        {selected && (
          <div className="animate-fade" style={{ marginBottom: 20 }}>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${selected * 20}%`,
                background: `linear-gradient(90deg, ${energyLabels[1].color}, ${energyLabels[selected].color})`,
                borderRadius: 999, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Note */}
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="הוסף הערה... (אופציונלי) — מה השפיע על האנרגיה שלך?"
          style={{
            width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
            color: '#f1f5f9', fontSize: 14, resize: 'none', height: 80,
            marginBottom: 20, direction: 'rtl', fontFamily: 'inherit', transition: 'all 0.3s',
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="gradient-btn"
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed',
            opacity: selected ? 1 : 0.4,
          }}
        >
          {selected
            ? `${energyLabels[selected].emoji} שמור — ${energyLabels[selected].label}`
            : 'בחר רמת אנרגיה'}
        </button>
      </div>
    </div>
  );
}
