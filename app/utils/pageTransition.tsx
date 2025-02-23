"use client";

import { useTransitionRouter } from "next-view-transitions";

export function slideInOut() {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.1,
        transform: "translateY(-35%)",
      },
    ],
    {
      duration: 1500,
      easing: "cubic-bezier(0.87,0,0.13,1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );
  document.documentElement.animate(
    [
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      },
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      },
    ],
    {
      duration: 1500,
      easing: "cubic-bezier(0.87,0,0.13,1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

export function useTransitionRouterWithEffect() {
  const router = useTransitionRouter();

  const navigateWithTransition = (
    path: string,
    event: { preventDefault: () => void }
  ) => {
    if (event) event.preventDefault();
    router.push(path, {
      onTransitionReady: slideInOut,
    });
  };

  return navigateWithTransition;
}
