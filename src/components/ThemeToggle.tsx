import { useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export const THEME_STORAGE_KEY = 'theme';

const ICON = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: 'light', label: '라이트', icon: <svg {...ICON}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> },
  { value: 'dark', label: '다크', icon: <svg {...ICON}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg> },
  { value: 'system', label: '시스템', icon: <svg {...ICON}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg> },
];

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
}

/** <html data-theme> 적용. 토큰(theme.css)이 data-theme만 보므로 이것만 바꾸면 된다. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = resolveTheme(theme);
}

export function readTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {}
  return 'system';
}

/** FOUC 방지용. 앱 index.html <head>에 <script>{THEME_SCRIPT}</script> 로 넣는다. */
export const THEME_SCRIPT = `(()=>{try{var v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var t=v==='light'||v==='dark'?v:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}})()`;

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const t = readTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  function change(next: Theme) {
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
    applyTheme(next);
  }

  return (
    <div role="radiogroup" aria-label="테마 선택" className={`inline-flex items-center gap-0.5 rounded-pill border border-line bg-panel-2 p-0.5 ${className}`}>
      {OPTIONS.map((o) => {
        const active = o.value === theme;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => change(o.value)}
            className={`grid size-6 cursor-pointer place-items-center rounded-pill border-0 ${active ? 'bg-[var(--seg-active)] text-fg shadow-[var(--seg-shadow)]' : 'bg-transparent text-fg-3 hover:text-fg'}`}
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}
