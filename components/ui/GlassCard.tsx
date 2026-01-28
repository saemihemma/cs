'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cardHoverVariants } from '@/lib/design/animations';
import { clsx } from 'clsx';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: 'orange' | 'blue' | 'green' | 'cyan' | 'red' | 'none';
  className?: string;
}

export function GlassCard({
  children,
  hover = true,
  glow = 'none',
  className,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    green: 'hover:shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:border-neon-green/30',
    cyan: 'hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:border-neon-cyan/30',
    red: 'hover:shadow-[0_0_30px_rgba(255,0,60,0.2)] hover:border-neon-red/30',
    orange: 'hover:shadow-[0_0_30px_rgba(0,255,65,0.2)] hover:border-neon-green/30', // legacy alias
    blue: 'hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:border-neon-cyan/30', // legacy alias
    none: '',
  };

  return (
    <motion.div
      variants={hover ? cardHoverVariants : undefined}
      initial="initial"
      whileHover={hover ? 'hover' : undefined}
      whileTap={hover ? 'tap' : undefined}
      className={clsx(
        'glass rounded-xl',
        hover && 'cursor-pointer',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Simple non-animated version
export function StaticGlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('glass rounded-xl', className)}>
      {children}
    </div>
  );
}
