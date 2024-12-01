"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "../../utils/imageUrl";
import { getFeaturedListings } from "@/sanity/sanity.query";
import type { FeaturedListings } from "@/sanity/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const scrollWidth = container.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = scrollWidth - viewportWidth;

    gsap.to(container, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [featuredListingsData]);

  const listings = featuredListingsData;

  if (!listings?.featuredListing) {
    return <p>No listings available.</p>;
  }

  return (
    <div className='featuredListings relative w-screen !pt-24' ref={sectionRef}>
      <span className='title transition-all duration-300 ease-in-out'>
        <h2>featured</h2>
        <h1>listings</h1>
      </span>

      <div className='listings pt-6 flex gap-5 w-full' ref={containerRef}>
        {listings?.featuredListing.map((listing, index) => (
          <div
            className='listing flex flex-col flex-shrink-0 max-w-[324px]'
            key={index}
          >
            <Image
              src={urlFor(listing.homeThumbnail).width(500).height(500).url()}
              alt={`${listing.homeThumbnail?.alt}`}
              width={500}
              height={500}
            />
            <div className='homeInfo mt-5'>
              <h3>
                <b>{listing.address?.line1},</b>
              </h3>
              <h3>
                <b>{listing.address?.line2}</b>
              </h3>
              <h3 className='mt-3'>{listing.price}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
