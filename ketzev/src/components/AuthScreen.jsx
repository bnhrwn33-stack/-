import { useState } from 'react';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="animate-float" style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }} className="gradient-text">
            קֶצֶב
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, marginTop: 8 }}>
            גלה את קצב האנרגיה שלך
          </p>
        </div>

        {/* Card */}
        <div className="glass animate-slide-up stagger-2 animate-slide-up" style={{
          borderRadius: 24, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            borderRadius: 12, padding: 4, marginBottom: 28,
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 15, fontWeight: 600, transition: 'all 0.3s',
                background: mode === m ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'transparent',
                color: mode === m ? '#fff' : '#94a3b8',
              }}>
                {m === 'login' ? 'כניסה' : 'הרשמה'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                  שם מלא
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="מה השם שלך?"
                  style={{
                    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                    color: '#f1f5f9', fontSize: 15, transition: 'all 0.3s', direction: 'rtl',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                אימייל
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                  color: '#f1f5f9', fontSize: 15, transition: 'all 0.3s', direction: 'ltr',
                  textAlign: 'right',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                סיסמה
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                  color: '#f1f5f9', fontSize: 15, transition: 'all 0.3s',
                }}
              />
            </div>

            <button type="submit" className="gradient-btn" style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? (
                <div style={{
                  width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff', borderRadius: '50%',
                  animation: 'spin-slow 0.8s linear infinite',
                }} />
              ) : (
                mode === 'login' ? '⚡ כניסה לקצב' : '🚀 צור חשבון'
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
                onClick={onLogin}>
                כניסה ללא חשבון (הדגמה) →
              </span>
            </div>
          )}
        </div>

        {/* Feature pills */}
        <div className="animate-slide-up stagger-4" style={{
          display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap',
        }}>
          {['⚡ מעקב אנרגיה', '🔗 סינכרון חברים', '📊 תובנות AI', '🏆 הישגים'].map(f => (
            <span key={f} style={{
              padding: '6px 12px', background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.2)', borderRadius: 999,
              fontSize: 12, color: '#a78bfa',
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
