"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactElement } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import { Column } from './Column/Column';

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

  // Update the click handler to only handle compare mode
  const handleCompareModeClick = () => {
    const newMode = !isCompareMode;
    setIsCompareMode(newMode);
    onDrawingModeChange(newMode);
  };

  const handleAutoComparatorClick = () => {
    onAutoComparator(leftState.count, rightState.count);
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
                  backgroundColor: isCompareMode ? '#ff0088' : '#0cdcf7',
                }}
                onClick={handleCompareModeClick}
                whileTap={{ scale: 0.95 }}
              >
                {isCompareMode ? 'Exit Compare Mode' : 'Enter Compare Mode'}
              </motion.button>

              <motion.button
                style={{
                  ...styles.compareButton,
                  backgroundColor: isAutoComparatorVisible ? '#ff0088' : '#0cdcf7',
                }}
                onClick={handleAutoComparatorClick}
                whileTap={{ scale: 0.95 }}
              >
                {isAutoComparatorVisible ? 'Turn Off Auto Comparison' : 'Turn On Auto Comparison'}
              </motion.button>

              <motion.button
                style={{
                  ...styles.compareButton,
                  backgroundColor: isAnimationPlaying ? '#ff0088' : '#0cdcf7',
                }}
                onClick={() => onPlayAnimation(!isAnimationPlaying)}
                whileTap={{ scale: 0.95 }}
              >
                {isAnimationPlaying ? 'Stop Animation' : 'Play Animation'}
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
