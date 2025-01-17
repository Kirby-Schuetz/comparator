"use client";

import * as motion from "motion/react-client";
import { useState, useRef } from "react";

export default function Blocks() {
  const [boxes, setBoxes] = useState<{ id: string; x: number; y: number }[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const SPACING = 12; // 1/3 cm = ~12px
  const BOX_WIDTH = 40;
  
  const COLUMN_WIDTH = BOX_WIDTH * 2.5; 
  const CONTAINER_HEIGHT = 520; 

  const handleDoubleClick = (column: "left" | "right") => {
    if (boxes.length >= 20) return; 
    
    const newId = boxes.length.toString();
    
    const leftColumnCount = boxes.filter(box => box.x === 0).length;
    const rightColumnCount = boxes.filter(box => box.x === COLUMN_WIDTH).length;
    
    let newX: number;
    let newY: number;

    if (column === "left" && leftColumnCount < 10) {
      newX = 0;
      newY = CONTAINER_HEIGHT - (leftColumnCount + 1) * (BOX_WIDTH + SPACING);
    } else if (column === "right" && rightColumnCount < 10) {
      newX = COLUMN_WIDTH; 
      newY = CONTAINER_HEIGHT - (rightColumnCount + 1) * (BOX_WIDTH + SPACING);
    } else {
      return;
    }

    setBoxes([...boxes, { id: newId, x: newX, y: newY }]);
  };

  const handleDragEnd = (event: any, info: any, boxId: string) => {
    const container = constraintsRef.current?.getBoundingClientRect();
    if (!container) return;

    const draggedRect = event.target.getBoundingClientRect();

    const isOutside = 
      draggedRect.left < container.left ||
      draggedRect.right > container.right ||
      draggedRect.top < container.top ||
      draggedRect.bottom > container.bottom;

//    * Removes box if dragged outside of the container
    if (isOutside) {
      const updatedBoxes = boxes.filter(box => box.id !== boxId);

      const leftColumnBoxes = updatedBoxes.filter(box => box.x === 0);
      const rightColumnBoxes = updatedBoxes.filter(box => box.x === COLUMN_WIDTH);
    
//    * Repositions boxes starting from the bottom when one is removed
      const repositionedBoxes = [
        ...leftColumnBoxes.map((box, index) => ({
          ...box,
          y: CONTAINER_HEIGHT - (index + 1) * (BOX_WIDTH + SPACING),
        })),
        ...rightColumnBoxes.map((box, index) => ({
          ...box,
          y: CONTAINER_HEIGHT - (index + 1) * (BOX_WIDTH + SPACING),
        }))
      ];

      setBoxes(repositionedBoxes);
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      style={constraints}
    >
      <div 
        onDoubleClick={() => handleDoubleClick("left")}
        style={{ width: COLUMN_WIDTH, height: "100%", float: "left" }}
      />
      <div 
        onDoubleClick={() => handleDoubleClick("right")}
        style={{ width: COLUMN_WIDTH, height: "100%", float: "right" }}
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
            left: `${box.x}px`,
            top: `${box.y}px`,
          }}
        />
      ))}
    </motion.div>
  );
}

const constraints = {
  width: 212, 
  height: 520, 
  borderRadius: 10,
  position: "relative" as const,
};

const boxStyle = {
  width: 40,
  height: 40,
  backgroundColor: "#ff0088",
  borderRadius: 0,
  position: "absolute" as const,
  cursor: 'grab',
};

