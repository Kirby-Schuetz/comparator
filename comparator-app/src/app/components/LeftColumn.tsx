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
import { BlockGroup } from './BlockGroup';

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
  columnId: 'left' | 'right';
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
};

function useBoxManagement(constraintsRef: React.RefObject<HTMLDivElement | null>) {
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
    if (!constraintsRef.current || boxes.length === 0) {
      updateConnectionPoint([]);
      return;
    }

    const containerRect = constraintsRef.current.getBoundingClientRect();
    const columnId = 'left';
    // Adjust x position to be at the right edge of the block
    const xPosition = containerRect.left + CONFIG.BOX_WIDTH; // Position at right edge of block
    
    let connectionPoints: ConnectionPoint[] = [];

    if (boxes.length === 1) {
      const box = boxes[0];
      connectionPoints = [
        {
          x: xPosition,
          y: box.y + 10, // Top of the box
          type: 'top',
          columnId
        },
        {
          x: xPosition,
          y: box.y + 30, // Bottom of the box
          type: 'bottom',
          columnId
        }
      ];
    } else {
      connectionPoints = [
        {
          x: xPosition,
          y: boxes[0].y + 20, // Top block connection
          type: 'top',
          columnId
        },
        {
          x: xPosition,
          y: boxes[boxes.length - 1].y + 20, // Bottom block connection
          type: 'bottom',
          columnId
        }
      ];
    }

    updateConnectionPoint(connectionPoints);
  }, [boxes, updateConnectionPoint, constraintsRef]);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      // Force re-calculation of points on resize
      const event = new Event('resize');
      window.dispatchEvent(event);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  const { boxes, addBox, removeBox } = useBoxManagement(constraintsRef);
  const { isDrawingMode } = useConnections();

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

      {boxes.map((box, index) => (
        <BlockGroup
          key={box.id}
          id={box.id}
          x={box.x}
          y={box.y}
          points={box.points}
          isDraggable={!isDrawingMode}
          onDragEnd={(event, info) => !isDrawingMode && handleDragEnd(event, info, box.id)}
          constraintsRef={constraintsRef}
          columnId="left"
          isTop={index === 0}
          isBottom={index === boxes.length - 1}
        />
      ))}
    </motion.div>
  );
}