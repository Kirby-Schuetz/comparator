"use client";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";

interface ColumnContainerProps {
  isAutoComparatorVisible: boolean;
}

export default function ColumnContainer({ isAutoComparatorVisible }: ColumnContainerProps) {
  const columnClasses = "w-[40%] relative";
  
  return (
    <div className="flex flex-row justify-center items-center h-[650px] gap-8 p-8 relative">
      <div className={`left-column ${columnClasses}`}>
        <LeftColumn isAutoComparatorVisible={isAutoComparatorVisible} />
      </div>
      <div className={`right-column ${columnClasses}`}>
        <RightColumn isAutoComparatorVisible={isAutoComparatorVisible} />
      </div>
    </div>
  );
}
