import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CrownIcon, SearchIcon, SettingsIcon } from './Icons';
import { useLibrary } from '../context/LibraryContext';

interface Props {
  onSearchOpen: () => void;
  onSettingsOpen: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'text-gold-400' : 'text-steel-300 hover:text-white'
  }`;

export default function Header({ onSearchOpen, onSettingsOpen }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { status, connectedCount } = useLibrary();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass shadow-card py-2' : 'bg-gradient-to-b from-ink-950/90 to-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <CrownIcon className="text-gold-500 group-hover:text-gold-300 transition-colors" width={30} height={30} />
          <div className="leading-tight">
            <span className="font-display font-bold text-lg gold-text tracking-wide">GAME OF THRONES</span>
            <span className="block text-[11px] text-steel-400 -mt-0.5">ספריית צפייה אישית</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 mr-4">
          <NavLink to="/" className={navLinkClass} end>ראשי</NavLink>
          <NavLink to="/seasons" className={navLinkClass}>כל העונות</NavLink>
          <NavLink to="/favorites" className={navLinkClass}>מועדפים</NavLink>
        </nav>

        <div className="flex-1" />

        {status === 'ready' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-steel-400 glass rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {connectedCount} פרקים מחוברים
          </span>
        )}

        <button
          onClick={onSearchOpen}
          aria-label="חיפוש"
          className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-steel-300 hover:text-white"
        >
          <SearchIcon />
        </button>
        <button
          onClick={onSettingsOpen}
          aria-label="הגדרות ספרייה"
          className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-steel-300 hover:text-white"
        >
          <SettingsIcon />
        </button>
      </div>
    </motion.header>
  );
}
