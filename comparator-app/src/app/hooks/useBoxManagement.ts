import { useState, useEffect } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import { Box, CONFIG } from "../types/shared";

// Configuration
export function useBoxManagement(columnId: 'left' | 'right') {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { leftState, leftDispatch } = useLeftBox();
  const { rightState, rightDispatch } = useRightBox();

  // Get the correct state and dispatch based on columnId
  const state = columnId === 'left' ? leftState : rightState;
  const dispatch = columnId === 'left' ? leftDispatch : rightDispatch;

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const event = new Event('resize');
      window.dispatchEvent(event);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [boxes]);

  // Update boxes when count changes
  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, state.count), CONFIG.MAX_BOXES);
    const currentCount = boxes.length;
    
    if (desiredCount > currentCount) {
      // Add boxes
      const newBoxes = [...boxes];
      for (let i = currentCount; i < desiredCount; i++) {
        newBoxes.push({
          id: crypto.randomUUID(),
          x: columnId === 'left' ? 0 : CONFIG.CONTAINER_WIDTH - CONFIG.BOX_WIDTH,
          y: CONFIG.CONTAINER_HEIGHT - (i + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING)        
        });
      }
      setBoxes(newBoxes);
    } else if (desiredCount < currentCount) {
      // Remove boxes
      const newBoxes = boxes.slice(0, desiredCount);
      const repositionedBoxes = newBoxes.map((box, index) => ({
        ...box,
        y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
      }));
      setBoxes(repositionedBoxes);
    }
  }, [boxes, state.count, columnId]);

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    const columnBoxes = updatedBoxes.filter(box => 
      columnId === 'left' ? box.x === 0 : box.x === CONFIG.CONTAINER_WIDTH - CONFIG.BOX_WIDTH
    );

    const repositionedBoxes = columnBoxes.map((box, index) => ({
      ...box,
      y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
    }));
    setBoxes(repositionedBoxes);
    dispatch({ type: "decrement" });
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    console.log('Adding box');
    const newId = crypto.randomUUID();
    const newY = CONFIG.CONTAINER_HEIGHT - (state.count + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING);
    
    const newBoxes = [...boxes, { 
      id: newId, 
      x: columnId === 'left' ? 0 : CONFIG.CONTAINER_WIDTH - CONFIG.BOX_WIDTH,
      y: newY 
    }];
    setBoxes(newBoxes);
    dispatch({ type: "increment" });
  };

  return { boxes, removeBox, addBox };
}
