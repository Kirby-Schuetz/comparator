// boundaries and positioning between both columns

"use client";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";

export default function Container() {
  return (
    <div>
      <div className="flex flex-row justify-center items-center h-[500px] gap-8 p-8 bg-gray-100 relative">
        <LeftColumn />
        <RightColumn />
      </div>
    </div>
  );
}
