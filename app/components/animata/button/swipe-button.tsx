"use client";
import React from "react";

import { cn } from "../../../utils/utils";

interface SwipeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  firstText: string;
  secondText: string;
  className?: string;
  firstClass?: string;
  secondClass?: string;
}

export default function SwipeButton({
  className = "second",
  secondText = "Get access",
  firstText = "Get access",
  firstClass = "bg-orange-500 text-white",
  secondClass = "bg-black text-white",
  ...props
}: SwipeButtonProps) {
  const common = "block py-1 px-2 duration-300 ease-in-out";
  // const commonHover = "pt-[.5rem] pb-[.3rem] duration-300 ease-in-out block";

  return (
    <button
      {...props}
      className={cn("group relative min-w-fit overflow-hidden")}
    >
      <span
        className={cn(
          "absolute inset-0 translate-y-full group-hover:translate-y-0",
          common,
          secondClass
        )}
      >
        {secondText}
      </span>
      <span
        className={cn(
          "group-hover:-translate-y-full",
          className,
          common,
          firstClass
        )}
      >
        {firstText}
      </span>
    </button>
  );
}
