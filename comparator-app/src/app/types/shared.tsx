export const CONFIG = {
  SPACING: 12,
  BOX_WIDTH: 40,
  MAX_BOXES: 10,
  CONTAINER_HEIGHT: 520,
  CONTAINER_WIDTH: 80,
} as const;

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

export type ColumnId = 'left' | 'right';

export type BoxAction = 
  | { type: 'increment' } 
  | { type: 'decrement' } 
  | { type: 'setCount'; count: number };

export type BoxDispatch = (action: BoxAction) => void;

export interface BoxState {
  count: number;
} 