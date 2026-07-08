import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CHARACTERS, characterById } from '../data/characters';
import { houseById } from '../data/houses';
import SmartImage from '../components/SmartImage';
import Lightbox from '../components/Lightbox';
import { characterPortrait, galleryTile, IMAGE_PATHS } from '../lib/art';

function InfoCard({ title, items, tone }: { title: string; items: string[]; tone: 'gold' | 'green' | 'red' }) {
  const toneClass = { gold: 'text-gold-400', green: 'text-emerald-400', red: 'text-rose-400' }[tone];
  return (
    <div className="glass rounded-xl p-5">
      <h3 className={`text-sm font-bold mb-3 ${toneClass}`}>{title}</h3>
      <ul className="space-y-1.5 text-sm text-steel-300">
        {items.map((it) => <li key={it} className="leading-relaxed">• {it}</li>)}
      </ul>
    </div>
  );
}

export default function CharacterPage() {
  const { id } = useParams();
  const c = characterById(id ?? '');
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!c) return <Navigate to="/characters" replace />;
  const house = houseById(c.houseId);
  const portrait = characterPortrait(c.nameHe, house?.colors[0] ?? '#c9a84c', house?.colors[1] ?? '#1a1a22');
  const others = CHARACTERS.filter((x) => x.houseId === c.houseId && x.id !== c.id).slice(0, 4);

  return (
    <div className="pt-16">
      {/* באנר עליון */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 blur-2xl scale-110">
          <SmartImage src={IMAGE_PATHS.character(c.id)} fallback={portrait} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[260px] mx-auto md:mx-0 shrink-0 rounded-2xl overflow-hidden glass shadow-card cursor-zoom-in"
            onClick={() => setLightbox(IMAGE_PATHS.character(c.id))}
          >
            <SmartImage src={IMAGE_PATHS.character(c.id)} fallback={portrait} alt={c.nameHe} className="w-full aspect-[4/5] object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="flex-1 min-w-0">
            <Link to={`/house/${c.houseId}`} className="inline-flex items-center gap-2 text-sm glass rounded-full px-3.5 py-1.5 text-steel-300 hover:text-gold-400 transition-colors">
              <span className="text-lg leading-none">{house?.sigil}</span> {house?.nameHe}
            </Link>
            <h1 className="text-4xl sm:text-6xl font-bold gold-text font-display mt-4">{c.nameHe}</h1>
            <p className="text-steel-500 font-display tracking-wide mt-1 text-lg text-right" dir="ltr">{c.name}</p>
            <p className="text-gold-500 text-sm mt-2">{c.title}</p>
            <div className="flex gap-2 mt-3 flex-wrap text-xs">
              <span className="glass rounded-full px-3 py-1 text-steel-300">🎭 {c.actor}</span>
              <span className="glass rounded-full px-3 py-1 text-steel-300">📺 {c.seasons}</span>
            </div>
            <p className="text-steel-300 mt-5 leading-relaxed max-w-2xl">{c.bio}</p>
            <p className="text-sm text-steel-500 mt-4 leading-relaxed"><b className="text-steel-300">הופעות:</b> {c.appearances}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 space-y-10 pb-6">
        {/* משפחה, בריתות, אויבים */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-5 md:grid-cols-3"
        >
          <InfoCard title="👪 בני משפחה" items={c.family} tone="gold" />
          <InfoCard title="🤝 בעלי ברית" items={c.allies} tone="green" />
          <InfoCard title="⚔️ אויבים" items={c.enemies} tone="red" />
        </motion.div>

        {/* גלריה */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
            גלריה
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => {
              const src = `/images/characters/${c.id}-${n}.jpg`;
              return (
                <button key={n} onClick={() => setLightbox(src)} className="rounded-xl overflow-hidden glass card-hover cursor-zoom-in">
                  <SmartImage
                    src={src}
                    fallback={galleryTile(c.nameHe, n * 17 + c.id.length)}
                    alt={`${c.nameHe} — תמונה ${n}`}
                    className="w-full aspect-video object-cover"
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-steel-500 mt-2">
            הוסף תמונות משלך: <code dir="ltr">public/images/characters/{c.id}-1.jpg</code> עד <code dir="ltr">{c.id}-4.jpg</code>
          </p>
        </section>

        {/* עוד מהבית */}
        {others.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
              עוד מ{house?.nameHe}
            </h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {others.map((o) => {
                const oh = houseById(o.houseId);
                return (
                  <Link key={o.id} to={`/character/${o.id}`} className="group glass rounded-xl overflow-hidden card-hover">
                    <SmartImage
                      src={IMAGE_PATHS.character(o.id)}
                      fallback={characterPortrait(o.nameHe, oh?.colors[0] ?? '#c9a84c', oh?.colors[1] ?? '#1a1a22')}
                      alt={o.nameHe}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <p className="p-3 text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">{o.nameHe}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Lightbox src={lightbox} title={c.nameHe} onClose={() => setLightbox(null)} />
    </div>
  );
}
