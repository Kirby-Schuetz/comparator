"use client";

import * as motion from "motion/react-client";
import { useState, useRef } from "react";
import { useLeftBox } from "../context/left-box-context";

type Box = {
  id: string;
  x: number;
  y: number;
};

export default function LeftColumn() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { leftState, leftDispatch } = useLeftBox();

  const constraintsRef = useRef<HTMLDivElement>(null);

  const SPACING = 12; // Spacing between boxes
  const BOX_SIZE = 40; // Width and height of a box
  const CONTAINER_HEIGHT = 520; // Height of the container

  // Dispatch helpers
  const increment = () => leftDispatch({ type: "increment" });
  const decrement = () => leftDispatch({ type: "decrement" });

  // Handles double-click to add a new box
  const handleDoubleClick = () => {
    if (boxes.length >= 10) return; // Limit to 10 boxes

    const newId = `${boxes.length}`; // Unique ID for each box
    const newY = CONTAINER_HEIGHT - (leftState.count + 1) * (BOX_SIZE + SPACING);

    setBoxes((prev) => [
      ...prev,
      { id: newId, x: 0, y: Math.max(newY, 0) }, // Add new box at the correct position
    ]);

    increment();
  };

  // Handles box drag end event
  const handleDragEnd = (event: MouseEvent | TouchEvent, boxId: string) => {
    const container = constraintsRef.current?.getBoundingClientRect();
    const draggedBox = event.target as HTMLElement;
    const draggedRect = draggedBox.getBoundingClientRect();

    if (!container) return;

    const isOutside =
      draggedRect.left < container.left ||
      draggedRect.right > container.right ||
      draggedRect.top < container.top ||
      draggedRect.bottom > container.bottom;

    if (isOutside) {
      // Remove the box
      setBoxes((prev) => {
        const updatedBoxes = prev.filter((box) => box.id !== boxId);
        const repositionedBoxes = updatedBoxes.map((box, index) => ({
          ...box,
          y: CONTAINER_HEIGHT - (index + 1) * (BOX_SIZE + SPACING),
        }));

        decrement();
        return repositionedBoxes;
      });
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      style={containerStyle}
      onDoubleClick={handleDoubleClick}
    >
      {boxes.map((box) => (
        <motion.div
          key={box.id}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          onDragEnd={(event) => handleDragEnd(event, box.id)}
          style={{
            ...boxStyle,
            left: `${box.x}px`,
            top: `${box.y}px`,
          }}
        />
      ))}
    </motion.div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  width: 212, // Width for the column
  height: 520, // Height for the column
  borderRadius: 10,
  position: "relative",
  backgroundColor: "#f0f0f0", 
  overflow: "hidden",
};

const boxStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  backgroundColor: "#ff0088",
  borderRadius: 0,
  position: "absolute",
  cursor: "grab",
};