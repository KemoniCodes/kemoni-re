"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getNeighborhoods } from "@/sanity/sanity.query";
import { Neighborhoods } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";
import SwipeButton from "../../components/animata/button/swipe-button";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollToPlugin);

// Register ScrollTrigger plugin with GSAP
// gsap.registerPlugin(ScrollTrigger);

interface Coordinates {
  lat: number;
  lng: number;
}

interface Place {
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

// Add emojis for specific types
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

export default function Neighborhood() {
  // Basic state hooks
  const [nHData, setNHData] = useState<Neighborhoods | null>(null);
  const [coordinatesData, setCoordinatesData] = useState<Coordinates | null>(
    null
  );
  const [placesData, setPlacesData] = useState<Place[] | null>(null);
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
  const container = useRef<HTMLDivElement | null>(null);

  // Toggle the InfoWindow visibility for a marker at a given index.
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

  // const handleClose = useCallback(() => setInfoWindowStates(false), []);

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!API_KEY) {
    throw new Error("Google Maps API Key is not defined.");
  }

  // On mount: set up filter names (from emojiMap keys)
  useEffect(() => {
    const names = Object.keys(emojiMap);
    setFilterNames(names.slice(0, 50));
  }, []);

  // Fetch neighborhood data
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

  // Determine current neighborhood from URL pathname
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const mainPathnameSlug = segments[1];
  // Simple slugify function
  const slugify = (input: string) =>
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200);

  const currentNeighborhood = nHData?.neighborhood?.find((hood) => {
    const neighborhoodName = hood?.neighborhoodName;
    if (!neighborhoodName) return false; // Ensure neighborhoodName is not undefined
    const hoodSlug = slugify(neighborhoodName);
    return mainPathnameSlug === hoodSlug;
  });

  // Background image for hero
  const heroBGImageUrl = currentNeighborhood?.nHMainImg?.asset?._ref
    ? urlFor(currentNeighborhood?.nHMainImg).url()
    : null;

  // Fetch geocoding data for the neighborhood
  useEffect(() => {
    if (!currentNeighborhood?.neighborhoodName) {
      console.log("Neighborhood name is missing.");
      return;
    } else {
      console.log(currentNeighborhood?.neighborhoodName);
    }
    async function fetchGeocodingData() {
      try {
        const address = encodeURIComponent(
          `${currentNeighborhood?.neighborhoodName}`
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
  }, [API_KEY, currentNeighborhood]);

  // When neighborhood data is available, extract filter titles from mapFilters
  useEffect(() => {
    // Only proceed if currentNeighborhood has filters AND coordinatesData is ready.
    if (nHData?.mapFilters?.length && coordinatesData) {
      const filterTitles = nHData.mapFilters
        .map((filter) => filter?.filterTitle) // filterTitle can be undefined here
        .filter((title): title is string => title !== undefined); // this ensures only strings remain

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
  }, [currentNeighborhood, coordinatesData]);

  // ─── API REQUEST FUNCTIONS ────────────────────────────────────────────────

  // Prepare the API request body using an explicit filters array.
  // Refactored prepareApiRequest that takes selectedType and filterNames as parameters.
  const prepareApiRequest = (
    newSelectedType: string,
    filterNames: string[],
    coordinatesData: Coordinates | null
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
      setPlacesData(data.places);
    } catch (error) {
      console.error("Error fetching places data:", error);
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
            },
              duration: 1.5,
            ease: "power3"
          });
        }
      });
    });
  }, [
    currentNeighborhood,
    nHData,
    coordinatesData,
    placesData,
    mapFiltersData,
  ]);

  useEffect(() => {
    console.log(container.current);
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      ".neighborhoodPage h1"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroSubHeading = container.current?.querySelector(
      ".neighborhoodPage .subtitle"
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
  }, [
    currentNeighborhood,
    nHData,
    coordinatesData,
    placesData,
    mapFiltersData,
  ]);

  if (
    !currentNeighborhood ||
    !nHData ||
    !coordinatesData ||
    !placesData ||
    !mapFiltersData
  ) {
    return <h2>Loading...</h2>;
  }

  // ─── RENDERING ─────────────────────────────────────────────────────────────
  return (
    <div className='neighborhoodPage' ref={container}>
      {/* -z-10 */}

      <div
        className='heroContainer w-screen bg-cover h-[700px] relative top-0  -ml-8 -mt-16 pl-8'
        style={{
          backgroundImage: heroBGImageUrl ? `url(${heroBGImageUrl})` : "none",
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50' />
        <div className='heroText absolute bottom-0 pb-14'>
          <h1 className='whitespace-pre-wrap'>
            {currentNeighborhood?.neighborhoodName}
          </h1>
          <p className='subtitle'>
            {currentNeighborhood?.neighborhoodGuide?.neighborhoodTagline}
          </p>
        </div>
      </div>

      <div className='infoContainer mt-14 mx-14 grid grid-cols-12 gap-x-10 gap-y-16 mb-28'>
        <div className='infoBlock col-end-4 grid col-span-3 row-start-1 row-end-[none]'>
          <h2 className='mb-6'>Overall Vibe</h2>
          <p className=''>
            {currentNeighborhood?.neighborhoodGuide?.overallVibe}
          </p>
        </div>
        <div className='infoBlock col-start-5 col-span-3'>
          <h2 className='mb-6'>Highlights</h2>
          <ul className='list-none'>
            {currentNeighborhood?.neighborhoodGuide?.highlights?.map(
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
        <div className='infoBlock col-start-5 col-span-3 row-start-2'>
          <h2 className='mb-6'>
            who lives in {currentNeighborhood?.neighborhoodName}
          </h2>
          <p className=''>
            {currentNeighborhood?.neighborhoodGuide?.whoLives?.whoLivesText}
          </p>

          <div className='stats mt-10 grid grid-cols-2 gap-y-10 gap-x-24'>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.whoLives
                    ?.whoLivesDataCallouts?.totalPopulation
                }
              </h3>
              <p>Total Population</p>
            </div>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.whoLives
                    ?.whoLivesDataCallouts?.medianAge
                }
              </h3>
              <p>Median Age</p>
            </div>
            <div className='stat w-max'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.whoLives
                    ?.whoLivesDataCallouts?.aII
                }
              </h3>
              <p>Average Household Income</p>
            </div>
          </div>
        </div>
        <div className='infoBlock col-start-5 col-span-3 row-start-3'>
          <h2 className='mb-6'>
            Getting around {currentNeighborhood?.neighborhoodName}
          </h2>
          <p className=''>
            {
              currentNeighborhood?.neighborhoodGuide?.gettingAround
                ?.gettingAroundText
            }
          </p>

          <div className='stats mt-10 grid grid-cols-2 gap-y-10 gap-x-24'>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.gettingAround
                    ?.walkabilityScore
                }
              </h3>
              <p>Walk Score</p>
            </div>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.gettingAround
                    ?.transitScore
                }
              </h3>
              <p>Transit Score</p>
            </div>
          </div>
        </div>
        <div className='infoBlock col-start-9 col-span-3 row-start-1'>
          <h2 className='mb-6'>Real Estate</h2>
          <p className=''>
            {currentNeighborhood?.neighborhoodGuide?.realEstate?.realEstateText}
          </p>

          <div className='stats mt-10 grid gap-y-10 gap-x-24'>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.realEstate
                    ?.averageHomePrice
                }
              </h3>
              <p>Average Sale Price</p>
            </div>
            <div className='stat'>
              <h3 className='text-[48px] mb-4'>
                {
                  currentNeighborhood?.neighborhoodGuide?.realEstate
                    ?.averageRentPrice
                }
              </h3>
              <p>Average Rent Price</p>
            </div>
            <div className='stat'>
              {/* <h3 className='text-[48px] leading-[48px] mb-2'> */}
              <h2>
                {currentNeighborhood?.neighborhoodGuide?.realEstate?.architecturalStyle?.join(
                  ", "
                )}
              </h2>
              <p>Architectural Style</p>
            </div>
          </div>
        </div>
        {/* <div className='infoBlock col-end-4 grid col-span-4'>
          <h2 className='mb-6'>Living in {currentNeighborhood?.neighborhoodName}</h2>
          <p className=''>
            {currentNeighborhood?.neighborhoodGuide?.}
          </p>
        </div> */}
      </div>

      <div className='mapContainer px-10 mt-2'>
        {/* ── FILTERS ROW ── */}
        <div className='filters flex justify-between mb-12'>
          {nHData?.mapFilters && nHData.mapFilters.length > 0 ? (
            nHData.mapFilters.map(
              // @ts-expect-error filter error
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
          )}
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
                    <h2 className="text-center mx-auto p-12">Loading...</h2>
                  )}
                </Map>
              </>
            ) : (
              <div className="text-center mx-auto p-12">Loading map...</div>
            )}
          </APIProvider>
        </div>

        {/* ── RESULTS ── */}
        <div className='resultsContainer grid grid-cols-12 gap-x-10 gap-y-20 mt-20'>
          {placesData && placesData.length > 0 ? (
            placesData.map((place, index) => {
              // Determine matching emoji from primaryType
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
                    target='#'
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
          ) : (
            <h2 className="text-center mx-auto p-12">Loading...</h2>
          )}
        </div>
      </div>
    </div>
  );
}
