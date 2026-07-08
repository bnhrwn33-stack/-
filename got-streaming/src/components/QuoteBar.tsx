import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { randomQuote } from '../data/world';

/** ציטוט אקראי — מתחלף בכל טעינת עמוד */
export default function QuoteBar() {
  const quote = useMemo(() => randomQuote(), []);

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative glass rounded-2xl px-6 sm:px-10 py-8 text-center overflow-hidden"
    >
      <span className="absolute top-2 right-5 text-6xl text-gold-700/30 font-serif select-none" aria-hidden>”</span>
      <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">{quote.he}</p>
      <p className="text-sm text-steel-500 mt-2 font-display tracking-wide" dir="ltr">{quote.en}</p>
      <footer className="mt-3 text-gold-500 text-sm font-semibold">— {quote.by}</footer>
    </motion.blockquote>
  );
}
