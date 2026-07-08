import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as store from '../lib/storage';
import type { UiPrefs } from '../lib/storage';

interface UiContextValue {
  prefs: UiPrefs;
  setPref: <K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => void;
  cinemaMode: boolean;
  setCinemaMode: (on: boolean) => void;
  theaterMode: boolean;
  setTheaterMode: (on: boolean) => void;
  kidsMode: boolean;
  setKidsMode: (on: boolean) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export const ACCENTS = {
  gold: { name: 'זהב הכס', primary: '#c9a84c', light: '#f0d99a', dark: '#7d6229' },
  stark: { name: 'צפון (סטארק)', primary: '#8e96a3', light: '#d9dde3', dark: '#3a4351' },
  lannister: { name: 'לאניסטר', primary: '#e3c46e', light: '#f5dfa0', dark: '#8f1d22' },
  targaryen: { name: 'טארגריין', primary: '#d64545', light: '#ef7a7a', dark: '#5c1414' },
  tyrell: { name: 'טירל', primary: '#7fae6f', light: '#a8d199', dark: '#274d2c' },
} as const;

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UiPrefs>(() => store.getPrefs());
  const [cinemaMode, setCinemaMode] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [kidsMode, setKidsModeState] = useState(false);

  const setPref = useCallback(<K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => {
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      store.savePrefs(next);
      return next;
    });
  }, []);

  // החלת ערכת הנושא וה-accent על שורש המסמך
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    document.documentElement.dataset.accent = prefs.accent;
    const a = ACCENTS[prefs.accent];
    const root = document.documentElement.style;
    const rgb = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
    };
    const mix = (h1: string, h2: string, t: number) => {
      const n1 = parseInt(h1.slice(1), 16);
      const n2 = parseInt(h2.slice(1), 16);
      const c = (shift: number) => {
        const a1 = (n1 >> shift) & 255;
        const a2 = (n2 >> shift) & 255;
        return Math.round(a1 + (a2 - a1) * t);
      };
      return `${c(16)} ${c(8)} ${c(0)}`;
    };
    root.setProperty('--gold-300-rgb', rgb(a.light));
    root.setProperty('--gold-400-rgb', mix(a.light, a.primary, 0.5));
    root.setProperty('--gold-500-rgb', rgb(a.primary));
    root.setProperty('--gold-600-rgb', mix(a.primary, a.dark, 0.5));
    root.setProperty('--gold-700-rgb', rgb(a.dark));
  }, [prefs.theme, prefs.accent]);

  useEffect(() => {
    document.documentElement.classList.toggle('kids-mode', kidsMode);
  }, [kidsMode]);

  const setKidsMode = useCallback((on: boolean) => setKidsModeState(on), []);

  return (
    <UiContext.Provider value={{ prefs, setPref, cinemaMode, setCinemaMode, theaterMode, setTheaterMode, kidsMode, setKidsMode }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi חייב לרוץ בתוך UiProvider');
  return ctx;
}
