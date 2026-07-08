import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { houseById, HOUSES, type TreeNode } from '../data/houses';
import { characterById } from '../data/characters';
import { LOCATIONS } from '../data/world';
import SmartImage from '../components/SmartImage';
import { characterPortrait, IMAGE_PATHS } from '../lib/art';

/** צומת בעץ המשפחה — לחיץ אם מקושר לדמות */
function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const inner = (
    <span
      className={`inline-block rounded-lg px-3.5 py-1.5 text-sm border transition-colors ${
        node.characterId
          ? 'glass text-gold-300 border-gold-700/50 hover:bg-gold-500/15'
          : 'bg-white/[0.03] text-steel-300 border-white/10'
      }`}
    >
      {node.name}
      {node.note && <span className="block text-[10px] text-steel-500">{node.note}</span>}
    </span>
  );

  return (
    <li className={depth > 0 ? 'relative pr-6 pt-3 tree-branch' : 'pt-1'}>
      {node.characterId ? <Link to={`/character/${node.characterId}`}>{inner}</Link> : inner}
      {node.children && node.children.length > 0 && (
        <ul className="pr-4 border-r border-gold-700/30 mr-3 mt-1">
          {node.children.map((c) => (
            <TreeNodeView key={c.name} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function HousePage() {
  const { id } = useParams();
  const house = houseById(id ?? '');
  if (!house) return <Navigate to="/houses" replace />;

  const members = house.memberIds.map(characterById).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const seatLocation = LOCATIONS.find((l) => l.houseId === house.id);

  return (
    <div className="pt-16">
      {/* באנר */}
      <div
        className="relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${house.colors[1]}66, transparent 65%)` }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="w-28 h-28 mx-auto rounded-3xl flex items-center justify-center text-7xl border-2 shadow-glow"
            style={{ borderColor: `${house.colors[0]}66`, background: `radial-gradient(circle at 30% 25%, ${house.colors[1]}dd, #0a0a0e)` }}
          >
            {house.sigil}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-bold gold-text font-display mt-6"
          >
            {house.nameHe}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gold-500 italic mt-3"
          >
            "{house.mottoHe}"
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xs text-steel-500 font-display tracking-[0.3em] mt-1" dir="ltr">
            {house.motto}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10 pb-6">
        {/* פרטים */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-5 md:grid-cols-3"
        >
          <div className="glass rounded-xl p-5 md:col-span-2">
            <h3 className="text-sm font-bold text-gold-400 mb-2">על הבית</h3>
            <p className="text-sm text-steel-300 leading-relaxed">{house.description}</p>
          </div>
          <div className="glass rounded-xl p-5 space-y-2.5 text-sm">
            <p><span className="text-steel-500">🏰 מושב:</span> <span className="text-steel-200">{house.seat}</span></p>
            <p><span className="text-steel-500">🗺 אזור שליטה:</span> <span className="text-steel-200">{house.region}</span></p>
            <p><span className="text-steel-500">📜 מייסד:</span> <span className="text-steel-200">{house.founder}</span></p>
            {seatLocation && (
              <Link to={`/map?loc=${seatLocation.id}`} className="inline-block mt-1 text-gold-500 hover:text-gold-300 transition-colors">
                הצג במפה ←
              </Link>
            )}
          </div>
        </motion.div>

        {/* עץ משפחה */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
            עץ המשפחה
          </h2>
          <ul className="text-right">
            <TreeNodeView node={house.tree} />
          </ul>
          <p className="text-xs text-steel-500 mt-3">לחיצה על שם מוזהב פותחת את עמוד הדמות.</p>
        </section>

        {/* חברי הבית */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
            חברי הבית
          </h2>
          {members.length > 0 && (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-5">
              {members.map((m) => (
                <Link key={m.id} to={`/character/${m.id}`} className="group glass rounded-xl overflow-hidden card-hover">
                  <SmartImage
                    src={IMAGE_PATHS.character(m.id)}
                    fallback={characterPortrait(m.nameHe, house.colors[0], house.colors[1])}
                    alt={m.nameHe}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <p className="p-2.5 text-xs font-semibold text-white group-hover:text-gold-400 transition-colors text-center">{m.nameHe}</p>
                </Link>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {house.extraMembers.map((m) => (
              <span key={m} className="text-xs glass rounded-full px-3 py-1.5 text-steel-300">{m}</span>
            ))}
          </div>
        </section>

        {/* בתים נוספים */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded bg-gradient-to-b from-gold-300 to-gold-600 inline-block" />
            בתים נוספים
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {HOUSES.filter((h) => h.id !== house.id).map((h) => (
              <Link
                key={h.id}
                to={`/house/${h.id}`}
                className="glass rounded-full px-4 py-2 text-sm text-steel-300 hover:text-gold-400 hover:border-gold-700/50 transition-colors"
              >
                {h.sigil} {h.nameHe}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
