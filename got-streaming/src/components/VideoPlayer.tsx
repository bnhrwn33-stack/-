import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Episode } from '../types';
import { useLibrary } from '../context/LibraryContext';
import {
  CheckIcon, FullscreenIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, SpeedIcon, VolumeIcon,
} from './Icons';
import { useUi } from '../context/UiContext';

interface Props {
  episode: Episode;
  onNext?: () => void;
  onPrev?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function fmt(t: number): string {
  if (!isFinite(t)) return '0:00';
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideoPlayer({ episode, onNext, onPrev }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const { progress, reportProgress, toggleWatched, watched } = useLibrary();
  const { cinemaMode, setCinemaMode } = useUi();

  const [sourceIdx, setSourceIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [menu, setMenu] = useState<null | 'speed' | 'quality'>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [resumeAt, setResumeAt] = useState<number | null>(null);

  const source = episode.sources[sourceIdx] ?? episode.sources[0];
  const hasVideo = episode.sources.length > 0;

  // איפוס במעבר פרק
  useEffect(() => {
    setSourceIdx(0);
    setFailed(false);
    setLoading(true);
    setTime(0);
    setDuration(0);
    const saved = progress[episode.key];
    setResumeAt(saved && saved.time > 30 && saved.time < saved.duration * 0.95 ? saved.time : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.key]);

  const poke = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
      setMenu(null);
    }, 2800);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  // שמירת התקדמות כל 5 שניות
  useEffect(() => {
    const iv = setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused && v.duration > 0) {
        reportProgress(episode.key, v.currentTime, v.duration);
        // סימון אוטומטי כ"נצפה" אחרי 90%
        if (v.currentTime / v.duration > 0.9 && !watched.includes(episode.key)) {
          toggleWatched(episode.key);
        }
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [episode.key, reportProgress, toggleWatched, watched]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
    poke();
  }, [poke]);

  const seekBy = useCallback((delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    poke();
  }, [poke]);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen?.();
  }, []);

