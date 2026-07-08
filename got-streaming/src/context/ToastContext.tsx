import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
  id: number;
  icon: string;
  title: string;
  desc?: string;
}

interface ToastContextValue {
  push: (icon: string, title: string, desc?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((icon: string, title: string, desc?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, icon, title, desc }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 items-center pointer-events-none w-full px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className="glass rounded-xl px-5 py-3 shadow-glow flex items-center gap-3 max-w-sm border border-gold-700/40"
            >
              <span className="text-2xl leading-none shrink-0">{t.icon}</span>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm">{t.title}</p>
                {t.desc && <p className="text-xs text-steel-400 mt-0.5">{t.desc}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast חייב לרוץ בתוך ToastProvider');
  return ctx;
}
