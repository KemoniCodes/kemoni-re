"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "../../utils/imageUrl";
import { getForSaleProperties } from "@/sanity/sanity.query";
import type { Properties } from "@/sanity/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type PropType = {
  slides?: number[];
  options?: EmblaOptionsType;
};

export default function FeaturedListings() {
  const [featuredListingsData, setFeaturedListingsData] =
    useState<Properties | null>(null);
  const [optionsData, setOptionsData] = useState<PropType | null>(null);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    optionsData?.options ?? {}
  );

  useEffect(() => {
    if (!emblaMainApi) return;
  }, [emblaMainApi]);

  useEffect(() => setOptionsData({
    options: optionsData?.options,
  }), [optionsData?.options]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getForSaleProperties();
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

  useEffect(() => {
    if (!sectionRef.current) return;

    const heroHeading = sectionRef.current?.querySelector(
      ".featuredListings .title"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroText = new SplitType(heroHeading, { types: "words" });

    gsap.set(heroText.words, { y: 400, opacity: 0 });

    gsap.to(heroText.words, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.075,
      ease: "power4.out",
      scrollTrigger: {
        trigger: heroHeading,
        // start: "top 80%", // Adjust where the animation starts
        // end: "top 50%", // Adjust where it ends
        toggleActions: "play none none none",
      },
    });
  }, [featuredListingsData]);

  console.log(featuredListingsData);

  const listings = featuredListingsData;

  // if (!listings?.property) {
  //   return <p>No listings available.</p>;
  // }

  return (
    <>
      {Array.isArray(listings?.property) && listings.property.length > 1 ? (
        <motion.div
          className='featuredListings relative w-screen !pt-24'
          ref={sectionRef}
          //   initial={{ opacity: 0, y: -100 }}
          // whileInView={{ opacity: 1, y: 50 }}
          // onAnimationStart={() => console.log('Animation Started')}
        >
          <span className='title'>
            <h2>exclusive</h2>
            <h1>listings</h1>
          </span>

          <div className='embla listings pt-6  w-full'>
            <div className='embla__viewport' ref={emblaMainRef}>
              <div className='embla__container gap-4 !-ml-0'>
                {listings?.property?.map((listing, index) => (
                  <div
                    className='listing flex flex-col flex-shrink-0 max-w-[324px]'
                    key={index}
                  >
                    <Image
                      src={urlFor(listing.homeThumbnail)
                        .width(500)
                        .height(500)
                        .url()}
                      alt={`${listing.homeThumbnail?.alt}`}
                      width={500}
                      height={500}
                      className='rounded-lg'
                    />
                    <div className='homeInfo mt-5'>
                      <h3>
                        <b>{listing.address?.line1},</b>
                      </h3>
                      <h3>
                        <b>{listing.address?.line2}</b>
                      </h3>
                      <h3 className='mt-3'>${listing.price}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className='listings pt-6 lg:flex gap-5 w-full hidden'
            ref={containerRef}
          >
            {listings?.property?.map((listing, index) => (
              <div
                className='listing flex flex-col flex-shrink-0 max-w-[324px]'
                key={index}
              >
                <Image
                  src={urlFor(listing.homeThumbnail)
                    .width(500)
                    .height(500)
                    .url()}
                  alt={`${listing.homeThumbnail?.alt}`}
                  width={500}
                  height={500}
                  className='rounded-lg'
                />
                <div className='homeInfo mt-5'>
                  <h3>
                    <b>{listing.address?.line1},</b>
                  </h3>
                  <h3>
                    <b>{listing.address?.line2}</b>
                  </h3>
                  <h3 className='mt-3'>${listing.price}</h3>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
