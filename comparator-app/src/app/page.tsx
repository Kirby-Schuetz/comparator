
import Image from "next/image";
import ControlPanel from "./components/ControlPanel";
import Blocks from "./components/Blocks";
import { LeftBoxProvider } from './context/left-box-context';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-left justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-left sm:items-start">
        <Image
          className="dark:invert"
          src="/comparator.png"
          alt="Comparator logo"
          width={180}
          height={38}
          priority
        />
        <LeftBoxProvider>
          <div className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <Blocks />
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
          <ControlPanel></ControlPanel>
          </div>
        </LeftBoxProvider>

      </main>
      
    </div>
  );
}


