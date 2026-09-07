import type { HTMLAttributes } from 'react';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'ok' | 'warn' | 'danger' | 'accent' };

const TONE = {
  neutral: 'border border-line bg-panel-2 text-fg-2',
  ok: 'bg-ok/15 text-ok',
  warn: 'bg-warn/15 text-warn',
  danger: 'bg-danger-soft text-danger',
  accent: 'bg-accent-soft text-accent',
};

export function Badge({ tone = 'neutral', className = '', ...rest }: BadgeProps) {
  return <span className={`inline-flex h-5 items-center gap-1 rounded-sm px-[7px] text-[11.5px] font-semibold ${TONE[tone]} ${className}`} {...rest} />;
}
