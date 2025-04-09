"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
import Image from "next/image";
import { getForSaleProperties } from "@/sanity/sanity.query";
import { getForLeaseProperties } from "@/sanity/sanity.query";
import {
  internalGroqTypeReferenceTo,
  Properties,
  SanityImageCrop,
  SanityImageHotspot,
  Slug,
} from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
// import { useTransitionRouterWithEffect } from "../../../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePathname } from "next/navigation";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  Modal,
  ModalContent,
  //   ModalHeader,
  ModalBody,
  //   ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import ShowingModal from "@/app/components/properties/property/showingModal";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Link from "next/link";
import SwipeButton from "@/app/components/animata/button/swipe-button";
// import SwipeButton from "@/app/components/animata/button/swipe-button";

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

type Property = {
  homeThumbnail?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  gallery?: Array<{
    image?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
    alt?: string;
    _type: "galleryImg";
    _key: string;
  }>;
  description?: string;
  highlights?: Array<string>;
  neighborhoodMapFilters?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "neighborhoods";
  }>;
  address?: {
    line1?: string;
    line2?: string;
  };
  area?:
    | "beverly-hills"
    | "santa-monica"
    | "west-hollywood"
    | "beverly-grove"
    | "hollywood-hills"
    | "los-feliz"
    | "brentwood"
    | "studio-city"
    | "culver-city";
  bedrooms?: number;
  bathrooms?: number;
  sqft?: string;
  price?: string;
  homeURL?: Slug;
  propertyType?: "for-sale" | "for-lease";
  _key: string;
};

interface PropertyMapProps {
  lat: number;
  lng: number;
  displayName?: {
    text: string;
  };
  shortFormattedAddress: string;
  description: string;
  primaryType: string;
  editorialSummary: {
    text?: string;
  };
  generativeSummary?: {
    overview?: {
      text?: string;
    };
  };
  primaryTypeDisplayName?: {
    text: string;
  };
  priceLevel: string;
  rating: string;
  websiteUri: string;
  googleMapsLinks?: {
    placeUri?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

const emojiMap: { [key: string]: string } = {
  cafe: "☕",
  coffee_shop: "☕",
  restaurant: "🥩",
  diner: "🥩",
  fine_dining_restaurant: "🥩",
  bakery: "🥩",
  bagel_shop: "🥩",
  ice_cream_shop: "🥩",
  dessert_shop: "🥩",
  deli: "🥩",
  donut_shop: "🥩",
  steak_house: "🥩",
  sandwich_shop: "🥩",
  bar: "🍸",
  pub: "🍸",
  school: "✏️",
  planetarium: "🌳",
  park: "🌳",
  hiking_area: "🌳",
  beach: "🌳",
  dog_park: "🌳",
  garden: "🌳",
  national_park: "🌳",
  zoo: "🌳",
  gym: "💪",
  yoga_studio: "💪",
  fitness_center: "💪",
  sports_coaching: "💪",
  store: "🛍️",
  shopping_mall: "🛍️",
  market: "🛍️",
  supermarket: "🛍️",
  convenience_store: "🛍️",
  pharmacy: "🛍️",
  grocery_store: "🛍️",
  museum: "🎭",
  art_gallery: "🎭",
  auditorium: "🎭",
  art_studio: "🎭",
  cultural_landmark: "🎭",
  historical_landmark: "🎭",
  historical_place: "🎭",
  monument: "🎭",
  performing_arts_theater: "🎭",
  sculpture: "🎭",
  library: "🎭",
  amphitheatre: "🎭",
  night_club: "🪩",
  banquet_hall: "🪩",
  event_venue: "🪩",
  concert_hall: "🪩",
  movie_theater: "🪩",
  tourist_attraction: "🪩",
  aquarium: "🪩",
  bowling_alley: "🪩",
};

export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [propertiesData, setPropertiesData] = useState<Properties | null>(null);
  const [leaseData, setLeaseData] = useState<Properties | null>(null);
  const [optionsData, setOptionsData] = useState<SlidesType | null>(null);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [dataOptionProp, setDataOptionProp] = useState<Properties | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    optionsData?.options ?? {}
  );

