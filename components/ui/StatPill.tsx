'use client';

import { clsx } from 'clsx';

export function StatPill({
  label,
  value,
  tone = 'neutral',
  className,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'orange' | 'blue' | 'green' | 'cyan' | 'red';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-white/5 border-white/10 text-gray-300',
    orange: 'bg-neon-green/10 border-neon-green/20 text-gray-200', // legacy alias
    blue: 'bg-neon-cyan/10 border-neon-cyan/20 text-gray-200', // legacy alias
    green: 'bg-neon-green/10 border-neon-green/20 text-gray-200',
    cyan: 'bg-neon-cyan/10 border-neon-cyan/20 text-gray-200',
    red: 'bg-neon-red/10 border-neon-red/20 text-gray-200',
  } as const;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-2 rounded-xl border',
        tones[tone],
        className
      )}
    >
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono font-semibold text-sm text-white">{value}</span>
    </div>
  );
}

