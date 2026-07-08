import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from './Icons';

const SHORTCUTS = [
  { keys: 'רווח / K', desc: 'נגן / השהה' },
  { keys: '→ / ←', desc: 'דילוג 10 שניות' },
  { keys: '↑ / ↓', desc: 'עוצמת קול' },
  { keys: 'F', desc: 'מסך מלא' },
  { keys: 'M', desc: 'השתקה' },
  { keys: 'N / P', desc: 'הפרק הבא / הקודם' },
  { keys: 'I', desc: 'תמונה בתוך תמונה (PiP)' },
  { keys: 'C', desc: 'מצב קולנוע (מחשיך את האתר)' },
  { keys: 'T', desc: 'מצב תיאטרון (נגן רחב)' },
  { keys: 'B', desc: 'הוספת סימנייה ברגע הנוכחי' },
  { keys: 'S', desc: 'דילוג על הפתיח' },
  { keys: '/', desc: 'פתיחת חיפוש' },
  { keys: '?', desc: 'הצגת החלון הזה' },
  { keys: 'Esc', desc: 'סגירת חלונות / יציאה ממצבים' },
];

/** חלון עזרה גלובלי לקיצורי מקלדת — נפתח בלחיצה על "?" */
export default function KeyboardHelpOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-ink-950/85 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">קיצורי מקלדת</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 text-steel-400 hover:text-white"><CloseIcon /></button>
            </div>
            <div className="space-y-1.5">
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="flex items-center justify-between text-sm py-1">
                  <span className="text-steel-300">{s.desc}</span>
                  <kbd dir="ltr" className="glass rounded px-2 py-0.5 text-xs text-gold-400 font-mono">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
