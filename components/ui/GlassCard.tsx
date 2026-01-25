'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cardHoverVariants } from '@/lib/design/animations';
import { clsx } from 'clsx';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: 'orange' | 'blue' | 'none';
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
    orange: 'card-glow-hover',
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-blue-500/30',
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
