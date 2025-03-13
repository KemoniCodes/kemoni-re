"use client";

import { useEffect, useState } from "react";
import { cn } from "../../../utils/utils";

interface TextProps {
  /**
   * Text to display
   */
  text: string;

  className?: string;
}

export default function TextBorderAnimation({
  text = "Programming",
  // className,
}: TextProps) {
  const [isHoveredIn, setIsHoveredIn] = useState(false);
  const [isHoveredOut, setIsHoveredOut] = useState(false);

  const handleHover = () => {
    setIsHoveredIn(true);
  };

  const handleHoverExit = () => {
    setIsHoveredIn(false);
    setIsHoveredOut(true);
  };

  useEffect(() => {
    if (isHoveredOut) {
      const timer = setTimeout(() => {
        setIsHoveredOut(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isHoveredOut]);

  return (
    <div
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverExit}
      className='overflow-hidden linkHover'
    >
      <span >{text}</span>
      <div className='relative h-[.8px] w-full'>
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full bg-casperWhite transition-transform duration-300 span1",
            isHoveredIn
              ? "translate-x-0 transform opacity-100"
              : "-translate-x-full transform opacity-0"
          )}
        ></div>
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full translate-x-0 transform bg-casperWhite opacity-0 transition-transform duration-300 span2",
            isHoveredOut && "translate-x-full opacity-100"
          )}
        ></div>
      </div>
    </div>
  );
}
