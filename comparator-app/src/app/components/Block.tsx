// Icy blue color
// 3D look
"use client";

import { motion } from "framer-motion";
import { CSSProperties } from "react";

interface BlockProps {
  id: string;
  isDraggable: boolean;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent) => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

const styles = {
  cube: {
    width: '40px',
    height: '40px',
    transformStyle: 'preserve-3d' as const,
    transform: 'rotateX(-20deg) rotateY(25deg)',
    transition: 'transform 0.2s',
  },
  face: {
    position: 'absolute' as const,
    width: '40px',
    height: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  // Color faces
  front:  { transform: 'translateZ(20px)',  background: '#ff0088' },
  back:   { transform: 'translateZ(-20px)', background: '#cc006d' },
  right:  { transform: 'rotateY(90deg) translateZ(20px)',  background: '#dd0077' },
  left:   { transform: 'rotateY(-90deg) translateZ(20px)', background: '#dd0077' },
  top:    { transform: 'rotateX(90deg) translateZ(20px)',  background: '#ff1a9c' },
  bottom: { transform: 'rotateX(-90deg) translateZ(20px)', background: '#cc006d' },
} as const;

export default function Block({ id, isDraggable, onDragEnd, constraintsRef }: BlockProps) {
  const blockStyle: CSSProperties = {
    ...styles.cube,
    cursor: isDraggable ? 'grab' : 'default',
  };

  return (
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
      <div style={{ ...styles.face, ...styles.front }} />
      <div style={{ ...styles.face, ...styles.back }} />
      <div style={{ ...styles.face, ...styles.right }} />
      <div style={{ ...styles.face, ...styles.left }} />
      <div style={{ ...styles.face, ...styles.top }} />
      <div style={{ ...styles.face, ...styles.bottom }} />
    </motion.div>
  );
}