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

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

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
  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;

    const { ctx, containerRect } = setup;
    
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
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
  const findBlockIndex = (y: number): number => {
    const blocks = Array.from(document.querySelectorAll('.block'));
    return blocks.findIndex(block => {
      const rect = block.getBoundingClientRect();
      return y >= rect.top && y <= rect.bottom;
    });
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
      const startBlockIndex = findBlockIndex(startPoint.y + rect.top);
      const endBlockIndex = findBlockIndex(e.clientY);
      
      if (startBlockIndex !== -1 && endBlockIndex !== -1) {
        setConnections(prev => [...prev, {
          start: startBlockIndex,
          end: endBlockIndex
        }]);
      }
      
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  // Setup event listeners and handle redraws
  useEffect(() => {
    console.log('Effect triggered with connections:', connections);
    const scrollHandler = () => requestAnimationFrame(drawConnections);
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', drawConnections);
    drawConnections();
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', drawConnections);
    };
  }, [connections]);

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '1100px',
      backgroundColor: isDrawingMode ? 'rgba(255,255,255,0.1)' : 'transparent',
      zIndex: 100,
      pointerEvents: isDrawingMode ? 'auto' : 'none',
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      />
    </div>
  );
} 