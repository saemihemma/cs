/**
 * Framer Motion animation variants for CS2 Intel
 */

import type { Variants, Transition } from 'framer-motion';

// Shared easing curves
export const easing = {
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.4, 0, 0.2, 1],
} as const;

// Default transition
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: easing.smooth,
};

// Container with staggered children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Fade up animation for list items
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
};

// Scale in animation
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
};

// Card hover animation
export const cardHoverVariants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: easing.snappy,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Button hover animation
export const buttonHoverVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.15,
      ease: easing.snappy,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Glow pulse animation (for level 10 badges)
export const glowPulseVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 15px rgba(254, 31, 0, 0.4)',
      '0 0 30px rgba(254, 31, 0, 0.7)',
      '0 0 15px rgba(254, 31, 0, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Number count up animation helper
export const countUpConfig = {
  duration: 0.8,
  ease: easing.smooth,
};

// Progress bar fill animation
export const progressFillVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.8,
      ease: easing.smooth,
      delay: 0.2,
    },
  }),
};

// Page transition
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// VS matchup animation (team cards coming from sides)
export const vsTeam1Variants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
};

export const vsTeam2Variants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
};

export const vsTextVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: easing.bounce,
    },
  },
};

// Tug of war bar animation
export const tugBarVariants: Variants = {
  hidden: {
    width: '50%',
  },
  visible: (percentage: number) => ({
    width: `${percentage}%`,
    transition: {
      duration: 1,
      ease: easing.smooth,
      delay: 0.3,
    },
  }),
};

// Stagger grid animation
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const gridItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
};

// Table row animation
export const tableRowVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
};
