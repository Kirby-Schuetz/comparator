export interface Box {
  id: string;
  x: number;
  y: number;
  points?: number;
}

export interface ConnectionPoint {
  x: number;
  y: number;
  type: 'top' | 'bottom';
  columnId: 'left' | 'right';
}

export interface Connection {
  id: string;
  start: ConnectionPoint;
  end: ConnectionPoint | null;
  isAnimating: boolean;
}

export type ColumnId = 'left' | 'right';

// Configuration constants
export const CONFIG = {
  SPACING: 12,
  BOX_WIDTH: 40,
  MAX_BOXES: 10,
  CONTAINER_HEIGHT: 520,
  CONTAINER_WIDTH: 80,
} as const; 