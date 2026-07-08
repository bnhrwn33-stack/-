import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import { exportBackup, importBackup } from '../lib/storage';
import { ALL_TAGS } from '../data/tags';
import SmartImage from '../components/SmartImage';
import { episodePoster, IMAGE_PATHS } from '../lib/art';
import { UploadIcon } from '../components/Icons';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LibraryManager() {
  const { seasons, overrides, setEpisodeOverride, clearEpisodeOverride, customTags, setEpisodeCustomTags } = useLibrary();
  const toast = useToast();
  const all = seasons.flatMap((s) => s.episodes);
  const [selectedKey, setSelectedKey] = useState(all[0]?.key ?? '');
  const importRef = useRef<HTMLInputElement>(null);

  const ep = all.find((e) => e.key === selectedKey);
  const ov = ep ? overrides[ep.key] ?? {} : {};
  const tags = ep ? customTags[ep.key] ?? [] : [];

  const [titleInput, setTitleInput] = useState('');
  const [synopsisInput, setSynopsisInput] = useState('');

  const selectEpisode = (key: string) => {
    setSelectedKey(key);
    const e = all.find((x) => x.key === key);
    const o = e ? overrides[e.key] ?? {} : {};
    setTitleInput(o.title ?? '');
    setSynopsisInput(o.synopsis ?? '');
  };

  const onCoverPick = async (file: File) => {
    if (!ep) return;
    const dataUrl = await fileToDataUrl(file);
    setEpisodeOverride(ep.key, { cover: dataUrl });
    toast.push('🖼️', 'הקאבר עודכן', ep.titleHe);
  };

  const doExport = () => {
    const blob = new Blob([exportBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `got-library-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.push('💾', 'הגיבוי הורד בהצלחה');
  };

  const doImport = async (file: File) => {
    try {
      importBackup(await file.text());
      toast.push('✅', 'הגיבוי יובא בהצלחה', 'רענן את הדף כדי לראות את כל השינויים');
    } catch {
      toast.push('⚠️', 'קובץ הגיבוי אינו תקין');
    }
  };

  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') return;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') toast.push('🔔', 'התראות הופעלו', 'תקבל התראה כשמתגלים פרקים חדשים בסריקה הבאה');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-10">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold gold-text font-display tracking-wide">ניהול הספרייה</h1>
        <p className="text-steel-400 mt-3 text-lg max-w-3xl">
          עריכת מטא-דאטה, קאברים מותאמים אישית, תגיות וגיבויים — הכול נשמר מקומית בדפדפן שלך.
        </p>
        <div className="mt-4 text-xs text-steel-500 glass rounded-lg px-4 py-3 max-w-3xl leading-relaxed">
          ℹ️ זו אפליקציה פרטית ללא שרת — אין כאן "העלאת סרטונים" או "ניהול משתמשים מרוחקים" כמו בפאנל ניהול של אתר עם
          שרת אחורי, כי הווידאו מגיע ישירות מהתיקייה שלך במחשב (או מה-Drive שלך). מה שכן אפשר לנהל כאן: איך הפרקים
          מוצגים, פרופילים (דרך תפריט הפרופיל למעלה), והגדרות הספרייה עצמה.
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* בחירת פרק */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-bold text-steel-300 mb-3">בחר פרק לעריכה</h2>
          <div className="glass rounded-xl max-h-[520px] overflow-y-auto divide-y divide-white/[0.06]">
            {all.map((e) => (
              <button
                key={e.key}
                onClick={() => selectEpisode(e.key)}
                className={`w-full text-right px-3.5 py-2.5 text-sm transition-colors ${
                  selectedKey === e.key ? 'bg-gold-500/15 text-gold-300' : 'text-steel-300 hover:bg-white/[0.05]'
                }`}
              >
                ע{e.season} פ{e.episode} — {overrides[e.key]?.title ?? e.titleHe}
              </button>
            ))}
          </div>
        </div>

        {/* עריכה */}
        {ep && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-5">
              <div className="flex gap-4">
                <div className="w-40 shrink-0 rounded-lg overflow-hidden aspect-video bg-ink-800">
                  <SmartImage
                    src={ov.cover ?? IMAGE_PATHS.episode(ep.season, ep.episode)}
                    fallback={episodePoster(ep.season, ep.episode)}
                    alt={ep.titleHe}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-steel-400 mb-2">עונה {ep.season} · פרק {ep.episode}</p>
                  <label className="btn-ghost !py-2 text-sm inline-flex cursor-pointer">
                    <UploadIcon width={15} height={15} /> העלה קאבר מותאם
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && onCoverPick(e.target.files[0])}
                    />
                  </label>
                  {ov.cover && (
                    <button
                      onClick={() => setEpisodeOverride(ep.key, { cover: undefined })}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors mr-3"
                    >
                      הסר קאבר מותאם
                    </button>
                  )}
                </div>
              </div>

              <label className="block mt-5">
                <span className="text-sm font-medium text-steel-200">כותרת מותאמת (מקורי: {ep.titleHe})</span>
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={() => setEpisodeOverride(ep.key, { title: titleInput || undefined })}
                  placeholder={ep.titleHe}
                  className="mt-1.5 w-full glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60"
                />
              </label>

              <label className="block mt-4">
                <span className="text-sm font-medium text-steel-200">תקציר מותאם</span>
                <textarea
                  value={synopsisInput}
                  onChange={(e) => setSynopsisInput(e.target.value)}
                  onBlur={() => setEpisodeOverride(ep.key, { synopsis: synopsisInput || undefined })}
                  placeholder={ep.synopsis}
                  rows={3}
                  className="mt-1.5 w-full glass rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-gold-600/60 resize-y"
                />
              </label>

              {(ov.title || ov.synopsis) && (
                <button onClick={() => clearEpisodeOverride(ep.key)} className="text-xs text-rose-400 hover:text-rose-300 mt-3 transition-colors">
                  איפוס לברירת המחדל
                </button>
              )}

              <div className="mt-5">
                <span className="text-sm font-medium text-steel-200 block mb-2">תגיות נוספות (קטגוריות אישיות)</span>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TAGS.map((t) => {
                    const active = tags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => setEpisodeCustomTags(ep.key, active ? tags.filter((x) => x !== t) : [...tags, t])}
                        className={`text-xs rounded-full px-3 py-1.5 transition-colors ${active ? 'bg-gold-500 text-ink-950' : 'glass text-steel-300 hover:text-gold-400'}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* גיבוי / ייבוא / התראות */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2">💾 גיבוי הנתונים</h3>
          <p className="text-xs text-steel-500 mb-3 leading-relaxed">מוריד קובץ JSON עם כל ההיסטוריה, הפרופילים, המועדפים והעריכות שלך.</p>
          <button onClick={doExport} className="btn-ghost w-full !py-2 text-sm">הורדת גיבוי</button>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2">📥 ייבוא גיבוי</h3>
          <p className="text-xs text-steel-500 mb-3 leading-relaxed">משחזר נתונים מקובץ גיבוי שהורדת בעבר (למשל אחרי ניקוי דפדפן).</p>
          <button onClick={() => importRef.current?.click()} className="btn-ghost w-full !py-2 text-sm">בחר קובץ גיבוי</button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2">🔔 התראות על תוכן חדש</h3>
          <p className="text-xs text-steel-500 mb-3 leading-relaxed">קבל התראת דפדפן כשסריקה חדשה של הספרייה מוצאת פרקים שלא היו קודם.</p>
          <button onClick={requestNotifications} className="btn-ghost w-full !py-2 text-sm">הפעלת התראות</button>
        </div>
      </div>
    </div>
  );
}
