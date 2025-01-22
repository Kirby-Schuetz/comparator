"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ComparisonAnimationProps {
  leftValue: number;
  rightValue: number;
  isPlaying: boolean;
  connectionStart: { x: number; y: number };
  connectionEnd: { x: number; y: number };
}

export function ComparisonAnimation({ 
  leftValue, 
  rightValue, 
  isPlaying,
  connectionStart,
  connectionEnd 
}: ComparisonAnimationProps) {
  const [symbol, setSymbol] = useState<'<' | '>' | '='>();
  
  useEffect(() => {
    if (leftValue < rightValue) setSymbol('<');
    else if (leftValue > rightValue) setSymbol('>');
    else setSymbol('=');
  }, [leftValue, rightValue]);

  // Calculate the midpoint between connection points for symbol placement
  const midX = (connectionStart.x + connectionEnd.x) / 2;
  const midY = (connectionStart.y + connectionEnd.y) / 2;

  const variants = {
    hidden: { 
      opacity: 0,
      scale: 0,
      rotate: -180
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  if (!isPlaying || !symbol) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      style={{
        position: 'absolute',
        left: midX,
        top: midY,
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#ff0088',
        zIndex: 200,
      }}
    >
      {symbol}
    </motion.div>
  );
} 