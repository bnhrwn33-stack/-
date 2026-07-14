import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, JSX } from 'react';
import type { Photo } from '../types';

const MIN_PHOTOS_TO_START = 2;

interface UploadScreenProps {
  readonly photos: readonly Photo[];
  readonly onAddFiles: (files: readonly File[]) => void;
  readonly onRemovePhoto: (id: string) => void;
  readonly onStart: () => void;
}

export function UploadScreen({ photos, onAddFiles, onRemovePhoto, onStart }: UploadScreenProps): JSX.Element {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDraggingOver(false);
    const files: File[] = Array.from(event.dataTransfer.files).filter((file: File): boolean =>
      file.type.startsWith('image/'),
    );
    if (files.length > 0) {
      onAddFiles(files);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files: File[] = Array.from(event.target.files ?? []).filter((file: File): boolean =>
      file.type.startsWith('image/'),
    );
    if (files.length > 0) {
      onAddFiles(files);
    }
    event.target.value = '';
  };

  const canStart: boolean = photos.length >= MIN_PHOTOS_TO_START;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-widest text-ember-400 uppercase">טורניר תמונות פרופיל</p>
        <h1 className="mt-3 text-3xl font-bold text-graphite-50 sm:text-4xl">מי התמונה הכי טובה שלך?</h1>
        <p className="mt-3 text-graphite-400">העלה כמה תמונות, ותן לטורניר הסווייפ להכריע מי המנצחת</p>
      </div>

      <div
        onDragOver={(event: DragEvent<HTMLDivElement>): void => {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={(): void => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={(): void => fileInputRef.current?.click()}
        className={`w-full cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200 ${
          isDraggingOver
            ? 'border-ember-400 bg-ember-500/10'
            : 'border-graphite-600 bg-graphite-900 hover:border-graphite-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <p className="text-lg font-medium text-graphite-50">גרור לכאן תמונות, או לחץ לבחירה</p>
        <p className="mt-2 text-sm text-graphite-400">אפשר להעלות כמה תמונות שרוצים · JPG, PNG וכו׳</p>
      </div>

      {photos.length > 0 && (
        <div className="w-full">
          <p className="mb-3 text-sm text-graphite-400">{photos.length} תמונות הועלו</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map(
              (photo: Photo): JSX.Element => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-graphite-800">
                  <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(): void => onRemovePhoto(photo.id)}
                    aria-label="הסר תמונה"
                    className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-graphite-950/80 text-graphite-50 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!canStart}
        onClick={onStart}
        className={`w-full rounded-full px-8 py-4 text-lg font-semibold transition-all duration-200 ${
          canStart
            ? 'bg-ember-500 text-graphite-950 hover:bg-ember-400 active:scale-[0.98]'
            : 'cursor-not-allowed bg-graphite-800 text-graphite-400'
        }`}
      >
        {canStart ? 'התחל טורניר' : `נדרשות לפחות ${MIN_PHOTOS_TO_START} תמונות`}
      </button>
    </div>
  );
}
