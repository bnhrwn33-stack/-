import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CHARACTERS } from '../data/characters';
import { houseById } from '../data/houses';
import SmartImage from '../components/SmartImage';
import { characterPortrait, IMAGE_PATHS } from '../lib/art';

export default function Characters() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">הדמויות</h1>
        <p className="text-steel-400 mt-3 text-lg">גיבורים, נבלים וכל מי שביניהם — האנשים ששיחקו במשחק הכס.</p>
      </motion.header>

      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {CHARACTERS.map((c, i) => {
          const house = houseById(c.houseId);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <Link to={`/character/${c.id}`} className="group block rounded-xl overflow-hidden glass card-hover relative">
                <div className="aspect-[4/5] overflow-hidden bg-ink-800">
                  <SmartImage
                    src={IMAGE_PATHS.character(c.id)}
                    fallback={characterPortrait(c.nameHe, house?.colors[0] ?? '#c9a84c', house?.colors[1] ?? '#1a1a22')}
                    alt={c.nameHe}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent p-3.5 pt-10">
                  <p className="font-bold text-white group-hover:text-gold-400 transition-colors">{c.nameHe}</p>
                  <p className="text-[11px] text-steel-400 mt-0.5">
                    {house?.sigil} {house?.nameHe} · {c.actor}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
