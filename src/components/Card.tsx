import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & { title?: ReactNode; footer?: ReactNode };

export function Card({ title, footer, children, className = '', ...rest }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-panel ${className}`} {...rest}>
      {title && <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-[11px] text-[13px] font-medium">{title}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="flex flex-wrap items-center gap-3 border-t border-line bg-panel-2 px-3.5 py-3">{footer}</div>}
    </div>
  );
}
