import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from './Icons';
import { IMAGE_PATHS } from '../lib/art';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** נגן טריילר — מנגן את /videos/trailer.mp4 אם קיים */
export default function TrailerModal({ open, onClose }: Props) {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            {missing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <p className="text-xl font-display gold-text font-bold mb-3">אין עדיין קובץ טריילר</p>
                <p className="text-steel-400 max-w-md leading-relaxed text-sm">
                  שמור טריילר בשם <code dir="ltr" className="text-gold-400">public/videos/trailer.mp4</code> והוא
                  ינוגן כאן אוטומטית.
                </p>
              </div>
            ) : (
              <video
                src={IMAGE_PATHS.trailer}
                className="absolute inset-0 w-full h-full"
                controls
                autoPlay
                onError={() => setMissing(true)}
              />
            )}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-2 rounded-full bg-ink-950/70 text-steel-300 hover:text-white transition-colors"
              aria-label="סגירה"
            >
              <CloseIcon />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
