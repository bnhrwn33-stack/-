import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import SmartImage from '../components/SmartImage';
import { IMAGE_PATHS, seasonPoster } from '../lib/art';
import { PlayIcon } from '../components/Icons';

export default function Seasons() {
  const { seasons, watched } = useLibrary();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">כל העונות</h1>
        <p className="text-steel-400 mt-3 text-lg">שמונה עונות, 73 פרקים — המסע המלא משערי ווינטרפל ועד כס הברזל.</p>
      </motion.header>

      <div className="space-y-6">
        {seasons.map((season, i) => {
          const connected = season.episodes.filter((e) => e.sources.length > 0).length;
          const seen = season.episodes.filter((e) => watched.includes(e.key)).length;
          return (
            <motion.div
              key={season.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
            >
              <Link
                to={`/season/${season.number}`}
                className="group flex flex-col sm:flex-row gap-5 glass rounded-2xl overflow-hidden card-hover p-4 sm:p-5"
              >
                <div className="w-full sm:w-40 shrink-0 aspect-video sm:aspect-[3/4] rounded-xl overflow-hidden bg-ink-800">
                  <SmartImage
                    src={IMAGE_PATHS.season(season.number)}
                    fallback={seasonPoster(season.number)}
                    alt={season.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                      {season.title}
                    </h2>
                    <span className="text-xs text-steel-500">{season.year}</span>
                    <span className="text-xs glass rounded-full px-2.5 py-0.5 text-steel-400">
                      {season.episodes.length} פרקים
                    </span>
                    {connected > 0 && (
                      <span className="text-xs rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        {connected} מחוברים
                      </span>
                    )}
                  </div>
                  <p className="text-steel-400 mt-2.5 leading-relaxed max-w-2xl">{season.description}</p>

                  {/* פס התקדמות צפייה של העונה */}
                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-l from-gold-300 to-gold-600 transition-all duration-700"
                          style={{ width: `${(seen / season.episodes.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-steel-500 tabular-nums shrink-0">
                        {seen}/{season.episodes.length} נצפו
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gold-500 group-hover:text-gold-300 transition-colors shrink-0">
                        <PlayIcon width={15} height={15} /> לעונה
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
