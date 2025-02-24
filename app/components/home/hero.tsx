"use client";
import React, { useState, useEffect, useRef } from "react";
import { getHero } from "@/sanity/sanity.query";
import type { Hero } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const [heroData, setHeroData] = useState<Hero | null>(null);

  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHero();
        setHeroData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  // useGSAP(() => {
  //   if (!container.current) return;

  //   setTimeout(() => {
  //     const heroHeading = container.current?.querySelector(
  //       "h1.hero"
  //     ) as HTMLElement;
  //     if (!heroHeading) {
  //       console.error("Hero heading not found");
  //       return;
  //     }

  //     const heroText = new SplitType(heroHeading, { types: "chars" });
  //     console.log("SplitType output:", heroText.chars); // Check if chars exist

  //     gsap.set(heroText.chars, { y: 400 });

  //     gsap.to(heroText.chars, {
  //       y: 0,
  //       duration: 1,
  //       stagger: 0.075,
  //       ease: "power4.out",
  //       delay: 1,
  //     });
  //   },100); // Small delay to ensure text is present
  // });

  useEffect(() => {
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      "h1.hero"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroText = new SplitType(heroHeading, { types: "chars" });
    console.log("SplitType output:", heroText.chars);

    gsap.set(heroText.chars, { y: 400 });

    gsap.to(heroText.chars, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 1,
    });

    return () => {
      heroText.revert();
    };
  }, [heroData]);

  const hero = heroData;

  const heroBGImageUrl = hero?.bgImg?.asset?._ref
    ? urlFor(hero?.bgImg).url()
    : null;

  console.log(hero);

  return (
    <div
      ref={container}
      className='heroContainer w-full bg-cover h-full absolute top-0 -z-10 -ml-8 pl-8'
      style={{
        backgroundImage: heroBGImageUrl ? `url(${heroBGImageUrl})` : "none",
      }}
    >
      <div className='absolute inset-0 bg-black opacity-50' />

      <h1 className='hero absolute -bottom-24 whitespace-pre-wrap -right-[37%] w-[90vw]'>
        {hero?.heroText}
      </h1>
    </div>
  );
}
