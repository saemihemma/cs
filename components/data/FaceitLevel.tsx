'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface FaceitLevelProps {
  level: number;
  elo?: number;
  size?: 'sm' | 'md' | 'lg';
  showElo?: boolean;
  className?: string;
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#EEEEEE',
  2: '#1CE400',
  3: '#1CE400',
  4: '#FFC800',
  5: '#FFC800',
  6: '#FFC800',
  7: '#FF6309',
  8: '#FF6309',
  9: '#FF6309',
  10: '#FE1F00',
};

const LEVEL_BG_COLORS: Record<number, string> = {
  1: 'rgba(238, 238, 238, 0.15)',
  2: 'rgba(28, 228, 0, 0.15)',
  3: 'rgba(28, 228, 0, 0.15)',
  4: 'rgba(255, 200, 0, 0.15)',
  5: 'rgba(255, 200, 0, 0.15)',
  6: 'rgba(255, 200, 0, 0.15)',
  7: 'rgba(255, 99, 9, 0.15)',
  8: 'rgba(255, 99, 9, 0.15)',
  9: 'rgba(255, 99, 9, 0.15)',
  10: 'rgba(254, 31, 0, 0.15)',
};

const sizes = {
  sm: {
    badge: 'w-8 h-8',
    text: 'text-sm',
    elo: 'text-[10px]',
  },
  md: {
    badge: 'w-10 h-10',
    text: 'text-base',
    elo: 'text-xs',
  },
  lg: {
    badge: 'w-14 h-14',
    text: 'text-xl',
    elo: 'text-sm',
  },
};

export function FaceitLevel({
  level,
  elo,
  size = 'md',
  showElo = true,
  className,
}: FaceitLevelProps) {
  const validLevel = level >= 1 && level <= 10 ? level : 0;
  const color = LEVEL_COLORS[validLevel] || '#6B7280';
  const bgColor = LEVEL_BG_COLORS[validLevel] || 'rgba(107, 114, 128, 0.15)';
  const isHighLevel = validLevel >= 7;
  const isMaxLevel = validLevel === 10;

  if (validLevel === 0) {
    return (
      <div className={clsx('flex flex-col items-center gap-1', className)}>
        <div
          className={clsx(
            sizes[size].badge,
            'rounded-lg flex items-center justify-center',
            'bg-gray-800/50 border border-gray-700'
          )}
        >
          <span className="text-gray-500 font-bold">?</span>
        </div>
        {showElo && (
          <span className={clsx(sizes[size].elo, 'text-gray-600')}>
            No data
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col items-center gap-1', className)}>
      <motion.div
        className={clsx(
          sizes[size].badge,
          'rounded-lg flex items-center justify-center border relative overflow-hidden'
        )}
        style={{
          backgroundColor: bgColor,
          borderColor: `${color}40`,
        }}
        animate={
          isMaxLevel
            ? {
                boxShadow: [
                  `0 0 10px ${color}40`,
                  `0 0 20px ${color}60`,
                  `0 0 10px ${color}40`,
                ],
              }
            : isHighLevel
            ? { boxShadow: `0 0 12px ${color}30` }
            : {}
        }
        transition={
          isMaxLevel
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        {/* Inner glow for high levels */}
        {isHighLevel && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
            }}
          />
        )}

        <span
          className={clsx(sizes[size].text, 'font-bold relative z-10')}
          style={{ color }}
        >
          {validLevel}
        </span>
      </motion.div>

      {showElo && elo && elo > 0 && (
        <span className={clsx(sizes[size].elo, 'text-gray-400 font-mono')}>
          {elo.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// Compact inline version for tables
export function FaceitLevelBadge({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  const validLevel = level >= 1 && level <= 10 ? level : 0;
  const color = LEVEL_COLORS[validLevel] || '#6B7280';
  const bgColor = LEVEL_BG_COLORS[validLevel] || 'rgba(107, 114, 128, 0.15)';

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold border',
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: `${color}40`,
        color,
      }}
    >
      {validLevel > 0 ? validLevel : '?'}
    </span>
  );
}
