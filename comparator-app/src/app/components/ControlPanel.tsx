"use client";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import Blocks from "./Blocks";

export default function ExitAnimation(): JSX.Element {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [column1Blocks, setColumn1Blocks] = useState<number>(0);
    const [column2Blocks, setColumn2Blocks] = useState<number>(0);

    const handleColumn1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = Number(e.target.value);
      setColumn1Blocks(Math.min(Math.max(0, value), 10));
    };
  
    const handleColumn2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = Number(e.target.value);
      setColumn2Blocks(Math.min(Math.max(0, value), 10));
    };

    // Callback to update control panel when blocks are added/removed via drag
    const handleBlocksUpdate = (col1Count: number, col2Count: number) => {
      setColumn1Blocks(col1Count);
      setColumn2Blocks(col2Count);
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
                              Column 1 (Blocks: {column1Blocks})
                            </label>
                            <input
                              id="column1Input"
                              type="text"
                              value={column1Blocks}
                              onChange={handleColumn1Change}
                              style={input}
                              min={0}
                              max={10}
                              placeholder="Enter number of blocks"
                            />
                          </div>
                          <div style={column}>
                            <label style={label} htmlFor="column2Input">
                              Column 2 (Blocks: {column2Blocks})
                            </label>
                            <input
                              id="column2Input"
                              type="text"
                              value={column2Blocks}
                              onChange={handleColumn2Change}
                              style={input}
                              min={0}
                              max={10}
                              placeholder="Enter number of blocks"
                            />
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
}

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