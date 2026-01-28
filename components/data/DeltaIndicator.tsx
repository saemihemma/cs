'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface DeltaIndicatorProps {
  value: number | null;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
  animated?: boolean;
  className?: string;
}

function getDeltaColor(delta: number): string {
  if (delta > 5) return '#00ff41'; // neon-green (strong positive)
  if (delta > 0) return '#00f3ff'; // neon-cyan (positive)
  if (delta < -5) return '#ff003c'; // neon-red (strong negative)
  if (delta < 0) return '#ff003c'; // neon-red (negative)
  return '#9CA3AF'; // neutral
}

function getDeltaBgClass(delta: number): string {
  if (delta > 5) return 'bg-neon-green/15';
  if (delta > 0) return 'bg-neon-cyan/10';
  if (delta < -5) return 'bg-neon-red/15';
  if (delta < 0) return 'bg-neon-red/10';
  return 'bg-gray-500/10';
}

const sizes = {
  sm: {
    text: 'text-xs',
    padding: 'px-1.5 py-0.5',
  },
  md: {
    text: 'text-sm',
    padding: 'px-2 py-1',
  },
  lg: {
    text: 'text-base',
    padding: 'px-3 py-1.5',
  },
};

export function DeltaIndicator({
  value,
  size = 'md',
  showSign = true,
  animated = false,
  className,
}: DeltaIndicatorProps) {
  if (value === null) {
    return (
      <span className={clsx('text-gray-600', sizes[size].text, className)}>
        —
      </span>
    );
  }

  const color = getDeltaColor(value);
  const sign = value > 0 ? '+' : '';
  const displayValue = showSign ? `${sign}${value.toFixed(0)}%` : `${value.toFixed(0)}%`;

  const content = (
    <span
      className={clsx(sizes[size].text, 'font-bold font-mono')}
      style={{ color }}
    >
      {displayValue}
    </span>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {content}
      </motion.span>
    );
  }

  return <span className={className}>{content}</span>;
}

// Badge version with background
export function DeltaBadge({
  value,
  size = 'md',
  className,
}: {
  value: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (value === null) {
    return (
      <span
        className={clsx(
          sizes[size].padding,
          sizes[size].text,
          'rounded bg-gray-500/10 text-gray-600',
          className
        )}
      >
        —
      </span>
    );
  }

  const color = getDeltaColor(value);
  const bgClass = getDeltaBgClass(value);
  const sign = value > 0 ? '+' : '';

  return (
    <span
      className={clsx(
        sizes[size].padding,
        sizes[size].text,
        'rounded font-bold font-mono',
        bgClass,
        className
      )}
      style={{ color }}
    >
      {sign}{value.toFixed(0)}%
    </span>
  );
}

// Tug of war visualization for comparison
export function TugOfWarBar({
  team1Value,
  team2Value,
  team1Label,
  team2Label,
  animated = true,
  className,
}: {
  team1Value: number | null;
  team2Value: number | null;
  team1Label?: string;
  team2Label?: string;
  animated?: boolean;
  className?: string;
}) {
  if (team1Value === null || team2Value === null) {
    return (
      <div className={clsx('flex items-center gap-4', className)}>
        <span className="text-sm text-gray-500 w-12">{team1Label || '—'}</span>
        <div className="flex-1 h-2 bg-bg-surface rounded-full" />
        <span className="text-sm text-gray-500 w-12 text-right">{team2Label || '—'}</span>
      </div>
    );
  }

  const total = team1Value + team2Value;
  const team1Percentage = total > 0 ? (team1Value / total) * 100 : 50;
  const team2Percentage = 100 - team1Percentage;
  const delta = team1Value - team2Value;

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-bold text-neon-cyan w-12">
          {team1Value.toFixed(0)}%
        </span>
        <div className="flex-1 h-3 bg-bg-surface rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-neon-cyan"
            style={{ boxShadow: '0 0 8px rgba(0, 243, 255, 0.4)' }}
            initial={animated ? { width: '50%' } : { width: `${team1Percentage}%` }}
            animate={{ width: `${team1Percentage}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          />
          <motion.div
            className="h-full bg-neon-red"
            style={{ boxShadow: '0 0 8px rgba(255, 0, 60, 0.4)' }}
            initial={animated ? { width: '50%' } : { width: `${team2Percentage}%` }}
            animate={{ width: `${team2Percentage}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          />
        </div>
        <span className="text-sm font-mono font-bold text-neon-red w-12 text-right">
          {team2Value.toFixed(0)}%
        </span>
      </div>

      {/* Labels and delta */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{team1Label}</span>
        <DeltaBadge value={delta} size="sm" />
        <span className="text-gray-500">{team2Label}</span>
      </div>
    </div>
  );
}
