import { currentUser, achievements } from '../data/mockData';

export default function ProfileScreen({ onLogout }) {
  const level = Math.floor(currentUser.points / 1000) + 1;
  const nextLevel = level * 1000;
  const levelPct = (currentUser.points % 1000) / 10;

  return (
    <div style={{ padding: '24px 16px 100px' }}>
      {/* Profile hero */}
      <div className="glass animate-slide-up" style={{
        borderRadius: 24, padding: 28, marginBottom: 16, textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))',
        border: '1px solid rgba(124,58,237,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 150, height: 150, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }} />
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, background: 'rgba(124,58,237,0.2)',
          border: '3px solid rgba(124,58,237,0.4)',
        }}>
          {currentUser.avatar}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{currentUser.name}</h2>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 999, marginBottom: 20,
          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)',
        }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>
            {currentUser.level}
          </span>
        </div>

        {/* Level progress */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
            <span>רמה {level}</span>
            <span>{currentUser.points} / {nextLevel} נקודות</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${levelPct}%`,
              background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              borderRadius: 999, transition: 'width 1.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '🔥', value: currentUser.streak, label: 'ימי רצף' },
          { icon: '📊', value: currentUser.totalLogs, label: 'סה״כ דיווחים' },
          { icon: '🏆', value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`, label: 'הישגים' },
          { icon: '🔗', value: `${currentUser.syncScore}%`, label: 'סינכרון מקסימלי' },
        ].map((s, i) => (
          <div key={i} className="glass card-hover" style={{ borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="glass animate-slide-up stagger-2" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
        {[
          { icon: '⚡', label: 'תזכורות אנרגיה', desc: 'כל 3 שעות', toggle: true, on: true },
          { icon: '👥', label: 'עדכוני חברים', desc: 'הישגים ושינויים', toggle: true, on: true },
          { icon: '💡', label: 'תובנות שבועיות', desc: 'כל יום ראשון', toggle: true, on: false },
          { icon: '🌙', label: 'מצב לילה', desc: 'אוטומטי מ-22:00', toggle: true, on: true },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px',
            borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 18,
              background: 'rgba(124,58,237,0.12)',
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.desc}</div>
            </div>
            <div style={{
              width: 44, height: 24, borderRadius: 999,
              background: s.on ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)',
              position: 'relative', transition: 'all 0.3s',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: s.on ? 22 : 3, width: 18, height: 18,
                borderRadius: '50%', background: '#fff', transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Streak calendar mini */}
      <div className="glass animate-slide-up stagger-3" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📅 הרצף שלך</h3>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Array.from({ length: 30 }, (_, i) => {
            const active = i < currentUser.streak;
            const today = i === currentUser.streak - 1;
            return (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: 6,
                background: today ? 'linear-gradient(135deg, #7c3aed, #ec4899)' :
                  active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)',
                border: today ? 'none' : active ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: active ? '#fff' : '#2d2d3a',
              }}>
                {today ? '⚡' : active ? '✓' : ''}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
          30 הימים האחרונים · {currentUser.streak} ימים רצוף
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 14,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        🚪 יציאה מהחשבון
      </button>
    </div>
  );
}
