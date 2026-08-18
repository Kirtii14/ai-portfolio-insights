export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -6,
  },
};

export const pageTransition = {
  duration: 0.32,
  ease: [0.2, 0.8, 0.2, 1],
};
