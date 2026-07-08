import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CrownIcon, SearchIcon, SettingsIcon } from './Icons';
import { useLibrary } from '../context/LibraryContext';

interface Props {
  onSearchOpen: () => void;
  onSettingsOpen: () => void;
}

const NAV_LINKS = [
  { to: '/', label: 'ראשי', end: true },
  { to: '/seasons', label: 'עונות' },
  { to: '/characters', label: 'דמויות' },
  { to: '/houses', label: 'בתים' },
  { to: '/map', label: 'מפה' },
  { to: '/gallery', label: 'גלריה' },
  { to: '/media', label: 'מדיה' },
  { to: '/timeline', label: 'ציר זמן' },
  { to: '/quiz', label: 'חידונים' },
  { to: '/favorites', label: 'מועדפים' },
  { to: '/stats', label: 'הפרופיל שלי' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
    isActive ? 'text-gold-400' : 'text-steel-300 hover:text-white'
  }`;

export default function Header({ onSearchOpen, onSettingsOpen }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { status, connectedCount } = useLibrary();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // סגירת התפריט במעבר עמוד
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen ? 'glass shadow-card py-2' : 'bg-gradient-to-b from-ink-950/90 to-transparent py-3'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <CrownIcon className="text-gold-500 group-hover:text-gold-300 transition-colors" width={28} height={28} />
          <div className="leading-tight">
            <span className="font-display font-bold text-base gold-text tracking-wide">GAME OF THRONES</span>
            <span className="block text-[10px] text-steel-400 -mt-0.5">ספריית צפייה אישית</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center mr-3 overflow-x-auto">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {status === 'ready' && (
          <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-steel-400 glass rounded-full px-3 py-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {connectedCount} פרקים
          </span>
        )}

        <button
          onClick={onSearchOpen}
          aria-label="חיפוש"
          className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-steel-300 hover:text-white shrink-0"
        >
          <SearchIcon width={18} height={18} />
        </button>
        <button
          onClick={onSettingsOpen}
          aria-label="הגדרות ספרייה"
          className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-steel-300 hover:text-white shrink-0"
        >
          <SettingsIcon width={18} height={18} />
        </button>

        {/* המבורגר למובייל */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="תפריט"
          aria-expanded={menuOpen}
          className="lg:hidden p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-steel-300 hover:text-white shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* תפריט מובייל */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06] mt-2"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-2 gap-1">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-gold-500/15 text-gold-300' : 'text-steel-300 hover:bg-white/[0.06]'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
