import type { ButtonHTMLAttributes } from 'react';

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; tone?: 'ink' | 'accent' };

export function Chip({ active = false, tone = 'ink', className = '', ...rest }: ChipProps) {
  const on = tone === 'accent' ? 'bg-accent-soft text-accent border-transparent' : 'bg-fg text-bg border-transparent';
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex h-7 items-center gap-1.5 rounded-pill border px-[11px] text-[12.5px] font-semibold whitespace-nowrap cursor-pointer ${active ? on : 'border-line bg-panel text-fg-2 hover:border-line-strong'} ${className}`}
      {...rest}
    />
  );
}
