"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactElement } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import { Column } from './Column/Column';
import { FaPlay, FaStop } from 'react-icons/fa';

// Add prop interface
interface ControlPanelProps {
  onDrawingModeChange: (isDrawing: boolean) => void;
  onAutoComparator: (leftCount: number, rightCount: number) => void;
  isAutoComparatorVisible: boolean;
  onPlayAnimation: (isPlaying: boolean) => void;
  isAnimationPlaying: boolean;
}

const ControlPanel = ({ 
  onDrawingModeChange,
  onAutoComparator,
  isAutoComparatorVisible,
  onPlayAnimation,
  isAnimationPlaying
}: ControlPanelProps): ReactElement => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const { leftState, leftDispatch } = useLeftBox();
  const { rightState, rightDispatch } = useRightBox();
  
  // Simplify to just track locked state
  const [columns, setColumns] = useState({
    left: { isLocked: false },
    right: { isLocked: false }
  });

  const handleColumn1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), 10);
    leftDispatch({ type: "setCount", count: value });
  };

  const handleColumn2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), 10);
    rightDispatch({ type: "setCount", count: value });
  };

  // Update both mode handlers to manage column locks
  const handleCompareModeClick = () => {
    const newMode = !isCompareMode;
    setIsCompareMode(newMode);
    onDrawingModeChange(newMode);
    
    // Lock/unlock columns based on mode
    if (newMode) {
      setColumns(prev => ({
        left: { ...prev.left, isLocked: true },
        right: { ...prev.right, isLocked: true }
      }));
    } else if (!isAutoComparatorVisible) {
      // Only unlock if auto comparator is also off
      setColumns(prev => ({
        left: { ...prev.left, isLocked: false },
        right: { ...prev.right, isLocked: false }
      }));
    }
  };

  const handleAutoComparatorClick = () => {
    const newAutoMode = !isAutoComparatorVisible;
    onAutoComparator(leftState.count, rightState.count);
    
    // Lock/unlock columns based on mode
    if (newAutoMode) {
      setColumns(prev => ({
        left: { ...prev.left, isLocked: true },
        right: { ...prev.right, isLocked: true }
      }));
    } else if (!isCompareMode) {
      // Only unlock if compare mode is also off
      setColumns(prev => ({
        left: { ...prev.left, isLocked: false },
        right: { ...prev.right, isLocked: false }
      }));
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: 300,
      gap: "10px",
      position: "relative",
    },
    box: {
      width: "100%",
      height: "auto",
      backgroundColor: "#95a5a6",
      borderRadius: "10px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    button: {
      backgroundColor: "#0cdcf7",
      borderRadius: "10px",
      padding: "10px 20px",
      color: "#0f1115",
      width: "100%",
    },
    controlContent: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "20px",
      width: "100%",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      flex: 1,
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "100%",
    },
    label: {
      fontSize: "14px",
      fontWeight: "bold",
    },
    input: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "80px",
    },
    buttonStyle: {
      padding: '8px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
    },
    compareButton: {
      padding: '8px',
      borderRadius: '5px',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s ease',
    },
    playButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0cdcf7 0%, #0a9af0 100%)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(12, 220, 247, 0.3)',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 15px rgba(12, 220, 247, 0.4)',
      },
    },
  } as const;

  return (
    <div style={styles.container}>
      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={styles.box}
            key="box"
          >
            <div style={styles.controlContent}>
              <Column
                id="left"
                state={{
                  isLocked: columns.left.isLocked,
                  count: leftState.count
                }}
                label={columns.left.isLocked ? "Label" : "Input"}
                onLockToggle={() => setColumns(prev => ({
                  ...prev,
                  left: { ...prev.left, isLocked: !prev.left.isLocked }
                }))}
                onCountChange={handleColumn1Change}
              />

              <motion.button
                style={{
                  ...styles.playButton,
                  backgroundColor: isAnimationPlaying 
                    ? 'rgba(10, 154, 240, 0.1)'
                    : 'rgba(12, 220, 247, 0.1)',
                  borderColor: isAnimationPlaying
                    ? 'rgba(10, 154, 240, 0.3)'
                    : 'rgba(12, 220, 247, 0.3)',
                }}
                onClick={() => onPlayAnimation(!isAnimationPlaying)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {isAnimationPlaying ? <FaStop /> : <FaPlay />}
              </motion.button>

              <Column
                id="right"
                state={{
                  isLocked: columns.right.isLocked,
                  count: rightState.count
                }}
                label={columns.right.isLocked ? "Label" : "Input"}
                onLockToggle={() => setColumns(prev => ({
                  ...prev,
                  right: { ...prev.right, isLocked: !prev.right.isLocked }
                }))}
                onCountChange={handleColumn2Change}
              />
            </div>

            <div style={styles.buttonContainer}>
              <motion.button
                style={{
                  ...styles.compareButton,
                  backgroundColor: isCompareMode
                    ? 'rgba(10, 154, 240, 0.1)'
                    : 'rgba(12, 220, 247, 0.1)',
                  borderColor: isCompareMode
                    ? 'rgba(10, 154, 240, 0.3)'
                    : 'rgba(12, 220, 247, 0.3)',
                }}
                onClick={handleCompareModeClick}
                whileTap={{ scale: 0.95 }}
              >
                {isCompareMode ? 'Exit Compare Mode' : 'Enter Compare Mode'}
              </motion.button>

              <motion.button
                style={{
                  ...styles.compareButton,
                  backgroundColor: isAutoComparatorVisible
                    ? 'rgba(10, 154, 240, 0.1)'
                    : 'rgba(12, 220, 247, 0.1)',
                  borderColor: isAutoComparatorVisible
                    ? 'rgba(10, 154, 240, 0.3)'
                    : 'rgba(12, 220, 247, 0.3)',
                }}
                onClick={handleAutoComparatorClick}
                whileTap={{ scale: 0.95 }}
              >
                {isAutoComparatorVisible ? 'Turn Off Auto Comparison' : 'Turn On Auto Comparison'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        style={styles.button}
        onClick={() => setIsVisible(!isVisible)}
        whileTap={{ y: 1 }}
      >
        {isVisible ? "Hide Control Panel" : "Show Control Panel"}
      </motion.button>
    </div>
  );
};

export default ControlPanel;
