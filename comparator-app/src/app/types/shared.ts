export const CONFIG = {
  SPACING: 12,
  BOX_WIDTH: 40,
  MAX_BOXES: 10,
  CONTAINER_HEIGHT: 520,
} as const;

export interface Box {
  id: string;
  x: number;
  y: number;
}


export type ColumnId = 'left' | 'right'; 