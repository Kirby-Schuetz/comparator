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
    <div className="flex flex-col items-center justify-center h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-left sm:items-start">
        <Image
          className="dark:invert"
          src="/comparator.png"
          alt="Comparator logo"
          width={180}
          height={38}
          priority
        />
        <LeftBoxProvider>
          <RightBoxProvider>
            <div>
              <ColumnContainer />
            </div>
            <div>
              <ControlPanel onDrawingModeChange={setIsDrawingMode} />
            </div>
          </RightBoxProvider>
        </LeftBoxProvider>
        <div></div>
        <LineCanvas isDrawingMode={isDrawingMode} />
      </main>
    </div>
  );
}
