// boundaries and positioning between both columns

"use client";
import RightColumn from "./RightColumn";
import LeftColumn from "./LeftColumn";

export default function Container() {
  return (
    <div>
      <LeftColumn></LeftColumn>
      <RightColumn></RightColumn>
    </div>
  );
}
