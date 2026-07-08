import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { CloseIcon, HeartIcon } from './Icons';

/** אזור תגובות לפרק — נשמר מקומית בדפדפן, משויך לפרופיל הפעיל */
export default function Comments({ episodeKey }: { episodeKey: string }) {
  const { comments, addComment, removeComment, likeComment, activeProfile } = useLibrary();
  const [text, setText] = useState('');
  const list = comments[episodeKey] ?? [];

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addComment(episodeKey, t);
    setText('');
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
        תגובות ({list.length})
      </h2>

      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `linear-gradient(135deg, ${activeProfile.color}, #0a0a0e)` }}>
            {activeProfile.avatar}
          </span>
          <span className="text-sm text-steel-300">מגיב/ה בתור <b className="text-white">{activeProfile.name}</b></span>
        </div>
        <div className="flex gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}
            placeholder="מה חשבת על הפרק? (Ctrl+Enter לשליחה)"
            rows={2}
            className="flex-1 glass rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 resize-y"
          />
          <button onClick={submit} disabled={!text.trim()} className="btn-gold !px-5 self-end disabled:opacity-40 disabled:pointer-events-none">
            שלח
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 && <p className="text-sm text-steel-500">עדיין אין תגובות — היה הראשון.</p>}
        {[...list].reverse().map((c) => (
          <motion.div
            key={c.ts}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 group"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-b from-gold-500 to-gold-700 text-ink-950 font-bold flex items-center justify-center text-sm">
                {c.name.charAt(0)}
              </span>
              <span className="font-semibold text-white text-sm">{c.name}</span>
              <span className="text-[11px] text-steel-500">
                {new Date(c.ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => removeComment(episodeKey, c.ts)}
                className="mr-auto opacity-0 group-hover:opacity-100 text-steel-500 hover:text-rose-400 transition-all p-1"
                aria-label="מחיקת תגובה"
              >
                <CloseIcon width={14} height={14} />
              </button>
            </div>
            <p className="text-sm text-steel-300 leading-relaxed whitespace-pre-wrap">{c.text}</p>
            <button
              onClick={() => likeComment(episodeKey, c.ts)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-steel-500 hover:text-rose-400 transition-colors"
            >
              <HeartIcon width={13} height={13} filled={(c.likes ?? 0) > 0} /> {c.likes ?? 0}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
