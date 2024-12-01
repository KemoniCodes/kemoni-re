"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "../../utils/imageUrl";
import { getFeaturedListings } from "@/sanity/sanity.query";
import type { FeaturedListings } from "@/sanity/types";

export default function FeaturedListings() {
  const [featuredListingsData, setFeaturedListingsData] =
    useState<FeaturedListings | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFeaturedListings();
        setFeaturedListingsData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  const listings = featuredListingsData;

  if (!listings?.featuredListing) {
    return <p>No listings available.</p>;
  }


  return (
    <div className='featuredListings section'>
      <span className='title'>
        <h2>featured</h2>
        <h1>listings</h1>
      </span>
      <div className='listings container mt-6'>
        {listings?.featuredListing.map((listing, index) => (
          <div className='listing col-span-3' key={index}>
            <Image
              src={urlFor(listing.homeThumbnail).width(500).height(500).url()}
              alt={`${listing.homeThumbnail?.alt}`}
              width={500}
              height={500}
            />
            <div className="homeInfo mt-5">
                <h3>
                    <b>{listing.address?.line1},</b>
                </h3>
                <h3>
                    <b>{listing.address?.line2}</b>
                </h3>
                <h3 className="mt-3">{listing.price}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
