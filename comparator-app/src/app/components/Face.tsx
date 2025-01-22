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
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  transforms: {
    [FacePosition.FRONT]:  { transform: 'translateZ(var(--block-half))',  background: '#ff0088' },
    [FacePosition.BACK]:   { transform: 'translateZ(calc(var(--block-half) * -1))', background: '#cc006d' },
    [FacePosition.RIGHT]:  { transform: 'rotateY(90deg) translateZ(var(--block-half))',  background: '#dd0077' },
    [FacePosition.LEFT]:   { transform: 'rotateY(-90deg) translateZ(var(--block-half))', background: '#dd0077' },
    [FacePosition.TOP]:    { transform: 'rotateX(90deg) translateZ(var(--block-half))',  background: '#ff1a9c' },
    [FacePosition.BOTTOM]: { transform: 'rotateX(-90deg) translateZ(var(--block-half))', background: '#cc006d' },
  },
} as const;

export function Face({ position }: FaceProps) {
  const style: CSSProperties = {
    ...faceStyles.base,
    ...faceStyles.transforms[position],
  };

  return <div style={style} />;
} 