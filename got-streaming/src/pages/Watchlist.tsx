import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import EpisodeCard from '../components/EpisodeCard';
import { ListIcon, PlusIcon } from '../components/Icons';

export default function Watchlist() {
  const { seasons, watchlist, lists, createList, deleteList, toggleInList } = useLibrary();
  const all = seasons.flatMap((s) => s.episodes);
  const watchEps = watchlist
    .map((key) => all.find((e) => e.key === key))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const [newListName, setNewListName] = useState('');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10 min-h-[70vh]">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">לצפייה מאוחר יותר</h1>
        <p className="text-steel-400 mt-3 text-lg">פרקים ששמרת בצד — ורשימות אישיות משלך.</p>
      </motion.header>

      <section className="mb-14">
        {watchEps.length === 0 ? (
          <div className="glass rounded-2xl p-14 text-center">
            <ListIcon width={40} height={40} className="mx-auto text-steel-500 mb-4" />
            <p className="text-steel-300 text-lg font-medium">הרשימה ריקה</p>
            <p className="text-steel-500 mt-1.5">לחץ על "לצפייה מאוחר יותר" בכל פרק כדי לשמור אותו כאן.</p>
            <Link to="/seasons" className="btn-gold mt-6 inline-flex">לעיון בעונות</Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {watchEps.map((ep, i) => (
              <EpisodeCard key={ep.key} ep={ep} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* רשימות אישיות */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
          <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
          הרשימות האישיות שלי
        </h2>

        <div className="flex gap-2 mb-6">
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newListName.trim()) { createList(newListName.trim()); setNewListName(''); } }}
            placeholder='שם רשימה חדשה, למשל "עשרת הפרקים המובילים"'
            className="flex-1 glass rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60"
          />
          <button
            onClick={() => { if (newListName.trim()) { createList(newListName.trim()); setNewListName(''); } }}
            className="btn-gold !px-4 text-sm"
          >
            <PlusIcon width={16} height={16} /> רשימה חדשה
          </button>
        </div>

        {lists.length === 0 ? (
          <p className="text-sm text-steel-500">עדיין לא יצרת רשימות אישיות.</p>
        ) : (
          <div className="space-y-8">
            {lists.map((list) => {
              const eps = list.keys.map((k) => all.find((e) => e.key === k)).filter((e): e is NonNullable<typeof e> => Boolean(e));
              return (
                <div key={list.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">{list.name}</h3>
                    <span className="text-xs text-steel-500">({eps.length} פרקים)</span>
                    <button onClick={() => deleteList(list.id)} className="mr-auto text-xs text-rose-400 hover:text-rose-300 transition-colors">
                      מחיקת הרשימה
                    </button>
                  </div>
                  {eps.length > 0 && (
                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                      {eps.map((ep, i) => <EpisodeCard key={ep.key} ep={ep} index={i} />)}
                    </div>
                  )}
                  <select
                    value=""
                    onChange={(e) => e.target.value && toggleInList(list.id, e.target.value)}
                    className="glass rounded-lg px-3 py-2 text-sm text-steel-300 outline-none focus:border-gold-600/60 max-w-xs"
                  >
                    <option value="">+ הוסף פרק לרשימה…</option>
                    {all.filter((e) => !list.keys.includes(e.key)).map((e) => (
                      <option key={e.key} value={e.key}>ע{e.season} פ{e.episode} — {e.titleHe}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
