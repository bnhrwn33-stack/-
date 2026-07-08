import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TIMELINE } from '../data/world';
import { PlayIcon } from '../components/Icons';
import Throne3D from '../components/Throne3D';

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">ציר הזמן</h1>
        <p className="text-steel-400 mt-3 text-lg">האירועים ששינו את ווסטרוס — מהרגע שברן טיפס על המגדל ועד הדרקון שהמיס את הכס.</p>
      </motion.header>

      <div className="relative">
        {/* קו מרכזי */}
        <div className="absolute right-[19px] sm:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-700/60 via-gold-600/30 to-transparent" />

        <div className="space-y-10">
          {TIMELINE.map((ev, i) => (
            <motion.div
              key={`${ev.season}-${ev.episode}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className={`relative flex ${i % 2 ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-start gap-6`}
            >
              {/* נקודה */}
              <div className="absolute right-[13px] sm:right-1/2 sm:translate-x-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-gold-500 ring-4 ring-gold-500/20" />

              <div className="w-full sm:w-1/2 pr-12 sm:pr-0 sm:px-8">
                <Link
                  to={`/watch/${ev.season}/${ev.episode}`}
                  className="group block glass rounded-xl p-5 card-hover"
                >
                  <div className="flex items-center gap-2 text-xs text-gold-500 font-display tracking-widest">
                    <span>SEASON {ev.season} · EPISODE {ev.episode}</span>
                    <PlayIcon width={11} height={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1.5 group-hover:text-gold-400 transition-colors">{ev.title}</h2>
                  <p className="text-sm text-steel-400 mt-1.5 leading-relaxed">{ev.description}</p>
                </Link>
              </div>
              <div className="hidden sm:block w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* כס הברזל בתלת-ממד — סוף המסע */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-bold gold-text font-display mb-2">ובסוף — נשאר רק הכס</h2>
        <p className="text-steel-500 text-sm mb-6">תצוגת תלת-ממד אינטראקטיבית</p>
        <Throne3D />
      </motion.section>
    </div>
  );
}
