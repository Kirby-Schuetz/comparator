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

interface AnimatedConnection {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

interface LineCanvasProps {
  isDrawingMode: boolean;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  isAnimationPlaying: boolean;
}

export function LineCanvas({ isDrawingMode, connections, setConnections, isAnimationPlaying }: LineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<AnimatedConnection[]>([]);

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

  // Add function to convert block positions to coordinates
  const getConnectionCoordinates = (
    startBlock: Element, 
    endBlock: Element, 
    containerRect: DOMRect,
    isStartTop: boolean,
    isEndTop: boolean
  ) => {
    const startRect = startBlock.getBoundingClientRect();
    const endRect = endBlock.getBoundingClientRect();
    
    return {
      start: {
        x: startRect.right - containerRect.left,
        y: isStartTop 
          ? startRect.top - containerRect.top
          : startRect.bottom - containerRect.top
      },
      end: {
        x: endRect.left - containerRect.left,
        y: isEndTop 
          ? endRect.top - containerRect.top
          : endRect.bottom - containerRect.top
      }
    };
  };

  // Update drawConnection to include the top/bottom information
  const drawConnection = (
    ctx: CanvasRenderingContext2D, 
    containerRect: DOMRect, 
    startBlock: Element, 
    endBlock: Element,
    isStartTop: boolean,
    isEndTop: boolean,
    progress?: number
  ) => {
    const coords = getConnectionCoordinates(startBlock, endBlock, containerRect, isStartTop, isEndTop);
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(coords.start.x, coords.start.y);
    ctx.lineTo(coords.end.x, coords.end.y);
    ctx.stroke();

    // Draw animated dot if animation is playing
    if (isAnimationPlaying && progress !== undefined) {
      const x = coords.start.x + (coords.end.x - coords.start.x) * progress;
      const y = coords.start.y + (coords.end.y - coords.start.y) * progress;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0cdcf7';
      ctx.fill();
      ctx.shadowColor = '#0cdcf7';
      ctx.shadowBlur = 10;
      ctx.closePath();
    }
  };

  // Update the drawConnections function to handle animation state
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

    connections.forEach(conn => {
      const startBlock = leftBlocks[conn.start];
      const endBlock = rightBlocks[conn.end];
      
      if (startBlock && endBlock) {
        // Top connections for first blocks
        if (conn.start === 0 && conn.end === 0) {
          drawConnection(ctx, containerRect, startBlock, endBlock, true, true, isAnimationPlaying ? 1 : undefined);
        }
        
        // Bottom connections for last blocks
        if (conn.start === leftBlocks.length - 1 && conn.end === rightBlocks.length - 1) {
          drawConnection(ctx, containerRect, startBlock, endBlock, false, false, isAnimationPlaying ? 1 : undefined);
        }
      }
    });
  };

  // Find block index from click coordinates
  const findBlockIndex = (y: number, isLeftColumn: boolean): number => {
    const column = document.querySelector(isLeftColumn ? '.left-column' : '.right-column');
    if (!column) return -1;

    const blocks = Array.from(column.querySelectorAll('.block'));
    const clickedIndex = blocks.findIndex(block => {
      const rect = block.getBoundingClientRect();
      return y >= rect.top && y <= rect.bottom;
    });

    // Allow connections only from top (0) or bottom (length-1) blocks
    if (clickedIndex === 0 || clickedIndex === blocks.length - 1) {
      return clickedIndex;
    }

    return -1;
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
      const startBlockIndex = findBlockIndex(startPoint.y + rect.top, true);
      const endBlockIndex = findBlockIndex(e.clientY, false);
      
      if (startBlockIndex !== -1 && endBlockIndex !== -1) {
        // Check if this exact connection already exists
        const connectionExists = connections.some(conn => 
          conn.start === startBlockIndex && conn.end === endBlockIndex
        );

        if (!connectionExists) {
          setConnections(prev => [...prev, {
            start: startBlockIndex,
            end: endBlockIndex
          }]);
        }
      }
      
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
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

  // Update the animation effect to maintain connections
  useEffect(() => {
    if (!isAnimationPlaying) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const setup = setupCanvas(canvas);
      if (!setup) return;
      
      const { ctx, containerRect } = setup;
      drawConnections(ctx, containerRect);
      return;
    }

    let progress = 0;
    let animationFrame: number;

    const animate = () => {
      progress += 0.02; // Adjust speed here
      if (progress <= 1) {
        const canvas = canvasRef.current;
        if (canvas) {
          const setup = setupCanvas(canvas);
          if (setup) {
            const { ctx, containerRect } = setup;
            drawConnections(ctx, containerRect);
          }
        }
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isAnimationPlaying, connections]);

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