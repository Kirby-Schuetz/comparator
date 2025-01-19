// boundaries and positioning between both columns

"use client";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";

export default function Container() {
  return (
    <div>
      <div className="flex flex-row justify-center items-center h-auto gap-8 p-8 bg-gray-100">
        <LeftColumn></LeftColumn>
        <RightColumn></RightColumn>
      </div>
    </div>
  );
}