import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HOUSES } from '../data/houses';

export default function Houses() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">בתי האצולה</h1>
        <p className="text-steel-400 mt-3 text-lg">הבתים הגדולים של ווסטרוס — סמלים, מוטו, ומאבקי הכוח שביניהם.</p>
      </motion.header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {HOUSES.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
          >
            <Link
              to={`/house/${h.id}`}
              className="group block glass rounded-2xl p-6 card-hover relative overflow-hidden h-full"
            >
              {/* פס צבעי הבית */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ background: `linear-gradient(90deg, ${h.colors[0]}, ${h.colors[1]})` }}
              />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 border shadow-card group-hover:scale-110 transition-transform duration-300"
                style={{ borderColor: `${h.colors[0]}55`, background: `radial-gradient(circle at 30% 25%, ${h.colors[1]}cc, #0a0a0e)` }}
              >
                {h.sigil}
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">{h.nameHe}</h2>
              <p className="text-xs text-steel-500 font-display tracking-wide mt-0.5" dir="ltr">{h.name}</p>
              <p className="text-sm text-gold-500/90 mt-3 italic">"{h.mottoHe.split(' (')[0]}"</p>
              <p className="text-xs text-steel-400 mt-3">🏰 {h.seat} · {h.region}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
