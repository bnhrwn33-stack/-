import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon, DownloadIcon } from './Icons';

interface Props {
  src: string | null;
  title?: string;
  onClose: () => void;
}

/** תצוגת תמונה במסך מלא */
export default function Lightbox({ src, title, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-lg flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            src={src}
            alt={title ?? ''}
            className="max-w-full max-h-[85vh] rounded-xl shadow-card object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute top-5 inset-x-6 flex items-center justify-between">
            <span className="text-steel-300 text-sm">{title}</span>
            <div className="flex gap-2">
              <a
                href={src}
                download
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-full glass text-steel-300 hover:text-gold-400 transition-colors"
                aria-label="הורדת תמונה"
              >
                <DownloadIcon />
              </a>
              <button onClick={onClose} className="p-2.5 rounded-full glass text-steel-300 hover:text-white transition-colors" aria-label="סגירה">
                <CloseIcon />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
