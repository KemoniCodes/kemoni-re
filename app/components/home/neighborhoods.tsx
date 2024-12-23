"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import type { Neighborhoods } from "@/sanity/types";
import { ArrowDownRight } from "lucide-react";

export default function Neighborhoods() {
  const [neighborhoodsData, setneighborhoodsData] =
    useState<Neighborhoods | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        {neighborhoodsData.neighborhood?.map(
          (hood, index) => (
            
              <div className='name flex items-end justify-center ' key={index}>
                <h1 className='text-foreground transition-all duration-500 group-hover:opacity-40'>
                  {/*on hover of one link add active class to it and add inactive to the ones that are not hovered and without ay link hovered make them all white*/}
                  <Link
                    key={index}
                    href={`${hood.neighborhoodLink?.current}`}
                    className={`${activeIndex === index ? "active" : "inactive"}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {hood.neighborhoodName}
                  </Link>
                </h1>
                <span className=''>
                  <ArrowDownRight className='h-24 w-24' strokeWidth={1.6} />
                </span>
                <div className='absolute right-8 -top-1 z-40 h-20 w-16'>
                  <div className='relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-md'>
                    <img alt={hood?.nHMainImg?.asset} src={hood?.nHMainImg} className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            
          )
        )}
      </div>
    </div>
  );
}
