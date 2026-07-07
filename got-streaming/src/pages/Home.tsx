import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import EpisodeCard from '../components/EpisodeCard';
import SmartImage from '../components/SmartImage';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useLibrary } from '../context/LibraryContext';
import { IMAGE_PATHS, seasonPoster } from '../lib/art';

function SectionTitle({ children, to }: { children: React.ReactNode; to?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
        <span className="w-1.5 h-7 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
        {children}
      </h2>
      {to && (
        <Link to={to} className="text-sm text-gold-500 hover:text-gold-300 transition-colors">
          הצג הכול ←
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { seasons, status, progress, watched } = useLibrary();
  const allEpisodes = seasons.flatMap((s) => s.episodes);

  // המשך צפייה — לפי עדכון אחרון
  const continueList = Object.entries(progress)
    .filter(([, p]) => p.time > 30 && p.time < p.duration * 0.95)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    .map(([key]) => allEpisodes.find((e) => e.key === key))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 4);

  // נצפו לאחרונה
  const recentWatched = [...watched]
    .reverse()
    .map((key) => allEpisodes.find((e) => e.key === key))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 4);

  return (
    <>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16 -mt-10 relative z-10">
        {status === 'loading' && (
          <section>
            <SectionTitle>סורק את הספרייה שלך…</SectionTitle>
            <SkeletonGrid count={4} />
          </section>
        )}

        {continueList.length > 0 && (
          <section>
            <SectionTitle>המשך צפייה</SectionTitle>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {continueList.map((ep, i) => (
                <EpisodeCard key={ep.key} ep={ep} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* עונות */}
        <section>
          <SectionTitle to="/seasons">העונות</SectionTitle>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {seasons.map((season, i) => (
              <motion.div
                key={season.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.5) }}
              >
                <Link
                  to={`/season/${season.number}`}
                  className="group block rounded-xl overflow-hidden glass card-hover relative"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-ink-800">
                    <SmartImage
                      src={IMAGE_PATHS.season(season.number)}
                      fallback={seasonPoster(season.number)}
                      alt={season.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 to-transparent p-3 pt-8">
                    <p className="text-sm font-bold text-white">{season.title}</p>
                    <p className="text-[11px] text-steel-400">{season.year} · {season.episodes.length} פרקים</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {recentWatched.length > 0 && (
          <section>
            <SectionTitle>נצפו לאחרונה</SectionTitle>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {recentWatched.map((ep, i) => (
                <EpisodeCard key={ep.key} ep={ep} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* פרקים נבחרים */}
        <section>
          <SectionTitle to="/seasons">פרקים בלתי נשכחים</SectionTitle>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              [1, 9], [3, 9], [4, 8], [5, 8], [6, 5], [6, 9], [6, 10], [8, 3],
            ].map(([s, e], i) => {
              const ep = allEpisodes.find((x) => x.season === s && x.episode === e);
              return ep ? <EpisodeCard key={ep.key} ep={ep} index={i} /> : null;
            })}
          </div>
        </section>
      </div>
    </>
  );
}
