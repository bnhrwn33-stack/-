import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as store from '../lib/storage';
import type { UiPrefs } from '../lib/storage';

interface UiContextValue {
  prefs: UiPrefs;
  setPref: <K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => void;
  cinemaMode: boolean;
  setCinemaMode: (on: boolean) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UiPrefs>(() => store.getPrefs());
  const [cinemaMode, setCinemaMode] = useState(false);

  const setPref = useCallback(<K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => {
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      store.savePrefs(next);
      return next;
    });
  }, []);

  // החלת ערכת הנושא על שורש המסמך
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  return (
    <UiContext.Provider value={{ prefs, setPref, cinemaMode, setCinemaMode }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi חייב לרוץ בתוך UiProvider');
  return ctx;
}
