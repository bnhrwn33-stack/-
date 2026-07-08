import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { useUi } from '../context/UiContext';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeCard from '../components/EpisodeCard';
import Comments from '../components/Comments';
import RatingStars from '../components/RatingStars';
import EmberOverlay from '../components/effects/EmberOverlay';
import { CheckIcon, DownloadIcon, HeartIcon, LinkIcon, NextIcon, PlusIcon, PrevIcon, ShareIcon } from '../components/Icons';
import { shareUrl } from '../lib/drive';
import { episodeRating } from '../data/ratings';
import { deriveTags, episodeDuration, tagIcon } from '../data/tags';

export default function WatchPage() {
  const { season, episode } = useParams();
  const navigate = useNavigate();
  const {
    findEpisode, nextEpisode, prevEpisode, seasons, watched, favorites, watchlist,
    toggleWatched, toggleFavorite, toggleWatchlist, progress, ratings, rateEpisode, logView,
  } = useLibrary();
  const { cinemaMode, setCinemaMode, theaterMode } = useUi();
  const [copied, setCopied] = useState(false);

  const ep = findEpisode(Number(season), Number(episode));

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (ep) {
      document.title = `ע${ep.season} פ${ep.episode} · ${ep.titleHe} — משחקי הכס`;
      logView(ep.key);
    }
    return () => { document.title = 'משחקי הכס — ספריית צפייה אישית'; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep?.key]);

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

  // Prefetch למקור הפרק הבא (רק אם זו כתובת http אמיתית, לא blob מקומי)
  useEffect(() => {
    if (!ep) return;
    const nxt = nextEpisode(ep);
    const url = nxt?.sources[0]?.streamUrl;
    if (!url || !url.startsWith('http')) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [ep, nextEpisode]);

  if (!ep) return <Navigate to="/" replace />;

  const nxt = nextEpisode(ep);
  const prv = prevEpisode(ep);
  const isWatched = watched.includes(ep.key);
  const isFav = favorites.includes(ep.key);
  const inWatchlist = watchlist.includes(ep.key);
  const seasonEps = seasons.find((s) => s.number === ep.season)?.episodes ?? [];
  const moreInSeason = seasonEps.filter((e) => e.key !== ep.key).slice(0, 4);
  const linkForShare = ep.sources[0] ? shareUrl(ep.sources[0].id) : location.href;
  const savedProgress = progress[ep.key];
  const crowdRating = episodeRating(ep.season, ep.episode);
  const myRating = ratings[ep.key] ?? 0;
  const tags = deriveTags(ep);
  const runtime = episodeDuration(ep.season, ep.episode);

  const fmtTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkForShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* חסום */ }
  };

  return (
    <div className={`relative mx-auto px-4 sm:px-6 pt-24 pb-10 transition-all duration-300 ${theaterMode ? 'max-w-full' : 'max-w-6xl'}`}>
      {/* גיצי אש עדינים ברקע העמוד */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <EmberOverlay density={18} />
      </div>

      {/* מצב קולנוע — מחשיך את כל האתר ומשאיר את הנגן */}
      <AnimatePresence>
        {cinemaMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95"
            onClick={() => setCinemaMode(false)}
          />
        )}
      </AnimatePresence>

      {!theaterMode && (
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
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`relative mx-auto ${cinemaMode || theaterMode ? 'z-50' : ''} ${theaterMode ? 'max-w-[1600px]' : ''}`}
      >
        <VideoPlayer
          episode={ep}
          onNext={nxt ? goNext : undefined}
          onPrev={prv ? goPrev : undefined}
          nextTitle={nxt ? `ע${nxt.season} פ${nxt.episode} · ${nxt.titleHe}` : undefined}
        />
      </motion.div>

      {/* כותרת ופעולות */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className={`mt-6 flex flex-col lg:flex-row gap-6 mx-auto ${theaterMode ? 'max-w-[1600px]' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-display tracking-[0.35em] text-gold-500 mb-1.5">
            SEASON {ep.season} · EPISODE {ep.episode} · {runtime} דק׳
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{ep.titleHe}</h1>
          <p className="text-steel-500 font-display tracking-wide mt-1">{ep.title}</p>

          {/* תגיות אוטומטיות */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((t) => (
              <span key={t} className="text-xs glass rounded-full px-2.5 py-1 text-steel-300">
                {tagIcon(t)} {t}
              </span>
            ))}
          </div>

          {/* דירוגים */}
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            {crowdRating !== undefined && (
              <span className="inline-flex items-center gap-1.5 text-sm glass rounded-full px-3 py-1">
                <span className="text-gold-400 font-bold">★ {crowdRating.toFixed(1)}</span>
                <span className="text-steel-500 text-xs">דירוג הקהל</span>
              </span>
            )}
            <span className="inline-flex items-center gap-2 text-sm">
              <RatingStars value={myRating} onChange={(s) => rateEpisode(ep.key, s)} size={19} />
              <span className="text-steel-500 text-xs">{myRating ? 'הדירוג שלך' : 'דרג את הפרק'}</span>
            </span>
          </div>

          <p className="text-steel-300 mt-4 leading-relaxed max-w-2xl">{ep.synopsis}</p>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {savedProgress && savedProgress.time > 30 && savedProgress.time < savedProgress.duration * 0.95 && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="btn-gold !px-4 !py-2 text-sm"
                title="ההצעה להמשיך מופיעה בנגן"
              >
                ⏯ המשך מ-{fmtTime(savedProgress.time)}
              </button>
            )}
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
            <button
              onClick={() => toggleWatchlist(ep.key)}
              className={`btn-ghost !px-4 !py-2 text-sm ${inWatchlist ? '!text-gold-400' : ''}`}
            >
              {inWatchlist ? <CheckIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />}
              {inWatchlist ? 'ברשימה שלי' : 'לצפייה מאוחר יותר'}
            </button>
          </div>
        </div>
      </motion.div>

      {!theaterMode && (
        <>
          <Comments episodeKey={ep.key} />

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
        </>
      )}
    </div>
  );
}
