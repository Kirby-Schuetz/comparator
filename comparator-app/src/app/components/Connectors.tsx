// Line segment that snaps to the top box in one column has to snap to the top box in the other column
// This needs to stored/passed top box position for each column
// Line segment that snaps to the bottom box in one column has to snap to the bottom box in the other column
// This needs to stored/passed bottom box position for each column
// The line segments can only connect to the top

// When pressing the play button, the line segments need to animate into their comparative symbol
// Most likely an if then else statement that checks the top box position of each column and then animates the line segment to the top box position of the other column
import { motion } from 'framer-motion';
import { useConnections } from '../context/connection-context';
import { useState } from 'react';

export function Connections() {
  const { connectionPoints } = useConnections();
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Find the specific points for top and bottom connections
  const leftTop = connectionPoints.find(p => p.columnId === 'left' && p.type === 'top');
  const rightTop = connectionPoints.find(p => p.columnId === 'right' && p.type === 'top');
  const leftBottom = connectionPoints.find(p => p.columnId === 'left' && p.type === 'bottom');
  const rightBottom = connectionPoints.find(p => p.columnId === 'right' && p.type === 'bottom');

  return (
    <>
      <button
        onClick={() => setIsDrawingMode(!isDrawingMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: isDrawingMode ? '#2196f3' : '#ffffff',
          color: isDrawingMode ? '#ffffff' : '#000000',
          border: '2px solid #2196f3',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        {isDrawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode'}
      </button>

      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: isDrawingMode ? 'auto' : 'none',
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      >
        {/* Connection Points Indicators */}
        {isDrawingMode && connectionPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#2196f3"
            stroke="#ffffff"
            strokeWidth={2}
            style={{
              cursor: 'pointer',
            }}
          />
        ))}

        {/* Top Connection */}
        {leftTop && rightTop && (
          <motion.path
            key="top-connection"
            d={`
              M ${leftTop.x} ${leftTop.y}
              C ${leftTop.x + 100} ${leftTop.y},
                ${rightTop.x - 100} ${rightTop.y},
                ${rightTop.x} ${rightTop.y}
              `}
            stroke="#2196f3"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              stroke: "#2196f3"
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}

        {/* Bottom Connection */}
        {leftBottom && rightBottom && (
          <motion.path
            key="bottom-connection"
            d={`
              M ${leftBottom.x} ${leftBottom.y}
              C ${leftBottom.x + 100} ${leftBottom.y},
                ${rightBottom.x - 100} ${rightBottom.y},
                ${rightBottom.x} ${rightBottom.y}
              `}
            stroke="#2196f3"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              stroke: "#2196f3"
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </svg>
    </>
  );
}