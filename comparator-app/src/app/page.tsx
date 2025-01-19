import Image from "next/image";
import ControlPanel from "./components/ControlPanel";
// import Blocks from "./components/Blocks";
import { LeftBoxProvider } from "./context/left-box-context";
import { RightBoxProvider } from "./context/right-box-context";
import Container from "./components/Container";

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
          <RightBoxProvider>
            <div>
              <Container>
                <div></div>
              </Container>
            </div>
            <div>
              <ControlPanel />
            </div>
          </RightBoxProvider>
        </LeftBoxProvider>
        <div></div>
      </main>
    </div>
  );
}
