import { useState, useEffect } from 'react';
import { Box, ConnectionPoint, ColumnId, CONFIG } from '../types/shared';
import { useColumns } from '../context/columns-context';
import { useConnections } from '../context/connection-context';

export function useColumnManagement(
  columnId: ColumnId,
  constraintsRef: React.RefObject<HTMLDivElement>
) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { count, increment, decrement } = useColumns(columnId);
  const { updateConnectionPoint } = useConnections();

  const updateBoxPoints = (boxArray: Box[]): Box[] => {
    if (boxArray.length === 0) return [];
    return boxArray.map((box, index) => ({
      ...box,
      points: index === 0 ? 10 : 
             index === boxArray.length - 1 ? 1 : 
             undefined
    }));
  };

  // Connection points effect
  useEffect(() => {
    if (!constraintsRef.current) {
      updateConnectionPoint([]);
      return;
    }

    const containerRect = constraintsRef.current.getBoundingClientRect();
    const topY = boxes.length > 0 
      ? boxes[0].y + (CONFIG.BOX_WIDTH / 2)
      : containerRect.top + CONFIG.BOX_WIDTH / 2;
    
    const bottomY = boxes.length > 0 
      ? boxes[boxes.length - 1].y + (CONFIG.BOX_WIDTH / 2)
      : containerRect.bottom - CONFIG.BOX_WIDTH / 2;

    const xPosition = columnId === 'left'
      ? containerRect.left + CONFIG.BOX_WIDTH + 15
      : containerRect.left - 15;

    const newConnectionPoints: ConnectionPoint[] = [
      { x: xPosition, y: topY, type: 'top', columnId },
      { x: xPosition, y: bottomY, type: 'bottom', columnId }
    ];

    updateConnectionPoint(newConnectionPoints);
  }, [boxes, updateConnectionPoint, constraintsRef, columnId]);

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
  }, [count]);

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