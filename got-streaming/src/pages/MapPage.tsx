import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BATTLES, LOCATIONS } from '../data/world';
import { houseById } from '../data/houses';
import SmartImage from '../components/SmartImage';
import { galleryTile, IMAGE_PATHS } from '../lib/art';
import { CloseIcon, PlayIcon } from '../components/Icons';

/** צורת יבשת מסוגננת בהשראת ווסטרוס ואסוס */
function Landmass() {
  return (
    <g>
      {/* ווסטרוס */}
      <path
        d="M38 4 L56 3 L60 8 L58 14 L62 20 L58 27 L61 33 L57 38 L63 44 L60 52 L66 58 L63 66 L67 73 L62 80 L64 88 L55 94 L46 92 L40 95 L34 89 L37 82 L31 76 L35 69 L30 62 L34 55 L29 48 L33 42 L28 35 L33 28 L29 20 L35 13 L32 7 Z"
        fill="#14141c" stroke="#c9a84c" strokeOpacity="0.35" strokeWidth="0.4"
      />
      {/* אסוס */}
      <path
        d="M80 22 L96 20 L99 28 L97 40 L99 52 L96 64 L99 74 L90 78 L83 72 L86 62 L81 54 L85 44 L80 36 L84 29 Z"
        fill="#131318" stroke="#c9a84c" strokeOpacity="0.28" strokeWidth="0.4"
      />
      {/* איי הברזל */}
      <ellipse cx="27" cy="40" rx="3.4" ry="2.2" fill="#14141c" stroke="#c9a84c" strokeOpacity="0.3" strokeWidth="0.35" />
      {/* החומה */}
      <line x1="36" y1="10" x2="60" y2="10" stroke="#9fd3e8" strokeOpacity="0.65" strokeWidth="0.8" strokeDasharray="1.6 0.9" />
      {/* הים הצר */}
      <text x="72" y="48" textAnchor="middle" fontSize="2.4" fill="#4a5568" opacity="0.9" transform="rotate(90 72 48)">הים הצר</text>
    </g>
  );
}

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const [showBattles, setShowBattles] = useState(false);
  const selectedId = params.get('loc');
  const selected = useMemo(() => LOCATIONS.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const selectedBattles = useMemo(
    () => (selected ? BATTLES.filter((b) => b.locationId === selected.id) : []),
    [selected],
  );

  const select = (id: string | null) => {
    if (id) setParams({ loc: id });
    else setParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">מפת העולם</h1>
        <p className="text-steel-400 mt-3 text-lg">מהחומה בצפון ועד סאנספיר בדרום — לחץ על כל מקום כדי לגלות את סיפורו.</p>
        <button
          onClick={() => setShowBattles((b) => !b)}
          className={`mt-4 btn-ghost !px-4 !py-2 text-sm ${showBattles ? '!text-rose-300 !border-rose-500/40' : ''}`}
        >
          ⚔️ {showBattles ? 'הסתר קרבות' : 'הצג קרבות מרכזיים'}
        </button>
      </motion.header>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* המפה */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 glass rounded-2xl overflow-hidden relative"
        >
          <svg viewBox="0 0 100 100" className="w-full" style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1420 0%, #07070c 70%)' }}>
            {/* גלים */}
            <g stroke="#1d2735" strokeWidth="0.25" fill="none" opacity="0.7">
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d={`M${2 + i * 3} ${16 + i * 10} q 3 -1.5 6 0 t 6 0`} />
              ))}
            </g>
            <Landmass />

            {/* מיקומים */}
            {LOCATIONS.map((l) => {
              const active = selected?.id === l.id;
              return (
                <g
                  key={l.id}
                  transform={`translate(${l.x} ${l.y})`}
                  className="cursor-pointer"
                  onClick={() => select(active ? null : l.id)}
                >
                  <circle r="2.6" fill="transparent" />
                  <circle r={active ? 1.5 : 1} fill={active ? '#f0d99a' : '#c9a84c'} stroke="#050507" strokeWidth="0.3">
                    {active && <animate attributeName="r" values="1.3;1.7;1.3" dur="1.6s" repeatCount="indefinite" />}
                  </circle>
                  <text
                    y="-2"
                    textAnchor="middle"
                    fontSize="2.1"
                    fill={active ? '#f0d99a' : '#b9bfc9'}
                    className="select-none"
                    style={{ fontWeight: active ? 700 : 400 }}
                  >
                    {l.nameHe}
                  </text>
                </g>
              );
            })}

            {/* קרבות */}
            {showBattles && BATTLES.map((b, i) => {
              const loc = LOCATIONS.find((l) => l.id === b.locationId);
              if (!loc) return null;
              const dx = (i % 3 - 1) * 3.2;
              return (
                <g key={b.id} transform={`translate(${loc.x + dx} ${loc.y + 2.8})`} className="cursor-pointer" onClick={() => select(loc.id)}>
                  <text textAnchor="middle" fontSize="2.6">⚔️</text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* פאנל מידע */}
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="relative aspect-video">
                  <SmartImage
                    src={IMAGE_PATHS.location(selected.id)}
                    fallback={galleryTile(selected.nameHe, selected.x + selected.y)}
                    alt={selected.nameHe}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => select(null)}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-ink-950/70 text-steel-300 hover:text-white transition-colors"
                    aria-label="סגירה"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">{selected.nameHe}</h2>
                    <span className="text-xs glass rounded-full px-2.5 py-0.5 text-steel-400">{selected.region}</span>
                  </div>
                  {selected.houseId && (
                    <Link to={`/house/${selected.houseId}`} className="inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-300 transition-colors mt-1.5">
                      {houseById(selected.houseId)?.sigil} מושב {houseById(selected.houseId)?.nameHe} ←
                    </Link>
                  )}
                  <p className="text-sm text-steel-300 leading-relaxed mt-3">{selected.description}</p>

                  <h3 className="text-sm font-bold text-gold-400 mt-4 mb-2">אירועים מרכזיים</h3>
                  <ul className="space-y-1.5 text-sm text-steel-300">
                    {selected.events.map((e) => <li key={e}>• {e}</li>)}
                  </ul>

                  {selectedBattles.length > 0 && (
                    <>
                      <h3 className="text-sm font-bold text-rose-400 mt-4 mb-2">⚔️ קרבות שנערכו כאן</h3>
                      <ul className="space-y-2.5">
                        {selectedBattles.map((b) => (
                          <li key={b.id} className="bg-white/[0.04] rounded-lg p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-white">{b.nameHe}</span>
                              <Link
                                to={`/watch/${b.season}/${b.episode}`}
                                className="inline-flex items-center gap-1 text-xs text-gold-500 hover:text-gold-300 transition-colors shrink-0"
                              >
                                <PlayIcon width={12} height={12} /> ע{b.season} פ{b.episode}
                              </Link>
                            </div>
                            <p className="text-xs text-steel-400 mt-1">{b.sides}</p>
                            <p className="text-xs text-steel-500 mt-0.5">{b.outcome}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <p className="text-4xl mb-3">🗺</p>
                <p className="text-steel-300 font-medium">בחר מקום על המפה</p>
                <p className="text-sm text-steel-500 mt-1.5">כל נקודת זהב היא עיר, טירה או ציון דרך — עם ההיסטוריה המלאה שלה.</p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {LOCATIONS.slice(0, 6).map((l) => (
                    <button key={l.id} onClick={() => select(l.id)} className="text-xs glass rounded-full px-3 py-1.5 text-steel-300 hover:text-gold-400 transition-colors">
                      {l.nameHe}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
