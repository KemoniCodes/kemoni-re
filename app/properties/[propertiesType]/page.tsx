"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getForSaleProperties } from "@/sanity/sanity.query";
import { getForLeaseProperties } from "@/sanity/sanity.query";
import { Properties } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePathname } from "next/navigation";
import { Slider } from "@heroui/slider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { X, Search, ChevronDown } from "lucide-react";
import { Button } from "@heroui/react";

gsap.registerPlugin(useGSAP);

export default function PropertiesPage() {
  const [propertiesData, setPropertiesData] = useState<Properties | null>(null);
  const [leaseData, setLeaseData] = useState<Properties | null>(null);
  const [value, setValue] = useState<number | number[]>([500000, 10000000]);
  const [sqftValue, setSqftValue] = useState<number | number[]>([
    500.0, 10000.0,
  ]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  const container = useRef<HTMLDivElement | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const mainPathnameSlug = segments[1];

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

  const dataOption =
    mainPathnameSlug === "exclusive-listings"
      ? propertiesData
      : mainPathnameSlug === "featured-leases"
        ? leaseData
        : propertiesData;

  const headingText =
    mainPathnameSlug === "exclusive-listings"
      ? "Exclusive Listings"
      : mainPathnameSlug === "featured-leases"
        ? "Featured Leases"
        : "Neighborhoods";

  const subHeadingText =
    mainPathnameSlug === "exclusive-listings"
      ? "Explore our exclusive collection of distinguished properties.<br/>Arrange a private viewing at your convenience."
      : mainPathnameSlug === "featured-leases"
        ? "Featured Leases"
        : "Properties";

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getForLeaseProperties();
        setLeaseData(data);
      } catch (error) {
        console.error("Error fetching lease properties", error);
      }
    }
    fetchData();
  }, []);

  const selectedValue = Array.from(selectedKeys)
    .join(", ")
    .replace(/_/g, " ")
    .replace("-", " ");

  const forSaleAreas = propertiesData?.property?.map((a) => a?.area) || [];
  const forLeaseAreas = leaseData?.property?.map((a) => a?.area) || [];
  const allAreas = [
    ...new Set([
      ...forSaleAreas.filter((area) => area !== undefined),
      ...forLeaseAreas.filter((area) => area !== undefined),
    ]),
  ].map((area) => ({
    key: area,
    label: area.replace("-", " "),
  }));
  console.log(allAreas);

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedKeys(keys); // Update selected keys
  };

  const formatPrice = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(".0", "") + "m";
    }
    return (num / 1000).toFixed(0) + "k";
  };

  const formatFootage = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "k";
    }
    return num.toString();
  };

  if (mainPathnameSlug === "exclusive-listings" && !propertiesData) {
    return <h2>Loading...</h2>;
  }

  if (mainPathnameSlug === "featured-leases" && !leaseData) {
    return <h2>Loading...</h2>;
  }

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
          <h1 className='whitespace-pre-wrap absolute'>{headingText}</h1>
          <p
            className='subtitle pt-12'
            dangerouslySetInnerHTML={{
              __html: subHeadingText,
            }}
          />
        </div>
      </div>
      <div className='neighborhoodsContainer mt-14 mx-14 mb-28'>
        <div className='filters -mx-14'>
          <div className='row min-w-96 flex justify-between'>
            <div className='searchFilter min-w-[56rem] max-w-[56rem]'>
              <form
                // onSubmit={handleSubmit}
                className='text-center'
              >
                <div className='flex'>
                  <span>
                    <Search
                      className='text-casperWhite h-[1.4rem]'
                      strokeWidth={1.8}
                    />
                  </span>
                  <input
                    type='text'
                    placeholder='search by address, city, or neighborhood...'
                    className='bg-transparent border-b border-casperWhite outline-none text-casperWhite placeholder-casperWhite w-full pt-0 ml-3 h3 mb-[.1rem]'
                    autoFocus
                  />
                </div>
              </form>
            </div>
            <div className='areaFilter'>
              <Dropdown onOpenChange={setIsOpen} placement="bottom">
                <DropdownTrigger>
                  <Button className='h3'>
                    {selectedValue || "Select an area"}
                    <span className='pl-[.1rem]'>
                      <ChevronDown
                        strokeWidth={1}
                        className={`text-casperWhite h-[1.2rem] w-auto transition-transform duration-500 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label='Single selection example'
                  selectedKeys={selectedKeys}
                  selectionMode='single'
                  
                  // @ts-expect-error working properly just pulling error here
                  onSelectionChange={handleSelectionChange}
                  items={allAreas}
                >
                  {(area) => (
                    <DropdownItem
                      key={area.key}
                      // className={area.key === "delete" ? "text-danger" : ""}
                      // color={area.key === "delete" ? "danger" : "default"}
                    >
                      {area.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className='row min-w-96 flex justify-between mt-12'>
            <div className='priceFilter flex items-center mr-12'>
              <h3 className='mr-9'>price</h3>

              <div className='relative w-96'>
                <h3 className='absolute w-[5vw] text-right -left-2 top-1/2 -translate-y-1/2'>
                  {Array.isArray(value) && value[0] === 500000 ? "<" : ""}$
                  {formatPrice(Array.isArray(value) ? value[0] : value)}
                </h3>
                <h3 className='absolute -right-[8.5rem] w-[4vw] text-left top-1/2 -translate-y-1/2'>
                  ${formatPrice(Array.isArray(value) ? value[1] : value)}
                  {Array.isArray(value) && value[1] === 10000000 ? "+" : ""}
                </h3>

                <Slider
                  classNames={{
                    base: "w-full px-3 ml-[4.5rem]",
                    track: "bg-shadowGrey h-[.1rem]",
                    filler: "bg-casperWhite",
                  }}
                  size='sm'
                  formatOptions={{
                    style: "currency",
                    currencyDisplay: "symbol",
                    currencySign: "standard",
                    currency: "USD",
                  }}
                  maxValue={10000000}
                  minValue={500000}
                  step={100000}
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </div>
            </div>
            <div className='sqftFilter flex items-center'>
              <h3 className='mr-9'>SQFT</h3>

              <div className='relative w-96'>
                <h3 className='absolute w-[3vw] text-right -left-2 top-1/2 -translate-y-1/2'>
                  {Array.isArray(sqftValue) && sqftValue[0] === 500 ? "<" : ""}
                  {formatFootage(
                    Array.isArray(sqftValue) ? sqftValue[0] : sqftValue
                  )}
                </h3>

                <h3 className='absolute w-[2.8vw] -right-[5.4rem] top-1/2 -translate-y-1/2'>
                  {formatFootage(
                    Array.isArray(sqftValue) ? sqftValue[1] : sqftValue
                  )}
                  {Array.isArray(sqftValue) && sqftValue[1] === 10000
                    ? "+"
                    : ""}
                </h3>

                <Slider
                  classNames={{
                    base: "w-full px-3 ml-[2.5rem]",
                    track: "bg-shadowGrey h-[.1rem]",
                    filler: "bg-casperWhite",
                  }}
                  size='sm'
                  formatOptions={{ style: "decimal" }}
                  maxValue={10000.0}
                  minValue={500.0}
                  step={500}
                  value={sqftValue}
                  onChange={(newValue) => setSqftValue(newValue)}
                />
              </div>
            </div>
            <div className='clear relative'>
              <h3 className='flex gap-x-2 items-center'>
                <span>
                  <X
                    className='text-casperWhite h-[1.4rem]'
                    strokeWidth={1.8}
                  />
                </span>
                <b>clear</b>
              </h3>
            </div>
          </div>
        </div>
        <div className='listings pt-6 grid grid-cols-3 gap-x-10 gap-y-20 w-full'>
          {dataOption?.property?.map((listing, index) => (
            <Link
              href={
                dataOption === propertiesData
                  ? `exclusive-listings/${listing?.homeURL?.current}`
                  : `featured-leases/${listing?.homeURL?.current}`
              }
              key={index}
              onClick={(e) =>
                navigateWithTransition(
                  dataOption === propertiesData
                    ? `exclusive-listings/${listing?.homeURL?.current}`
                    : `featured-leases/${listing?.homeURL?.current}`,
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
