import { useEffect, useRef } from 'react';
import { useUi } from '../../context/UiContext';

interface Flake {
  x: number; y: number; r: number; vy: number; vx: number; o: number;
}

/** שלג עדין שיורד על כל האתר — "החורף מגיע" */
export default function SnowOverlay() {
  const { prefs } = useUi();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!prefs.snow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let flakes: Flake[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor(window.innerWidth / 16));
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 2,
        vy: 0.25 + Math.random() * 0.7,
        vx: -0.15 + Math.random() * 0.3,
        o: 0.15 + Math.random() * 0.4,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e8eef5';
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.y * 0.01) * 0.2;
        if (f.y > canvas.height + 4) { f.y = -4; f.x = Math.random() * canvas.width; }
        if (f.x < -4) f.x = canvas.width + 4;
        if (f.x > canvas.width + 4) f.x = -4;
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [prefs.snow]);

  if (!prefs.snow) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden
    />
  );
}
