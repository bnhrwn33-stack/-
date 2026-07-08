/** אייקוני SVG מוטמעים — ללא תלות חיצונית */
import React from 'react';

type P = React.SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor', ...p });

export const PlayIcon = (p: P) => (
  <svg {...base(p)}><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" /></svg>
);
export const PauseIcon = (p: P) => (
  <svg {...base(p)}><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
);
export const FullscreenIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
);
export const DownloadIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
);
export const LinkIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
export const SearchIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const NextIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 5.14v13.72a1 1 0 0 0 1.5.86l9-5.86-9-5.86-1.5-.86z" transform="translate(2 0) scale(0.85)" /><rect x="17" y="5" width="2.5" height="14" rx="1" /></svg>
);
export const PrevIcon = (p: P) => (
  <svg {...base(p)} style={{ transform: 'scaleX(-1)', ...(p.style ?? {}) }}><path d="M6 5.14v13.72a1 1 0 0 0 1.5.86l9-5.86-9-5.86-1.5-.86z" transform="translate(2 0) scale(0.85)" /><rect x="17" y="5" width="2.5" height="14" rx="1" /></svg>
);
export const VolumeIcon = ({ muted, ...p }: P & { muted?: boolean }) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
    {muted ? <path d="m16 9 6 6M22 9l-6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
  </svg>
);
export const SettingsIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </svg>
);
export const CrownIcon = (p: P) => (
  <svg {...base(p)} viewBox="0 0 64 64"><path d="M8 44 L12 22 L22 34 L32 14 L42 34 L52 22 L56 44 Z" /><rect x="8" y="46" width="48" height="6" rx="2" /></svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
);
export const SpeedIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20a8 8 0 1 1 8-8" /><path d="m12 12 5-5" /><path d="M20 16h2M2 16h2" opacity=".5" /></svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
);
export const BookmarkIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
);
export const TrophyIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4" />
  </svg>
);
export const CalendarIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
);
export const ListIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
);
export const UploadIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
);
export const DiceIcon = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" /><circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" /><circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" /></svg>
);
