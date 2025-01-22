export const CONFIG = {
  SPACING: 12,
  BOX_WIDTH: 40,
  MAX_BOXES: 10,
  CONTAINER_HEIGHT: 520,
  CONTAINER_WIDTH: 40,
} as const;

export interface Box {
  id: string;
  x: number;
  y: number;
}


export type ColumnId = 'left' | 'right'; 


export interface Connection {
  start: number;
  end: number;
}