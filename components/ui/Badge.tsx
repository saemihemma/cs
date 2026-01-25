'use client';

import { clsx } from 'clsx';

export type BadgeTone = 'neutral' | 'orange' | 'blue' | 'green' | 'red';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-white/5 border-white/10 text-gray-300',
  orange: 'bg-cs2-orange/15 border-cs2-orange/30 text-cs2-orange',
  blue: 'bg-cs2-blue/15 border-cs2-blue/30 text-cs2-blue-bright',
  green: 'bg-green-500/15 border-green-500/30 text-green-400',
  red: 'bg-red-500/15 border-red-500/30 text-red-400',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

