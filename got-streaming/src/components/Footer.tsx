import { Link } from 'react-router-dom';
import { CrownIcon } from './Icons';
import { SEASONS_META } from '../lib/metadata';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink-900 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <CrownIcon className="text-gold-500" width={34} height={34} />
            <span className="font-display font-bold text-xl gold-text tracking-wide">GAME OF THRONES</span>
          </div>
          <p className="text-sm text-steel-400 leading-relaxed max-w-md">
            ספריית צפייה אישית ופרטית. כל התכנים מוזרמים ישירות מחשבון ה-Google Drive הפרטי שלך —
            שום דבר לא עובר דרך שרת חיצוני.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-steel-200 mb-4">ניווט מהיר</h4>
          <ul className="space-y-2 text-sm text-steel-400">
            <li><Link to="/" className="hover:text-gold-400 transition-colors">עמוד ראשי</Link></li>
            <li><Link to="/seasons" className="hover:text-gold-400 transition-colors">כל העונות</Link></li>
            <li><Link to="/favorites" className="hover:text-gold-400 transition-colors">מועדפים</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-steel-200 mb-4">עונות</h4>
          <ul className="grid grid-cols-4 gap-2 text-sm">
            {SEASONS_META.map((s) => (
              <li key={s.number}>
                <Link
                  to={`/season/${s.number}`}
                  className="flex items-center justify-center w-9 h-9 rounded-md glass text-steel-300 hover:text-gold-400 hover:border-gold-700/50 transition-colors"
                >
                  {s.number}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-steel-500">
          <span>© {new Date().getFullYear()} ספרייה אישית לשימוש פרטי בלבד. Game of Thrones © HBO.</span>
          <span className="font-display tracking-[0.3em] text-gold-700">VALAR MORGHULIS</span>
        </div>
      </div>
    </footer>
  );
}
