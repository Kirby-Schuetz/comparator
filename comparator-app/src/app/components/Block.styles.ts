export const BlockStyles = {
  cube: {
    width: 'var(--block-size)',
    height: 'var(--block-size)',
    transformStyle: 'preserve-3d' as const,
    transform: 'rotateX(-20deg) rotateY(25deg)',
    transition: 'transform 0.2s',
    position: 'relative' as const,
    '& > *': {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      backgroundColor: '#64ffda',
      boxShadow: '0 0 10px rgba(100, 255, 218, 0.5)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(100, 255, 218, 0.8)',
    },
    '&:hover': {
      transform: 'rotateX(-20deg) rotateY(25deg) scale(1.05)',
    }
  },
  face: {
    front: {
      transform: 'translateZ(20px)',
      background: 'linear-gradient(135deg, #64ffda 0%, rgba(100, 255, 218, 0.8) 100%)',
    },
    right: {
      transform: 'rotateY(90deg) translateZ(20px)',
      background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.6) 0%, rgba(100, 255, 218, 0.4) 100%)',
    },
    top: {
      transform: 'rotateX(90deg) translateZ(20px)',
      background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.8) 0%, rgba(100, 255, 218, 0.6) 100%)',
    }
  }
} as const; 