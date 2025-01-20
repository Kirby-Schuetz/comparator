import { useState, useEffect } from 'react';
import { useConnections } from '../context/connection-context';
import { useLeftBox } from '../context/left-box-context';
import { useRightBox } from '../context/right-box-context';
import { Box, ConnectionPoint, ColumnId, CONFIG } from '../types/shared';

export function useColumnManagement(
  columnId: ColumnId,
  constraintsRef: React.RefObject<HTMLDivElement>
) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { updateConnectionPoint } = useConnections();
  
  const context = columnId === 'left' ? useLeftBox() : useRightBox();
  const { state, dispatch } = context;

  // Points calculation
  const updateBoxPoints = (boxArray: Box[]): Box[] => {
    if (boxArray.length === 0) return [];
    return boxArray.map((box, index) => ({
      ...box,
      points: index === 0 ? 10 : 
             index === boxArray.length - 1 ? 1 : 
             undefined
    }));
  };

  // Connection points update
  useEffect(() => {
    if (!constraintsRef.current) {
      updateConnectionPoint([]);
      return;
    }

    const containerRect = constraintsRef.current.getBoundingClientRect();
    const xPosition = columnId === 'left' ? 
      containerRect.left + CONFIG.BOX_WIDTH + 15 : 
      containerRect.left - 15;

    const topY = boxes.length > 0 
      ? boxes[0].y + (CONFIG.BOX_WIDTH / 2)
      : containerRect.top + CONFIG.BOX_WIDTH / 2;
    
    const bottomY = boxes.length > 0 
      ? boxes[boxes.length - 1].y + (CONFIG.BOX_WIDTH / 2)
      : containerRect.bottom - CONFIG.BOX_WIDTH / 2;

    const newConnectionPoints: ConnectionPoint[] = [
      { x: xPosition, y: topY, type: 'top', columnId },
      { x: xPosition, y: bottomY, type: 'bottom', columnId }
    ];

    updateConnectionPoint(newConnectionPoints);
  }, [boxes, updateConnectionPoint, constraintsRef, columnId]);

  // Box count management
  useEffect(() => {
    const desiredCount = Math.min(Math.max(0, state.count), CONFIG.MAX_BOXES);
    const currentCount = boxes.length;
    
    if (desiredCount !== currentCount) {
      const newBoxes = Array.from({ length: desiredCount }, (_, i) => ({
        id: crypto.randomUUID(),
        x: 0,
        y: CONFIG.CONTAINER_HEIGHT - (i + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING)
      }));
      setBoxes(updateBoxPoints(newBoxes));
    }
  }, [state.count]);

  const removeBox = (boxId: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== boxId);
    setBoxes(updateBoxPoints(updatedBoxes));
    dispatch({ type: 'decrement' });
  };

  const addBox = () => {
    if (boxes.length >= CONFIG.MAX_BOXES) return;
    const newId = crypto.randomUUID();
    const newY = CONFIG.CONTAINER_HEIGHT - (boxes.length + 1) * (CONFIG.BOX_WIDTH + CONFIG.SPACING);
    const newBoxes = [...boxes, { id: newId, x: 0, y: newY }];
    setBoxes(updateBoxPoints(newBoxes));
    dispatch({ type: 'increment' });
  };

  return { boxes, addBox, removeBox };
} 