// left column container
// onClick adding box
// box positioning
// drag remove box
// repositioning boxes after removing a box
// tracking individual box count
// tracking the top point of the stack of boxes and the bottom point of the stack of boxes
// updating the points when the box count changes

"use client";

import { motion, PanInfo } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useConnections } from "../context/connection-context";

// BoxID and positioning
interface Box {
  id: string;
  x: number;
  y: number;
  points?: number;
}
interface ConnectionPoint {
  x: number;
  y: number;
  type: 'top' | 'bottom';
  columnId: string;
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
  const { leftState, leftDispatch } = useLeftBox();
  const { updateConnectionPoint } = useConnections();
  
  // Updated points calculation to be more explicit
  const updateBoxPoints = (boxArray: Box[]): Box[] => {
    if (boxArray.length === 0) return [];
    return boxArray.map((box, index) => ({
      ...box,
      points: index === 0 ? 10 : // top box gets 10 points
             index === boxArray.length - 1 ? 1 : // bottom box gets 1 point
             undefined // middle boxes get no points
    }));
  };

  useEffect(() => {
    if (boxes.length === 0) {
      updateConnectionPoint([]);
      return;
    }

    const topBox = boxes[0];
    const bottomBox = boxes[boxes.length - 1];
    
    const columnId = 'left'; // or 'right' for RightColumn.tsx
    const xPosition = columnId === 'left' ? CONFIG.CONTAINER_WIDTH : 0;
    
    const newConnectionPoints: ConnectionPoint[] = [
      {
        x: xPosition,
        y: topBox.y + (CONFIG.BOX_WIDTH / 2),
        type: 'top',
        columnId
      },
      {
        x: xPosition,
        y: bottomBox.y + (CONFIG.BOX_WIDTH / 2),
        type: 'bottom',
        columnId
      }
    ];

    updateConnectionPoint(newConnectionPoints);
  }, [boxes]);

  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, leftState.count), CONFIG.MAX_BOXES);
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
      setBoxes(updateBoxPoints(newBoxes));
    } else if (desiredCount < currentCount) {
      // Remove boxes from the top
      const newBoxes = boxes.slice(0, desiredCount);
      // Reposition remaining boxes
      const repositionedBoxes = newBoxes.map((box, index) => ({
        ...box,
        y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
      }));
      setBoxes(updateBoxPoints(repositionedBoxes));
    }
  }, [leftState.count]);

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    const leftColumnBoxes = updatedBoxes.filter(box => box.x === 0);

    const repositionedBoxes = leftColumnBoxes.map((box, index) => ({
      ...box,
      y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
    }));
    setBoxes(updateBoxPoints(repositionedBoxes));
    leftDispatch({ type: "decrement" });
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    
    const newId = crypto.randomUUID();
    const newY = CONFIG.CONTAINER_HEIGHT - (leftState.count + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING);
    
    const newBoxes = [...boxes, { id: newId, x: 0, y: newY }];
    setBoxes(updateBoxPoints(newBoxes));
    leftDispatch({ type: "increment" });

    // Checks if max boxes is reached
    // Positions the new box
    // Updates state and context
  };

  return { boxes, removeBox, addBox };
}

export default function LeftColumn() {
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