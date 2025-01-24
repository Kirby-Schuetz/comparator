// Icy blue color
// 3D look
"use client";

import { motion } from "framer-motion";
import { CSSProperties } from "react";
import { Face, FacePosition } from './Face';

interface BlockProps {
  id: string;
  isDraggable: boolean;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent) => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

const styles = {
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
      backgroundColor: '#788CE3',  // Royal
      boxShadow: '0 0 10px rgba(120, 140, 227, 0.5)',  // Royal with opacity
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(120, 140, 227, 0.8)',  // Royal with opacity
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

export default function Block({ id, isDraggable, onDragEnd, constraintsRef }: BlockProps) {
  const blockStyle: CSSProperties = {
    ...styles.cube,
    cursor: isDraggable ? 'grab' : 'default',
  };

  return (
    <div className="block-group">
      <motion.div
        key={id}
        className="block"
        drag={isDraggable}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        style={blockStyle}
        whileHover={{ transform: 'rotateX(-20deg) rotateY(25deg) scale(1.1)' }}
      >
        {Object.values(FacePosition).map((position) => (
          <Face key={position} position={position} />
        ))}
      </motion.div>
    </div>
  );
}