import type { JSX } from 'react';
import type { Photo } from '../types';

interface RoundSummaryScreenProps {
  readonly roundNumber: number;
  readonly selected: readonly Photo[];
  readonly rejected: readonly Photo[];
  readonly onContinue: () => void;
}

export function RoundSummaryScreen({
  roundNumber,
  selected,
  rejected,
  onContinue,
}: RoundSummaryScreenProps): JSX.Element {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-widest text-ember-400 uppercase">סוף סיבוב {roundNumber}</p>
        <h2 className="mt-3 text-2xl font-bold text-graphite-50 sm:text-3xl">
          נבחרו {selected.length} תמונות · נפסלו {rejected.length} תמונות
        </h2>
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember-500 text-sm font-bold text-graphite-950">
              ✓
            </span>
            <p className="text-sm font-medium text-graphite-200">נבחרו ({selected.length})</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {selected.map(
              (photo: Photo): JSX.Element => (
                <div
                  key={photo.id}
                  className="aspect-square overflow-hidden rounded-xl ring-2 ring-ember-500/60"
                >
                  <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-graphite-600 text-sm font-bold text-graphite-400">
              ✕
            </span>
            <p className="text-sm font-medium text-graphite-400">נפסלו ({rejected.length})</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {rejected.map(
              (photo: Photo): JSX.Element => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-xl opacity-40 grayscale">
                  <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full max-w-sm rounded-full bg-ember-500 px-8 py-4 text-lg font-semibold text-graphite-950 transition-all duration-200 hover:bg-ember-400 active:scale-[0.98]"
      >
        המשך לסיבוב הבא
      </button>
    </div>
  );
}
