// boundaries and positioning between both columns

"use client"
import * as motion from "motion/react-client";
import { useState, useRef } from "react";
import { useLeftBox } from '../context/left-box-context';
import { useRightBox } from '../context/right-box-context';
import { RightColumn } from './RightColumn';
import { LeftColumm } from './LeftColumn';
import Blocks from "./Blocks";

export default function Container() {
    const constraintsRef = useRef<HTMLDivElement>(null)

    return (
        <motion.div ref={constraintsRef} style={constraints}>
            <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.2}
               
            />
        </motion.div>
    )
}


const constraints = {
    width: 212, 
    height: 520, 
    borderRadius: 10,
    position: "relative" as const,
  };