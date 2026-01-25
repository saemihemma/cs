'use client';

import { clsx } from 'clsx';

export function SectionHeader({
  title,
  subtitle,
  accent = 'orange',
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  accent?: 'orange' | 'blue';
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-end justify-between gap-4 mb-4', className)}>
      <div>
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'w-1 h-5 rounded-full',
              accent === 'orange' ? 'bg-cs2-orange' : 'bg-cs2-blue'
            )}
          />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

