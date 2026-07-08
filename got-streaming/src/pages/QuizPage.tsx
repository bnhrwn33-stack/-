import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SORTING_QUIZ, TRIVIA } from '../data/quizzes';
import { HOUSES, houseById } from '../data/houses';
import { Link } from 'react-router-dom';

/** חידון טריוויה */
function TriviaQuiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = TRIVIA[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= TRIVIA.length) setDone(true);
    else { setIdx(idx + 1); setPicked(null); }
  };

  const restart = () => { setIdx(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / TRIVIA.length) * 100);
    const title = pct >= 90 ? '🏆 מייסטר של הציטדל!' : pct >= 70 ? '⚔️ אביר ראוי' : pct >= 40 ? '🛡 בן אצולה מתחיל' : '❄️ You know nothing…';
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-10 text-center">
        <p className="text-3xl font-bold gold-text font-display mb-2">{title}</p>
        <p className="text-steel-300 text-lg">ענית נכון על {score} מתוך {TRIVIA.length} שאלות ({pct}%)</p>
        <button onClick={restart} className="btn-gold mt-6">נסה שוב</button>
      </motion.div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs text-steel-500 mb-5">
        <span>שאלה {idx + 1} מתוך {TRIVIA.length}</span>
        <span>ניקוד: {score}</span>
      </div>
      <div className="h-1 rounded bg-white/10 mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-l from-gold-300 to-gold-600 transition-all duration-500" style={{ width: `${(idx / TRIVIA.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.25 }}>
          <h2 className="text-xl font-bold text-white mb-5">{q.q}</h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {q.options.map((opt, i) => {
              let cls = 'glass text-steel-200 hover:bg-white/[0.08]';
              if (picked !== null) {
                if (i === q.answer) cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                else if (i === picked) cls = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                else cls = 'glass text-steel-500 opacity-60';
              }
              return (
                <button key={opt} onClick={() => pick(i)} className={`rounded-xl border border-white/10 px-4 py-3 text-sm text-right transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-steel-400 bg-white/[0.04] rounded-lg p-3.5">
              {q.explain}
            </motion.div>
          )}
          <div className="mt-5 text-left">
            <button onClick={next} disabled={picked === null} className="btn-gold !px-6 !py-2 text-sm disabled:opacity-40 disabled:pointer-events-none">
              {idx + 1 >= TRIVIA.length ? 'לתוצאה' : 'הבא ←'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** מחשבון "לאיזה בית אתה שייך?" */
function SortingQuiz() {
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const result = useMemo(() => {
    if (!done) return null;
    const sorted = Object.entries(points).sort((a, b) => b[1] - a[1]);
    return houseById(sorted[0]?.[0] ?? 'stark') ?? HOUSES[0];
  }, [done, points]);

  const pick = (optionPoints: Record<string, number>) => {
    const next = { ...points };
    for (const [houseId, p] of Object.entries(optionPoints)) {
      next[houseId] = (next[houseId] ?? 0) + p;
    }
    setPoints(next);
    if (idx + 1 >= SORTING_QUIZ.length) setDone(true);
    else setIdx(idx + 1);
  };

  const restart = () => { setIdx(0); setPoints({}); setDone(false); };

  if (done && result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-10 text-center">
        <div
          className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-6xl border-2 shadow-glow mb-5"
          style={{ borderColor: `${result.colors[0]}66`, background: `radial-gradient(circle at 30% 25%, ${result.colors[1]}dd, #0a0a0e)` }}
        >
          {result.sigil}
        </div>
        <p className="text-steel-400 text-sm">אתה שייך ל…</p>
        <p className="text-3xl font-bold gold-text font-display mt-1">{result.nameHe}</p>
        <p className="text-gold-500 italic mt-2">"{result.mottoHe.split(' (')[0]}"</p>
        <p className="text-sm text-steel-400 mt-4 max-w-md mx-auto leading-relaxed">{result.description}</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to={`/house/${result.id}`} className="btn-gold !px-5 !py-2 text-sm">לעמוד הבית</Link>
          <button onClick={restart} className="btn-ghost !px-5 !py-2 text-sm">שוב</button>
        </div>
      </motion.div>
    );
  }

  const q = SORTING_QUIZ[idx];
  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs text-steel-500 mb-5">
        <span>שאלה {idx + 1} מתוך {SORTING_QUIZ.length}</span>
        <span>🐺 🦁 🐉 🦑</span>
      </div>
      <div className="h-1 rounded bg-white/10 mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-l from-gold-300 to-gold-600 transition-all duration-500" style={{ width: `${(idx / SORTING_QUIZ.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.25 }}>
          <h2 className="text-xl font-bold text-white mb-5">{q.q}</h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => pick(opt.points)}
                className="glass rounded-xl border border-white/10 px-4 py-3.5 text-sm text-right text-steel-200 hover:bg-gold-500/10 hover:border-gold-700/50 transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function QuizPage() {
  const [tab, setTab] = useState<'trivia' | 'sorting'>('trivia');

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-10 min-h-[70vh]">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">חידוני הממלכה</h1>
        <p className="text-steel-400 mt-3 text-lg">בדוק את הידע שלך — וגלה לאיזה בית אתה באמת שייך.</p>
      </motion.header>

      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setTab('trivia')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${tab === 'trivia' ? 'bg-gold-500 text-ink-950 shadow-glow' : 'glass text-steel-300 hover:text-gold-400'}`}
        >
          🧠 טריוויה
        </button>
        <button
          onClick={() => setTab('sorting')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${tab === 'sorting' ? 'bg-gold-500 text-ink-950 shadow-glow' : 'glass text-steel-300 hover:text-gold-400'}`}
        >
          🏰 לאיזה בית אתה שייך?
        </button>
      </div>

      {tab === 'trivia' ? <TriviaQuiz /> : <SortingQuiz />}
    </div>
  );
}
