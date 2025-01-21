// left column container
// onClick adding box
// box positioning
// drag remove box
// repositioning boxes after removing a box
// tracking individual box count
// tracking the top point of the stack of boxes and the bottom point of the stack of boxes
// updating the points when the box count changes

"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Block from './Block';
import { useBoxManagement } from "../hooks/useBoxManagement";
import { CONFIG } from "../types/shared";

// Styles
const styles = {
  container: {
    width: CONFIG.CONTAINER_WIDTH,
    height: CONFIG.CONTAINER_HEIGHT,
    borderRadius: 5,
    position: "relative" as const,
    marginBottom: 0,
  },
  column: {
    width: CONFIG.BOX_WIDTH,
    height: "100%",
    float: "right" as const,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 5,
    paddingBottom: "24px",
  },
};

export default function LeftColumn() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { boxes, addBox, removeBox } = useBoxManagement('left');

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.currentTarget !== e.target) return; // Only trigger if clicking the column itself
    console.log('Left column double click event detected');
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
          zIndex: 200,
        }}
      >
        <div 
          className="boxes-container" 
          onDoubleClick={handleDoubleClick}
          style={{ 
            gap: '24px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,  // Changed from 'right' to 'left' for left column
            width: '100%',
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