import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import EpisodeCard from '../components/EpisodeCard';
import { HeartIcon } from '../components/Icons';

export default function Favorites() {
  const { seasons, favorites } = useLibrary();
  const all = seasons.flatMap((s) => s.episodes);
  const favEps = favorites
    .map((key) => all.find((e) => e.key === key))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10 min-h-[70vh]">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">המועדפים שלי</h1>
        <p className="text-steel-400 mt-3 text-lg">הפרקים שסימנת בלב — במקום אחד.</p>
      </motion.header>

      {favEps.length === 0 ? (
        <div className="glass rounded-2xl p-14 text-center">
          <HeartIcon width={44} height={44} className="mx-auto text-steel-500 mb-4" />
          <p className="text-steel-300 text-lg font-medium">עדיין אין מועדפים</p>
          <p className="text-steel-500 mt-1.5">לחץ על אייקון הלב בכל פרק כדי להוסיף אותו לכאן.</p>
          <Link to="/seasons" className="btn-gold mt-6 inline-flex">לעיון בעונות</Link>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favEps.map((ep, i) => (
            <EpisodeCard key={ep.key} ep={ep} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
