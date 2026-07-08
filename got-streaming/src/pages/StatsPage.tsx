import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { episodeRating } from '../data/ratings';
import RatingStars from '../components/RatingStars';
import { PlayIcon, TrophyIcon } from '../components/Icons';
import { ACHIEVEMENTS, userTitle } from '../data/achievements';
import { episodeDuration } from '../data/tags';

function StatCard({ value, label, icon, delay = 0 }: { value: string; label: string; icon: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-6 text-center"
    >
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-3xl font-bold gold-text font-display">{value}</p>
      <p className="text-sm text-steel-400 mt-1">{label}</p>
    </motion.div>
  );
}

/** גרף פעילות פשוט — פרקים שנצפו ב-14 הימים האחרונים */
function ActivityChart({ progress }: { progress: Record<string, { updatedAt: number }> }) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const counts = days.map((d) => {
    const next = d.getTime() + 86400000;
    return Object.values(progress).filter((p) => p.updatedAt >= d.getTime() && p.updatedAt < next).length;
  });
  const max = Math.max(1, ...counts);

  return (
    <div className="flex items-end gap-1.5 h-24">
      {days.map((d, i) => (
        <div key={d.getTime()} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full flex items-end justify-center h-20">
            <div
              className="w-full max-w-[18px] rounded-t bg-gradient-to-t from-gold-600 to-gold-300 transition-all"
              style={{ height: `${(counts[i] / max) * 100}%`, minHeight: counts[i] > 0 ? 4 : 0 }}
              title={`${counts[i]} פרקים`}
            />
          </div>
          <span className="text-[9px] text-steel-500">{d.getDate()}/{d.getMonth() + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const { seasons, watched, progress, ratings, activeProfile, achievements, lists, watchlist } = useLibrary();
  const all = seasons.flatMap((s) => s.episodes);

  const totalEpisodes = all.length;
  const watchedCount = watched.length;
  const completion = Math.round((watchedCount / totalEpisodes) * 100);
  const totalMinutes = all.reduce((sum, e) => sum + episodeDuration(e.season, e.episode), 0);
  const watchedMinutes = all
    .filter((e) => watched.includes(e.key))
    .reduce((sum, e) => sum + episodeDuration(e.season, e.episode), 0);

  const history = useMemo(
    () =>
      Object.entries(progress)
        .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
        .map(([key, p]) => ({ ep: all.find((e) => e.key === key), p }))
        .filter((x): x is { ep: NonNullable<typeof x.ep>; p: typeof x.p } => Boolean(x.ep))
        .slice(0, 12),
    [progress, all],
  );

  const myRated = useMemo(
    () =>
      Object.entries(ratings)
        .map(([key, stars]) => ({ ep: all.find((e) => e.key === key), stars }))
        .filter((x): x is { ep: NonNullable<typeof x.ep>; stars: number } => Boolean(x.ep))
        .sort((a, b) => b.stars - a.stars),
    [ratings, all],
  );

  const fmtHours = (min: number) => {
    const h = Math.floor(min / 60);
    return h > 0 ? `${h} שע׳ ${min % 60} דק׳` : `${min} דק׳`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex items-center gap-4">
          <span
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${activeProfile.color}, #0a0a0e)` }}
          >
            {activeProfile.avatar}
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gold-text font-display tracking-wide">שלום, {activeProfile.name}</h1>
            <p className="text-gold-500 text-sm mt-1">{userTitle(watchedCount)}</p>
          </div>
        </div>
        <p className="text-steel-400 mt-3 text-lg">המסע שלך דרך שבע הממלכות — במספרים. (החלף פרופיל מהאייקון בכותרת העליונה)</p>
      </motion.header>

      {/* מספרים */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon="📺" value={`${totalEpisodes}`} label="פרקים בספרייה" />
        <StatCard icon="👑" value={`${seasons.length}`} label="עונות" delay={0.05} />
        <StatCard icon="⏱" value={fmtHours(totalMinutes)} label="זמן צפייה כולל בסדרה" delay={0.1} />
        <StatCard icon="✅" value={`${watchedCount}`} label={`פרקים שצפית (${fmtHours(watchedMinutes)})`} delay={0.15} />
      </div>

      {/* אחוז השלמה + גרף פעילות */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-6 sm:p-8 mb-10 space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                whileInView={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - completion / 100) }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--gold-300-rgb))" />
                  <stop offset="100%" stopColor="rgb(var(--gold-600-rgb))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold gold-text font-display">{completion}%</span>
              <span className="text-[11px] text-steel-500">הושלם</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2.5">
            {seasons.map((s) => {
              const seen = s.episodes.filter((e) => watched.includes(e.key)).length;
              return (
                <div key={s.number} className="flex items-center gap-3">
                  <Link to={`/season/${s.number}`} className="text-xs text-steel-400 hover:text-gold-400 transition-colors w-14 shrink-0">
                    עונה {s.number}
                  </Link>
                  <div className="flex-1 h-2 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-gold-300 to-gold-600 transition-all duration-700"
                      style={{ width: `${(seen / s.episodes.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-steel-500 tabular-nums w-10 text-left shrink-0">{seen}/{s.episodes.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6">
          <p className="text-sm font-bold text-steel-300 mb-3">פעילות ב-14 הימים האחרונים</p>
          <ActivityChart progress={progress} />
        </div>
      </motion.div>

      {/* הישגים */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
          <TrophyIcon className="text-gold-400" width={20} height={20} />
          הישגים ({Object.keys(achievements).length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = Boolean(achievements[a.id]);
            return (
              <div
                key={a.id}
                className={`glass rounded-xl p-4 text-center transition-opacity ${unlocked ? '' : 'opacity-35'}`}
                title={a.desc}
              >
                <p className="text-3xl mb-1.5">{a.icon}</p>
                <p className="text-xs font-semibold text-white">{a.title}</p>
                <p className="text-[10px] text-steel-500 mt-1 leading-snug">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* רשימת צפייה + רשימות אישיות */}
      <section className="mb-10 grid sm:grid-cols-2 gap-4">
        <Link to="/watchlist" className="glass rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
          <p className="text-sm text-steel-400">לצפייה מאוחר יותר</p>
          <p className="text-2xl font-bold gold-text font-display mt-1">{watchlist.length} פרקים</p>
        </Link>
        <Link to="/watchlist" className="glass rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
          <p className="text-sm text-steel-400">רשימות אישיות</p>
          <p className="text-2xl font-bold gold-text font-display mt-1">{lists.length} רשימות</p>
        </Link>
      </section>

      {/* היסטוריית צפייה */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
          <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
          היסטוריית צפייה
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-steel-500 glass rounded-xl p-6">עדיין לא צפית — <Link to="/watch/1/1" className="text-gold-500 hover:text-gold-300">התחל מהפרק הראשון</Link>.</p>
        ) : (
          <div className="glass rounded-2xl divide-y divide-white/[0.06]">
            {history.map(({ ep, p }) => {
              const pct = p.duration > 0 ? Math.min(100, Math.round((p.time / p.duration) * 100)) : 0;
              return (
                <Link key={ep.key} to={`/watch/${ep.season}/${ep.episode}`} className="flex items-center gap-4 p-4 hover:bg-white/[0.04] transition-colors group">
                  <PlayIcon className="text-steel-500 group-hover:text-gold-400 transition-colors shrink-0" width={16} height={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">ע{ep.season} פ{ep.episode} · {ep.titleHe}</p>
                    <p className="text-[11px] text-steel-500">
                      {new Date(p.updatedAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="w-28 shrink-0 hidden sm:block">
                    <div className="h-1.5 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-steel-500 tabular-nums w-9 text-left shrink-0">{pct}%</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* הדירוגים שלי */}
      <section>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
          <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
          הדירוגים שלי
        </h2>
        {myRated.length === 0 ? (
          <p className="text-sm text-steel-500 glass rounded-xl p-6">עדיין לא דירגת פרקים — הדירוג מופיע בעמוד הצפייה של כל פרק.</p>
        ) : (
          <div className="glass rounded-2xl divide-y divide-white/[0.06]">
            {myRated.map(({ ep, stars }) => (
              <Link key={ep.key} to={`/watch/${ep.season}/${ep.episode}`} className="flex items-center gap-4 p-4 hover:bg-white/[0.04] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">ע{ep.season} פ{ep.episode} · {ep.titleHe}</p>
                  <p className="text-[11px] text-steel-500">דירוג הקהל: {episodeRating(ep.season, ep.episode)?.toFixed(1) ?? '—'}/10</p>
                </div>
                <RatingStars value={stars} readonly size={16} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
