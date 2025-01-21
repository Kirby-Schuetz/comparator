"use client";
import Image from "next/image";
import ControlPanel from "./components/ControlPanel";
// import Blocks from "./components/Blocks";
import { LeftBoxProvider } from "./context/left-box-context";
import { RightBoxProvider } from "./context/right-box-context";
import ColumnContainer from "./components/ColumnContainer";
import { LineCanvas } from './components/LineCanvas';
import { useState } from "react";

export default function Home() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 w-full max-w-5xl">
        <div className="flex justify-center w-full">
          <Image
            className="dark:invert"
            src="/comparator.png"
            alt="Comparator logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <LeftBoxProvider>
          <RightBoxProvider>
            <div className="w-full">
              <ColumnContainer />
            </div>
            <div className="w-full flex justify-center">
              <ControlPanel onDrawingModeChange={setIsDrawingMode} />
            </div>
          </RightBoxProvider>
        </LeftBoxProvider>
        <div className="w-full">
          <LineCanvas isDrawingMode={isDrawingMode} />
        </div>
      </main>
    </div>
  );
}
