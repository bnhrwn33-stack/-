import { useState } from 'react';
import { notifications } from '../data/mockData';

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(notifications);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markOne = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const typeColors = {
    reminder: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', dot: '#f59e0b' },
    friend: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', dot: '#22c55e' },
    insight: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', dot: '#06b6d4' },
    sync: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', dot: '#8b5cf6' },
    achievement: { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)', dot: '#ec4899' },
  };

  return (
    <div style={{ padding: '24px 16px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>🔔 התראות</h2>
          {unread > 0 && (
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              {unread} חדשות
            </p>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAll} style={{
            padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(124,58,237,0.3)',
            background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: 13,
            cursor: 'pointer', fontWeight: 600,
          }}>
            סמן הכל כנקרא
          </button>
        )}
      </div>

      {/* Settings summary */}
      <div className="glass-purple animate-slide-up" style={{ borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>⏰ תזכורות אוטומטיות</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              כל 3 שעות, 08:00–21:00
            </div>
          </div>
          <div style={{
            width: 44, height: 24, borderRadius: 999,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            position: 'relative', cursor: 'pointer',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: 22, width: 18, height: 18,
              borderRadius: '50%', background: '#fff',
            }} />
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map((n, i) => {
          const c = typeColors[n.type];
          return (
            <div
              key={n.id}
              onClick={() => markOne(n.id)}
              className={`animate-slide-up card-hover`}
              style={{
                animationDelay: `${i * 0.05}s`, opacity: 0,
                borderRadius: 16, padding: '14px 16px',
                background: n.read ? 'rgba(255,255,255,0.03)' : c.bg,
                border: `1px solid ${n.read ? 'rgba(255,255,255,0.06)' : c.border}`,
                cursor: 'pointer', transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  background: n.read ? 'rgba(255,255,255,0.05)' : `${c.dot}20`,
                }}>
                  {n.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14, lineHeight: 1.4,
                    color: n.read ? '#94a3b8' : '#f1f5f9',
                    fontWeight: n.read ? 400 : 600,
                  }}>
                    {n.text}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    {n.time}
                  </div>
                </div>
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: c.dot, flexShrink: 0, marginTop: 4,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state when all read */}
      {unread === 0 && (
        <div className="animate-fade" style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>הכל נקרא!</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>תחזור מאוחר יותר לעדכונים חדשים</div>
        </div>
      )}
    </div>
  );
}
