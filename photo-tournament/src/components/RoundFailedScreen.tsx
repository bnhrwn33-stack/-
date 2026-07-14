import type { JSX } from 'react';

interface RoundFailedScreenProps {
  readonly onRetry: () => void;
}

export function RoundFailedScreen({ onRetry }: RoundFailedScreenProps): JSX.Element {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-glow/50 text-3xl text-rose-glow">
        ✕
      </div>
      <div>
        <h2 className="text-2xl font-bold text-graphite-50">לא נבחרה אף תמונה</h2>
        <p className="mt-2 text-graphite-400">אי אפשר לפסול את כולן. נסה שוב את הסיבוב הזה.</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-ember-500 px-8 py-4 text-lg font-semibold text-graphite-950 transition-all duration-200 hover:bg-ember-400 active:scale-[0.98]"
      >
        נסה שוב
      </button>
    </div>
  );
}
