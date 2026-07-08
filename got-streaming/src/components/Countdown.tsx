import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTDOWN_TARGET, COUNTDOWN_TITLE } from '../lib/config';

/**
 * ספירה לאחור לאירוע/עונה חדשה — מוצגת רק אם הוגדר תאריך עתידי ב-config.ts.
 */
export default function Countdown() {
  const target = COUNTDOWN_TARGET ? new Date(COUNTDOWN_TARGET).getTime() : null;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!target) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [target]);

  if (!target || target <= now) return null;

  const diff = target - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const Cell = ({ v, label }: { v: number; label: string }) => (
    <div className="glass rounded-xl px-4 py-3 min-w-[70px] text-center">
      <p className="text-2xl sm:text-3xl font-bold gold-text font-display tabular-nums">{String(v).padStart(2, '0')}</p>
      <p className="text-[11px] text-steel-500 mt-0.5">{label}</p>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 sm:p-8 text-center"
    >
      <p className="font-display tracking-[0.4em] text-gold-500 text-xs mb-4">{COUNTDOWN_TITLE}</p>
      <div className="flex justify-center gap-3 flex-wrap" dir="ltr">
        <Cell v={d} label="ימים" />
        <Cell v={h} label="שעות" />
        <Cell v={m} label="דקות" />
        <Cell v={s} label="שניות" />
      </div>
    </motion.section>
  );
}
