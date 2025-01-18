// right column container
// onClick adding box
// box positioning
// drag remove box
// repositioning boxes after removing a box
// tracking individual box count

"use client";

import * as motion from "motion/react-client";
import { useState, useRef } from "react";
import { useRightBox } from '../context/right-box-context';

export default function RightColumn() {
  const [boxes, setBoxes] = useState<{ id: string; x: number; y: number }[]>([]);
  const {rightState, rightDispatch} = useRightBox();

  const constraintsRef = useRef<HTMLDivElement>(null);

  const SPACING = 12; // 1/3 cm = ~12px
  const BOX_WIDTH = 40;
  
  const COLUMN_WIDTH = BOX_WIDTH * 2.5; 
  const CONTAINER_HEIGHT = 520; 

  const increment = () => {
    rightDispatch({ type: 'increment' });
  }

  const decrement = () => {
    rightDispatch({ type: 'decrement' });
  }

  const handleDoubleClick = () => {
    if (boxes.length >= 10) return; 
    
//  * Generates box ID
    const newId = boxes.length.toString();
    
//  * Counts boxes in each column
    const rightColumnCount = rightState.count;
    
    let newX: number;
    let newY: number;

//  * Positions new box
    if (rightColumnCount < 10) {
      newX = 0;
      increment();
      newY = CONTAINER_HEIGHT - (rightState.count) * (BOX_WIDTH + SPACING);
    } else if (rightColumnCount < 10) {
      newX = COLUMN_WIDTH; 
      newY = CONTAINER_HEIGHT - (rightColumnCount + 1) * (BOX_WIDTH + SPACING);
    } else {
      return;
    }

    setBoxes([...boxes, { id: newId, x: newX, y: newY }]);
  };

  const handleDragEnd = (event: any, info: any, boxId: string) => {

//  * Container boundaries
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
      const rightColumnBoxes = updatedBoxes.filter(box => box.x === 0);
      decrement();

//    * Repositions boxes starting from the bottom when one is removed
      const repositionedBoxes = [
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
        onDoubleClick={() => handleDoubleClick()}
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
            right: `${box.x}px`,
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