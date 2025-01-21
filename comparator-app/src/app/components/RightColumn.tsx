"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRightBox } from "../context/right-box-context";
import { BlockGroup } from './BlockGroup';
import { CONFIG } from "../types/shared";

interface Box {
  id: string;
  points?: number;
}

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
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 5,
  },
};

function useBoxManagement() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { rightState, rightDispatch } = useRightBox();
  
  const updateBoxPoints = (boxArray: Box[]): Box[] => {
    if (boxArray.length === 0) return [];
    return boxArray.map((box, index) => ({
      ...box,
      points: index === 0 ? 10 : 
             index === boxArray.length - 1 ? 1 : 
             undefined
    }));
  };

  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, rightState.count), CONFIG.MAX_BOXES);
    const currentCount = boxes.length;
    
    if (desiredCount > currentCount) {
      const newBoxes = [...boxes];
      for (let i = currentCount; i < desiredCount; i++) {
        newBoxes.push({ id: crypto.randomUUID() });
      }
      setBoxes(updateBoxPoints(newBoxes));
    } else if (desiredCount < currentCount) {
      const newBoxes = boxes.slice(0, desiredCount);
      setBoxes(updateBoxPoints(newBoxes));
    }
  }, [boxes, rightState.count]);

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    setBoxes(updateBoxPoints(updatedBoxes));
    rightDispatch({ type: "decrement" });
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    
    const newBoxes = [...boxes, { id: crypto.randomUUID() }];
    setBoxes(updateBoxPoints(newBoxes));
    rightDispatch({ type: "increment" });
  };

  return { boxes, removeBox, addBox };
}

export default function RightColumn() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { boxes, addBox, removeBox } = useBoxManagement();

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
      <div onDoubleClick={addBox} style={styles.column} />
      
      <div className="boxes-container right" style={{ 
        gap: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
      }}>
        {boxes.map((box, index) => (
          <BlockGroup
            key={box.id}
            id={box.id}
            isDraggable={true}
            onDragEnd={(event) => handleDragEnd(event, box.id)}
            constraintsRef={constraintsRef as React.RefObject<HTMLDivElement>}
            columnId="right"
            isTop={index === 0}
            isBottom={index === boxes.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}