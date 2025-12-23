import { Transition, Variants } from "motion/react";

// ============================================================================
// MOTION SYSTEM - Deliverable E
// ============================================================================

export const DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
};

export const EASINGS = {
  smooth: [0.23, 1, 0.32, 1], // Cubic Bezier for smooth "Apple-like" feel
};

export const TRANSITIONS = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 24,
  } as const, // The "Osmo" snappy feel
  
  smooth: {
    duration: DURATIONS.normal,
    ease: EASINGS.smooth,
  } as const,
};

export const VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: TRANSITIONS.spring },
  } satisfies Variants,
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: TRANSITIONS.spring },
  } satisfies Variants,
  
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } satisfies Variants,
};
