import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUi } from '../../context/UiContext';

/** לוח שליטה צף: שלג, מוזיקה, סמן מיוחד וערכת נושא */
export default function EffectsDock() {
  const { prefs, setPref } = useUi();
  const [open, setOpen] = useState(false);

  const Toggle = ({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-gold-500/15 text-gold-300 border border-gold-700/40' : 'text-steel-300 hover:bg-white/[0.07] border border-transparent'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="flex-1 text-right">{label}</span>
      <span className={`w-8 h-4.5 h-[18px] rounded-full relative transition-colors ${active ? 'bg-gold-500' : 'bg-white/15'}`}>
        <span className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white transition-all ${active ? 'right-[2px]' : 'right-[14px]'}`} />
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-xl p-2.5 w-56 shadow-card space-y-1"
          >
            <p className="text-[11px] text-steel-500 px-2 pb-1">אווירה ואפקטים</p>
            <Toggle label="שלג יורד" icon="❄️" active={prefs.snow} onClick={() => setPref('snow', !prefs.snow)} />
            <Toggle label="מוזיקת רקע" icon="🎵" active={prefs.music} onClick={() => setPref('music', !prefs.music)} />
            <Toggle label="סמן מיוחד" icon="✨" active={prefs.cursor} onClick={() => setPref('cursor', !prefs.cursor)} />
            <Toggle
              label={prefs.theme === 'dark' ? 'מצב כהה' : 'מצב בהיר'}
              icon={prefs.theme === 'dark' ? '🌙' : '☀️'}
              active={prefs.theme === 'light'}
              onClick={() => setPref('theme', prefs.theme === 'dark' ? 'light' : 'dark')}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="אפקטים ואווירה"
        className={`w-11 h-11 rounded-full glass shadow-card flex items-center justify-center text-lg transition-all hover:scale-105 ${open ? 'text-gold-400 border-gold-700/50' : 'text-steel-300'}`}
      >
        {open ? '✕' : '❄️'}
      </button>
    </div>
  );
}
