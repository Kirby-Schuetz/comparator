import { CSSProperties } from 'react';

export enum FacePosition {
  FRONT = 'front',
  BACK = 'back',
  RIGHT = 'right',
  LEFT = 'left',
  TOP = 'top',
  BOTTOM = 'bottom',
}

interface FaceProps {
  position: FacePosition;
}

const faceStyles = {
  base: {
    position: 'absolute' as const,
    width: 'var(--block-size)',
    height: 'var(--block-size)',
    border: '1px solid rgba(12, 220, 247, 0.2)',
    boxShadow: 'inset 0 0 10px rgba(12, 220, 247, 0.1)',
    transition: 'all 0.2s ease',
  },
  transforms: {
    [FacePosition.FRONT]:  { 
      transform: 'translateZ(var(--block-half))',  
      background: 'linear-gradient(135deg, rgba(12, 220, 247, 0.8) 0%, rgba(10, 154, 240, 0.8) 100%)',
    },
    [FacePosition.BACK]:   { 
      transform: 'translateZ(calc(var(--block-half) * -1))', 
      background: 'linear-gradient(135deg, rgba(10, 154, 240, 0.6) 0%, rgba(12, 220, 247, 0.6) 100%)',
    },
    [FacePosition.RIGHT]:  { 
      transform: 'rotateY(90deg) translateZ(var(--block-half))',  
      background: 'linear-gradient(135deg, rgba(12, 220, 247, 0.7) 0%, rgba(10, 154, 240, 0.7) 100%)',
    },
    [FacePosition.LEFT]:   { 
      transform: 'rotateY(-90deg) translateZ(var(--block-half))', 
      background: 'linear-gradient(135deg, rgba(12, 220, 247, 0.7) 0%, rgba(10, 154, 240, 0.7) 100%)',
    },
    [FacePosition.TOP]:    { 
      transform: 'rotateX(90deg) translateZ(var(--block-half))',  
      background: 'linear-gradient(135deg, rgba(12, 220, 247, 0.9) 0%, rgba(10, 154, 240, 0.9) 100%)',
    },
    [FacePosition.BOTTOM]: { 
      transform: 'rotateX(-90deg) translateZ(var(--block-half))', 
      background: 'linear-gradient(135deg, rgba(10, 154, 240, 0.6) 0%, rgba(12, 220, 247, 0.6) 100%)',
    },
  },
} as const;

export function Face({ position }: FaceProps) {
  const style: CSSProperties = {
    ...faceStyles.base,
    ...faceStyles.transforms[position],
  };

  return <div style={style} />;
} 