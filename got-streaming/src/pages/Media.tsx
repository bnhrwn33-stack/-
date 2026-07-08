import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon } from '../components/Icons';
import SmartImage from '../components/SmartImage';
import { galleryTile } from '../lib/art';

const SECTIONS = [
  { id: 'trailers', labelHe: 'טריילרים', hint: 'trailer-1.mp4, trailer-2.mp4...' },
  { id: 'clips', labelHe: 'קליפים וסצנות', hint: 'clip-1.mp4...' },
  { id: 'interviews', labelHe: 'ראיונות', hint: 'interview-1.mp4...' },
  { id: 'bts', labelHe: 'מאחורי הקלעים', hint: 'bts-1.mp4...' },
] as const;

function MediaCard({ section, n }: { section: string; n: number }) {
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const src = `/videos/media/${section}-${n}.mp4`;

  if (playing && !missing) {
    return (
      <div className="rounded-xl overflow-hidden bg-black aspect-video">
        <video src={src} className="w-full h-full" controls autoPlay onError={() => setMissing(true)} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative rounded-xl overflow-hidden glass card-hover group aspect-video w-full"
    >
      <SmartImage
        src={`/images/media/${section}-${n}.jpg`}
        fallback={galleryTile(`${section.toUpperCase()} ${n}`, n * 31 + section.length * 11)}
        alt=""
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-12 h-12 rounded-full bg-gold-500/90 text-ink-950 flex items-center justify-center shadow-glow opacity-90 group-hover:scale-110 transition-transform">
          {missing ? '✕' : <PlayIcon width={22} height={22} style={{ marginInlineStart: 2 }} />}
        </span>
      </span>
      {missing && (
        <span className="absolute bottom-2 inset-x-2 text-[11px] bg-ink-950/85 rounded px-2 py-1 text-steel-400">
          אין קובץ — הוסף <code dir="ltr">public/videos/media/{section}-{n}.mp4</code>
        </span>
      )}
    </button>
  );
}

export default function Media() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">מדיה</h1>
        <p className="text-steel-400 mt-3 text-lg">
          טריילרים, קליפים, ראיונות וסרטוני מאחורי הקלעים — שמור אותם ב-<code dir="ltr" className="text-gold-500">public/videos/media/</code> והם ינוגנו כאן.
        </p>
      </motion.header>

      <div className="space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.id}>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
              {s.labelHe}
              <span className="text-xs text-steel-500 font-normal" dir="ltr">({s.hint})</span>
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <MediaCard key={n} section={s.id} n={n} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
