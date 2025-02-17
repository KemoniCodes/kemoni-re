"use client";
import React, { useState, useEffect } from "react";
import { cn } from "../../../utils/utils";

interface SwipeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  firstText: string | React.ReactNode;
  secondText: string | React.ReactNode;
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
  // const [isClicked, setIsClicked] = useState(false);
  // const [selectFilter, setSelectFilter] = useState("");

  // const handleClick = () => {
  //   setIsClicked((prev) => !prev);
  // };

  // useEffect(() => {
  //   const selected = document.querySelectorAll(".currentFilter");
  //   if (selected.length > 1) {
  //     setSelectFilter(
  //       selected[1]?.children[0]?.lastChild?.innerText.toLowerCase()
  //     );
  //     // console.log(selected[1]?.children[0]?.lastChild?.innerText || "No text");
  //   } else {
  //     console.log("Element not found or not enough selected elements.");
  //   }
  // }, [isClicked]);

  // console.log(selectFilter);

  const common = "block py-1 px-2 duration-300 ease-in-out";

  return (
    <button
      {...props}
      // onClick={handleClick}
      className={cn("group relative min-w-fit overflow-hidden")}
    >
      <span
        className={cn(
          "absolute inset-0 translate-y-full group-hover:translate-y-0",
          common,
          // isClicked
          //   ? `bg-crimsonRed text-casperWhite currentFilter filter_${selectFilter}`
          //   :
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
          // isClicked
          //   ? `bg-crimsonRed text-casperWhite currentFilter filter_${selectFilter}`
          //   :
          firstClass
        )}
      >
        {firstText}
      </span>
    </button>
  );
}
