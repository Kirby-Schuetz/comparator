// right column container
// onClick adding box
// box positioning
// drag remove box
// repositioning boxes after removing a box
// tracking individual box count

"use client";

import { motion, PanInfo } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRightBox } from "../context/right-box-context";

// BoxID and positioning
interface Box {
  id: string;
  x: number;
  y: number;
}

// Configuration
const CONFIG = {
  SPACING: 12, // 1/3 cm = ~12px
  BOX_WIDTH: 40,
  MAX_BOXES: 10,
  CONTAINER_HEIGHT: 520,
  CONTAINER_WIDTH: 80,
} as const;

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
  },
  box: {
    width: CONFIG.BOX_WIDTH,
    height: CONFIG.BOX_WIDTH,
    backgroundColor: "#ff0088",
    borderRadius: 0,
    position: "absolute" as const,
    cursor: "grab",
  },
};

function useBoxManagement() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { rightState, rightDispatch } = useRightBox();

  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, rightState.count), CONFIG.MAX_BOXES);
    const currentCount = boxes.length;
    
    if (desiredCount > currentCount) {
      // Add boxes
      const newBoxes = [...boxes];
      for (let i = currentCount; i < desiredCount; i++) {
        newBoxes.push({
          id: crypto.randomUUID(),
          x: 0,
          y: CONFIG.CONTAINER_HEIGHT - (i + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING)
        });
      }
      setBoxes(newBoxes);
    } else if (desiredCount < currentCount) {
      // Remove boxes from the top
      const newBoxes = boxes.slice(0,desiredCount);
      // Reposition remaining boxes
      const repositionedBoxes = newBoxes.map((box, index) => ({
        ...box,
        y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
      }));
      setBoxes(repositionedBoxes);
    }
  }, [rightState.count]);

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    
    const newId = crypto.randomUUID();
    const newY = CONFIG.CONTAINER_HEIGHT - (rightState.count + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING);
    
    setBoxes([...boxes, { id: newId, x: 0, y: newY }]);
    rightDispatch({ type: "increment" });
    // Checks if max boxes is reached
    // Positions the new box
    // Updates state and context
  };

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    const rightColumnBoxes = updatedBoxes.filter(box => box.x === 0);

    const repositionedBoxes = rightColumnBoxes.map((box, index) => ({
      ...box,
      y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
    }));
    // Repositions the boxes
    setBoxes(repositionedBoxes);
    rightDispatch({ type: "decrement" });
  };

  return { boxes, addBox, removeBox };
}

export default function RightColumn() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { boxes, addBox, removeBox } = useBoxManagement();

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    boxId: string
  ) => {
    const container = constraintsRef.current?.getBoundingClientRect();
    if (!container) return;

    const target = event.target as HTMLElement;
    const draggedRect = target.getBoundingClientRect();

    const isOutside =
      draggedRect.left < container.left ||
      draggedRect.right > container.right ||
      draggedRect.top < container.top ||
      draggedRect.bottom > container.bottom;

    if (isOutside) {
      removeBox(boxId);
    }
    // Checks if box is outside the container
    // Removes the box if it is
  };

  return (
    <motion.div ref={constraintsRef} style={styles.container}>
      <div onDoubleClick={addBox} style={styles.column} />

      {boxes.map((box) => (
        <motion.div
          key={box.id}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          onDragEnd={(event, info) => handleDragEnd(event, info, box.id)}
          style={{
            ...styles.box,
            right: `${box.x}px`,
            top: `${box.y}px`,
          }}
          // Renders interactive boxes with drag capabilities
          // Maintains container constraints
        />
      ))}
    </motion.div>
  );
}