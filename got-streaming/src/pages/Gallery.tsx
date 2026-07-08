import { useState } from 'react';
import { motion } from 'framer-motion';
import SmartImage from '../components/SmartImage';
import Lightbox from '../components/Lightbox';
import { galleryTile, IMAGE_PATHS } from '../lib/art';

const CATEGORIES = [
  { id: 'wallpapers', label: 'Wallpapers', labelHe: 'רקעים למסך' },
  { id: 'posters', label: 'Posters', labelHe: 'פוסטרים' },
  { id: 'bts', label: 'Behind the Scenes', labelHe: 'מאחורי הקלעים' },
  { id: 'concept', label: 'Concept Art', labelHe: 'קונספט ארט' },
] as const;

export default function Gallery() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]['id']>('wallpapers');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const active = CATEGORIES.find((c) => c.id === cat)!;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10 min-h-[70vh]">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">גלריה</h1>
        <p className="text-steel-400 mt-3 text-lg">רקעים, פוסטרים, מאחורי הקלעים וקונספט ארט — באיכות מלאה.</p>
      </motion.header>

      {/* קטגוריות */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full px-4.5 px-4 py-2 text-sm font-medium transition-all ${
              cat === c.id ? 'bg-gold-500 text-ink-950 shadow-glow' : 'glass text-steel-300 hover:text-gold-400'
            }`}
          >
            {c.labelHe}
          </button>
        ))}
      </div>

      <motion.div
        key={cat}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
          const src = IMAGE_PATHS.gallery(cat, n);
          return (
            <button
              key={`${cat}-${n}`}
              onClick={() => setLightbox(src)}
              className="rounded-xl overflow-hidden glass card-hover cursor-zoom-in group"
            >
              <SmartImage
                src={src}
                fallback={galleryTile(active.label, n * 13 + cat.length * 7)}
                alt={`${active.labelHe} ${n}`}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          );
        })}
      </motion.div>

      <p className="text-xs text-steel-500 mt-6">
        הוסף תמונות משלך: <code dir="ltr">public/images/gallery/{cat}/1.jpg</code> עד <code dir="ltr">12.jpg</code> —
        הן יחליפו את האריחים המעוצבים אוטומטית.
      </p>

      <Lightbox src={lightbox} title={active.labelHe} onClose={() => setLightbox(null)} />
    </div>
  );
}
