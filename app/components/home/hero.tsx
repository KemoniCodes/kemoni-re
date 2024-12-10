"use client";
import React, { useState, useEffect } from "react";
import { getHero } from "@/sanity/sanity.query";
import type { Hero } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";

export default function Hero() {
  const [heroData, setHeroData] = useState<Hero | null>(null);

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

  const hero = heroData;

  const heroBGImageUrl = hero?.bgImg?.asset?._ref
    ? urlFor(hero?.bgImg).url()
    : null;

  console.log(hero);

  return (
    <div
      className='heroContainer w-full bg-cover h-full absolute top-0 -z-10 -ml-8 pl-8'
      style={{
        backgroundImage: heroBGImageUrl ? `url(${heroBGImageUrl})` : "none",
      }}
    >
      <div className='absolute inset-0 bg-black opacity-50' />

      <h1 className='hero absolute bottom-0 whitespace-pre-wrap'>
        {hero?.heroText}
      </h1>
    </div>
  );
}
