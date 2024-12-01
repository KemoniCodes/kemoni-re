"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import type { Neighborhoods } from "@/sanity/types";

export default function Neighborhoods() {
  const [neighborhoodsData, setneighborhoodsData] = useState<Neighborhoods |null>(null);

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
        {neighborhoodsData.neighborhood?.map((hood, index) => (
          <h1 key={index}>
            {/*on hover of one link add active class to it and add inactive to the ones that are not hovered and without ay link hovered make them all white*/}
            <Link
              key={index}
              href={`${hood.neighborhoodLink?.current}`}
              className={activeIndex === index ? "active" : "inactive"}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {hood.neighborhoodName}
            </Link>
          </h1>
        ))}
      </div>
    </div>
  );
}
