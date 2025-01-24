"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactElement } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import { Column } from './Column';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

// Add prop interface
interface ControlPanelProps {
  onDrawingModeChange: (isDrawing: boolean) => void;
  onAutoComparator: (leftCount: number, rightCount: number) => void;
  isAutoComparatorVisible: boolean;
  onPlayAnimation: (isPlaying: boolean) => void;
  isAnimationPlaying: boolean;
  onReset: () => void;
  onClearConnections: () => void;
}

const ControlPanel = ({ 
  onDrawingModeChange,
  onAutoComparator,
  isAutoComparatorVisible,
  onPlayAnimation,
  isAnimationPlaying,
  onReset,
  onClearConnections
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
    } else {
      // Clear connections when exiting compare mode
      onClearConnections();
      
      if (!isAutoComparatorVisible) {
        // Only unlock if auto comparator is also off
        setColumns(prev => ({
          left: { ...prev.left, isLocked: false },
          right: { ...prev.right, isLocked: false }
        }));
      }
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

  // Add reset handler
  const handleReset = () => {
    // Reset local state
    setIsCompareMode(false);
    onDrawingModeChange(false);
    
    // Reset columns
    setColumns({
      left: { isLocked: false },
      right: { isLocked: false }
    });
    
    // Reset box counts
    leftDispatch({ type: "setCount", count: 0 });
    rightDispatch({ type: "setCount", count: 0 });
    
    // Call parent reset handler
    onReset();
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
      backgroundColor: 'rgba(23, 36, 63, 0.9)',  // Midnight with opacity
      borderRadius: "10px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      border: '2px solid rgba(120, 140, 227, 0.2)',  // Royal with opacity
    },
    controlContent: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      width: "100%",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "100%",
    },
    compareButton: {
      padding: '15px 20px',
      borderRadius: '10px',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: 'rgba(120, 140, 227, 0.3)',  // Royal with opacity
      color: '#ECE9DF',  // Sand
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s ease',
      backgroundColor: 'rgba(120, 140, 227, 0.15)',  // Royal with opacity
      backdropFilter: 'blur(5px)',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px',
      fontSize: '14px',
      fontWeight: '800',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(120, 140, 227, 0.25)',  // Royal with opacity
        boxShadow: '0 0 20px rgba(120, 140, 227, 0.2)',  // Royal with opacity
        borderColor: 'rgba(120, 140, 227, 0.4)',  // Royal with opacity
      },
    },
    playButton: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(120, 140, 227, 0.1)',  // Royal with opacity
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: 'rgba(120, 140, 227, 0.3)',  // Royal with opacity
      color: '#788CE3',  // Royal
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 0 15px rgba(120, 140, 227, 0.1)',  // Royal with opacity
      fontSize: '32px',
      '&:hover': {
        backgroundColor: 'rgba(120, 140, 227, 0.15)',  // Royal with opacity
        boxShadow: '0 0 25px rgba(120, 140, 227, 0.2)',  // Royal with opacity
        borderColor: 'rgba(120, 140, 227, 0.4)',  // Royal with opacity
      },
    },
    label: {
      fontSize: '14px',
      fontWeight: "bold",
      color: '#788CE3',  // Royal
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px',
      textShadow: '0 0 10px rgba(120, 140, 227, 0.2)',  // Royal with opacity
    },
    input: {
      padding: '30px',
      borderRadius: '20px',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: 'rgba(120, 140, 227, 0.3)',  // Royal with opacity
      backgroundColor: 'rgba(23, 36, 63, 0.7)',  // Midnight with opacity
      color: '#788CE3',  // Royal
      width: '100%',
      transition: 'all 0.2s ease',
      fontSize: '84px',
      fontWeight: '800',
      textAlign: 'center' as const,
      minWidth: '180px',
      height: '168px',
      lineHeight: '1',
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
      },
      '&[type=number]': {
        MozAppearance: 'textfield',
      },
      '&:focus': {
        outline: 'none',
        borderColor: '#788CE3',  // Royal
        boxShadow: '0 0 30px rgba(120, 140, 227, 0.2)',  // Increased glow
      },
      '&:hover': {
        borderColor: 'rgba(120, 140, 227, 0.4)',
      },
    },
    button: {
      padding: '10px 20px',
      borderRadius: '10px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgba(120, 140, 227, 0.3)',  // Royal with opacity
      backgroundColor: 'rgba(120, 140, 227, 0.1)',  // Royal with opacity
      color: '#788CE3',  // Royal
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px',
      fontSize: '15px',
      fontWeight: 'bold' as const,
      textShadow: '0 0 10px rgba(120, 140, 227, 0.2)',  // Royal with opacity
      '&:hover': {
        backgroundColor: 'rgba(120, 140, 227, 0.15)',  // Royal with opacity
        boxShadow: '0 0 20px rgba(120, 140, 227, 0.2)',  // Royal with opacity
        borderColor: 'rgba(120, 140, 227, 0.4)',  // Royal with opacity
      },
    },
    activeButton: {
      backgroundColor: 'rgba(120, 140, 227, 0.25)',  // Royal with opacity
      borderColor: 'rgba(120, 140, 227, 0.5)',  // Royal with opacity
      color: '#788CE3',  // Royal
      fontWeight: '800',
      textShadow: '0 0 10px rgba(120, 140, 227, 0.3)',  // Royal with opacity
    },
    resetButton: {
      backgroundColor: 'rgba(223, 244, 120, 0.15)',  // Neon with opacity
      borderColor: 'rgba(223, 244, 120, 0.4)',  // Neon with opacity
      color: '#ECE9DF',  // Sand
      fontWeight: '800',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(223, 244, 120, 0.25)',  // Neon with opacity
        borderColor: 'rgba(223, 244, 120, 0.5)',  // Neon with opacity
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
                state={{
                  isLocked: columns.left.isLocked,
                  count: leftState.count
                }}
                label={"Left"}
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
                {isAnimationPlaying ? 
                  <StopIcon className="w-4 h-4" /> : 
                  <PlayIcon className="w-4 h-4" />
                }
              </motion.button>

              <Column
                state={{
                  isLocked: columns.right.isLocked,
                  count: rightState.count
                }}
                label={"Right"}
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
                  ...(isCompareMode ? styles.activeButton : {}),
                }}
                onClick={handleCompareModeClick}
                whileTap={{ scale: 0.95 }}
              >
                {isCompareMode ? 'Exit Compare Mode' : 'Enter Compare Mode'}
              </motion.button>

              <motion.button
                style={{
                  ...styles.compareButton,
                  ...(isAutoComparatorVisible ? styles.activeButton : {}),
                }}
                onClick={handleAutoComparatorClick}
                whileTap={{ scale: 0.95 }}
              >
                {isAutoComparatorVisible ? 'Turn Off Auto Comparison' : 'Turn On Auto Comparison'}
              </motion.button>

              <motion.button
                style={{
                  ...styles.compareButton,
                  ...styles.resetButton,
                }}
                onClick={handleReset}
                whileTap={{ scale: 0.95 }}
              >
                Reset All
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
