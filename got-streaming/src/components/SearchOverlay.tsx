import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { CloseIcon, PlayIcon, SearchIcon } from './Icons';
import SmartImage from './SmartImage';
import { episodePoster, IMAGE_PATHS } from '../lib/art';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const { seasons } = useLibrary();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const all = seasons.flatMap((s) => s.episodes);

    // חיפוש לפי "עונה X" / "פרק Y" / "SxEy" / טקסט חופשי
    const se = q.match(/^s?(\d{1,2})\s*[ex]\s*(\d{1,2})$/i) || q.match(/עונה\s*(\d{1,2})\s*פרק\s*(\d{1,2})/);
    if (se) {
      return all.filter((e) => e.season === +se[1] && e.episode === +se[2]);
    }
    const seasonOnly = q.match(/^(?:עונה|season|s)\s*(\d{1,2})$/i);
    if (seasonOnly) return all.filter((e) => e.season === +seasonOnly[1]);
    const epOnly = q.match(/^(?:פרק|episode|ep|e)\s*(\d{1,2})$/i);
    if (epOnly) return all.filter((e) => e.episode === +epOnly[1]);
    const num = q.match(/^(\d{1,2})$/);
    if (num) return all.filter((e) => e.episode === +num[1] || e.season === +num[1]);

    return all
      .filter(
        (e) =>
          e.titleHe.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.synopsis.toLowerCase().includes(q),
      )
      .slice(0, 24);
  }, [query, seasons]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          <div className="mx-auto max-w-3xl px-4 pt-24 pb-16" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="relative"
            >
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-400" width={22} height={22} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) {
                    navigate(`/watch/${results[0].season}/${results[0].episode}`);
                    onClose();
                  }
                }}
                placeholder='חיפוש: שם פרק, "עונה 3", "פרק 9", S03E09...'
                className="w-full glass rounded-xl py-4 pr-12 pl-12 text-lg text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 transition-colors"
              />
              <button onClick={onClose} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-steel-400 hover:text-white transition-colors" aria-label="סגירה">
                <CloseIcon />
              </button>
            </motion.div>

            <div className="mt-6 space-y-2">
              {query && results.length === 0 && (
                <p className="text-center text-steel-500 py-10">לא נמצאו פרקים תואמים.</p>
              )}
              {results.map((ep, i) => (
                <motion.button
                  key={ep.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  onClick={() => {
                    navigate(`/watch/${ep.season}/${ep.episode}`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 glass rounded-lg p-2.5 text-right hover:bg-white/[0.08] transition-colors group"
                >
                  <div className="w-28 shrink-0 aspect-video rounded-md overflow-hidden bg-ink-800">
                    <SmartImage
                      src={IMAGE_PATHS.episode(ep.season, ep.episode)}
                      fallback={episodePoster(ep.season, ep.episode, 224, 126)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{ep.titleHe}</p>
                    <p className="text-xs text-steel-500 truncate">
                      עונה {ep.season} · פרק {ep.episode} · {ep.title}
                    </p>
                  </div>
                  <PlayIcon className="text-steel-500 group-hover:text-gold-400 transition-colors ml-2 shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
