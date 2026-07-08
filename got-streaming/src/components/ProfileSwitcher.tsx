import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { userTitle } from '../data/achievements';
import { CloseIcon } from './Icons';

const AVATAR_CHOICES = ['👑', '🐺', '🦁', '🐉', '🦑', '🌹', '☀️', '❄️', '🗡️', '🛡️', '🏰', '👤'];
const COLOR_CHOICES = ['#c9a84c', '#8e96a3', '#e3c46e', '#d64545', '#7fae6f', '#9fd3e8'];

function ProfileForm({
  initial, onSave, onCancel,
}: {
  initial?: { name: string; avatar: string; color: string; kids: boolean; pin?: string };
  onSave: (v: { name: string; avatar: string; color: string; kids: boolean; pin: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATAR_CHOICES[0]);
  const [color, setColor] = useState(initial?.color ?? COLOR_CHOICES[0]);
  const [kids, setKids] = useState(initial?.kids ?? false);
  const [pin, setPin] = useState(initial?.pin ?? '');

  return (
    <div className="glass rounded-xl p-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם הפרופיל"
        className="w-full glass rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 mb-3"
      />
      <p className="text-xs text-steel-500 mb-1.5">אווטאר</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {AVATAR_CHOICES.map((a) => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg glass transition-all ${avatar === a ? 'ring-2 ring-gold-400 scale-105' : ''}`}
          >
            {a}
          </button>
        ))}
      </div>
      <p className="text-xs text-steel-500 mb-1.5">צבע</p>
      <div className="flex gap-2 mb-3">
        {COLOR_CHOICES.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <label className="flex items-center gap-2.5 text-sm text-steel-300 mb-3">
        <input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} className="accent-gold-500 w-4 h-4" />
        מצב ילדים (ממשק פשוט יותר)
      </label>
      <input
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="קוד נעילה בן 4 ספרות (אופציונלי)"
        dir="ltr"
        className="w-full glass rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 mb-1"
      />
      <p className="text-[11px] text-steel-500 mb-3">
        לא הגנה אמיתית — רק נעילת מסך קטנה למשפחה, הכול נשאר בדפדפן הזה.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => name.trim() && onSave({ name: name.trim(), avatar, color, kids, pin })}
          disabled={!name.trim()}
          className="btn-gold flex-1 !py-2 text-sm disabled:opacity-40 disabled:pointer-events-none"
        >
          שמירה
        </button>
        <button onClick={onCancel} className="btn-ghost !py-2 text-sm">ביטול</button>
      </div>
    </div>
  );
}

export default function ProfileSwitcher() {
  const { profiles, activeProfile, switchProfile, addProfile, editProfile, removeProfile, watched } = useLibrary();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'list' | 'new' | string>('list'); // 'edit-<id>' לעריכה
  const [pinPrompt, setPinPrompt] = useState<{ id: string; pin: string } | null>(null);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const requestSwitch = (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (target?.pin) {
      setPinPrompt({ id, pin: target.pin });
      setPinInput('');
    } else {
      switchProfile(id);
      setOpen(false);
    }
  };

  const confirmPin = () => {
    if (pinPrompt && pinInput === pinPrompt.pin) {
      switchProfile(pinPrompt.id);
      setPinPrompt(null);
      setOpen(false);
    } else {
      setPinInput('');
    }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setMode('list'); }}
        className="flex items-center gap-1.5 p-1 pl-2 rounded-full glass hover:bg-white/10 transition-colors shrink-0"
        aria-label="פרופיל"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
          style={{ background: `linear-gradient(135deg, ${activeProfile.color}, #0a0a0e)` }}
        >
          {activeProfile.avatar}
        </span>
        <span className="hidden sm:inline text-xs text-steel-300 max-w-[80px] truncate">{activeProfile.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-lg flex items-start sm:items-center justify-center overflow-y-auto p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl p-6 my-12 shadow-card"
            >
              {pinPrompt ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">קוד נעילה</h2>
                    <button onClick={() => setPinPrompt(null)} className="p-1.5 text-steel-400 hover:text-white"><CloseIcon /></button>
                  </div>
                  <input
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onKeyDown={(e) => e.key === 'Enter' && confirmPin()}
                    autoFocus
                    dir="ltr"
                    placeholder="••••"
                    className="w-full glass rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none focus:border-gold-600/60"
                  />
                  <button onClick={confirmPin} className="btn-gold w-full mt-4">אישור</button>
                </>
              ) : mode === 'list' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">מי צופה?</h2>
                    <button onClick={() => setOpen(false)} className="p-1.5 text-steel-400 hover:text-white"><CloseIcon /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {profiles.map((p) => (
                      <div key={p.id} className="relative group">
                        <button
                          onClick={() => requestSwitch(p.id)}
                          className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                            activeProfile.id === p.id ? 'ring-2 ring-gold-400' : 'glass hover:bg-white/[0.08]'
                          }`}
                          style={{ background: activeProfile.id === p.id ? `linear-gradient(135deg, ${p.color}33, transparent)` : undefined }}
                        >
                          <span className="text-3xl">{p.avatar}</span>
                          <span className="text-xs text-steel-300 truncate max-w-full px-1">{p.name}</span>
                          {p.kids && <span className="text-[9px] text-emerald-400">ילדים</span>}
                        </button>
                        <button
                          onClick={() => setMode(`edit-${p.id}`)}
                          className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-ink-800 text-steel-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                          aria-label="עריכה"
                        >
                          ✎
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setMode('new')}
                      className="aspect-square rounded-xl glass hover:bg-white/[0.08] flex flex-col items-center justify-center gap-1.5 text-steel-400 hover:text-gold-400 transition-colors"
                    >
                      <span className="text-2xl">+</span>
                      <span className="text-xs">פרופיל חדש</span>
                    </button>
                  </div>
                  <p className="text-xs text-steel-500 text-center">{watched.length} פרקים נצפו · {userTitle(watched.length)}</p>
                </>
              ) : mode === 'new' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">פרופיל חדש</h2>
                    <button onClick={() => setMode('list')} className="p-1.5 text-steel-400 hover:text-white"><CloseIcon /></button>
                  </div>
                  <ProfileForm
                    onCancel={() => setMode('list')}
                    onSave={(v) => { addProfile(v.name, v.avatar, v.color, v.kids); setMode('list'); }}
                  />
                </>
              ) : (
                (() => {
                  const id = mode.replace('edit-', '');
                  const p = profiles.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">עריכת פרופיל</h2>
                        <button onClick={() => setMode('list')} className="p-1.5 text-steel-400 hover:text-white"><CloseIcon /></button>
                      </div>
                      <ProfileForm
                        initial={p}
                        onCancel={() => setMode('list')}
                        onSave={(v) => { editProfile(id, v); setMode('list'); }}
                      />
                      {profiles.length > 1 && (
                        <button
                          onClick={() => { removeProfile(id); setMode('list'); }}
                          className="w-full mt-2 text-sm text-rose-400 hover:text-rose-300 transition-colors py-2"
                        >
                          מחיקת הפרופיל
                        </button>
                      )}
                    </>
                  );
                })()
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
