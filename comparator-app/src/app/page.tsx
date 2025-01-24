"use client";
import Image from "next/image";
import ControlPanel from "./components/ControlPanel";
// import Blocks from "./components/Blocks";
import { LeftBoxProvider } from "./context/left-box-context";
import { RightBoxProvider } from "./context/right-box-context";
import ColumnContainer from "./components/ColumnContainer";
import { LineCanvas } from './components/LineCanvas';
import { useState } from "react";
import ComparisonAnimationWrapper from "./components/ComparisonAnimationWrapper";
import { Connection } from "./types/shared";

export default function Home() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isAutoComparatorVisible, setIsAutoComparatorVisible] = useState(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);

  const handleAutoComparator = (leftCount: number, rightCount: number) => {
    const newIsVisible = !isAutoComparatorVisible;
    setIsAutoComparatorVisible(newIsVisible);
    
    if (!newIsVisible) {
      setConnections(prev => prev.filter(conn => 
        !(conn.start === 0 && conn.end === 0) && 
        !(conn.start === leftCount - 1 && conn.end === rightCount - 1)
      ));
      return;
    }

    if (leftCount === 0 || rightCount === 0) return;

    const manualConnections = connections.filter(conn => 
      !(conn.start === 0 && conn.end === 0) && 
      !(conn.start === leftCount - 1 && conn.end === rightCount - 1)
    );
    
    const autoConnections: Connection[] = [
      { start: 0, end: 0 },
      { start: leftCount - 1, end: rightCount - 1 }
    ];
    
    setConnections([...manualConnections, ...autoConnections]);
  };

  const handleReset = () => {
    // Clear connections
    setConnections([]);
    // Turn off animation if playing
    setIsAnimationPlaying(false);
    // Turn off auto comparator if on
    setIsAutoComparatorVisible(false);
  };

  const handleClearConnections = () => {
    setConnections([]);
  };
  
  return (
    <div className="flex flex-col items-center h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 w-full max-w-5xl">
        <LeftBoxProvider>
          <RightBoxProvider>
            <ColumnContainer isAutoComparatorVisible={isAutoComparatorVisible} />
            <div className="w-full flex justify-center">
              <ControlPanel 
                onDrawingModeChange={setIsDrawingMode}
                onAutoComparator={handleAutoComparator}
                isAutoComparatorVisible={isAutoComparatorVisible}
                onPlayAnimation={setIsAnimationPlaying}
                isAnimationPlaying={isAnimationPlaying}
                onReset={handleReset}
                onClearConnections={handleClearConnections}
              />
            </div>
            <LineCanvas 
              isDrawingMode={isDrawingMode && !isAnimationPlaying}
              connections={connections}
              setConnections={setConnections}
              isAnimationPlaying={isAnimationPlaying}
            />
            
            <ComparisonAnimationWrapper 
              connections={connections}
              isAnimationPlaying={isAnimationPlaying}
            />
          </RightBoxProvider>
        </LeftBoxProvider>
      </main>
    </div>
  );
}
