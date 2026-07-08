import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import EpisodeCard from '../components/EpisodeCard';
import SmartImage from '../components/SmartImage';
import QuoteBar from '../components/QuoteBar';
import Countdown from '../components/Countdown';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useLibrary } from '../context/LibraryContext';
import { IMAGE_PATHS, seasonPoster } from '../lib/art';
import { topRatedKeys } from '../data/ratings';

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

  // הפופולריים ביותר — לפי דירוג הקהל
  const popular = topRatedKeys(8)
    .map(({ season, episode }) => allEpisodes.find((e) => e.season === season && e.episode === episode))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  // המלצות מותאמות: הפרק הבא שלא נצפה בכל עונה שהתחלת, ואם אין — תחילת הסדרה
  const recommendations = (() => {
    const recs: typeof allEpisodes = [];
    const startedSeasons = new Set(
      allEpisodes.filter((e) => watched.includes(e.key) || progress[e.key]).map((e) => e.season),
    );
    for (const sn of startedSeasons) {
      const nextUnseen = allEpisodes.find(
        (e) => e.season === sn && !watched.includes(e.key) && !(progress[e.key] && progress[e.key].time > 30),
      );
      if (nextUnseen && !recs.some((r) => r.key === nextUnseen.key)) recs.push(nextUnseen);
    }
    // השלמה מקלאסיקות שלא נצפו
    for (const p of popular) {
      if (recs.length >= 4) break;
      if (!watched.includes(p.key) && !recs.some((r) => r.key === p.key)) recs.push(p);
    }
    return recs.slice(0, 4);
  })();

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

        <QuoteBar />
        <Countdown />

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

        {/* המלצות מותאמות */}
        {recommendations.length > 0 && (
          <section>
            <SectionTitle>מומלץ עבורך</SectionTitle>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((ep, i) => (
                <EpisodeCard key={ep.key} ep={ep} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* הפופולריים ביותר */}
        <section>
          <SectionTitle to="/seasons">הפופולריים ביותר</SectionTitle>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popular.map((ep, i) => (
              <EpisodeCard key={ep.key} ep={ep} index={i} />
            ))}
          </div>
        </section>

        {/* גילוי העולם */}
        <section>
          <SectionTitle>גלה את העולם</SectionTitle>
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/characters', icon: '👑', title: 'הדמויות', sub: 'ביוגרפיות, בריתות ואויבים' },
              { to: '/houses', icon: '🛡️', title: 'בתי האצולה', sub: 'סמלים, מוטו ועצי משפחה' },
              { to: '/map', icon: '🗺️', title: 'מפת העולם', sub: 'טירות, ערים וקרבות' },
              { to: '/timeline', icon: '⏳', title: 'ציר הזמן', sub: 'האירועים ששינו הכול' },
            ].map((card, i) => (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.4) }}
              >
                <Link to={card.to} className="group block glass rounded-2xl p-6 card-hover h-full">
                  <p className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 origin-right">{card.icon}</p>
                  <p className="font-bold text-white group-hover:text-gold-400 transition-colors">{card.title}</p>
                  <p className="text-xs text-steel-400 mt-1">{card.sub}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
