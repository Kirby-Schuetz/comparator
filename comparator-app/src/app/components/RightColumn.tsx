// right column container
// onClick adding box
// box positioning
// drag remove box
// repositioning boxes after removing a box
// tracking individual box count

"use client";

import * as motion from "motion/react-client";
import { useState, useRef } from "react";
import { useRightBox } from "../context/right-box-context";
import ColumnContainer from "./ColumnContainer";

export default function RightColumn() {
  const [boxes, setBoxes] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const { rightState, rightDispatch } = useRightBox();

  const constraintsRef = useRef<HTMLDivElement>(null);

  const SPACING = 12; // 1/3 cm = ~12px
  const BOX_WIDTH = 40;

  const COLUMN_WIDTH = BOX_WIDTH;
  const CONTAINER_HEIGHT = 520;

  const increment = () => {
    rightDispatch({ type: "increment" });
  };

  const decrement = () => {
    rightDispatch({ type: "decrement" });
  };

  const handleDoubleClick = () => {
    if (boxes.length >= 10) return;

    // Generate unique ID using timestamp + random number
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const rightColumnCount = rightState.count;

    let newX: number;
    let newY: number;

    // Fix logic for column positioning
    if (rightColumnCount < 10) {
      newX = 0;
      newY = CONTAINER_HEIGHT - (rightColumnCount + 1) * (BOX_WIDTH + SPACING);
      increment();
    } else {
      return;
    }

    setBoxes([...boxes, { id: newId, x: newX, y: newY }]);
  };

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
      // Find the box being removed to check its column
      const removedBox = boxes.find((box) => box.id === boxId);
      if (removedBox?.x === 0) {
        decrement();
      }

      const updatedBoxes = boxes.filter((box) => box.id !== boxId);
      const rightColumnBoxes = updatedBoxes.filter((box) => box.x === 0);

      // Reposition remaining boxes
      const repositionedBoxes = rightColumnBoxes.map((box, index) => ({
        ...box,
        y: CONTAINER_HEIGHT - (index + 1) * (BOX_WIDTH + SPACING),
      }));

      setBoxes(repositionedBoxes);
    }
  };

  return (
    <motion.div ref={constraintsRef} style={constraints}>
      <div
        onDoubleClick={() => handleDoubleClick()}
        style={{ 
          width: COLUMN_WIDTH, 
          height: "100%", 
          float: "right",
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 5,
         }}
      />

      {boxes.map((box) => (
        <motion.div
          key={box.id}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          onDragEnd={(event, info) => handleDragEnd(event, info, box.id)}
          style={{
            ...boxStyle,
            right: `${box.x}px`,
            top: `${box.y}px`,
          }}
        />
      ))}
    </motion.div>
  );
}

const constraints = {
  width: 80,
  height: 520,
  borderRadius: 5,
  position: "relative" as const,
  marginBotton: 0,
};

const boxStyle = {
  width: 40,
  height: 40,
  backgroundColor: "#ff0088",
  borderRadius: 0,
  position: "absolute" as const,
  cursor: "grab",
};
