"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Block from './Block';
import { useBoxManagement } from "../hooks/useBoxManagement";
import { CONFIG } from "../types/shared";

const styles = {
  container: {
    width: '40%',
    height: CONFIG.CONTAINER_HEIGHT,
    borderRadius: 5,
    position: "relative" as const,
    marginBottom: 0,
  },
  column: {
    width: '100%',
    height: "100%",
    float: "right" as const,
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 5,
    paddingBottom: "24px",
  },
};

export default function RightColumn() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { boxes, addBox, removeBox } = useBoxManagement('right');

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log('Right column double click event detected');
    e.preventDefault();
    e.stopPropagation();
    addBox();
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, boxId: string) => {
    const container = constraintsRef.current?.getBoundingClientRect();
    if (!container) return;

    const target = event.target as HTMLElement;
    const box = target.getBoundingClientRect();
    
    const isOutside = 
      box.left < container.left || 
      box.right > container.right || 
      box.top < container.top || 
      box.bottom > container.bottom;

    if (isOutside) removeBox(boxId);
  };

  return (
    <motion.div ref={constraintsRef} style={styles.container}>
      <div 
        onDoubleClick={handleDoubleClick}
        style={{
          ...styles.column,
          position: 'relative',
          cursor: 'pointer',
          minWidth: CONFIG.BOX_WIDTH,
          minHeight: '100%',
          zIndex: 1,
        }}
      >
        <div 
          className="boxes-container right" 
          onDoubleClick={handleDoubleClick}
          style={{ 
            gap: '24px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: '100%',
            position: 'absolute',
            top: 0,
            right: '33%',
            width: '100%',
            pointerEvents: 'auto',
          }}
        >
          {boxes.map((box) => (
            <Block
              key={box.id}
              id={box.id}
              isDraggable
              onDragEnd={(event) => handleDragEnd(event, box.id)}
              constraintsRef={constraintsRef as React.RefObject<HTMLDivElement>}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}