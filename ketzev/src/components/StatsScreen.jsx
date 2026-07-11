import { weeklyData, hourlyPattern, achievements, currentUser } from '../data/mockData';

function WeekGrid({ data }) {
  const max = 5;
  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {data.map((d, di) => (
          <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            {d.entries.map((e, ei) => (
              <div key={ei} style={{
                width: '100%', aspectRatio: '1', borderRadius: 4,
                background: e === 0 ? 'rgba(255,255,255,0.05)' :
                  e === 1 ? '#ef444430' : e === 2 ? '#f9731640' : e === 3 ? '#eab30840' :
                  e === 4 ? '#22c55e40' : '#8b5cf660',
                border: e === 5 ? '1px solid rgba(139,92,246,0.5)' : '1px solid transparent',
              }} />
            ))}
            <span style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarStat({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color, borderRadius: 999,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

function CircleProgress({ value, max, size = 80, color, label, sublabel }) {
  const pct = value / max;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" className="progress-ring" />
      </svg>
      <div style={{ marginTop: 8, fontWeight: 800, fontSize: 20 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>{sublabel}</div>
    </div>
  );
}

export default function StatsScreen() {
  const avgEnergy = 3.7;
  const bestDay = 'ד׳';
  const bestTime = '10:00';

  return (
    <div style={{ padding: '24px 16px 100px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>📊 הסטטיסטיקות שלך</h2>

      {/* Overview circles */}
      <div className="glass animate-slide-up" style={{ borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#94a3b8' }}>סיכום השבוע</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <CircleProgress value={14} max={30} color="#8b5cf6" label="14" sublabel="ימי רצף" />
          <CircleProgress value={37} max={50} color="#f472b6" label="3.7" sublabel="ממוצע אנרגיה" />
          <CircleProgress value={287} max={365} color="#06b6d4" label="287" sublabel="סה״כ דיווחים" />
        </div>
      </div>

      {/* Weekly heatmap */}
      <div className="glass animate-slide-up stagger-1" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>🗓️ מפת חום שבועית</h3>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>שעות ← ימים</span>
        </div>
        <WeekGrid data={weeklyData} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#475569' }}>נמוך</span>
          {['rgba(239,68,68,0.3)', 'rgba(249,115,22,0.4)', 'rgba(234,179,8,0.4)', 'rgba(34,197,94,0.4)', 'rgba(139,92,246,0.6)'].map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 11, color: '#475569' }}>גבוה</span>
        </div>
      </div>

      {/* Patterns */}
      <div className="glass animate-slide-up stagger-2" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🧬 הדפוס שלך</h3>
        <RadarStat label="אנרגיית בוקר" value={4.2} max={5} color="#f59e0b" />
        <RadarStat label="אנרגיית צהריים" value={3.1} max={5} color="#22c55e" />
        <RadarStat label="אנרגיית ערב" value={2.4} max={5} color="#8b5cf6" />
        <RadarStat label="עקביות מעקב" value={87} max={100} color="#06b6d4" />
        <RadarStat label="יצירתיות (לפי הערות)" value={72} max={100} color="#f472b6" />
      </div>

      {/* AI Predictions */}
      <div className="glass-purple animate-slide-up stagger-3" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🤖 תחזית AI להיום</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { time: '09:00–11:30', level: 5, label: 'שיא אנרגיה', color: '#8b5cf6', tip: 'מומלץ לקבוע ישיבות יצירתיות' },
            { time: '13:00–15:00', level: 2, label: 'שפל צפוי', color: '#f97316', tip: 'שמור למשימות שגרתיות' },
            { time: '16:30–18:00', level: 4, label: 'עלייה שנייה', color: '#22c55e', tip: 'זמן טוב לפגישות קצרות' },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', background: `${p.color}10`,
              border: `1px solid ${p.color}30`, borderRadius: 12,
            }}>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{p.time}</div>
                <div style={{
                  fontSize: 18, fontWeight: 800, color: p.color,
                }}>{p.level}/5</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: p.color }}>{p.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="glass animate-slide-up stagger-4" style={{ borderRadius: 20, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏆 הישגים</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {achievements.map(a => (
            <div key={a.id} style={{
              borderRadius: 14, padding: '14px 10px', textAlign: 'center',
              background: a.unlocked ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
              border: a.unlocked ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
              opacity: a.unlocked ? 1 : 0.6,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>
                {a.icon}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>{a.desc}</div>
              {!a.unlocked && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
                    <div style={{
                      height: '100%', width: `${a.progress}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                      borderRadius: 999,
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{a.progress}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
