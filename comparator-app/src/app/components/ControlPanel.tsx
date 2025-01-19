"use client";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState, ReactElement } from "react";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import { useConnections } from "../context/connection-context";

const ControlPanel = (): ReactElement => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { leftState, leftDispatch } = useLeftBox();
  const { rightState, rightDispatch } = useRightBox();
  const { showConnections, setShowConnections } = useConnections();

  const handleColumn1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), 10);
    leftDispatch({ type: "setCount", count: value });
  };

  const handleColumn2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), 10);
    rightDispatch({ type: "setCount", count: value });
  };

  return (
    <div style={container}>
      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={box}
            key="box"
          >
            <div style={controlContent}>
              <div style={column}>
                <label style={label} htmlFor="column1Input">
                  Column 1
                </label>
                <input
                  id="column1Input"
                  type="text"
                  value={leftState.count}
                  onChange={handleColumn1Change}
                  style={input}
                  min={0}
                  max={10}
                  placeholder="Enter number of blocks"
                />
              </div>
            </div>
            <div style={controlContent}>
              <div style={column}>
                <label style={label} htmlFor="column2Input">
                  Column 2
                </label>
                <input
                  id="column2Input"
                  type="text"
                  value={rightState.count}
                  onChange={handleColumn2Change}
                  style={input}
                  min={0}
                  max={10}
                  placeholder="Enter number of blocks"
                />
                <button
                  onClick={() => setShowConnections(!showConnections)}
                  className="control-button"
                >
                  {showConnections ? "Hide Connections" : "Show Connections"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        style={button}
        onClick={() => setIsVisible(!isVisible)}
        whileTap={{ y: 1 }}
      >
        {isVisible ? "Hide Control Panel" : "Show Control Panel"}
      </motion.button>
    </div>
  );
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 300,
  gap: "20px",
  position: "relative",
};

const box: React.CSSProperties = {
  width: "100%",
  height: "120px",
  backgroundColor: "#95a5a6",
  borderRadius: "10px",
  padding: "10px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
};

const button: React.CSSProperties = {
  backgroundColor: "#0cdcf7",
  borderRadius: "10px",
  padding: "10px 20px",
  color: "#0f1115",
  position: "absolute",
  top: 130,
  left: 0,
  right: 0,
};

const controlContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "20px",
  width: "100%",
};

const column: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const label: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "bold",
};

const input: React.CSSProperties = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "80px",
};

export default ControlPanel;
