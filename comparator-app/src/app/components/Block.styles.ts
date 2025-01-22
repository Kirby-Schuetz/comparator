export const BlockStyles = {
  cube: {
    width: 'var(--block-size)',
    height: 'var(--block-size)',
    transformStyle: 'preserve-3d' as const,
    transform: 'rotateX(-20deg) rotateY(25deg)',
    transition: 'transform 0.2s',
  },
} as const; 