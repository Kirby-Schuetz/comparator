"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';


interface ConnectionPoint {
  x: number;
  y: number;
  type: 'top' | 'bottom';
  columnId: 'left' | 'right';
}

interface Connection {
  id: string;
  start: ConnectionPoint;
  end: ConnectionPoint | null;
  isAnimating: boolean;
}

interface ConnectionContextType {
  connections: Connection[];
  connectionPoints: ConnectionPoint[];
  updateConnectionPoint: (points: ConnectionPoint[]) => void;
  startConnection: (from: ConnectionPoint) => void;
  completeConnection: (to: ConnectionPoint) => void;
  animateConnections: () => void;
  showConnections: boolean;
  setShowConnections: (show: boolean) => void;
  isDrawingMode: boolean;
  setIsDrawingMode: (mode: boolean) => void;
  addConnectionPoint: (point: ConnectionPoint) => void;
}

export const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [connectionPoints, setConnectionPoints] = useState<ConnectionPoint[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showConnections, setShowConnections] = useState(false);

  const addConnectionPoint = (point: ConnectionPoint) => {
    setConnectionPoints(prev => {
      // Check if point already exists to avoid duplicates
      const exists = prev.some(p => 
        p.x === point.x && 
        p.y === point.y && 
        p.type === point.type && 
        p.columnId === point.columnId
      );
      if (!exists) {
        return [...prev, point];
      }
      return prev;
    });
  };

  // Clear only connections when exiting drawing mode
  useEffect(() => {
    if (!isDrawingMode) {
      setConnections([]); // Only clear connections
    }
  }, [isDrawingMode]);

  const updateConnectionPoint = useCallback((points: ConnectionPoint[]) => {
    if (points.length === 0) {
      // If points are empty, only clear points for the specific column
      const columnId = points[0]?.columnId;
      if (columnId) {
        setConnectionPoints(prev => prev.filter(p => p.columnId !== columnId));
      }
      return;
    }
    
    // Update points for the specific column while preserving the other column's points
    const columnId = points[0].columnId;
    setConnectionPoints(prev => {
      const otherPoints = prev.filter(p => p.columnId !== columnId);
      return [...otherPoints, ...points];
    });
  }, []);

  const startConnection = (from: ConnectionPoint) => {
    // Only allow one connection per point type
    const newConnection: Connection = {
      id: crypto.randomUUID(),
      start: from,
      end: null,
      isAnimating: false
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const completeConnection = (to: ConnectionPoint) => {
    setConnections(prev => 
      prev.map(conn => {
        if (!conn.end && conn.start.type === to.type) {
          return { ...conn, end: to };
        }
        return conn;
      })
    );
  };

  const animateConnections = () => {
    setConnections(prev => 
      prev.map(conn => ({ ...conn, isAnimating: true }))
    );
  };

  return (
    <ConnectionContext.Provider value={{ 
      connections, 
      connectionPoints, 
      showConnections, 
      setShowConnections,
      updateConnectionPoint,
      startConnection,
      completeConnection,
      animateConnections,
      isDrawingMode, 
      setIsDrawingMode,
      addConnectionPoint 
    }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};