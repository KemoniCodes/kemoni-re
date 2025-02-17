"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import { Neighborhoods } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";

export default function NeighborhoodsPage() {
  const [nHData, setNHData] = useState<Neighborhoods | null>(null);

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

  return (
    <div className='neighborhoodsPage'>
      <div
        className='heroContainer w-screen bg-cover h-[700px] relative top-0 -z-10 -ml-8 -mt-16 pl-8'
        style={{
          backgroundImage: "url('/nhImg.png')",
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50' />
        <div className='heroText absolute bottom-0 pb-14'>
          <h1 className='whitespace-pre-wrap'>neighborhoods</h1>
          <p className='subtitle'>Unveiling the Best of Local Living</p>
        </div>
      </div>
      <div className='neighborhoodsContainer mt-14 mx-14 grid grid-cols-3 gap-x-10 gap-y-10 mb-28'>
        {nHData?.neighborhood?.map((hood, index) => {
          const hoodBGImageUrl = hood?.nHMainImg?.asset?._ref
            ? urlFor(hood?.nHMainImg).url()
            : null;

          return (
            <Link href={`neighborhoods/${hood?.neighborhoodLink?.current}`} key={index}>
              <div className='neighborhood transform transition-transform duration-300 ease-in-out hover:-translate-y-2 group' key={index}>
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
