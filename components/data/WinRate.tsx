'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface WinRateProps {
  percentage: number | null;
  matches?: number;
  size?: 'sm' | 'md' | 'lg';
  showMatches?: boolean;
  animated?: boolean;
  className?: string;
}

function getWinRateColor(percentage: number): string {
  if (percentage >= 55) return '#22C55E'; // excellent - green
  if (percentage >= 50) return '#84CC16'; // good - lime
  if (percentage >= 45) return '#EAB308'; // neutral - yellow
  return '#EF4444'; // poor - red
}

function getWinRateBgClass(percentage: number): string {
  if (percentage >= 55) return 'winrate-excellent';
  if (percentage >= 50) return 'winrate-good';
  if (percentage >= 45) return 'winrate-neutral';
  return 'winrate-poor';
}

const sizes = {
  sm: {
    text: 'text-sm',
    matches: 'text-[10px]',
    padding: 'px-2 py-1',
  },
  md: {
    text: 'text-base',
    matches: 'text-xs',
    padding: 'px-3 py-1.5',
  },
  lg: {
    text: 'text-xl',
    matches: 'text-sm',
    padding: 'px-4 py-2',
  },
};

export function WinRate({
  percentage,
  matches,
  size = 'md',
  showMatches = true,
  animated = false,
  className,
}: WinRateProps) {
  if (percentage === null) {
    return (
      <div className={clsx('text-gray-600', sizes[size].text, className)}>
        —
      </div>
    );
  }

  const color = getWinRateColor(percentage);

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <motion.span
        className={clsx(sizes[size].text, 'font-bold font-mono')}
        style={{ color }}
        initial={animated ? { opacity: 0, scale: 0.8 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.3 }}
      >
        {percentage.toFixed(0)}%
      </motion.span>
      {showMatches && matches !== undefined && matches > 0 && (
        <span className={clsx(sizes[size].matches, 'text-gray-500')}>
          {matches}g
        </span>
      )}
    </div>
  );
}

// Cell version for tables with background
export function WinRateCell({
  percentage,
  matches,
  className,
}: {
  percentage: number | null;
  matches?: number;
  className?: string;
}) {
  if (percentage === null || (matches !== undefined && matches === 0)) {
    return (
      <div className={clsx('py-3 px-2 text-center text-gray-600', className)}>
        —
      </div>
    );
  }

  const color = getWinRateColor(percentage);
  const bgClass = getWinRateBgClass(percentage);

  return (
    <div className={clsx('py-3 px-2 text-center rounded', bgClass, className)}>
      <div className="font-bold font-mono text-sm" style={{ color }}>
        {percentage.toFixed(0)}%
      </div>
      {matches !== undefined && matches > 0 && (
        <div className="text-[10px] text-gray-500 mt-0.5">{matches}g</div>
      )}
    </div>
  );
}

// Horizontal bar version
export function WinRateBar({
  percentage,
  label,
  animated = true,
  className,
}: {
  percentage: number | null;
  label?: string;
  animated?: boolean;
  className?: string;
}) {
  if (percentage === null) {
    return (
      <div className={clsx('flex items-center gap-3', className)}>
        {label && <span className="text-sm text-gray-400 w-16">{label}</span>}
        <div className="flex-1 h-2 bg-bg-surface rounded-full" />
        <span className="text-sm text-gray-600 w-12 text-right">—</span>
      </div>
    );
  }

  const color = getWinRateColor(percentage);

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {label && <span className="text-sm text-gray-400 w-16">{label}</span>}
      <div className="flex-1 h-2 bg-bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        />
      </div>
      <span
        className="text-sm font-bold font-mono w-12 text-right"
        style={{ color }}
      >
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
