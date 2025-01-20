"use client";

// import { motion } from "framer-motion";
import Block from "./Blocks";
import { useConnections } from "../context/connection-context";
import { PanInfo } from "framer-motion";
import { useEffect } from "react";

interface BlockGroupProps {
  id: string;
  x: number;
  y: number;
  points?: number;
  isDraggable: boolean;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
  columnId: 'left' | 'right';
  isTop: boolean;
  isBottom: boolean;
}

export function BlockGroup({
  id,
  x,
  y,
  points,
  isDraggable,
  onDragEnd,
  constraintsRef,
  columnId,
  isTop,
  isBottom
}: BlockGroupProps) {
  const { isDrawingMode } = useConnections();

  return (
    <div style={{ position: 'relative' }}>
      <Block
        id={id}
        x={x}
        y={y}
        points={points}
        isDraggable={isDraggable}
        onDragEnd={onDragEnd}
        constraintsRef={constraintsRef}
      />
    </div>
  );
}