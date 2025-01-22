import { Connection } from "../types/shared";
import { useLeftBox } from "../context/left-box-context";
import { useRightBox } from "../context/right-box-context";
import ComparisonAnimation from "./ComparisonAnimation";

export default function ComparisonAnimationWrapper({ 
    connections, 
    isAnimationPlaying 
  }: { 
    connections: Connection[],
    isAnimationPlaying: boolean 
  }) {
    const { leftState } = useLeftBox();
    const { rightState } = useRightBox();
  
    return (
      <>
        {connections.map((connection, index) => (
          <ComparisonAnimation
            key={index}
            leftValue={leftState.count}
            rightValue={rightState.count}
            isPlaying={isAnimationPlaying}
            connectionStart={connection.start}
            connectionEnd={connection.end}
          />
        ))}
      </>
    );
  }