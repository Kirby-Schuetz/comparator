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

  // Get the container element
  const containerElement = document.querySelector('.flex.flex-row.justify-center');
  
  let midX = 0;
  let midY = 0;

  if (containerElement) {
    const containerRect = containerElement.getBoundingClientRect();
    // Calculate the middle point of the container
    midX = containerRect.width / 2;
    midY = containerRect.height / 2;
  }

  if (!isPlaying || !symbol) return null;

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