  const togglePip = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch { /* הדפדפן סירב */ }
  }, []);

  // קיצורי מקלדת
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          seekBy(-10);
          break;
        case 'ArrowRight':
          seekBy(10);
          break;
        case 'ArrowUp': {
          e.preventDefault();
          const v = videoRef.current;
          if (v) { v.volume = Math.min(1, v.volume + 0.1); setVolume(v.volume); }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const v = videoRef.current;
          if (v) { v.volume = Math.max(0, v.volume - 0.1); setVolume(v.volume); }
          break;
        }
        case 'f':
          toggleFullscreen();
          break;
        case 'm': {
          const v = videoRef.current;
          if (v) { v.muted = !v.muted; setMuted(v.muted); }
          break;
        }
        case 'n':
          onNext?.();
          break;
        case 'p':
          onPrev?.();
          break;
        case 'i':
          togglePip();
          break;
        case 'c':
          setCinemaMode(!cinemaMode);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, seekBy, toggleFullscreen, onNext, onPrev, togglePip, cinemaMode, setCinemaMode]);

  // יציאה ממצב קולנוע כשעוזבים את העמוד
  useEffect(() => () => setCinemaMode(false), [setCinemaMode]);

  if (!hasVideo) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden glass flex flex-col items-center justify-center text-center p-8">
        <p className="text-2xl font-display gold-text font-bold mb-3">הפרק עדיין לא מחובר</p>
        <p className="text-steel-400 max-w-md leading-relaxed">
          חבר את תיקיית ה-Google Drive שלך דרך כפתור ההגדרות למעלה, והפרק יופיע כאן אוטומטית.
        </p>
      </div>
    );
  }

  // גיבוי: נגן ה-iframe של Drive כשההזרמה הישירה נכשלת
  if (failed && source.previewUrl) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={source.previewUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          title={`עונה ${episode.season} פרק ${episode.episode}`}
        />
        <div className="absolute top-2 right-2 text-[11px] bg-ink-950/80 text-steel-400 rounded px-2 py-1">
          מוצג בנגן Drive (הזרמה ישירה לא זמינה)
        </div>
      </div>
    );
  }

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      dir="ltr"
      className={`relative aspect-video rounded-xl overflow-hidden bg-black group/player select-none ${cinemaMode ? 'z-50' : ''}`}
      onMouseMove={poke}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        key={source.id}
        src={source.streamUrl}
        className="absolute inset-0 w-full h-full"
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => { setPlaying(true); poke(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onLoadedData={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onError={() => setFailed(true)}
        onEnded={() => {
          toggleWatched(episode.key);
          onNext?.();
        }}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
        }}
      />

      {/* ספינר טעינה */}
      <AnimatePresence>
        {loading && !failed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-14 h-14 rounded-full border-[3px] border-gold-700/40 border-t-gold-400 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* הצעת "המשך צפייה" */}
      <AnimatePresence>
        {resumeAt !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            dir="rtl"
            className="absolute bottom-24 right-4 z-10 glass rounded-xl p-4 flex items-center gap-3 shadow-card"
          >
            <span className="text-sm text-steel-200">להמשיך מ-{fmt(resumeAt)}?</span>
            <button
              className="btn-gold !px-4 !py-1.5 text-sm"
              onClick={() => {
                const v = videoRef.current;
                if (v) { v.currentTime = resumeAt; v.play(); }
                setResumeAt(null);
              }}
            >
              המשך
            </button>
            <button
              className="btn-ghost !px-4 !py-1.5 text-sm"
              onClick={() => setResumeAt(null)}
            >
              מההתחלה
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* פקדים */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-3 px-4"
          >
            {/* פס התקדמות */}
            <div className="relative h-5 flex items-center mb-1 group/seek">
              <div className="absolute inset-x-0 h-[5px] rounded bg-white/15 overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${bufPct}%` }} />
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 to-gold-400" style={{ width: `${pct}%` }} />
              </div>
              <input
                type="range"
                className="seek absolute inset-x-0 w-full bg-transparent"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={(e) => {
                  const v = videoRef.current;
                  if (v) v.currentTime = +e.target.value;
                  setTime(+e.target.value);
                }}
                aria-label="פס התקדמות"
              />
            </div>

            <div className="flex items-center gap-1.5 text-white">
              {onPrev && (
                <button onClick={onPrev} title="פרק קודם (P)" className="p-2 rounded hover:bg-white/15 transition-colors">
                  <PrevIcon />
                </button>
              )}
              <button onClick={togglePlay} title="נגן/השהה (רווח)" className="p-2 rounded hover:bg-white/15 transition-colors">
                {playing ? <PauseIcon width={24} height={24} /> : <PlayIcon width={24} height={24} />}
              </button>
              {onNext && (
                <button onClick={onNext} title="הפרק הבא (N)" className="p-2 rounded hover:bg-white/15 transition-colors">
                  <NextIcon />
                </button>
              )}

              {/* ווליום */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={() => {
                    const v = videoRef.current;
                    if (v) { v.muted = !v.muted; setMuted(v.muted); }
                  }}
                  title="השתקה (M)"
                  className="p-2 rounded hover:bg-white/15 transition-colors"
                >
                  <VolumeIcon muted={muted || volume === 0} />
                </button>
                <input
                  type="range"
                  className="seek w-0 opacity-0 group-hover/vol:w-20 group-hover/vol:opacity-100 transition-all duration-300 bg-white/20 rounded"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = videoRef.current;
                    if (v) { v.volume = +e.target.value; v.muted = false; }
                    setVolume(+e.target.value);
                    setMuted(false);
                  }}
                  aria-label="עוצמת קול"
                />
              </div>

              <span className="text-xs text-steel-300 tabular-nums ms-1">
                {fmt(time)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              {/* מהירות */}
              <div className="relative">
                <button
                  onClick={() => setMenu(menu === 'speed' ? null : 'speed')}
                  title="מהירות ניגון"
                  className={`p-2 rounded hover:bg-white/15 transition-colors flex items-center gap-1 text-xs ${speed !== 1 ? 'text-gold-400' : ''}`}
                >
                  <SpeedIcon /> {speed}×
                </button>
                {menu === 'speed' && (
                  <div className="absolute bottom-11 right-0 glass rounded-lg py-1.5 min-w-[90px] shadow-card">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          const v = videoRef.current;
                          if (v) v.playbackRate = s;
                          setSpeed(s);
                          setMenu(null);
                        }}
                        className={`w-full px-4 py-1.5 text-xs text-left hover:bg-white/10 transition-colors ${s === speed ? 'text-gold-400' : 'text-steel-200'}`}
                      >
                        {s === speed && <CheckIcon width={12} height={12} className="inline mr-1" />} {s}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* מצב קולנוע */}
              <button
                onClick={() => setCinemaMode(!cinemaMode)}
                title="מצב קולנוע (C)"
                className={`p-2 rounded hover:bg-white/15 transition-colors ${cinemaMode ? 'text-gold-400' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 5l4 4M22 5l-4 4" opacity=".6" />
                </svg>
              </button>

              {/* Picture in Picture */}
              <button onClick={togglePip} title="מסך צף — Picture in Picture (I)" className="p-2 rounded hover:bg-white/15 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <rect x="12" y="12" width="8" height="6" rx="1" fill="currentColor" stroke="none" />
                </svg>
              </button>

              {/* איכות */}
              {episode.sources.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setMenu(menu === 'quality' ? null : 'quality')}
                    title="איכות"
                    className="p-2 rounded hover:bg-white/15 transition-colors text-xs font-semibold"
                  >
                    {source.label}
                  </button>
                  {menu === 'quality' && (
                    <div className="absolute bottom-11 right-0 glass rounded-lg py-1.5 min-w-[100px] shadow-card">
                      {episode.sources.map((s, i) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            const t = videoRef.current?.currentTime ?? 0;
                            setSourceIdx(i);
                            setMenu(null);
                            // שחזור מיקום אחרי החלפת מקור
                            setTimeout(() => {
                              const v = videoRef.current;
                              if (v) { v.currentTime = t; v.play(); }
                            }, 120);
                          }}
                          className={`w-full px-4 py-1.5 text-xs text-left hover:bg-white/10 transition-colors ${i === sourceIdx ? 'text-gold-400' : 'text-steel-200'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={toggleFullscreen} title="מסך מלא (F)" className="p-2 rounded hover:bg-white/15 transition-colors">
                <FullscreenIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
