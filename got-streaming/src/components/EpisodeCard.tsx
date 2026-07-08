import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Episode } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { episodePoster, IMAGE_PATHS } from '../lib/art';
import SmartImage from './SmartImage';
import { CheckIcon, DownloadIcon, HeartIcon, LinkIcon, PlayIcon, ShareIcon, ClockIcon } from './Icons';
import { shareUrl } from '../lib/drive';
import { episodeRating } from '../data/ratings';

function fmtDuration(ms?: number): string | null {
  if (!ms) return null;
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')} ש׳` : `${m} דק׳`;
}

export default function EpisodeCard({ ep, index = 0 }: { ep: Episode; index?: number }) {
  const { progress, watched, favorites, toggleWatched, toggleFavorite } = useLibrary();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const prog = progress[ep.key];
  const pct = prog && prog.duration > 0 ? Math.min(100, (prog.time / prog.duration) * 100) : 0;
  const isWatched = watched.includes(ep.key);
  const isFav = favorites.includes(ep.key);
  const hasVideo = ep.sources.length > 0;
  const duration = fmtDuration(ep.sources[0]?.durationMillis);
  const watchPath = `/watch/${ep.season}/${ep.episode}`;

  const linkForShare = hasVideo ? shareUrl(ep.sources[0].id) : `${location.origin}${location.pathname}#${watchPath}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkForShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* דפדפן חוסם — מתעלמים */ }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `משחקי הכס — עונה ${ep.season} פרק ${ep.episode}`, url: linkForShare });
      } catch { /* המשתמש ביטל */ }
    } else {
      copyLink();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
      className="group relative rounded-xl overflow-hidden glass card-hover"
    >
      {/* עטיפה */}
      <Link to={watchPath} className="block relative aspect-video overflow-hidden bg-ink-800">
        <SmartImage
          src={IMAGE_PATHS.episode(ep.season, ep.episode)}
          fallback={episodePoster(ep.season, ep.episode)}
          alt={`עונה ${ep.season} פרק ${ep.episode} — ${ep.titleHe}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent opacity-70" />

        {/* כפתור פליי מרחף */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-14 h-14 rounded-full bg-gold-500/90 text-ink-950 flex items-center justify-center shadow-glow scale-90 group-hover:scale-100 transition-transform duration-300">
            <PlayIcon width={26} height={26} style={{ marginInlineStart: 3 }} />
          </span>
        </div>

        {/* תגיות */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
          <span className="text-[11px] font-bold bg-ink-950/80 backdrop-blur px-2 py-0.5 rounded text-gold-400 border border-gold-700/40">
            ע{ep.season} · פ{ep.episode}
          </span>
          {!hasVideo && (
            <span className="text-[11px] bg-ink-950/80 backdrop-blur px-2 py-0.5 rounded text-steel-400 border border-white/10">
              לא מחובר
            </span>
          )}
        </div>
        {isWatched && (
          <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-emerald-500/90 text-ink-950 flex items-center justify-center">
            <CheckIcon width={14} height={14} />
          </span>
        )}

        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          {duration && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-ink-950/80 backdrop-blur px-2 py-0.5 rounded text-steel-300">
              <ClockIcon width={12} height={12} /> {duration}
            </span>
          )}
          {episodeRating(ep.season, ep.episode) !== undefined && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-ink-950/80 backdrop-blur px-2 py-0.5 rounded text-gold-400 font-semibold">
              ★ {episodeRating(ep.season, ep.episode)!.toFixed(1)}
            </span>
          )}
        </span>

        {/* פס התקדמות */}
        {pct > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10">
            <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
          </div>
        )}
      </Link>

      {/* תוכן */}
      <div className="p-4">
        <h3 className="font-semibold text-white leading-snug">
          <Link to={watchPath} className="hover:text-gold-400 transition-colors">
            {ep.titleHe}
          </Link>
        </h3>
        <p className="text-xs text-steel-500 font-display tracking-wide mt-0.5">{ep.title}</p>
        <p className="text-sm text-steel-400 mt-2 leading-relaxed line-clamp-2">{ep.synopsis}</p>

        {/* פעולות */}
        <div className="mt-3.5 flex items-center gap-1 text-steel-400">
          <button
            onClick={() => navigate(watchPath)}
            title="צפייה"
            className="p-2 rounded-md hover:bg-white/10 hover:text-gold-400 transition-colors"
          >
            <PlayIcon width={17} height={17} />
          </button>
          {hasVideo && (
            <a
              href={ep.sources[0].downloadUrl}
              target="_blank"
              rel="noreferrer"
              title="הורדה"
              className="p-2 rounded-md hover:bg-white/10 hover:text-gold-400 transition-colors"
            >
              <DownloadIcon width={17} height={17} />
            </a>
          )}
          <button onClick={share} title="שיתוף" className="p-2 rounded-md hover:bg-white/10 hover:text-gold-400 transition-colors">
            <ShareIcon width={17} height={17} />
          </button>
          <button
            onClick={copyLink}
            title={copied ? 'הועתק!' : 'העתקת קישור'}
            className={`p-2 rounded-md hover:bg-white/10 transition-colors ${copied ? 'text-emerald-400' : 'hover:text-gold-400'}`}
          >
            {copied ? <CheckIcon width={17} height={17} /> : <LinkIcon width={17} height={17} />}
          </button>

          <div className="flex-1" />

          <button
            onClick={() => toggleWatched(ep.key)}
            title={isWatched ? 'סמן כלא נצפה' : 'סמן כנצפה'}
            className={`p-2 rounded-md hover:bg-white/10 transition-colors ${isWatched ? 'text-emerald-400' : 'hover:text-emerald-400'}`}
          >
            <CheckIcon width={17} height={17} />
          </button>
          <button
            onClick={() => toggleFavorite(ep.key)}
            title={isFav ? 'הסר ממועדפים' : 'הוסף למועדפים'}
            className={`p-2 rounded-md hover:bg-white/10 transition-colors ${isFav ? 'text-rose-400' : 'hover:text-rose-400'}`}
          >
            <HeartIcon width={17} height={17} filled={isFav} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
