import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CrownIcon } from '../Icons';

/** אנימציית פתיחה קולנועית — מוצגת פעם אחת בכל ביקור (session) */
export default function CinematicIntro() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('got.introSeen'));

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem('got.introSeen', '1');
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          className="fixed inset-0 z-[80] bg-ink-950 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setShow(false)}
        >
          {/* טבעת אסטרולבית מסתובבת בהשראת הפתיח */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="relative w-40 h-40"
          >
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute inset-0 text-gold-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * 74} y1={100 + Math.sin(a) * 74}
                    x2={100 + Math.cos(a) * 92} y2={100 + Math.sin(a) * 92}
                    stroke="currentColor" strokeWidth="1.5" opacity="0.6"
                  />
                );
              })}
            </motion.svg>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CrownIcon className="text-gold-400" width={56} height={56} />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.55em' }}
            transition={{ delay: 0.8, duration: 1.1 }}
            className="mt-8 font-display text-gold-400 text-lg sm:text-2xl font-bold"
          >
            GAME OF THRONES
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-2 text-steel-400 text-sm"
          >
            ספריית צפייה אישית
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
