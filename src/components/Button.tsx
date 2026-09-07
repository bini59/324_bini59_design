import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'accent' | 'danger' | 'ghost';
  size?: 'md' | 'sm';
  block?: boolean;
};

const VARIANT = {
  default: 'border-line-strong bg-raise text-fg hover:bg-panel-2',
  primary: 'border-transparent bg-fg text-bg font-medium hover:opacity-[.88]',
  accent: 'border-transparent bg-accent text-accent-fg font-medium hover:opacity-[.88]',
  danger: 'border-danger bg-danger-soft text-danger hover:opacity-[.88]',
  ghost: 'border-transparent bg-transparent text-fg-2 hover:bg-panel-2',
};
const SIZE = { md: 'h-8 px-3 text-[13px] rounded-md', sm: 'h-[26px] px-[9px] text-xs rounded-sm' };

export function Button({ variant = 'default', size = 'md', block, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 border whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  );
}
