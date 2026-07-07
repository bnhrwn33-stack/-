import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { CloseIcon, CrownIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DriveSettingsModal({ open, onClose }: Props) {
  const { settings, status, error, connectedCount, connectDrive, disconnectDrive } = useLibrary();
  const [folderUrl, setFolderUrl] = useState(settings.folderUrl);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setLocalError(null);
    try {
      await connectDrive({ folderUrl, apiKey });
      onClose();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'שגיאה לא צפויה');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-lg flex items-start sm:items-center justify-center overflow-y-auto p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass rounded-2xl p-6 sm:p-8 my-12 shadow-card"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <CrownIcon className="text-gold-500" width={26} height={26} />
                <h2 className="text-xl font-bold text-white">חיבור ספריית Google Drive</h2>
              </div>
              <button onClick={onClose} className="p-1.5 text-steel-400 hover:text-white transition-colors" aria-label="סגירה">
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm text-steel-400 leading-relaxed mt-2">
              הדבק קישור לתיקיית ה-Drive שמכילה את קובצי הפרקים. המערכת תסרוק אותה (כולל תתי-תיקיות),
              תזהה עונות ופרקים לפי שמות הקבצים (S01E01, "עונה 1 פרק 1"...) ותסדר הכול אוטומטית.
            </p>

            {status === 'ready' && (
              <div className="mt-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-4 py-2.5">
                מחוברים {connectedCount} פרקים מהספרייה שלך.
              </div>
            )}

            <label className="block mt-5">
              <span className="text-sm font-medium text-steel-200">קישור לתיקיית Drive</span>
              <input
                value={folderUrl}
                onChange={(e) => setFolderUrl(e.target.value)}
                dir="ltr"
                placeholder="https://drive.google.com/drive/folders/..."
                className="mt-1.5 w-full glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 transition-colors"
              />
            </label>

            <label className="block mt-4">
              <span className="text-sm font-medium text-steel-200">מפתח Google API</span>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                dir="ltr"
                type="password"
                placeholder="AIza..."
                className="mt-1.5 w-full glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 transition-colors"
              />
            </label>

            <details className="mt-4 text-sm text-steel-400">
              <summary className="cursor-pointer text-gold-500 hover:text-gold-400 transition-colors select-none">
                איך משיגים מפתח API? (חינם, 2 דקות)
              </summary>
              <ol className="mt-2 pr-5 space-y-1.5 list-decimal leading-relaxed">
                <li>היכנס אל <span dir="ltr" className="text-steel-300">console.cloud.google.com</span> וצור פרויקט חדש.</li>
                <li>בתפריט APIs & Services הפעל את <b>Google Drive API</b>.</li>
                <li>תחת Credentials צור <b>API Key</b> והעתק אותו לכאן.</li>
                <li>ודא שתיקיית הפרקים משותפת כ"כל מי שיש לו את הקישור" (Anyone with the link).</li>
              </ol>
              <p className="mt-2 text-xs text-steel-500">
                המפתח נשמר מקומית בדפדפן שלך בלבד ומשמש רק לקריאת התיקייה שלך.
              </p>
            </details>

            {(localError || (status === 'error' && error)) && (
              <div className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-2.5">
                {localError ?? error}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button onClick={submit} disabled={busy || !folderUrl || !apiKey} className="btn-gold flex-1 disabled:opacity-40 disabled:pointer-events-none">
                {busy ? 'סורק את התיקייה…' : 'התחבר וסרוק'}
              </button>
              {status === 'ready' && (
                <button
                  onClick={() => { disconnectDrive(); setFolderUrl(''); setApiKey(''); }}
                  className="btn-ghost"
                >
                  ניתוק
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
