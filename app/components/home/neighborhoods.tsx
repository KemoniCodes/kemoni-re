"use client";
import React, { useEffect, useState } from "react";
// import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import type { Neighborhoods } from "@/sanity/types";

export default function Neighborhoods() {
  const [neighborhoodsData, setneighborhoodsData] =
    useState<Neighborhoods | null>(null);

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
      <div className='neighborhoods'>
        {neighborhoodsData.neighborhood?.map((hood, index) => (
          <h1 key={index}>{hood.neighborhoodName}</h1>
        ))}
      </div>
    </div>
  );
}
