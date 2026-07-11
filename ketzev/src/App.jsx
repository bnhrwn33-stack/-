import { useState } from 'react';
import './index.css';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import StatsScreen from './components/StatsScreen';
import SocialScreen from './components/SocialScreen';
import NotificationsScreen from './components/NotificationsScreen';
import ProfileScreen from './components/ProfileScreen';
import EnergyCheckin from './components/EnergyCheckin';
import BottomNav from './components/BottomNav';
import { notifications } from './data/mockData';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('home');
  const [showCheckin, setShowCheckin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);
  const [recentEntry, setRecentEntry] = useState(null);

  const handleCheckin = ({ energy, note, time }) => {
    setRecentEntry({ energy, note, time });
    setShowCheckin(false);
  };

  if (!loggedIn) {
    return <AuthScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', minHeight: '100vh', position: 'relative', background: '#0a0a0f' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(236,72,153,0.06) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {tab === 'home' && <Dashboard onCheckin={() => setShowCheckin(true)} recentEntry={recentEntry} />}
        {tab === 'stats' && <StatsScreen />}
        {tab === 'social' && <SocialScreen />}
        {tab === 'notifications' && <NotificationsScreen />}
        {tab === 'profile' && <ProfileScreen onLogout={() => setLoggedIn(false)} />}
      </div>

      {tab === 'home' && (
        <button
          onClick={() => setShowCheckin(true)}
          style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 40,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          ⚡
        </button>
      )}

      <BottomNav
        active={tab}
        onChange={(newTab) => {
          setTab(newTab);
          if (newTab === 'notifications') setUnreadCount(0);
        }}
        unreadNotifs={unreadCount}
      />

      {showCheckin && (
        <EnergyCheckin
          onClose={() => setShowCheckin(false)}
          onSubmit={handleCheckin}
        />
      )}
    </div>
  );
}
