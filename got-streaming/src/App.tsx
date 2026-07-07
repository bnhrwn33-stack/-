import { lazy, Suspense, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LibraryProvider } from './context/LibraryContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import DriveSettingsModal from './components/DriveSettingsModal';
import Home from './pages/Home';

// טעינה עצלה לעמודים משניים — ה-bundle הראשוני נשאר קטן
const Seasons = lazy(() => import('./pages/Seasons'));
const SeasonPage = lazy(() => import('./pages/SeasonPage'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
const Favorites = lazy(() => import('./pages/Favorites'));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-[3px] border-gold-700/40 border-t-gold-400 animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/season/:num" element={<SeasonPage />} />
            <Route path="/watch/:season/:episode" element={<WatchPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <LibraryProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header onSearchOpen={() => setSearchOpen(true)} onSettingsOpen={() => setSettingsOpen(true)} />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
          <DriveSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      </HashRouter>
    </LibraryProvider>
  );
}
