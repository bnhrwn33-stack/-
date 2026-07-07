import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import EpisodeCard from '../components/EpisodeCard';
import SmartImage from '../components/SmartImage';
import { IMAGE_PATHS, seasonPoster } from '../lib/art';

export default function SeasonPage() {
  const { num } = useParams();
  const { seasons } = useLibrary();
  const season = seasons.find((s) => s.number === Number(num));

  if (!season) return <Navigate to="/seasons" replace />;

  return (
    <div className="pt-16">
      {/* באנר עונה */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <SmartImage
          src={IMAGE_PATHS.season(season.number)}
          fallback={seasonPoster(season.number, 1600, 500)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
        <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 flex flex-col justify-end pb-8">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-display tracking-[0.4em] text-gold-500 text-xs mb-2">SEASON {season.number} · {season.year}</p>
            <h1 className="text-4xl sm:text-6xl font-bold gold-text font-display">{season.title}</h1>
            <p className="text-steel-300 mt-3 max-w-2xl leading-relaxed">{season.description}</p>
          </motion.div>
        </div>
      </div>

      {/* ניווט בין עונות */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 flex items-center gap-2 flex-wrap">
        {seasons.map((s) => (
          <Link
            key={s.number}
            to={`/season/${s.number}`}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
              s.number === season.number
                ? 'bg-gold-500 text-ink-950 shadow-glow'
                : 'glass text-steel-300 hover:text-gold-400 hover:border-gold-700/50'
            }`}
          >
            {s.number}
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 pb-6">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {season.episodes.map((ep, i) => (
            <EpisodeCard key={ep.key} ep={ep} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
