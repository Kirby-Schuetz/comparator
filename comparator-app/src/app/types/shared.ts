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
}

export interface ConnectionPoint {
  x: number;      // x position on page
  y: number;      // y position on page
  columnId: 'left' | 'right';  // which column the box is in
  boxId: string;  // which box was clicked
}

export interface Connection {
  id: string;
  start: ConnectionPoint;  // where the line starts
  end: ConnectionPoint;    // where the line ends
}

export type ColumnId = 'left' | 'right'; 