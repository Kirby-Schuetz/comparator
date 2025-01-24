"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ComparisonAnimationProps {
  leftValue: number;
  rightValue: number;
  isPlaying: boolean;
}

const styles = {
  symbol: {
    position: 'absolute' as const,
    fontSize: '8rem',
    fontWeight: '800',
    color: '#64c8ff',
    textShadow: `
      0 0 30px rgba(100, 200, 255, 0.6),
      0 0 60px rgba(100, 200, 255, 0.4)
    `,
    zIndex: 200,
    pointerEvents: 'none' as const,
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
}: ComparisonAnimationProps) {
  const [symbol, setSymbol] = useState<'<' | '>' | '='>();
  const [position, setPosition] = useState({ top: '50%' });
  
  useEffect(() => {
    if (leftValue < rightValue) setSymbol('<');
    else if (leftValue > rightValue) setSymbol('>');
    else setSymbol('=');

    // Find the boxes containers
    const leftContainer = document.querySelector('.boxes-container');
    const rightContainer = document.querySelector('.boxes-container.right');

    if (leftContainer && rightContainer) {
      const leftRect = leftContainer.getBoundingClientRect();
      const rightRect = rightContainer.getBoundingClientRect();
      
      // Calculate vertical center of the stacks
      const leftCenter = leftRect.top + (leftRect.height / 2);
      const rightCenter = rightRect.top + (rightRect.height / 2);
      const centerY = (leftCenter + rightCenter) / 2;

      // Convert to percentage relative to container
      const container = document.querySelector('main');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const topPercentage = ((centerY - containerRect.top) / containerRect.height) * 100;
        setPosition({ top: `${topPercentage}%` });
      }
    }
  }, [leftValue, rightValue]);

  if (!isPlaying || !symbol) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      style={{
        ...styles.symbol,
        position: 'absolute',
        top: position.top,
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {symbol}
    </motion.div>
  );
} 