'use client';

import { clsx } from 'clsx';

export type BadgeTone = 'neutral' | 'orange' | 'blue' | 'green' | 'cyan' | 'red';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-white/5 border-white/10 text-gray-300',
  green: 'bg-neon-green/15 border-neon-green/30 text-neon-green',
  cyan: 'bg-neon-cyan/15 border-neon-cyan/30 text-neon-cyan',
  red: 'bg-neon-red/15 border-neon-red/30 text-neon-red',
  // Legacy aliases
  orange: 'bg-neon-green/15 border-neon-green/30 text-neon-green',
  blue: 'bg-neon-cyan/15 border-neon-cyan/30 text-neon-cyan',
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

