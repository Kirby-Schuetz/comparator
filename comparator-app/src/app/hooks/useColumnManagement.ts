import { useState, useEffect } from 'react';
import { Box, ColumnId, CONFIG } from '../types/shared';
import { useColumns } from '../context/columns-context';

export function useColumnManagement(
  columnId: ColumnId
) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { count, increment, decrement } = useColumns(columnId);

  const updateBoxPoints = (boxArray: Box[]): Box[] => {
    if (boxArray.length === 0) return [];
    return boxArray.map((box, index) => ({
      ...box,
      points: index === 0 ? 10 : 
             index === boxArray.length - 1 ? 1 : 
             undefined
    }));
  };

  // Box count effect
  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, count), CONFIG.MAX_BOXES);
    const currentCount = boxes.length;
    
    if (desiredCount !== currentCount) {
      const newBoxes = Array.from({ length: desiredCount }, (_, i) => ({
        id: crypto.randomUUID(),
        x: 0,
        y: CONFIG.CONTAINER_HEIGHT - (i + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING)
      }));
      setBoxes(updateBoxPoints(newBoxes));
    }
  }, []);

  const removeBox = (boxId: string) => {
    setBoxes(prev => {
      const updatedBoxes = prev.filter(box => box.id !== boxId);
      return updateBoxPoints(updatedBoxes);
    });
    decrement();
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    
    const newBox = {
      id: crypto.randomUUID(),
      x: 0,
      y: CONFIG.CONTAINER_HEIGHT - (boxes.length + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING)
    };
    
    setBoxes(prev => updateBoxPoints([...prev, newBox]));
    increment();
  };

  return { boxes, addBox, removeBox };
}