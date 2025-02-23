"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/app/utils/imageUrl";
import { getNeighborhoods } from "@/sanity/sanity.query";
import type { Neighborhoods } from "@/sanity/types";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";

// import { ArrowDownRight } from "lucide-react";

export default function Neighborhoods() {
  const [neighborhoodsData, setneighborhoodsData] =
    useState<Neighborhoods | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const navigateWithTransition = useTransitionRouterWithEffect();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNeighborhoods();
        setneighborhoodsData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  console.log(neighborhoodsData?.neighborhood);

  if (!neighborhoodsData) {
    return <p>Neighborhoods not available.</p>;
  }
  return (
    <div className='neighborhoods section text-center'>
      <h2>serving</h2>
      <div className='neighborhood'>
        {neighborhoodsData.neighborhood?.map((hood, index) => (
          <div
            className='name flex items-end justify-center relative'
            key={index}
            onMouseMove={handleMouseMove}
          >
            <h1>
              <Link
                key={index}
                href={`/neighborhoods/${hood.neighborhoodLink?.current}`}
                className={`${activeIndex === index ? "active" : "inactive "}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(e) =>
                  navigateWithTransition(
                    `/neighborhoods/${hood.neighborhoodLink?.current}`,
                    e
                  )
                }
              >
                {hood.neighborhoodName}
              </Link>
            </h1>
            {/* <span>
              <ArrowDownRight className='h-24 w-24' strokeWidth={1.6} />
            </span> */}
            {activeIndex === index && (
              <div
                className={`pointer-events-none absolute  transition-opacity duration-800 delay-400 ease-in ${
                  activeIndex === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90 relative"
                }`}
                style={{
                  top: cursorPos.y,
                  left: cursorPos.x,
                  transform: "translate(30%, -55%)",
                }}
              >
                <Image
                  src={urlFor(hood?.nHMainImg).width(800).height(800).url()}
                  alt={`${hood?.nHMainImg?.alt}`}
                  width={800}
                  height={800}
                  className='h-[300px] w-[300px] object-cover rounded-lg'
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
