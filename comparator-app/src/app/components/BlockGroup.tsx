"use client";

// import { motion } from "framer-motion";
import Block from "./Block";

interface BlockGroupProps {
  id: string;
  isDraggable: boolean;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent) => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
  columnId: 'left' | 'right';
  isTop: boolean;
  isBottom: boolean;
}

export function BlockGroup({
  id,
  isDraggable,
  onDragEnd,
  constraintsRef,
}: BlockGroupProps) {
  return (
    <div className="block-group">
      <Block
        id={id}
        isDraggable={isDraggable}
        onDragEnd={onDragEnd}
        constraintsRef={constraintsRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
}