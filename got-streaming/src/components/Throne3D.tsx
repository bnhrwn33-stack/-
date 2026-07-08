import { useRef, useState } from 'react';

/**
 * כס הברזל בתלת-ממד: שכבות SVG במרחב CSS 3D — גרירה עם העכבר מסובבת את הכס.
 */

function ThroneLayer({ depth, opacity }: { depth: number; opacity: number }) {
  return (
    <svg
      viewBox="0 0 400 460"
      className="absolute inset-0 w-full h-full"
      style={{ transform: `translateZ(${depth}px)`, opacity }}
      aria-hidden
    >
      {Array.from({ length: 26 }, (_, i) => {
        const t = i / 25;
        const x = 40 + t * 320;
        const hh = 110 + 240 * Math.exp(-((t - 0.5) ** 2) / 0.05) + ((i * 91 + depth * 7) % 46);
        const lean = (t - 0.5) * 20;
        return (
          <path
            key={i}
            d={`M${x} 430 L${x - 6 + lean * 0.2} ${430 - hh * 0.9} L${x + lean * 0.3} ${430 - hh} L${x + 6 + lean * 0.4} ${430 - hh * 0.9} Z`}
            fill={`hsl(${36 + (i % 5) * 4}, ${14 + (i % 4) * 6}%, ${9 + (i % 6) + depth / 8}%)`}
            stroke="#2a2416"
            strokeWidth="1"
          />
        );
      })}
      <ellipse cx="200" cy="436" rx="180" ry="18" fill="#000" opacity="0.5" />
    </svg>
  );
}

export default function Throne3D() {
  const [rot, setRot] = useState({ x: -6, y: 0 });
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: rot.x, baseY: rot.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    setRot({
      y: drag.current.baseY + dx * 0.4,
      x: Math.max(-40, Math.min(25, drag.current.baseX - dy * 0.25)),
    });
  };
  const onPointerUp = () => { drag.current = null; };

  return (
    <div className="relative select-none">
      <div
        className="relative mx-auto w-full max-w-md aspect-[4/5] cursor-grab active:cursor-grabbing touch-none"
        style={{ perspective: '900px' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="כס הברזל בתלת-ממד — גרור לסיבוב"
      >
        {/* הילת אור */}
        <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-75" aria-hidden />
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          }}
        >
          {[-60, -30, 0, 30, 60].map((depth, i) => (
            <ThroneLayer key={depth} depth={depth} opacity={0.55 + i * 0.1} />
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-steel-500 mt-2">🖱 גרור כדי לסובב את הכס</p>
    </div>
  );
}
