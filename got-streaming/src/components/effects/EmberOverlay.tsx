import { useEffect, useRef } from 'react';

interface Ember {
  x: number; y: number; r: number; vy: number; vx: number; o: number; hue: number;
}

/** גיצי אש עולים — לאזורים "דרקוניים" (עמוד צפייה, טארגריין) */
export default function EmberOverlay({ density = 26 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let embers: Ember[] = [];

    const spawn = (w: number, h: number): Ember => ({
      x: Math.random() * w,
      y: h + 6 + Math.random() * 40,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.4 + Math.random() * 0.9,
      vx: -0.2 + Math.random() * 0.4,
      o: 0.25 + Math.random() * 0.5,
      hue: 20 + Math.random() * 25,
    });

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      embers = Array.from({ length: density }, () => {
        const e = spawn(canvas.width, canvas.height);
        e.y = Math.random() * canvas.height;
        return e;
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.y * 0.02) * 0.3;
        e.o -= 0.0015;
        if (e.y < -6 || e.o <= 0) embers[i] = spawn(canvas.width, canvas.height);
        ctx.globalAlpha = Math.max(0, e.o);
        ctx.fillStyle = `hsl(${e.hue}, 95%, 60%)`;
        ctx.shadowColor = `hsl(${e.hue}, 95%, 55%)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden />;
}
