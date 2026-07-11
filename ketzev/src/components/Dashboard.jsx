import { useState } from 'react';
import { currentUser, recentLogs, insights, hourlyPattern, energyLabels, friends } from '../data/mockData';

function EnergyGraph({ data }) {
  const max = 5;
  const w = 320, h = 100;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (w - 20) + 10,
    y: h - (d.avg / max) * (h - 20) - 10,
    avg: d.avg,
    hour: d.hour,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  const peakIdx = pts.reduce((m, p, i) => p.avg > pts[m].avg ? i : m, 0);

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#graphGrad)" />
        <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === peakIdx ? 5 : 3}
            fill={i === peakIdx ? '#f472b6' : '#8b5cf6'}
            stroke={i === peakIdx ? '#f472b6' : '#0a0a0f'} strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {data.filter((_, i) => i % 4 === 0).map(d => (
          <span key={d.hour} style={{ fontSize: 11, color: '#475569' }}>{d.hour}</span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, delay }) {
  return (
    <div className={`glass card-hover animate-slide-up stagger-${delay}`} style={{
      borderRadius: 16, padding: '16px', flex: 1, minWidth: 0, cursor: 'pointer',
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || '#f1f5f9', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function Dashboard({ onCheckin }) {
  const [expandedInsight, setExpandedInsight] = useState(null);
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'בוקר טוב' : now.getHours() < 17 ? 'צהריים טובים' : 'ערב טוב';
  const lastLog = recentLogs[0];
  const lastInfo = energyLabels[lastLog.energy];

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Header greeting */}
      <div className="animate-slide-up" style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{greeting},</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>
              {currentUser.name.split(' ')[0]} 👋
            </h1>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end',
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 999, padding: '6px 12px',
            }}>
              <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>
                🔥 {currentUser.streak} ימים
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#475569' }}>רצף מעקב</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main check-in card */}
      <div style={{ padding: '20px 16px 0' }}>
        <div className="animate-slide-up stagger-1 neon-border" style={{
          borderRadius: 24, padding: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }} onClick={onCheckin}>
          <div style={{
            position: 'absolute', top: -30, left: -30, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>הדיווח האחרון • {lastLog.time}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 36 }}>{lastInfo.emoji}</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{lastInfo.label}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>רמה {lastLog.energy}/5</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="gradient-btn animate-pulse-glow" style={{
                width: 56, height: 56, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 24,
                border: 'none', cursor: 'pointer',
              }}>
                ⚡
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>דווח עכשיו</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 10 }}>
        <StatCard icon="📊" value={currentUser.totalLogs} label="סה״כ דיווחים" color="#8b5cf6" delay={2} />
        <StatCard icon="⏰" value={currentUser.peakHour} label="שעת שיא" color="#f472b6" delay={3} />
        <StatCard icon="🔗" value={`${currentUser.syncScore}%`} label="סינכרון" color="#06b6d4" delay={4} />
      </div>

      {/* Energy graph */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="glass animate-slide-up stagger-2" style={{ borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>📈 קצב יומי ממוצע</h3>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>שעות</span>
          </div>
          <EnergyGraph data={hourlyPattern} />
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.2)',
            borderRadius: 10, fontSize: 13, color: '#f472b6',
          }}>
            🎯 השיא שלך: 10:00 — קבע את הפגישות החשובות בבוקר!
          </div>
        </div>
      </div>

      {/* Insights */}
      <div style={{ padding: '16px 16px 0' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, paddingRight: 4 }}>
          💡 תובנות עבורך
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {insights.map((insight, i) => {
            const colors = {
              purple: { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)', text: '#a78bfa' },
              amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24' },
              cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', text: '#22d3ee' },
              green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' },
            };
            const c = colors[insight.color];
            return (
              <div key={insight.id}
                className={`animate-slide-up stagger-${i + 1} card-hover`}
                onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                style={{
                  borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
                  background: c.bg, border: `1px solid ${c.border}`,
                  transition: 'all 0.3s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    background: 'rgba(0,0,0,0.2)',
                  }}>
                    {insight.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{insight.title}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                      {insight.description}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: c.text }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friends energy now */}
      <div style={{ padding: '16px 16px 0' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, paddingRight: 4 }}>
          👥 האנרגיה של החברים עכשיו
        </h3>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
          {friends.map(f => (
            <div key={f.id} className="glass" style={{
              borderRadius: 16, padding: '12px 14px', minWidth: 100, textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
            }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{f.avatar}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {f.name.split(' ')[0]}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 999, fontSize: 12,
                background: `${energyLabels[f.energy].color}20`,
                color: energyLabels[f.energy].color,
                border: `1px solid ${energyLabels[f.energy].color}40`,
              }}>
                {energyLabels[f.energy].emoji} {f.energy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
