"use client";

import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Connection {
  start: number;
  end: number;
}

interface LineCanvasProps {
  isDrawingMode: boolean;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}

export function LineCanvas({ isDrawingMode, connections, setConnections }: LineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

  // Setup canvas dimensions and context
  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const columnContainer = document.querySelector('.flex.flex-row.justify-center');
    if (!columnContainer) return null;

    const containerRect = columnContainer.getBoundingClientRect();
    const canvasParent = canvas.parentElement;
    if (!canvasParent) return null;

    canvasParent.style.top = `${containerRect.top}px`;
    canvasParent.style.height = `${containerRect.height}px`;
    
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.strokeStyle = '#0cdcf7';
    ctx.shadowColor = '#0cdcf7';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;

    return { ctx, containerRect };
  };

  // Draw a single connection
  const drawConnection = (
    ctx: CanvasRenderingContext2D, 
    containerRect: DOMRect, 
    startBlock: Element, 
    endBlock: Element
  ) => {
    const startRect = startBlock.getBoundingClientRect();
    const endRect = endBlock.getBoundingClientRect();
    
    const startX = startRect.right - containerRect.left;
    const startY = startRect.top + (startRect.height / 2) - containerRect.top;
    const endX = endRect.left - containerRect.left;
    const endY = endRect.top + (endRect.height / 2) - containerRect.top;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  // Draw all connections
  const drawConnections = (ctx: CanvasRenderingContext2D, containerRect: DOMRect) => {
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');
    
    if (!leftColumn || !rightColumn) {
      console.log('Columns not found:', { leftColumn, rightColumn });
      return;
    }

    const leftBlocks = leftColumn.querySelectorAll('.block');
    const rightBlocks = rightColumn.querySelectorAll('.block');
    
    console.log('Connections to draw:', connections);
    console.log('Blocks found:', { 
      leftCount: leftBlocks.length, 
      rightCount: rightBlocks.length 
    });

    connections.forEach(conn => {
      const startBlock = leftBlocks[conn.start];
      const endBlock = rightBlocks[conn.end];
      
      if (startBlock && endBlock) {
        drawConnection(ctx, containerRect, startBlock, endBlock);
      } else {
        console.log('Blocks not found for connection:', {
          connection: conn,
          startBlock: !!startBlock,
          endBlock: !!endBlock
        });
      }
    });
  };

  // Find block index from click coordinates
  const findBlockIndex = (y: number, isLeftColumn: boolean): number => {
    const column = document.querySelector(isLeftColumn ? '.left-column' : '.right-column');
    if (!column) return -1;

    const blocks = Array.from(column.querySelectorAll('.block'));
    return blocks.findIndex(block => {
      const rect = block.getBoundingClientRect();
      return y >= rect.top && y <= rect.bottom;
    });

    // Return -1 if clicked block is not first or last
    if (clickedIndex !== 0 && clickedIndex !== blocks.length - 1) {
      return -1;
    }

    return clickedIndex;
  };

  // Handle canvas click events
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isDrawing) {
      setStartPoint({ x, y });
      setIsDrawing(true);
    } else if (startPoint) {
      const startBlockIndex = findBlockIndex(startPoint.y + rect.top, true);  // Left column
      const endBlockIndex = findBlockIndex(e.clientY, false);  // Right column
      
      if (startBlockIndex !== -1 && endBlockIndex !== -1) {
        setConnections(prev => [...prev, {
          start: startBlockIndex,
          end: endBlockIndex
        }]);
      }
      
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);  // Clear the preview point
    }
  };

  // Add mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setCurrentPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Update the drawing effect to include both preview and maintenance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawAll = () => {
      const setup = setupCanvas(canvas);
      if (!setup) return;

      const { ctx, containerRect } = setup;
      
      // Clear the canvas before redrawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw existing connections
      drawConnections(ctx, containerRect);
      
      // Draw preview line if we're currently drawing
      if (isDrawing && startPoint && currentPoint) {
        ctx.beginPath();
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Make the preview line dashed
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
      }
    };

    // Set up event listeners
    const scrollHandler = () => requestAnimationFrame(drawAll);
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', drawAll);
    
    // Initial draw
    drawAll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', drawAll);
    };
  }, [connections, isDrawing, startPoint, currentPoint]);

  // Add effect to clear connections when drawing mode is turned off
  useEffect(() => {
    if (!isDrawingMode) {
      setConnections([]);
    }
  }, [isDrawingMode, setConnections]);

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '1100px',
      backgroundColor: isDrawingMode 
        ? 'rgba(10, 25, 47, 0.3)' // Dark blue with transparency
        : 'transparent',
      border: isDrawingMode 
        ? '1px solid rgba(12, 220, 247, 0.2)'
        : 'none',
      boxShadow: isDrawingMode 
        ? 'inset 0 0 20px rgba(12, 220, 247, 0.05)'
        : 'none',
      zIndex: 100,
      pointerEvents: isDrawingMode ? 'auto' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      />
    </div>
  );
} 