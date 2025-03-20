"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getForSaleProperties } from "@/sanity/sanity.query";
import { getForLeaseProperties } from "@/sanity/sanity.query";
import { Properties } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
import { useTransitionRouterWithEffect } from "../../../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePathname } from "next/navigation";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(useGSAP);

type SlidesType = {
  options?: EmblaOptionsType;
};

type ThumbProps = {
  selected: boolean;
  index: number;
  slideImg: string;
  onClick: () => void;
};

export default function PropertiesPage() {
  const [propertiesData, setPropertiesData] = useState<Properties | null>(null);
  const [leaseData, setLeaseData] = useState<Properties | null>(null);
  //   const [slidesData, setSlidesData] = useState<Properties | null>(null);
  const [optionsData, setOptionsData] = useState<SlidesType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slidesOptions: SlidesType = {
    options: optionsData?.options,
  };
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    slidesOptions.options ?? {}
  );
  setOptionsData(optionsData);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const container = useRef<HTMLDivElement | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const mainPathnameSlug = segments[1];
  const secondaryPathnameSlug = segments[2];

  useEffect(() => {
    async function fetchData() {
      if (mainPathnameSlug === "exclusive-listings") {
        try {
          const data = await getForSaleProperties();
          setPropertiesData(data);
        } catch (error) {
          console.error("Error fetching sale properties", error);
        }
      } else if (mainPathnameSlug === "featured-leases") {
        try {
          const data = await getForLeaseProperties();
          setLeaseData(data);
        } catch (error) {
          console.error("Error fetching lease properties", error);
        }
      }
    }
    fetchData();
  }, [mainPathnameSlug]);
  console.log(propertiesData);
  console.log(leaseData);

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
  }, [propertiesData, leaseData]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  if (mainPathnameSlug === "exclusive-listings" && !propertiesData) {
    return <h2>Loading...</h2>;
  }

  if (mainPathnameSlug === "featured-leases" && !leaseData) {
    return <h2>Loading...</h2>;
  }

  const dataOption =
    mainPathnameSlug === "exclusive-listings"
      ? propertiesData
      : mainPathnameSlug === "featured-leases"
        ? leaseData
        : propertiesData;

  const slugify = (input: string) => {
    if (!input) return null;
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200);
  };

  const currentProperty = dataOption?.property?.find((p) => {
    const addressLine1 = p?.address?.line1;
    if (!addressLine1) return false;
    const addressSlug = slugify(addressLine1);
    return secondaryPathnameSlug === addressSlug;
  });

  console.log(currentProperty);

  const slides = currentProperty?.gallery?.map((slide) => {
    return slide?.image;
  });

  console.log(slides);

  const Thumb: React.FC<ThumbProps> = ({
    selected,
    index,
    onClick,
    slideImg,
  }) => {
    return (
      <div
        className={`embla-thumbs__slide${selected ? " embla-thumbs__slide--selected" : ""}`}
      >
        <button
          onClick={onClick}
          type='button'
          className='embla-thumbs__slide__number'
          key={index}
        >
          <Image
            src={urlFor(slideImg).width(197).height(185).url()}
            alt=''
            height={185}
            width={197}
          />
        </button>
      </div>
    );
  };

  //   const headingText =
  //     mainPathnameSlug === "exclusive-listings"
  //       ? "Exclusive Listings"
  //       : mainPathnameSlug === "featured-leases"
  //         ? "Featured Leases"
  //         : "Neighborhoods";

  const subHeadingText =
    mainPathnameSlug === "exclusive-listings"
      ? "Explore our exclusive collection of distinguished properties.<br/>Arrange a private viewing at your convenience."
      : mainPathnameSlug === "featured-leases"
        ? "Featured Leases"
        : "Properties";

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
          <h1 className='whitespace-pre-wrap absolute'>
            {currentProperty?.address?.line1}
          </h1>
          <p
            className='subtitle pt-12'
            dangerouslySetInnerHTML={{
              __html: subHeadingText,
            }}
          />
        </div>
      </div>
      <div className='embla'>
        <div className='embla__viewport' ref={emblaMainRef}>
          <div className='embla__container'>
            {slides?.map((slide, index) => (
              <div className='embla__slide' key={index}>
                <div className='embla__slide__number'>
                  <Image
                    src={urlFor(slide).width(197).height(185).url()}
                    alt=''
                    height={185}
                    width={197}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='embla-thumbs'>
          <div className='embla-thumbs__viewport' ref={emblaThumbsRef}>
            <div className='embla-thumbs__container'>
              {slides?.map((slide, index) => (
                <Thumb
                  key={index}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  slideImg={
                    typeof slide === "string"
                      ? slide
                      : slide?.asset?._ref
                        ? urlFor(slide).url()
                        : ""
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='neighborhoodsContainer mt-14 mx-14  mb-28'>
        <div className='listings pt-6 grid grid-cols-3 gap-x-10 gap-y-20 w-full'>
          {dataOption?.property?.map((listing, index) => (
            <Link
              href={`properties/${listing?.homeURL?.current}`}
              key={index}
              onClick={(e) =>
                navigateWithTransition(
                  `properties/${listing?.homeURL?.current}`,
                  e
                )
              }
            >
              <div
                className='listing flex flex-col flex-shrink-0 w-full transitionHover'
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
                  <div className='flex mt-[10px] text-shadowGrey items-center'>
                    <h3 className='text-shadowGrey pr-2'>
                      {listing?.bedrooms} BD
                    </h3>
                    |
                    <h3 className='text-shadowGrey px-2'>
                      {listing?.bathrooms} BA
                    </h3>
                    |
                    <h3 className='text-shadowGrey pl-2'>
                      {listing?.sqft} SQFT
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
