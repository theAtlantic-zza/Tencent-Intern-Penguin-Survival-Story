import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div
      className={`rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-white backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
