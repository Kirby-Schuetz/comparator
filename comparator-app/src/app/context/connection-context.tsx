"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';


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
}

export const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [leftPoints, setLeftPoints] = useState<ConnectionPoint[]>([]);
  const [rightPoints, setRightPoints] = useState<ConnectionPoint[]>([]);
  const [showConnections, setShowConnections] = useState(false);

  const updateConnectionPoint = useCallback((points: ConnectionPoint[]) => {
    if (points.length === 0) {
      // Clear points for the respective column
      return;
    }
    
    // Update points based on columnId
    const columnId = points[0].columnId;
    if (columnId === 'left') {
      setLeftPoints(points);
    } else if (columnId === 'right') {
      setRightPoints(points);
    }
  }, []);

  // Combine points for components that need all connection points
  const allConnectionPoints = [...leftPoints, ...rightPoints];

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
      connectionPoints: allConnectionPoints,
      showConnections,
      setShowConnections,
      updateConnectionPoint,
      startConnection,
      completeConnection,
      animateConnections
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};