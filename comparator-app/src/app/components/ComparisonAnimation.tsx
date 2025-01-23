"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ComparisonAnimationProps {
  leftValue: number;
  rightValue: number;
  isPlaying: boolean;
  connectionStart: number;
  connectionEnd: number;
}

const styles = {
  symbol: {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '8rem',
    fontWeight: '800',
    color: '#64c8ff',
    textShadow: `
      0 0 30px rgba(100, 200, 255, 0.6),
      0 0 60px rgba(100, 200, 255, 0.4)
    `,
    zIndex: 200,
    pointerEvents: 'none',
  }
};

const variants = {
  hidden: { 
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  visible: { 
    opacity: 1,
    scale: 1.2,
    rotate: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0,
    rotate: 180,
    transition: {
      duration: 0.5
    }
  }
};

export default function ComparisonAnimation({ 
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

  // Get the columns and their blocks
  const leftColumn = document.querySelector('.left-column');
  const rightColumn = document.querySelector('.right-column');
  const leftBlocks = leftColumn?.querySelectorAll('.block');
  const rightBlocks = rightColumn?.querySelectorAll('.block');
  
  // Check if we have valid columns and blocks
  if (!leftBlocks || !rightBlocks) return null;

  // Determine if this is a valid connection
  const isValidConnection = (
    // Case 1: Top of first blocks connection
    (connectionStart === 0 && connectionEnd === 0) ||
    
    // Case 2: Bottom of last blocks connection
    (connectionStart === leftBlocks.length - 1 && 
     connectionEnd === rightBlocks.length - 1) ||
    
    // Case 3: Single block case - both top and bottom connections
    (leftBlocks.length === 1 && rightBlocks.length === 1 &&
     ((connectionStart === 0 && connectionEnd === 0) || // top connection
      (connectionStart === 0 && connectionEnd === 0)))  // bottom connection
  );

  // Only show animation if all conditions are met
  if (!isPlaying || !symbol || !isValidConnection) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      style={styles.symbol}
    >
      {symbol}
    </motion.div>
  );
} 