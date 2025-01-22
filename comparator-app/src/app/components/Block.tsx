// Icy blue color
// 3D look
"use client";

import { motion } from "framer-motion";
import { CSSProperties } from "react";
import { BlockStyles } from './Block.styles';
import { Face, FacePosition } from './Face';

interface BlockProps {
  id: string;
  isDraggable: boolean;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent) => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

export default function Block({ id, isDraggable, onDragEnd, constraintsRef }: BlockProps) {
  const blockStyle: CSSProperties = {
    ...BlockStyles.cube,
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