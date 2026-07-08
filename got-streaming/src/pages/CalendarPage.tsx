import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { episodeAirDate } from '../data/tags';
import { PlayIcon } from '../components/Icons';

const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export default function CalendarPage() {
  const { seasons, watched } = useLibrary();
  const all = seasons.flatMap((s) => s.episodes);

  const grouped = new Map<string, typeof all>();
  for (const ep of all) {
    const d = episodeAirDate(ep.season, ep.episode);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(ep);
  }
  const months = [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">לוח השידורים</h1>
        <p className="text-steel-400 mt-3 text-lg">מסע לאורך תאריכי השידור המקוריים של הסדרה — פרק אחר פרק, שבוע אחר שבוע.</p>
      </motion.header>

      <div className="space-y-10">
        {months.map(([key, eps]) => {
          const [y, m] = key.split('-').map(Number);
          return (
            <motion.section
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold gold-text font-display mb-4">{MONTHS_HE[m]} {y}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {eps
                  .sort((a, b) => episodeAirDate(a.season, a.episode).getTime() - episodeAirDate(b.season, b.episode).getTime())
                  .map((ep) => {
                    const d = episodeAirDate(ep.season, ep.episode);
                    const isWatched = watched.includes(ep.key);
                    return (
                      <Link
                        key={ep.key}
                        to={`/watch/${ep.season}/${ep.episode}`}
                        className="group flex items-center gap-4 glass rounded-xl p-3.5 hover:bg-white/[0.06] transition-colors"
                      >
                        <div className="w-12 text-center shrink-0">
                          <p className="text-lg font-bold text-gold-400">{d.getDate()}</p>
                          <p className="text-[10px] text-steel-500">יום {['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'][d.getDay()]}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-gold-400 transition-colors">{ep.titleHe}</p>
                          <p className="text-xs text-steel-500">עונה {ep.season} · פרק {ep.episode}</p>
                        </div>
                        {isWatched && <span className="text-emerald-400 text-xs shrink-0">✓ נצפה</span>}
                      </Link>
                    );
                  })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
