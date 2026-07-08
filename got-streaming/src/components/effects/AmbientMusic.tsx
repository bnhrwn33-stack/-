import { useEffect, useRef } from 'react';
import { useUi } from '../../context/UiContext';

/**
 * מוזיקת רקע אווירתית: אם קיים קובץ /audio/theme.mp3 — הוא ינוגן בלולאה;
 * אחרת נוצר דרון אמביינטי עדין ב-WebAudio (ללא קבצים חיצוניים).
 */
export default function AmbientMusic() {
  const { prefs } = useUi();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopSynthRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!prefs.music) {
      audioRef.current?.pause();
      stopSynthRef.current?.();
      stopSynthRef.current = null;
      return;
    }

    let cancelled = false;

    const startSynth = () => {
      if (cancelled || stopSynthRef.current) return;
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = ctxRef.current ?? new Ctor();
      ctxRef.current = ctx;
      ctx.resume().catch(() => {});

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 4);

      // דרון בסולם רה מינור — צליל "כלי קשת" עמום
      const freqs = [73.42, 110, 146.83, 220]; // D2, A2, D3, A3
      const nodes: OscillatorNode[] = [];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.5 : 0.22;
        // ויברטו איטי
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.06 + i * 0.03;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 1.2;
        lfo.connect(lfoGain).connect(osc.frequency);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;
        osc.connect(g).connect(filter).connect(master);
        osc.start();
        lfo.start();
        nodes.push(osc, lfo);
      });

      stopSynthRef.current = () => {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        setTimeout(() => nodes.forEach((n) => { try { n.stop(); } catch { /* כבר נעצר */ } }), 1400);
      };
    };

    // ניסיון ראשון: קובץ אודיו אמיתי מהמשתמש
    const audio = new Audio('/audio/theme.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    audio.play().catch(() => {
      // אין קובץ או שהדפדפן דורש אינטראקציה — נחכה לקליק ראשון ואז סינתזה
      const onFirstClick = () => startSynth();
      window.addEventListener('pointerdown', onFirstClick, { once: true });
    });
    audio.addEventListener('error', () => startSynth());

    return () => {
      cancelled = true;
      audio.pause();
      stopSynthRef.current?.();
      stopSynthRef.current = null;
    };
  }, [prefs.music]);

  return null;
}
