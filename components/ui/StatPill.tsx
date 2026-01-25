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
  tone?: 'neutral' | 'orange' | 'blue';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-white/5 border-white/10 text-gray-300',
    orange: 'bg-cs2-orange/10 border-cs2-orange/20 text-gray-200',
    blue: 'bg-cs2-blue/10 border-cs2-blue/20 text-gray-200',
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

