import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PlayIcon } from './Icons';
import { IMAGE_PATHS } from '../lib/art';
import { SHOW_TAGLINE } from '../lib/metadata';
import { useLibrary } from '../context/LibraryContext';
import TrailerModal from './TrailerModal';

/** רקע SVG דרמטי (כס מוקף הילת אור) — גיבוי כשאין תמונת hero.jpg */
function ThroneBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="halo" cx="38%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#e8d49a" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#8a713a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#050507" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0e" />
          <stop offset="100%" stopColor="#050507" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="#07070a" />
      <rect width="1600" height="900" fill="url(#halo)" />
      <rect y="640" width="1600" height="260" fill="url(#floor)" />
      {/* צללית כס חרבות */}
      <g transform="translate(800 660)" opacity="0.9">
        {Array.from({ length: 46 }, (_, i) => {
          const t = i / 45;
          const x = (t - 0.5) * 560;
          const hh = 150 + 330 * Math.exp(-((t - 0.5) ** 2) / 0.045) + ((i * 137) % 60);
          const lean = (t - 0.5) * 26;
          return (
            <path
              key={i}
              d={`M${x} 40 L${x - 7 + lean * 0.2} ${-hh * 0.92} L${x + lean * 0.3} ${-hh} L${x + 7 + lean * 0.4} ${-hh * 0.92} Z`}
              fill={`hsl(${38 + (i % 5) * 3}, ${12 + (i % 4) * 5}%, ${7 + (i % 6)}%)`}
              stroke="#1c1810"
              strokeWidth="1"
            />
          );
        })}
        <ellipse cx="0" cy="52" rx="330" ry="34" fill="#000" opacity="0.55" />
      </g>
      {/* חלקיקי אבק */}
      <g fill="#e8d49a">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={(i * 233) % 1600} cy={(i * 149) % 620} r={(i % 3) + 0.6} opacity={0.05 + (i % 5) * 0.03} />
        ))}
      </g>
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { seasons, progress } = useLibrary();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [hasHeroVideo, setHasHeroVideo] = useState(true);

  // "המשך צפייה" — הפרק האחרון שנצפה חלקית
  const resume = Object.entries(progress)
    .filter(([, p]) => p.time > 30 && p.time < p.duration * 0.95)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)[0];
  const resumeEp = resume ? seasons.flatMap((s) => s.episodes).find((e) => e.key === resume[0]) : undefined;

  return (
    <div ref={ref} className="relative h-[92vh] min-h-[560px] overflow-hidden">
      {/* שכבת רקע עם פרלקסה: וידאו (אם קיים) → תמונה (אם קיימת) → SVG דרמטי */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <ThroneBackdrop />
        <img
          src={IMAGE_PATHS.hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {hasHeroVideo && (
          <video
            src={IMAGE_PATHS.heroVideo}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setHasHeroVideo(false)}
          />
        )}
      </motion.div>

      {/* Overlay כהה */}
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="absolute inset-0 bg-gradient-to-l from-ink-950/70 via-transparent to-ink-950/40" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 h-full mx-auto max-w-7xl px-4 sm:px-6 flex flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display tracking-[0.5em] text-gold-500 text-xs sm:text-sm mb-5"
        >
          WINTER IS COMING
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
          className="font-display font-black text-5xl sm:text-7xl lg:text-8xl gold-text leading-[1.05] max-w-3xl"
        >
          GAME <span className="text-3xl sm:text-5xl lg:text-6xl align-middle">OF</span> THRONES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-6 text-steel-300 text-lg sm:text-xl max-w-xl leading-relaxed"
        >
          {SHOW_TAGLINE}. שמונה עונות, 73 פרקים — כולם מסודרים ומוכנים לצפייה, ישירות מהענן הפרטי שלך.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            to={resumeEp ? `/watch/${resumeEp.season}/${resumeEp.episode}` : '/watch/1/1'}
            className="btn-gold text-base"
          >
            <PlayIcon width={22} height={22} />
            {resumeEp ? `המשך צפייה — עונה ${resumeEp.season} פרק ${resumeEp.episode}` : 'התחל לצפות'}
          </Link>
          <Link to="/seasons" className="btn-ghost text-base">
            כל העונות
          </Link>
          <button onClick={() => setTrailerOpen(true)} className="btn-ghost text-base">
            🎬 טריילר
          </button>
        </motion.div>
      </motion.div>

      {/* חץ גלילה */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.6, duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-600"
        aria-hidden
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  );
}
