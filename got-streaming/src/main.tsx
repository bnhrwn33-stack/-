import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// כפיית כיווניות ושפה בזמן ריצה — כדי שהאתר יישאר RTL בכל סביבת אירוח
document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'he');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// רישום Service Worker — התקנה כאפליקציה (PWA) וטעינה מהירה
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
