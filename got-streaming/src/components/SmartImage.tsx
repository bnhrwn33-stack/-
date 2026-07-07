import React, { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback: string;
}

/**
 * תמונה עם טעינה עצלה וגיבוי אוטומטי:
 * מנסה את התמונה האמיתית (מ-public/images), ואם אינה קיימת — עוברת לעטיפה שנוצרה ב-SVG.
 */
export default function SmartImage({ src, fallback, className, alt, ...rest }: Props) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      {...rest}
      src={current}
      alt={alt ?? ''}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      className={`${className ?? ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
