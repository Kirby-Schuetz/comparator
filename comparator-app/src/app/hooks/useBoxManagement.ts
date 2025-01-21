import { useState, useEffect } from "react";
import { useLeftBox } from "../context/left-box-context";
import { Box, CONFIG } from "../types/shared";

// Configuration
export function useBoxManagement() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { leftState, leftDispatch } = useLeftBox();

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
  }, [boxes,leftState.count]);

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    const leftColumnBoxes = updatedBoxes.filter(box => box.x === 0);

    const repositionedBoxes = leftColumnBoxes.map((box, index) => ({
      ...box,
      y: CONFIG.CONTAINER_HEIGHT - (index + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING),
    }));
    setBoxes(repositionedBoxes);
    leftDispatch({ type: "decrement" });
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    console.log('Adding box');
    const newId = crypto.randomUUID();
    const newY = CONFIG.CONTAINER_HEIGHT - (leftState.count + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING);
    
    const newBoxes = [...boxes, { id: newId, x: 0, y: newY }];
    setBoxes(newBoxes);
    leftDispatch({ type: "increment" });
  };

  return { boxes, removeBox, addBox };
}
