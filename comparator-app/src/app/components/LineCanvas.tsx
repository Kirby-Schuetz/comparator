"use client";

import { useEffect, useRef, useState } from 'react';

interface Connection {
  start: { x: number, y: number };
  end: { x: number, y: number };
}

export function LineCanvas({ isDrawingMode }: { isDrawingMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleScrollAndResize = () => {
      const columnContainer = document.querySelector('.flex.flex-row.justify-center');
      if (!columnContainer) return;

      const containerRect = columnContainer.getBoundingClientRect();
      const canvasParent = canvas.parentElement;
      if (!canvasParent) return;

      canvasParent.style.top = `${containerRect.top}px`;
      canvasParent.style.height = `${containerRect.height}px`;
      
      canvas.width = 400;
      canvas.height = containerRect.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      
      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.start.x, conn.start.y);
        ctx.lineTo(conn.end.x, conn.end.y);
        ctx.stroke();
      });
    };

    const scrollHandler = () => requestAnimationFrame(handleScrollAndResize);
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', handleScrollAndResize);
    handleScrollAndResize();
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, [connections]);

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
      setConnections(prev => [...prev, {
        start: startPoint,
        end: { x, y }
      }]);
      
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',
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