import { useState } from 'react';
import { friends, energyLabels, currentUser } from '../data/mockData';

function SyncRing({ pct, color, size = 60 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function LeaderboardRow({ rank, friend, isMe }) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = rank <= 3 ? medals[rank - 1] : null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderRadius: 14, marginBottom: 8,
      background: isMe ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
      border: isMe ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{ fontSize: 18, minWidth: 28, textAlign: 'center' }}>
        {medal || `#${rank}`}
      </span>
      <span style={{ fontSize: 22 }}>{friend.avatar}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          {friend.name} {isMe && <span style={{ fontSize: 11, color: '#a78bfa' }}>(אני)</span>}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>🔥 {friend.streak} ימים רצוף</div>
      </div>
      <div style={{
        padding: '4px 10px', borderRadius: 999,
        background: `${energyLabels[friend.energy]?.color}20`,
        color: energyLabels[friend.energy]?.color,
        fontSize: 13, fontWeight: 700,
      }}>
        {friend.energy}/5
      </div>
    </div>
  );
}

export default function SocialScreen() {
  const [tab, setTab] = useState('sync');
  const tabs = [
    { id: 'sync', label: '🔗 סינכרון' },
    { id: 'leaderboard', label: '🏆 טבלה' },
    { id: 'invite', label: '➕ הזמן' },
  ];

  const leaderboard = [
    { id: 4, name: 'נועה גולן', avatar: '👩‍🔬', energy: 5, streak: 31, syncScore: 73 },
    { id: 6, name: 'שירה כץ', avatar: '👩‍💻', energy: 4, streak: 19, syncScore: 92 },
    { id: 2, name: 'מיה לוי', avatar: '👩‍🎨', energy: 4, streak: 22, syncScore: 87 },
    { id: 'me', name: currentUser.name, avatar: currentUser.avatar, energy: 4, streak: currentUser.streak, syncScore: currentUser.syncScore },
    { id: 3, name: 'עמית שרון', avatar: '🧑‍💼', energy: 2, streak: 8, syncScore: 61 },
    { id: 5, name: 'רון אלון', avatar: '🧑‍🎤', energy: 3, streak: 5, syncScore: 44 },
  ];

  return (
    <div style={{ padding: '24px 16px 100px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>👥 חברה וסינכרון</h2>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)',
        borderRadius: 14, padding: 4, marginBottom: 20,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 10, border: 'none',
            cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.3s',
            background: tab === t.id ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'transparent',
            color: tab === t.id ? '#fff' : '#94a3b8',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sync' && (
        <div className="animate-fade">
          {/* Top sync */}
          <div className="glass-purple" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>⭐ הסינכרון הכי גבוה שלך</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
              מי איתך ב״אותו קצב״ עכשיו?
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32 }}>{currentUser.avatar}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>אני</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 900 }} className="gradient-text">
                    {currentUser.syncScore}%
                  </span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>סינכרון</div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${currentUser.syncScore}%`,
                    background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                    borderRadius: 999,
                  }} />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32 }}>👩‍💻</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>שירה</div>
              </div>
            </div>
            <div style={{
              marginTop: 16, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(124,58,237,0.15)', fontSize: 13, color: '#a78bfa',
            }}>
              🎯 שירה ואתה בשיא בין 09:00–11:00 — זמן מושלם לשיתוף פעולה!
            </div>
          </div>

          {/* All friends sync */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>כל החברים</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {friends.map(f => (
              <div key={f.id} className="glass card-hover" style={{ borderRadius: 16, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <SyncRing pct={f.syncScore} color={f.syncScore >= 80 ? '#8b5cf6' : f.syncScore >= 60 ? '#22c55e' : '#f97316'} />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      {f.avatar}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{f.name}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        {energyLabels[f.energy].emoji} {energyLabels[f.energy].label}
                      </span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        🔥 {f.streak} ימים
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 18, fontWeight: 800,
                      color: f.syncScore >= 80 ? '#a78bfa' : f.syncScore >= 60 ? '#4ade80' : '#fb923c',
                    }}>
                      {f.syncScore}%
                    </div>
                    <div style={{ fontSize: 11, color: '#475569' }}>סינכרון</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="animate-fade">
          <div className="glass" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>טבלת רצף השבוע</h3>
              <span style={{ fontSize: 12, color: '#a78bfa', background: 'rgba(124,58,237,0.15)', padding: '4px 10px', borderRadius: 999 }}>
                אתה במקום #4
              </span>
            </div>
            {leaderboard.map((f, i) => (
              <LeaderboardRow key={f.id} rank={i + 1} friend={f} isMe={f.id === 'me'} />
            ))}
          </div>
          <div className="glass-purple" style={{ borderRadius: 16, padding: '14px 16px', fontSize: 14, color: '#94a3b8' }}>
            💡 הישאר בטופ 3 לאורך שבוע שלם לפתיחת תג "מובייל מנהיג"
          </div>
        </div>
      )}

      {tab === 'invite' && (
        <div className="animate-fade">
          <div className="glass" style={{ borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤝</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>הזמן חבר לקצב</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              כשחבר מצטרף, שניכם מרוויחים 100 נקודות ומתחילים לצבור סינכרון יחד
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            }}>
              <span style={{ flex: 1, color: '#a78bfa', fontSize: 14, direction: 'ltr', textAlign: 'left' }}>
                ketzev.app/join/DAN2026
              </span>
              <button style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                העתק
              </button>
            </div>
            <button className="gradient-btn" style={{
              width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              📤 שתף קישור
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '⚡', title: '100 נקודות', desc: 'לכל חבר שמצטרף' },
              { icon: '🔗', title: 'סינכרון מיידי', desc: 'תתחילו לראות את הקצב המשותף' },
              { icon: '🏆', title: 'תג "מגייס"', desc: 'אחרי 3 הזמנות' },
            ].map((b, i) => (
              <div key={i} className="glass" style={{
                borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center',
              }}>
                <span style={{ fontSize: 28 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
