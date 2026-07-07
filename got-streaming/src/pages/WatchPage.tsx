import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeCard from '../components/EpisodeCard';
import { CheckIcon, DownloadIcon, HeartIcon, LinkIcon, NextIcon, PrevIcon, ShareIcon } from '../components/Icons';
import { shareUrl } from '../lib/drive';

export default function WatchPage() {
  const { season, episode } = useParams();
  const navigate = useNavigate();
  const { findEpisode, nextEpisode, prevEpisode, seasons, watched, favorites, toggleWatched, toggleFavorite } = useLibrary();
  const [copied, setCopied] = useState(false);

  const ep = findEpisode(Number(season), Number(episode));

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (ep) document.title = `ע${ep.season} פ${ep.episode} · ${ep.titleHe} — משחקי הכס`;
    return () => { document.title = 'משחקי הכס — ספריית צפייה אישית'; };
  }, [ep]);

  const goNext = useCallback(() => {
    if (!ep) return;
    const nxt = nextEpisode(ep);
    if (nxt) navigate(`/watch/${nxt.season}/${nxt.episode}`);
  }, [ep, nextEpisode, navigate]);

  const goPrev = useCallback(() => {
    if (!ep) return;
    const prv = prevEpisode(ep);
    if (prv) navigate(`/watch/${prv.season}/${prv.episode}`);
  }, [ep, prevEpisode, navigate]);

  if (!ep) return <Navigate to="/" replace />;

  const nxt = nextEpisode(ep);
  const prv = prevEpisode(ep);
  const isWatched = watched.includes(ep.key);
  const isFav = favorites.includes(ep.key);
  const seasonEps = seasons.find((s) => s.number === ep.season)?.episodes ?? [];
  const moreInSeason = seasonEps.filter((e) => e.key !== ep.key).slice(0, 4);
  const linkForShare = ep.sources[0] ? shareUrl(ep.sources[0].id) : location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkForShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* חסום */ }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-10">
      {/* פירורי לחם */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-steel-500 mb-4 flex items-center gap-2"
      >
        <Link to="/" className="hover:text-gold-400 transition-colors">ראשי</Link>
        <span>/</span>
        <Link to={`/season/${ep.season}`} className="hover:text-gold-400 transition-colors">עונה {ep.season}</Link>
        <span>/</span>
        <span className="text-steel-300">פרק {ep.episode}</span>
      </motion.nav>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <VideoPlayer episode={ep} onNext={nxt ? goNext : undefined} onPrev={prv ? goPrev : undefined} />
      </motion.div>

      {/* כותרת ופעולות */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-6 flex flex-col lg:flex-row gap-6"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-display tracking-[0.35em] text-gold-500 mb-1.5">
            SEASON {ep.season} · EPISODE {ep.episode}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{ep.titleHe}</h1>
          <p className="text-steel-500 font-display tracking-wide mt-1">{ep.title}</p>
          <p className="text-steel-300 mt-4 leading-relaxed max-w-2xl">{ep.synopsis}</p>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {prv && (
              <button onClick={goPrev} className="btn-ghost !px-4 !py-2 text-sm">
                <PrevIcon width={16} height={16} /> פרק קודם
              </button>
            )}
            {nxt && (
              <button onClick={goNext} className="btn-gold !px-4 !py-2 text-sm">
                הפרק הבא <NextIcon width={16} height={16} />
              </button>
            )}
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
            {ep.sources[0] && (
              <a href={ep.sources[0].downloadUrl} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 text-sm">
                <DownloadIcon width={16} height={16} /> הורדה
              </a>
            )}
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: ep.titleHe, url: linkForShare }).catch(() => {});
                else copyLink();
              }}
              className="btn-ghost !px-4 !py-2 text-sm"
            >
              <ShareIcon width={16} height={16} /> שיתוף
            </button>
            <button onClick={copyLink} className={`btn-ghost !px-4 !py-2 text-sm ${copied ? '!text-emerald-400' : ''}`}>
              {copied ? <CheckIcon width={16} height={16} /> : <LinkIcon width={16} height={16} />}
              {copied ? 'הועתק!' : 'העתק קישור'}
            </button>
            <button
              onClick={() => toggleWatched(ep.key)}
              className={`btn-ghost !px-4 !py-2 text-sm ${isWatched ? '!text-emerald-400' : ''}`}
            >
              <CheckIcon width={16} height={16} /> {isWatched ? 'נצפה' : 'סמן כנצפה'}
            </button>
            <button
              onClick={() => toggleFavorite(ep.key)}
              className={`btn-ghost !px-4 !py-2 text-sm ${isFav ? '!text-rose-400' : ''}`}
            >
              <HeartIcon width={16} height={16} filled={isFav} /> {isFav ? 'במועדפים' : 'מועדפים'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* עוד מהעונה */}
      {moreInSeason.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
            עוד מעונה {ep.season}
          </h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {moreInSeason.map((e, i) => (
              <EpisodeCard key={e.key} ep={e} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
