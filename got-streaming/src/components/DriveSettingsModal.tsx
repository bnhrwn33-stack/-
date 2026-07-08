import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { CloseIcon, CrownIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = 'local' | 'drive';

export default function DriveSettingsModal({ open, onClose }: Props) {
  const {
    settings, status, error, connectedCount, connectDrive, disconnectDrive,
    connectLocalDirectory, connectLocalFiles, supportsDirectoryPicker, librarySource, localInfo,
  } = useLibrary();
  const [tab, setTab] = useState<Tab>('local');
  const [folderUrl, setFolderUrl] = useState(settings.folderUrl);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFolderUrl(settings.folderUrl);
      setApiKey(settings.apiKey);
      setLocalError(null);
      setTab(librarySource === 'drive' ? 'drive' : 'local');
    }
  }, [open, settings, librarySource]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submitDrive = async () => {
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

  const pickFolder = async () => {
    setBusy(true);
    setLocalError(null);
    try {
      const result = await connectLocalDirectory();
      // ה-API חסום (למשל בתוך iframe של התצוגה) → נופלים חזרה לבורר הקבצים
      if (result === 'blocked') fileInputRef.current?.click();
    } finally {
      setBusy(false);
    }
  };

  const onFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      connectLocalFiles(e.target.files);
    }
  };

  const TabButton = ({ id, label, icon }: { id: Tab; label: string; icon: string }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
        tab === id ? 'bg-gold-500 text-ink-950 shadow-glow' : 'glass text-steel-300 hover:text-gold-400'
      }`}
    >
      <span className="text-base leading-none">{icon}</span> {label}
    </button>
  );

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CrownIcon className="text-gold-500" width={26} height={26} />
                <h2 className="text-xl font-bold text-white">חיבור ספריית הפרקים</h2>
              </div>
              <button onClick={onClose} className="p-1.5 text-steel-400 hover:text-white transition-colors" aria-label="סגירה">
                <CloseIcon />
              </button>
            </div>

            {/* מצב מחובר */}
            {status === 'ready' && (
              <div className="mb-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-4 py-2.5">
                מחוברים {connectedCount} פרקים {librarySource === 'local' ? 'מהתיקייה במחשב שלך' : 'מ-Google Drive'}.
                {localInfo && localInfo.unsupported > 0 && (
                  <span className="block text-amber-400/90 text-xs mt-1">
                    שים לב: {localInfo.unsupported} קבצים בפורמט שהדפדפן אולי לא ינגן (mkv/avi). מומלץ MP4.
                  </span>
                )}
              </div>
            )}

            {/* טאבים */}
            <div className="flex gap-2 mb-5">
              <TabButton id="local" label="תיקייה במחשב" icon="💻" />
              <TabButton id="drive" label="Google Drive" icon="☁️" />
            </div>

            {tab === 'local' ? (
              <div>
                <p className="text-sm text-steel-400 leading-relaxed">
                  בחר את התיקייה במחשב שמכילה את קובצי הפרקים. האתר יקרא אותם ישירות מהדיסק,
                  יזהה עונות ופרקים לפי שמות הקבצים ויסדר הכול — <b className="text-steel-200">בלי אינטרנט, בלי מפתח, פרטי לגמרי</b>.
                </p>

                <button
                  onClick={pickFolder}
                  disabled={busy}
                  className="btn-gold w-full mt-5 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {busy && status === 'loading' ? 'קורא את התיקייה…' : '📂 בחר תיקיית פרקים'}
                </button>

                {/* גיבוי לדפדפנים ללא File System Access API */}
                <input
                  ref={fileInputRef}
                  type="file"
                  // @ts-expect-error — תכונות לא-סטנדרטיות לבחירת תיקייה
                  webkitdirectory=""
                  directory=""
                  multiple
                  className="hidden"
                  onChange={onFilesPicked}
                />

                <div className="mt-4 text-xs text-steel-500 space-y-1.5 leading-relaxed">
                  <p>✓ שמות נתמכים: <span dir="ltr">S01E01</span>, <span dir="ltr">1x01</span>, "עונה 1 פרק 3", או תיקיית "Season 1" עם הפרקים בפנים.</p>
                  <p>✓ פורמט מומלץ: <b className="text-steel-300">MP4 (H.264)</b> — מתנגן בכל דפדפן. קובצי MKV לרוב לא מתנגנים בדפדפן.</p>
                  {supportsDirectoryPicker
                    ? <p>✓ הדפדפן שלך יזכור את התיקייה ויתחבר אליה אוטומטית בכל פתיחה.</p>
                    : <p>ℹ הדפדפן שלך יבקש לבחור את התיקייה מחדש בכל פתיחה (מגבלת הדפדפן).</p>}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-steel-400 leading-relaxed">
                  הדבק קישור לתיקיית Drive ומפתח API. המערכת תסרוק את התיקייה (כולל תתי-תיקיות) ותסדר הכול אוטומטית.
                </p>

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
                  <span className="text-sm font-medium text-steel-200">מפתח Google API (מתחיל ב-AIza)</span>
                  <input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    dir="ltr"
                    type="password"
                    placeholder="AIzaSy..."
                    className="mt-1.5 w-full glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 transition-colors"
                  />
                </label>

                <button onClick={submitDrive} disabled={busy || !folderUrl || !apiKey} className="btn-gold w-full mt-5 disabled:opacity-40 disabled:pointer-events-none">
                  {busy ? 'סורק את התיקייה…' : 'התחבר וסרוק'}
                </button>
              </div>
            )}

            {(localError || (status === 'error' && error)) && (
              <div className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-2.5">
                {localError ?? error}
              </div>
            )}

            {status === 'ready' && (
              <button
                onClick={() => { disconnectDrive(); setFolderUrl(''); setApiKey(''); }}
                className="btn-ghost w-full mt-3"
              >
                ניתוק הספרייה
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