  const [emblaModalRef, emblaModalApi] = useEmblaCarousel(
    optionsData?.options ?? {}
  );

  useEffect(() => {
    setOptionsData({
      options: optionsData?.options,
    });
  }, [optionsData?.options]);

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  //MAP STATES
  const [coordinatesData, setCoordinatesData] =
    useState<PropertyMapProps | null>(null);
  const [placesData, setPlacesData] = useState<PropertyMapProps[] | null>(null);
  const [mapFiltersData, setMapFiltersData] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterNames, setFilterNames] = useState<string[]>([]);
  const [includedPrimaryTypes, setIncludedPrimaryTypes] = useState<string[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<string>("all");
  const [infoWindowStates, setInfoWindowStates] = useState<boolean[]>([]);
  const markerRefs = useRef<
    (google.maps.marker.AdvancedMarkerElement | null)[]
  >([]);

  const handleOpen = (backdrop: React.SetStateAction<string>) => {
    setBackdrop(backdrop);
    onOpen();
  };

  const onPrevButtonClick = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const onButtonSelect = useCallback((emblaMainApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaMainApi.canScrollPrev());
    setNextBtnDisabled(!emblaMainApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaMainApi) return;

    onButtonSelect(emblaMainApi);
    emblaMainApi.on("reInit", onButtonSelect).on("select", onButtonSelect);
  }, [emblaMainApi, onButtonSelect]);

  //Modal Ref Logic
  const onModalPrevButtonClick = useCallback(() => {
    if (!emblaModalApi) return;
    emblaModalApi.scrollPrev();
  }, [emblaModalApi]);

  const onModalNextButtonClick = useCallback(() => {
    if (!emblaModalApi) return;
    emblaModalApi.scrollNext();
  }, [emblaModalApi]);

  const onModalButtonSelect = useCallback(
    (emblaModalApi: EmblaCarouselType) => {
      setPrevBtnDisabled(!emblaModalApi.canScrollPrev());
      setNextBtnDisabled(!emblaModalApi.canScrollNext());
    },
    []
  );

  useEffect(() => {
    if (!emblaModalApi) return;

    onModalButtonSelect(emblaModalApi);
    emblaModalApi
      .on("reInit", onModalButtonSelect)
      .on("select", onModalButtonSelect);
  }, [emblaModalApi, onModalButtonSelect]);

  useEffect(() => {
    if (!emblaThumbsApi) return;
    emblaThumbsApi.reInit();
  }, [emblaThumbsApi]);

  const container = useRef<HTMLDivElement | null>(null);

  // const navigateWithTransition = useTransitionRouterWithEffect();

  //MAP LOGIC
  const handleMarkerClick = useCallback((index: number) => {
    setInfoWindowStates((prevStates) => {
      // Optionally, you could close all others here if desired.
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  }, []);

  // Close the info window
  const handleClose = useCallback((index: number) => {
    setInfoWindowStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
  }, []);

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!API_KEY) {
    throw new Error("Google Maps API Key is not defined.");
  }

  // On mount: set up filter names (from emojiMap keys)
  useEffect(() => {
    const names = Object.keys(emojiMap);
    setFilterNames(names.slice(0, 50));
  }, []);

  useEffect(() => {
    if (!currentProperty?.address?.line1) {
      console.log("Neighborhood name is missing.");
      return;
    } else {
      console.log(currentProperty?.address?.line1);
    }
    async function fetchGeocodingData() {
      try {
        const address = encodeURIComponent(
          `${currentProperty?.address?.line1}`
        );
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&region=us&components=locality:Los Angeles|administrative_area:CA&key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "OK") {
          setCoordinatesData(data.results[0].geometry.location);
        } else {
          throw new Error(`Geocoding API error: ${data.status}`);
        }
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    }
    fetchGeocodingData();
  }, [API_KEY, currentProperty]);

  useEffect(() => {
    // Only proceed if currentNeighborhood has filters AND coordinatesData is ready.
    if (
      /* @ts-expect-error filter error */
      currentProperty?.neighborhoodMapFilters?.mapFilters?.length &&
      coordinatesData
    ) {
      /* @ts-expect-error filter error */
      const filterTitles = currentProperty?.neighborhoodMapFilters?.mapFilters
        /* @ts-expect-error filter error */
        .map((filter) => filter?.filterTitle) // filterTitle can be undefined here
        .filter((title: string): title is string => title !== undefined); // this ensures only strings remain

      setMapFiltersData(filterTitles);

      // If no filter has been selected yet, set a default and trigger the API.
      if (includedPrimaryTypes.length === 0 && filterTitles.length > 0) {
        const defaultFilter = filterTitles[0];
        setIncludedPrimaryTypes([defaultFilter]);
        setSelectedFilters([defaultFilter]);
        fetchPlacesDataFromAPI(defaultFilter);
      }

      // console.log(filterTitles, includedPrimaryTypes);
    }
  }, [currentProperty, coordinatesData]);

  // ─── API REQUEST FUNCTIONS ────────────────────────────────────────────────

  // Prepare the API request body using an explicit filters array.
  // Refactored prepareApiRequest that takes selectedType and filterNames as parameters.
  const prepareApiRequest = (
    newSelectedType: string,
    filterNames: string[],
    coordinatesData: PropertyMapProps | null
  ): string => {
    let filtersToSend: string[] = [];
    let excluded: string[] = [];

    if (!newSelectedType || newSelectedType.trim() === "") {
      newSelectedType = "all";
    }

    if (newSelectedType === "all") {
      filtersToSend = filterNames;
    } else {
      switch (newSelectedType) {
        case "Cafés":
          filtersToSend = ["cafe", "coffee_shop"];
          break;
        case "schools":
          filtersToSend = ["school"];
          break;
        case "drinks":
          filtersToSend = ["bar", "pub"];
          break;
        case "arts & culture":
          filtersToSend = [
            "museum",
            "art_gallery",
            "auditorium",
            "art_studio",
            "cultural_landmark",
            "historical_landmark",
            "historical_place",
            "monument",
            "performing_arts_theater",
            "sculpture",
            "library",
            "amphitheatre",
          ];
          break;
        case "nature":
          filtersToSend = [
            "park",
            "hiking_area",
            "beach",
            "dog_park",
            "garden",
            "national_park",
            "zoo",
          ];
          break;
        case "dining":
          filtersToSend = [
            "restaurant",
            "diner",
            "fine_dining_restaurant",
            "bakery",
            "bagel_shop",
            "ice_cream_shop",
            "dessert_shop",
            "deli",
            "donut_shop",
            "steak_house",
            "sandwich_shop",
          ];
          excluded = ["bar_and_grill"];
          break;
        case "entertainment":
          filtersToSend = [
            "night_club",
            "event_venue",
            "concert_hall",
            "movie_theater",
            "tourist_attraction",
            "aquarium",
            "bowling_alley",
            // "museum",
          ];
          excluded = [
            "amphitheatre",
            "performing_arts_theater",
            "bar",
            "auditorium",
            "community_center",
          ];
          break;
        case "wellness":
          filtersToSend = [
            "gym",
            "yoga_studio",
            "fitness_center",
            "sports_coaching",
          ];
          excluded = ["school"];
          break;
        case "shops":
          filtersToSend = [
            "shopping_mall",
            "book_store",
            "discount_store",
            "grocery_store",
            "market",
            "supermarket",
            "convenience_store",
            "pharmacy",
          ];
          excluded = ["coffee_shop", "bakery", "ice_cream_shop"];
          break;
        default:
          filtersToSend = [newSelectedType];
          break;
      }
    }

    // else if (Array.isArray(newSelectedType)) {
    //   filtersToSend = newSelectedType;
    // }

    console.log("API request filters:", filtersToSend);

    return JSON.stringify({
      includedPrimaryTypes: filtersToSend,
      excludedPrimaryTypes: excluded,
      // rankPreference: "DISTANCE",
      maxResultCount: 0,
      locationRestriction: {
        circle: {
          center: {
            latitude: coordinatesData?.lat,
            longitude: coordinatesData?.lng,
          },
          radius: 2000.0,
        },
      },
    });
  };

  // URL for places API
  const placesApiUrl = `https://places.googleapis.com/v1/places:searchNearby`;

  // Fetch places data from the API using the given filters.
  async function fetchPlacesDataFromAPI(
    newSelectedType: string,
    paginationToken: string | null = null
    // accumulatedPlaces: any[] = []
  ) {
    if (!coordinatesData) {
      console.error("Coordinates not ready");
      return;
    }
    setIsLoading(true);

    try {
      const body = prepareApiRequest(
        newSelectedType,
        filterNames,
        coordinatesData
      );
      const paginatedUrl = paginationToken
        ? `${placesApiUrl}?pagetoken=${paginationToken}`
        : placesApiUrl;
      const response = await fetch(paginatedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY as string,
          "X-Goog-FieldMask": "*",
        },
        body: paginationToken ? null : body,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPlacesData(data.places ?? []);
    } catch (error) {
      console.error("Error fetching places data:", error);

      setPlacesData([]); // force empty results so UI updates
    } finally {
      setIsLoading(false); // done loading
    }
  }

  // ─── FILTER BUTTON CLICK HANDLER ───────────────────────────────────────────
  // This function is used by all filter buttons.
  const handleFilterClick = (filterTitle: string) => {
    if (!filterTitle) return;
    console.log("Clicked filter:", filterTitle);
    setSelectedType(filterTitle);
    setIncludedPrimaryTypes([filterTitle]);
    setSelectedFilters([filterTitle]);
  };

  useEffect(() => {
    if (selectedType && coordinatesData) {
      fetchPlacesDataFromAPI(selectedType);
    }
  }, [selectedType, coordinatesData]);

  // ─── PRICE LEVEL MAPPING ────────────────────────────────────────────────────
  const priceLevelMap: { [key: string]: number } = {
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };

  useEffect(() => {
    const filterButtons = document?.querySelectorAll("#filterButton");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const resultsContainer = document.querySelector(".resultsContainer");

        if (resultsContainer) {
          gsap.to(window, {
            scrollTo: {
              y: resultsContainer,
              offsetY: 80,
              // @ts-expect-error duration error
              duration: 1,
              ease: "power4",
            },
          });
        }
      });
    });
  }, [
    currentProperty,
    dataOptionProp,
    coordinatesData,
    placesData,
    mapFiltersData,
  ]);

  // console.log(currentProperty?.neighborhoodMapFilters);

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

  useEffect(() => {
    if (!container.current) return;

    setTimeout(() => {
      const heroHeading = container.current?.querySelector(
        ".neighborhoodsPage h1"
      ) as HTMLElement;

      if (!heroHeading) {
        console.log("Hero heading not found");
        return;
      }

      const heroSubHeading = container.current?.querySelector(
        ".neighborhoodsPage .subtitle"
      ) as HTMLElement;

      if (!heroSubHeading) {
        console.log("Hero sub heading not found");
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
    }, 100);
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

  useEffect(() => {
    if (mainPathnameSlug === "exclusive-listings" && propertiesData) {
      setDataOptionProp(propertiesData);
    } else if (mainPathnameSlug === "featured-leases" && leaseData) {
      setDataOptionProp(leaseData);
    } else {
      setDataOptionProp(propertiesData); // Fallback to propertiesData
    }
  }, [mainPathnameSlug, propertiesData, leaseData]); // Dependencies to trigger useEffect

  console.log(dataOptionProp);
  const slugify = (input: string) => {
    if (!input) return null;
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200);
  };

  const foundCurrentProperty = dataOptionProp?.property?.find((p) => {
    const addressLine1 = p?.address?.line1;
    if (!addressLine1) return false;
    const addressSlug = slugify(addressLine1);
    return secondaryPathnameSlug === addressSlug;
  });

  // Update currentProperty only when necessary
  useEffect(() => {
    console.log("foundCurrentProperty:", foundCurrentProperty);
    if (currentProperty !== foundCurrentProperty) {
      /* @ts-expect-error filter error */
      setCurrentProperty(foundCurrentProperty ?? null);
    }
  }, [foundCurrentProperty, currentProperty]);

  console.log(currentProperty);

  const slides = currentProperty?.gallery?.map((slide) => {
    return slide?.image;
  });

  // console.log(slides);

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
          className='embla-thumbs__slide__number !h-full'
          key={index}
        >
          <Image
            src={urlFor(slideImg).width(197).height(185).url()}
            alt=''
            height={185}
            width={197}
            className='rounded-lg'
          />
        </button>
      </div>
    );
  };

  // const headingText =
  //   mainPathnameSlug === "exclusive-listings"
  //     ? "Exclusive Listings"
  //     : mainPathnameSlug === "featured-leases"
  //       ? "Featured Leases"
  //       : "Neighborhoods";

  // const subHeadingText =
  //   mainPathnameSlug === "exclusive-listings"
  //     ? "Explore our exclusive collection of distinguished properties.<br/>Arrange a private viewing at your convenience."
  //     : mainPathnameSlug === "featured-leases"
  //       ? "Featured Leases"
  //       : "Properties";

  return (
    <div className='neighborhoodsPage' ref={container}>
      {/* -z-10 */}
      <div className='embla w-screen relative top-0 -ml-8 -mt-16 '>
        <div className='buttons mt-4 flex justify-between absolute w-full top-[40%] z-20'>
          <button
            className='embla__button embla__button--prev'
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft strokeWidth={1} size={48} />
          </button>
          <button
            className='embla__button embla__button--next justify-items-end'
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <ChevronRight strokeWidth={1} size={48} />
          </button>
        </div>
        <div className='embla__viewport' ref={emblaMainRef}>
          <div className='embla__container'>
            {slides?.map((slide, index) => (
              <div className='embla__slide' key={index}>
                <Button
                  onPress={() => {
                    console.log("Opening modal");
                    handleOpen(backdrop);
                  }}
                  className='h-[700px] bg-cover w-full border-0 rounded-none !p-0 text-left'
                >
                  <div
                    className='heroContainer h-[700px] bg-cover pl-8 embla__slide__number w-full bg-center'
                    style={{
                      backgroundImage: slide
                        ? `url(${urlFor(slide?.asset).url()})`
                        : "none",
                    }}
                  >
                    {selectedIndex === 0 && (
                      <>
                        <div className='absolute inset-0 bg-black opacity-50' />
                        <div className='heroText absolute bottom-0 pb-4'>
                          <h1 className='whitespace-pre-wrap absolute'>
                            {currentProperty?.address?.line1}
                          </h1>
                          {/* subtitle */}
                          {/* pt-16 */}
                          <h1 className='flex flex-col'>
                            {currentProperty?.address?.line2}
                            {/* <span>${currentProperty?.price}</span>
                            <span className='flex mt-[10px] items-center gap-y-2'>
                              <span className='pr-2'>
                                {currentProperty?.bedrooms} BD
                              </span>
                              |
                              <span className='px-2'>
                                {currentProperty?.bathrooms} BA
                              </span>
                              |
                              <span className='pl-2'>
                                {currentProperty?.sqft} SQFT
                              </span>
                            </span> */}
                          </h1>
                          {/* <p
                            className='subtitle pt-12'
                            // dangerouslySetInnerHTML={{
                            //   __html: subHeadingText,
                            // }}
                          >

                          </p> */}
                        </div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            ))}
            <Modal
              backdrop={"blur"}
              isOpen={isOpen}
              onClose={onClose}
              scrollBehavior={"outside"}
              onOpenChange={onOpenChange}
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  },
                  exit: {
                    y: -20,
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeIn",
                    },
                  },
                },
              }}
            >
              <ModalContent className='max-w-[90vw] min-h-[90vh]'>
                {() => (
                  <>
                    <ModalBody>
                      <div className='gallerySlider embla'>
                        <div className='buttons mt-4 flex justify-between absolute w-[90vw] top-[40%] z-20 self px-3'>
                          <button
                            className='embla__button embla__button--prev'
                            onClick={onModalPrevButtonClick}
                            disabled={prevBtnDisabled}
                          >
                            <ChevronLeft strokeWidth={1} size={48} />
                          </button>
                          <button
                            className='embla__button embla__button--next justify-items-end'
                            onClick={onModalNextButtonClick}
                            disabled={nextBtnDisabled}
                          >
                            <ChevronRight strokeWidth={1} size={48} />
                          </button>
                        </div>
                        <div className='embla__viewport' ref={emblaModalRef}>
                          <div className='images embla__container'>
                            {slides &&
                              slides?.map((slide, index) => (
                                <div className='embla__slide' key={index}>
                                  <div
                                    className='h-[700px] bg-cover pl-8 embla__slide__number w-full'
                                    style={{
                                      backgroundImage: slide
                                        ? `url(${urlFor(slide?.asset).url()})`
                                        : "none",
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      {slides && slides?.length > 1 ? (
        <div className='embla'>
          {/* <div className='embla__viewport' ref={emblaMainRef}>
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
          </div> */}

          <div className='embla-thumbs mt-8 px-8'>
            <div className='embla-thumbs__viewport' ref={emblaThumbsRef}>
              <div className='embla-thumbs__container gap-2'>
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
      ) : (
        ""
      )}

      <div className='propertyContainer mt-[5.5rem] mx-10 mb-28'>
        <div className='propertyMainInfo justify-self-center'>
          <span className='text-casperWhite h2 flex w-[58vw] justify-around'>
            <span className=''>
              <span className='pr-2'>💰</span>${currentProperty?.price}
            </span>
            |
            <span className=''>
              <span className='pr-2'>🛏️</span>
              {currentProperty?.bedrooms} BD
            </span>
            |
            <span className=''>
              <span className='pr-2'>🚿</span>
              {currentProperty?.bathrooms} BA
            </span>
            |
            <span className=''>
              <span className='pr-2'>📐</span>
              {currentProperty?.sqft} SQFT
            </span>
          </span>
        </div>
        <div className='row flex mt-32 justify-between items-start'>
          <div className='info w-[60%] overflow-auto pt-4 flex flex-col gap-36'>
            <div className='intro'>
              <h2 className='mb-6'>description</h2>
              <p className=''>{currentProperty?.description}</p>
            </div>
            <div className='highlights w-1/2'>
              <h2 className='mb-6'>highlights</h2>
              <ul className='list-none'>
                {currentProperty?.highlights?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (
                    highlight:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          any,
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | Iterable<React.ReactNode>
                      | null
                      | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <li className='p list-none capitalize' key={index}>
                      - {highlight}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <ShowingModal />
        </div>
        {/* <div className='listings pt-6 grid grid-cols-3 gap-x-10 gap-y-20 w-full'>
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
        </div> */}
        <div className='mapContainer px-10 mt-2'>
          {/* ── FILTERS ROW ── */}
          <div className='filters flex justify-between mb-12'>
            {
              // @ts-expect-error filter error
              currentProperty?.neighborhoodMapFilters?.mapFilters &&
              // @ts-expect-error filter error
              currentProperty?.neighborhoodMapFilters?.mapFilters.length > 0 ? (
                // @ts-expect-error filter error
                currentProperty?.neighborhoodMapFilters?.mapFilters.map(
                  (
                    filter: {
                      filterName?: string;
                      filterTitle?: string;
                      emoji: string;
                    },
                    index: number
                  ) => {
                    return (
                      <div className='filter justify-items-center' key={index}>
                        <SwipeButton
                          key={filter.filterName}
                          className={`filter_${filter.filterName} ${
                            // Use filterTitle here for consistency
                            // @ts-expect-error filter error
                            selectedFilters.includes(filter?.filterTitle)
                              ? "active-filter"
                              : ""
                          }`}
                          data-filter-type={filter.filterName}
                          // Call our single click handler:
                          // @ts-expect-error filter error
                          onClick={() => handleFilterClick(filter.filterTitle)}
                          firstClass=''
                          firstText={
                            <div className='filter justify-items-center'>
                              <h3 className='text-[34.87px] leading-[34.87px] mb-6'>
                                {filter.emoji}
                              </h3>
                              <h4 className='text-casperWhite'>
                                {filter.filterTitle}
                              </h4>
                            </div>
                          }
                          secondClass='bg-crimsonRed text-casperWhite'
                          secondText={
                            <div className='filter justify-items-center'>
                              <h3 className='text-[34.87px] leading-[34.87px] mb-6'>
                                {filter.emoji}
                              </h3>
                              <h4 className='text-casperWhite'>
                                {filter.filterTitle}
                              </h4>
                            </div>
                          }
                        />
                      </div>
                    );
                  }
                )
              ) : (
                <p>No filters available.</p>
              )
            }
          </div>

          {/* ── MAP ── */}
          <div className='mapBoxContainer -ml-16'>
            <APIProvider apiKey={API_KEY}>
              {coordinatesData ? (
                <>
                  <Map
                    style={{ width: "100vw", height: "70vh" }}
                    defaultCenter={{
                      lat: coordinatesData.lat,
                      lng: coordinatesData.lng,
                    }}
                    defaultZoom={15}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    mapId={"a62568f945cb24eb"}
                    colorScheme={"DARK"}
                    // styleId={"f1c86c328fdf9d06"}
                  >
                    {/* NEIGHBORHOOD ANCHOR POINT */}
                    <AdvancedMarker
                      position={{
                        lat: coordinatesData?.lat,
                        lng: coordinatesData?.lng,
                      }}
                      className='text-[3rem] neighborhood'
                    >
                      <span>📍</span>
                    </AdvancedMarker>

                    {placesData && placesData.length > 0 ? (
                      placesData.map((place, index) => {
                        // Determine the emoji based on the place's primaryType
                        const matchingEmoji = Array.isArray(place.primaryType)
                          ? place.primaryType
                              .map((type) => {
                                const matchingKey = Object.keys(emojiMap).find(
                                  (key) => type.toLowerCase().includes(key)
                                );
                                return matchingKey ? emojiMap[matchingKey] : "";
                              })
                              .find((emoji) => emoji !== "") || ""
                          : (() => {
                              const matchingKey = Object.keys(emojiMap).find(
                                (key) =>
                                  place.primaryType?.toLowerCase().includes(key)
                              );
                              return matchingKey ? emojiMap[matchingKey] : "";
                            })();

                        return (
                          <React.Fragment key={index}>
                            <AdvancedMarker
                              position={{
                                lat: place?.location?.latitude ?? 0,
                                lng: place?.location?.longitude ?? 0,
                              }}
                              ref={(el) => {
                                markerRefs.current[index] = el;
                              }}
                              onClick={() => handleMarkerClick(index)}
                            >
                              {/* <h5>{place?.displayName?.text}</h5> */}
                              <h2>{matchingEmoji}</h2>
                            </AdvancedMarker>

                            {infoWindowStates[index] && (
                              <InfoWindow
                                headerContent={
                                  <div className='flex gap-4'>
                                    <h2>{matchingEmoji}</h2>
                                    <h2 className=''>
                                      {place?.displayName?.text}
                                    </h2>
                                  </div>
                                }
                                // position={{
                                //   lat: place?.location?.latitude ?? 0,
                                //   lng: place?.location?.longitude ?? 0,
                                // }}
                                anchor={markerRefs.current[index]}
                                onClose={() => handleClose(index)}
                                className=''
                                maxWidth={350}
                              >
                                {place?.displayName?.text !== "Starbucks" &&
                                place?.displayName?.text !==
                                  "The Coffee Bean & Tea Leaf" ? (
                                  <p className='pl-12'>
                                    {place?.editorialSummary?.text ||
                                      place?.generativeSummary?.overview
                                        ?.text || (
                                        <span className=''>
                                          {place?.primaryTypeDisplayName?.text}
                                        </span>
                                      )}
                                  </p>
                                ) : null}
                              </InfoWindow>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <h2>Loading...</h2>
                    )}
                  </Map>
                </>
              ) : (
                <div>Loading map...</div>
              )}
            </APIProvider>
          </div>

          {/* ── RESULTS ── */}
          <div className='resultsContainer grid grid-cols-12 gap-x-10 gap-y-20 mt-20'>
            {isLoading ? (
              <h2>Loading...</h2>
            ) : placesData && placesData.length === 0 ? (
              <h2>No results found</h2>
            ) : placesData && placesData.length > 0 ? (
              placesData.map((place, index) => {
                const matchingEmoji = Array.isArray(place.primaryType)
                  ? place.primaryType
                      .map((type) => {
                        const matchingKey = Object.keys(emojiMap).find((key) =>
                          type.toLowerCase().includes(key)
                        );
                        return matchingKey ? emojiMap[matchingKey] : "";
                      })
                      .find((emoji) => emoji !== "") || ""
                  : (() => {
                      const matchingKey = Object.keys(emojiMap).find((key) =>
                        place.primaryType?.toLowerCase().includes(key)
                      );
                      return matchingKey ? emojiMap[matchingKey] : "";
                    })();

                const name = place?.displayName;
                const activePriceLevel = priceLevelMap[place.priceLevel] || 0;

                return (
                  <div
                    className='resultBlock col-span-4 flex transitionHover'
                    key={index}
                  >
                    <Link
                      href={
                        place?.websiteUri ||
                        place?.googleMapsLinks?.placeUri ||
                        "#"
                      }
                      target='_blank'
                      className='flex'
                    >
                      <h3 className='text-[48px] mr-4'>{matchingEmoji}</h3>
                      <div>
                        <h2 className='mb-6 decoration-[.8px] underline-offset-[.15rem] group-hover:underline'>
                          {name?.text || "Unknown"}
                        </h2>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              place.shortFormattedAddress?.replace(
                                /, /g,
                                ",<br />"
                              ) || "",
                          }}
                        ></p>
                        <div
                          className='priceLevel flex mt-1'
                          key={`${activePriceLevel}-${index}`}
                        >
                          {[1, 2, 3, 4].map((level) =>
                            activePriceLevel !== 0 ? (
                              <p
                                key={level}
                                className={
                                  level <= activePriceLevel
                                    ? "text-casperWhite"
                                    : "text-shadowGrey"
                                }
                              >
                                $
                              </p>
                            ) : null
                          )}
                        </div>
                        {place?.rating !== undefined ? (
                          <p className='mt-2 underline flex gap-[4px] decoration-[.8px] underline-offset-[.1rem]'>
                            <Star
                              strokeWidth={1}
                              fill='#f7f7ff'
                              className='h-5'
                            />
                            {place?.rating}
                          </p>
                        ) : null}
                        <p className='mt-2'>
                          {place?.primaryTypeDisplayName?.text}
                        </p>

                        {name?.text !== "Starbucks" &&
                        name?.text !== "The Coffee Bean & Tea Leaf" ? (
                          <p className='mt-8'>
                            {place?.editorialSummary?.text ||
                              place?.generativeSummary?.overview?.text ||
                              ""}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
