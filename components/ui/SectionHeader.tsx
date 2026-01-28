'use client';

import { clsx } from 'clsx';

export function SectionHeader({
  title,
  subtitle,
  accent = 'green',
  right,
  className,
}: {
  title: React.ReactNode;
  subtitle?: string;
  accent?: 'green' | 'cyan' | 'red' | 'orange' | 'blue';
  right?: React.ReactNode;
  className?: string;
}) {
  const accentColors = {
    green: 'bg-neon-green',
    cyan: 'bg-neon-cyan',
    red: 'bg-neon-red',
    orange: 'bg-neon-green', // legacy alias
    blue: 'bg-neon-cyan', // legacy alias
  };

  return (
    <div className={clsx('flex items-end justify-between gap-4 mb-4', className)}>
      <div>
        <div className="flex items-center gap-2">
          <span
            className={clsx('w-1 h-5 rounded-full', accentColors[accent])}
          />
          <h2 className="text-lg font-display font-bold text-white">{title}</h2>
        </div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

