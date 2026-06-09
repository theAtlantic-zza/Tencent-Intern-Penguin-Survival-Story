import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'soft';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
  const styles: Record<string, string> = {
    primary:
      'bg-tx-blue text-white shadow-soft hover:bg-tx-deep',
    ghost:
      'bg-transparent text-tx-blue hover:bg-tx-blue/5',
    soft:
      'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
