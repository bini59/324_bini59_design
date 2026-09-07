import { useId, type InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };

export function Input({ label, hint, error, id, className = '', ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const msg = error ?? hint;
  return (
    <div className="grid gap-1.5">
      {label && <label className="text-xs text-fg-2" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={`h-8 w-full rounded-[7px] border bg-bg px-2.5 text-[13px] text-fg disabled:opacity-50 ${error ? 'border-danger' : 'border-line-strong'} ${className}`}
        {...rest}
      />
      {msg && <div className={`text-[11.5px] ${error ? 'text-danger' : 'text-fg-3'}`}>{msg}</div>}
    </div>
  );
}
