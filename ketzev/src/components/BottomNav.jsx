export default function BottomNav({ active, onChange, unreadNotifs }) {
  const tabs = [
    { id: 'home', icon: '⚡', label: 'בית' },
    { id: 'stats', icon: '📊', label: 'סטטס' },
    { id: 'social', icon: '👥', label: 'חברים' },
    { id: 'notifications', icon: '🔔', label: 'התראות', badge: unreadNotifs },
    { id: 'profile', icon: '👤', label: 'פרופיל' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    }}>
      <div style={{
        display: 'flex', maxWidth: 500, margin: '0 auto', paddingInline: 8,
      }}>
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, padding: '6px 0', border: 'none', cursor: 'pointer',
                background: 'transparent', position: 'relative', transition: 'all 0.2s',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 2, borderRadius: 999,
                  background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                }} />
              )}

              {/* Badge */}
              {tab.badge > 0 && (
                <div style={{
                  position: 'absolute', top: 4, right: '22%',
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#ec4899', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff',
                  border: '2px solid #0a0a0f',
                }}>
                  {tab.badge > 9 ? '9+' : tab.badge}
                </div>
              )}

              <span style={{
                fontSize: 22,
                filter: isActive ? 'none' : 'grayscale(0.6) brightness(0.7)',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 400,
                color: isActive ? '#a78bfa' : '#475569',
                transition: 'color 0.2s',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
