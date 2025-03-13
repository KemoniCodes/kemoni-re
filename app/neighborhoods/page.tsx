"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import { Neighborhoods } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
import { useTransitionRouterWithEffect } from "../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

export default function NeighborhoodsPage() {
  const [nHData, setNHData] = useState<Neighborhoods | null>(null);

  const container = useRef<HTMLDivElement | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNeighborhoods();
        setNHData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      ".neighborhoodsPage h1"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroSubHeading = container.current?.querySelector(
      ".neighborhoodsPage .subtitle"
    ) as HTMLElement;
    if (!heroSubHeading) {
      console.error("Hero sub heading not found");
      return;
    }

    const heroText = new SplitType(heroHeading, { types: "chars" });
    console.log("SplitType output:", heroText.chars);

    gsap.set(heroText.chars, { y: 200 });

    gsap.to(heroText.chars, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 0.8,
    });

    const subHeroText = new SplitType(heroSubHeading, { types: "lines" });
    console.log("SplitType output:", subHeroText.lines);

    gsap.set(subHeroText.lines, { y: 200 });

    gsap.to(subHeroText.lines, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 1.3,
    });

    return () => {
      heroText.revert();
      subHeroText.revert();
    };
  }, [nHData]);

  if (!nHData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='neighborhoodsPage' ref={container}>
      {/* -z-10 */}

      <div
        className='heroContainer w-screen bg-cover h-[700px] relative top-0  -ml-8 -mt-16 pl-8'
        style={{
          backgroundImage: "url('/nhImg.png')",
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50' />
        <div className='heroText absolute bottom-0 pb-14'>
          <h1 className='whitespace-pre-wrap absolute'>neighborhoods</h1>
          <p className='subtitle'>Unveiling the Best of Local Living</p>
        </div>
      </div>
      <div className='neighborhoodsContainer mt-14 mx-14 grid grid-cols-3 gap-x-10 gap-y-10 mb-28'>
        {nHData?.neighborhood?.map((hood, index) => {
          const hoodBGImageUrl = hood?.nHMainImg?.asset?._ref
            ? urlFor(hood?.nHMainImg).url()
            : null;

          return (
            <Link
              href={`neighborhoods/${hood?.neighborhoodLink?.current}`}
              key={index}
              onClick={(e) =>
                navigateWithTransition(
                  `neighborhoods/${hood?.neighborhoodLink?.current}`,
                  e
                )
              }
            >
              <div className='neighborhood transitionHover' key={index}>
                <div
                  className='heroContainer w-full h-[400px] relative top-0 -z-10'
                  style={{
                    backgroundImage: hoodBGImageUrl
                      ? `url(${hoodBGImageUrl})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPositionX: "center",
                    alignContent: "center",
                  }}
                >
                  <div className='absolute inset-0 bg-black opacity-50' />
                  <div className='heroText z-10 relative justify-items-center'>
                    <h2 className='whitespace-pre-wrap'>
                      {hood?.neighborhoodName}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
