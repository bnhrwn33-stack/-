import { useEffect, useRef } from 'react';
import { useUi } from '../../context/UiContext';

/** סמן עכבר מותאם: נקודת זהב + טבעת עוקבת (מסכי מגע מדלגים) */
export default function CustomCursor() {
  const { prefs } = useUi();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prefs.cursor) {
      document.documentElement.classList.remove('custom-cursor');
      return;
    }
    if (window.matchMedia('(pointer: coarse)').matches) return; // מובייל
    document.documentElement.classList.add('custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement;
      const interactive = !!t.closest('a,button,input,[role="button"],summary,textarea');
      ring.style.width = ring.style.height = interactive ? '44px' : '30px';
      ring.style.borderColor = interactive ? 'rgba(240,217,154,0.9)' : 'rgba(201,168,76,0.55)';
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, [prefs.cursor]);

  if (!prefs.cursor) return null;
  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 z-[70] w-1.5 h-1.5 rounded-full bg-gold-300 pointer-events-none hidden md:block" aria-hidden />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[70] w-[30px] h-[30px] rounded-full border pointer-events-none hidden md:block transition-[width,height,border-color] duration-200"
        style={{ borderColor: 'rgba(201,168,76,0.55)' }}
        aria-hidden
      />
    </>
  );
}
