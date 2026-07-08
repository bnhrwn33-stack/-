import { useState } from 'react';

interface Props {
  value: number; // 0–5
  onChange?: (stars: number) => void;
  size?: number;
  readonly?: boolean;
}

/** דירוג כוכבים — קריא בלבד או אינטראקטיבי */
export default function RatingStars({ value, onChange, size = 22, readonly }: Props) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="inline-flex items-center gap-0.5" dir="ltr" role={readonly ? undefined : 'radiogroup'}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s === value ? 0 : s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} כוכבים`}
          className={`transition-transform ${readonly ? 'cursor-default' : 'hover:scale-125'}`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24"
            fill={s <= shown ? '#e3c46e' : 'none'}
            stroke={s <= shown ? '#e3c46e' : '#6b7280'} strokeWidth="1.6">
            <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
