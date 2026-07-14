import { useRef } from 'react';
import type { JSX } from 'react';
import { PhotoCard } from './PhotoCard';
import type { PhotoCardHandle } from './PhotoCard';
import type { Photo, SwipeDirection } from '../types';

interface SwipeScreenProps {
  readonly roundPhotos: readonly Photo[];
  readonly currentIndex: number;
  readonly roundNumber: number;
  readonly onSwipe: (direction: SwipeDirection) => void;
}

export function SwipeScreen({ roundPhotos, currentIndex, roundNumber, onSwipe }: SwipeScreenProps): JSX.Element | null {
  const cardRef = useRef<PhotoCardHandle>(null);
  const currentPhoto: Photo | undefined = roundPhotos[currentIndex];
  const total: number = roundPhotos.length;

  if (!currentPhoto) {
    return null;
  }

  const progressPercent: number = (currentIndex / total) * 100;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between text-sm text-graphite-400">
          <span>סיבוב {roundNumber}</span>
          <span>
            תמונה {currentIndex + 1} מתוך {total}
          </span>
        </div>
        {/* פס ההתקדמות מתמלא מימין לשמאל, בהתאמה לכיוון ה-RTL */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-graphite-800">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-ember-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <PhotoCard key={currentPhoto.id} ref={cardRef} photo={currentPhoto} onSwiped={onSwipe} />

      <div className="flex items-center justify-center gap-8">
        {/* בכוונה בסדר הזה: תחת dir="rtl" הכפתור הראשון מוצג בצד ימין */}
        <button
          type="button"
          aria-label="בחר תמונה זו"
          onClick={(): void => cardRef.current?.triggerSwipe('right')}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-ember-500 text-2xl font-bold text-graphite-950 shadow-lg shadow-ember-900/40 transition-transform duration-150 hover:bg-ember-400 active:scale-90"
        >
          ✓
        </button>
        <button
          type="button"
          aria-label="פסול תמונה זו"
          onClick={(): void => cardRef.current?.triggerSwipe('left')}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-graphite-600 bg-graphite-900 text-2xl font-bold text-graphite-200 transition-transform duration-150 hover:border-rose-glow hover:text-rose-glow active:scale-90"
        >
          ✕
        </button>
      </div>

      <p className="text-center text-xs text-graphite-400">
        גרור את הכרטיס ימינה כדי לבחור, או שמאלה כדי לפסול
      </p>
    </div>
  );
}
