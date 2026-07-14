import type { JSX } from 'react';
import type { Photo } from '../types';

interface WinnerScreenProps {
  readonly winner: Photo;
  readonly onRestart: () => void;
}

export function WinnerScreen({ winner, onRestart }: WinnerScreenProps): JSX.Element {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* זוהר רקע פועם מאחורי התמונה המנצחת */}
      <div
        aria-hidden="true"
        className="animate-glow-pulse pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/30 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <p className="animate-fade-in-up text-sm font-semibold tracking-[0.3em] text-ember-400 uppercase">
          יש לנו מנצחת
        </p>

        <div className="animate-winner-reveal relative w-full">
          <div className="absolute inset-0 -z-10 scale-105 rounded-[2rem] bg-gradient-to-b from-ember-500/40 to-transparent blur-2xl" />
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[2rem] ring-4 ring-ember-400/80 shadow-2xl shadow-ember-900/50">
            <img src={winner.url} alt={winner.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-extrabold text-graphite-50 sm:text-4xl">זו התמונה שלך</h1>
          <p className="mt-2 text-graphite-400">היא ניצחה את כל השאר, סיבוב אחרי סיבוב</p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="animate-fade-in-up w-full rounded-full bg-ember-500 px-8 py-4 text-lg font-semibold text-graphite-950 transition-all duration-200 hover:bg-ember-400 active:scale-[0.98]"
          style={{ animationDelay: '0.35s' }}
        >
          התחל מחדש
        </button>
      </div>
    </div>
  );
}
