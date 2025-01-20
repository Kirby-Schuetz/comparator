// Line segment that snaps to the top box in one column has to snap to the top box in the other column
// This needs to stored/passed top box position for each column
// Line segment that snaps to the bottom box in one column has to snap to the bottom box in the other column
// This needs to stored/passed bottom box position for each column
// The line segments can only connect to the top

// When pressing the play button, the line segments need to animate into their comparative symbol
// Most likely an if then else statement that checks the top box position of each column and then animates the line segment to the top box position of the other column
// import { motion } from 'framer-motion';
import { useConnections } from '../context/connection-context';
import { useState } from 'react';

interface ConnectionPoint {
  x: number;
  y: number;
  type: 'top' | 'bottom';
  columnId: string;
}

export function Connections() {
  const { connectionPoints, isDrawingMode, setIsDrawingMode } = useConnections();
  const [connections, setConnections] = useState<Array<{start: ConnectionPoint, end: ConnectionPoint}>>([]);
  const [activeConnection, setActiveConnection] = useState<{start: ConnectionPoint}>();

  const handlePointClick = (point: ConnectionPoint) => {
    if (!activeConnection) {
      setActiveConnection({ start: point });
    } else {
      // Only allow connecting points of the same type (top-to-top or bottom-to-bottom)
      // and from different columns
      if (point.type === activeConnection.start.type && 
          point.columnId !== activeConnection.start.columnId) {
        // Check if this connection already exists
        const connectionExists = connections.some(
          conn => 
            (conn.start === activeConnection.start && conn.end === point) ||
            (conn.start === point && conn.end === activeConnection.start)
        );

        if (!connectionExists) {
          setConnections(prev => [...prev, { start: activeConnection.start, end: point }]);
        }
      }
      setActiveConnection(undefined);
    }
  };

  // Clear all connections when exiting drawing mode
  const handleDrawingModeToggle = () => {
    setIsDrawingMode(!isDrawingMode);
    if (isDrawingMode) {
      setActiveConnection(undefined);
      setConnections([]);
    }
  };

  return (
    <>
      <button
        onClick={handleDrawingModeToggle}
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
          zIndex: 1000,
        }}
      >
        {/* Connection Points */}
        {isDrawingMode && connectionPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={8}
            fill={activeConnection?.start === point ? "#ff0088" : "#2196f3"}
            stroke="#ffffff"
            strokeWidth={3}
            style={{ 
              cursor: 'pointer',
              filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
            }}
            onClick={() => handlePointClick(point)}
          />
        ))}

        {/* Existing Connections */}
        {isDrawingMode && connections.map((connection, index) => (
          <line
            key={`connection-${index}`}
            x1={connection.start.x}
            y1={connection.start.y}
            x2={connection.end.x}
            y2={connection.end.y}
            stroke="#2196f3"
            strokeWidth={4}
            style={{
              filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
            }}
          />
        ))}

        {/* Active Connection Line */}
        {isDrawingMode && activeConnection && (
          <line
            x1={activeConnection.start.x}
            y1={activeConnection.start.y}
            x2={activeConnection.start.x}
            y2={activeConnection.start.y}
            stroke="#2196f3"
            strokeWidth={4}
            opacity={0.5}
            style={{
              filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
            }}
          />
        )}
      </svg>
    </>
  );
}