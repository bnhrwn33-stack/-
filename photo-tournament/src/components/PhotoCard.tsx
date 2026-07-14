import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { DragEvent, JSX, PointerEvent as ReactPointerEvent } from 'react';
import type { Photo, SwipeDirection } from '../types';

const SWIPE_THRESHOLD_PX = 110;
const EXIT_ANIMATION_MS = 260;

export interface PhotoCardHandle {
  /** מפעיל אנימציית סווייפ יזומה (למשל מלחיצה על כפתור) */
  readonly triggerSwipe: (direction: SwipeDirection) => void;
}

interface PhotoCardProps {
  readonly photo: Photo;
  readonly onSwiped: (direction: SwipeDirection) => void;
}

export const PhotoCard = forwardRef<PhotoCardHandle, PhotoCardProps>(function PhotoCard(
  { photo, onSwiped }: PhotoCardProps,
  ref,
): JSX.Element {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const commitSwipe = (direction: SwipeDirection): void => {
    setIsDragging(false);
    setIsExiting(true);
    const flyOutX: number = direction === 'right' ? window.innerWidth : -window.innerWidth;
    setOffset({ x: flyOutX, y: offset.y });
    window.setTimeout((): void => onSwiped(direction), EXIT_ANIMATION_MS);
  };

  useImperativeHandle(ref, (): PhotoCardHandle => ({
    triggerSwipe: (direction: SwipeDirection): void => commitSwipe(direction),
  }));

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (isExiting) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!dragStart.current || isExiting) return;
    setOffset({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const endDrag = (): void => {
    if (!dragStart.current || isExiting) return;
    dragStart.current = null;
    if (Math.abs(offset.x) > SWIPE_THRESHOLD_PX) {
      commitSwipe(offset.x > 0 ? 'right' : 'left');
    } else {
      setIsDragging(false);
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation: number = offset.x / 18;
  const acceptOpacity: number = Math.min(Math.max(offset.x / SWIPE_THRESHOLD_PX, 0), 1);
  const rejectOpacity: number = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD_PX, 0), 1);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : `transform ${EXIT_ANIMATION_MS}ms ease, opacity ${EXIT_ANIMATION_MS}ms ease`,
        opacity: isExiting ? 0 : 1,
        touchAction: 'none',
      }}
      className="relative aspect-[3/4] w-full max-w-sm cursor-grab select-none overflow-hidden rounded-3xl bg-graphite-800 shadow-2xl shadow-black/50 active:cursor-grabbing"
    >
      <img
        src={photo.url}
        alt={photo.name}
        draggable={false}
        onDragStart={(event: DragEvent<HTMLImageElement>): void => event.preventDefault()}
        className="pointer-events-none h-full w-full object-cover"
      />

      <div
        style={{ opacity: acceptOpacity }}
        className="absolute top-8 right-8 rounded-xl border-4 border-ember-400 px-4 py-1.5 text-2xl font-extrabold text-ember-400 rotate-[-8deg]"
      >
        ✓ נבחרה
      </div>

      <div
        style={{ opacity: rejectOpacity }}
        className="absolute top-8 left-8 rounded-xl border-4 border-rose-glow px-4 py-1.5 text-2xl font-extrabold text-rose-glow rotate-[8deg]"
      >
        ✕ נפסלה
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
});
