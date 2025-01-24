"use client";
// import React, { useState, useEffect } from "react";
import React from "react";

// import Link from "next/link";
// import { getNeighborhoods } from "@/sanity/sanity.query";
// import { Neighborhoods } from "@/sanity/types";
// // import Image from "next/image";
// import { urlFor } from "@/app/utils/imageUrl";
// import SwipeButton from "../../components/animata/button/swipe-button";
// import { APIProvider, Map } from "@vis.gl/react-google-maps";
// import { Star } from "lucide-react";
// import { h2 } from "motion/react-client";

// interface Coordinates {
//   lat: number;
//   lng: number;
// }

// interface Place {
//   displayName: string;
//   shortFormattedAddress: string;
//   description: string;
//   primaryType: string;
//   editorialSummary: string;
//   generativeSummary: string;
//   primaryTypeDisplayName: string;
//   priceLevel: string;
//   rating: string;
//   websiteUri: string;
//   googleMapsLinks: string;
// }

export default function Neighborhood() {
//   const [nHData, setNHData] = useState<Neighborhoods[] | null>(null);
//   const [coordinatesData, setCoordinatesData] = useState<Coordinates | null>(
//     null
//   );
//   const [placesData, setPlacesData] = useState<Place[] | null>(null);
//   const [mapFiltersData, setmapFiltersData] = useState<string[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState([]);
//   //   const [includedTypes, setIncludedTypes] = useState(["restaurant"]);
//   const [selectedType, setselectedType] = useState("");

//   //   const [selectedType, setSelectedType] = useState(null);

//   //   const handleFilterClick = (filterName, emoji) => {
//   //     setSelectedFilters((prev) => {
//   //       if (prev.includes(filterName)) {
//   //         // Remove filter if already selected
//   //         return prev.filter((name) => name !== filterName);
//   //       } else {
//   //         // Add filter and update includedTypes
//   //         setIncludedTypes([filterName]);
//   //         return [...prev, filterName];
//   //       }
//   //     });
//   //   };

//   //   const [error, setError] = useState(null);

//   const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

//   if (!API_KEY) {
//     throw new Error("Google Maps API Key is not defined.");
//   }
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await getNeighborhoods();
//         setNHData(data);
//       } catch (error) {
//         console.error("Error", error);
//       }
//     }
//     fetchData();
//   }, []);

//   //   console.log(nHData);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const slugify = (input: any) =>
//     input
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "")
//       .slice(0, 200);

//   const pathname = location.pathname;
//   //   const subPathnameSlug = pathname.split("/").pop();

//   const segments = pathname.split("/").filter(Boolean);
//   const mainPathnameSlug = segments[1];

//   //   console.log(mainPathnameSlug);

//   const currentNeighborhood = nHData?.neighborhood?.find((hood) => {
//     const hoodSlug = slugify(hood?.neighborhoodName);

//     return mainPathnameSlug === hoodSlug;
//   });

//   const heroBGImageUrl = currentNeighborhood?.nHMainImg?.asset?._ref
//     ? urlFor(currentNeighborhood?.nHMainImg).url()
//     : null;

//   //   console.log(currentNeighborhood);
//   //   console.log("Neighborhood Name:", currentNeighborhood?.neighborhoodName);

//   useEffect(() => {
//     if (!currentNeighborhood?.neighborhoodName) {
//       console.log("Neighborhood name is missing.");
//       return;
//     }
//     async function fetchGeocodingData() {
//       try {
//         const neighborhoodName = currentNeighborhood?.neighborhoodName || "";
//         const address = encodeURIComponent(
//           `${neighborhoodName}, Los Angeles, CA`
//         );
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&region=us&components=locality:Los Angeles|administrative_area:CA&key=${API_KEY}`;

//         const response = await fetch(url);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.status === "OK") {
//           setCoordinatesData(data.results[0].geometry.location);
//         } else {
//           throw new Error(`Geocoding API error: ${data.status}`);
//         }
//       } catch (error) {
//         console.error("Error fetching geocoding data:", error);
//       }
//     }

//     fetchGeocodingData();
//   }, [currentNeighborhood]);

//   useEffect(() => {
//     if (!currentNeighborhood?.neighborhoodName) {
//       console.log("Neighborhood name is missing.");
//       return;
//     }

//     async function fetchPlacesData() {
//       try {
//         if (currentNeighborhood?.neighborhoodGuide?.mapFilters) {
//           const filterTitles = currentNeighborhood.neighborhoodGuide.mapFilters
//             .map((filter) => filter?.filterTitle)
//             .filter((title): title is string => title !== undefined);

//           setmapFiltersData(filterTitles);
//         }
//       } catch (error) {
//         console.error("Error processing filters:", error);
//       }
//     }

//     if (mapFiltersData?.length > 1) {
//       const location = encodeURIComponent(
//         coordinatesData?.lat && coordinatesData?.lng
//           ? `${coordinatesData.lat},${coordinatesData.lng}`
//           : ""
//       );

//       // Dynamically set the selected type based on the filter clicked
//       const handleFilterMapping = (filterType) => {
//         switch (filterType) {
//           case "schools":
//             return "school";
//           case "nature":
//             return "park";
//           case "cafes":
//             return "cafe";
//           case "dining":
//             return "restaurant";
//           case "entertainment":
//             return "museum";
//           case "wellness":
//             return "gym";
//           case "wellness":
//             return "yoga_studio";
//           case "wellness":
//             return "fitness_center";
//           default:
//             return filterType; // Default to the provided filter type
//         }
//       };

//       let selectedType = handleFilterMapping(mapFiltersData[3]); // Default type
//       console.log(`Initial selectedType: ${selectedType}`);

//       // Function to update selectedType and trigger actions
//       const updatePlacesDataOnFilterChange = (newFilterType) => {
//         // Update selectedType based on the selected filter
//         selectedType = handleFilterMapping(newFilterType);
//         console.log(`Selected type changed to: ${selectedType}`); // Log the updated type

//         // After updating, call fetchPlacesDataFromAPI
//         fetchPlacesDataFromAPI();
//       };

//       // Function to handle button click
//       const handleFilterClick = (filterType) => {
//         console.log("Button clicked with filter type:", filterType);
//         updatePlacesDataOnFilterChange(filterType); // Update selectedType on click
//       };

//       // Example: Selecting all filter buttons
//       const filterButtons = document.querySelectorAll("button");
//       console.log("Filter buttons found:", filterButtons);

//       if (filterButtons.length > 0) {
//         filterButtons.forEach((filter) => {
//           const filterText =
//             filter.children[1]?.lastChild?.lastChild?.innerText?.toLowerCase();

//           if (filterText) {
//             // Attach the click handler to each filter button
//             filter.onclick = () => handleFilterClick(filterText);
//             console.log(`Filter button set up for: ${filterText}`); // Debugging log
//           } else {
//             console.warn("Filter button text could not be determined.", filter);
//           }
//         });
//       } else {
//         console.warn("No filter buttons found in the DOM.");
//       }

//       console.log();
//       const body = JSON.stringify({
//         includedPrimaryTypes: [selectedType], // Dynamically set the included type
//         excludedPrimaryTypes: ["community_center"],
//         maxResultCount: 0,
//         locationRestriction: {
//           circle: {
//             center: {
//               latitude: coordinatesData?.lat,
//               longitude: coordinatesData?.lng,
//             },
//             radius: 1500.0,
//           },
//         },
//       });

//       const url = `https://places.googleapis.com/v1/places:searchNearby`;

//       async function fetchPlacesDataFromAPI(
//         paginationToken = null,
//         accumulatedPlaces = []
//       ) {
//         try {
//           const paginatedUrl = paginationToken
//             ? `${url}?pagetoken=${paginationToken}`
//             : url;

//           const response = await fetch(paginatedUrl, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "X-Goog-Api-Key": API_KEY as string,
//               "X-Goog-FieldMask": "*",
//             },
//             body: paginationToken ? null : body, // Only send the body for the initial request
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           const data = await response.json();
// setPlacesData(data.places)
//         //   const updatedPlaces = accumulatedPlaces.concat(data.places || []);
//         //   if (data.nextPageToken) {
//         //     // Google requires a short delay before reusing the nextPageToken
//         //     await new Promise((resolve) => setTimeout(resolve, 2000));
//         //     return fetchPlacesDataFromAPI(data.nextPageToken, updatedPlaces);
//         //   } else {
//         //     setPlacesData(updatedPlaces);
//         //   }
//         } catch (error) {
//           console.error("Error fetching places data:", error);
//         }
//       }

//       // Initialize the fetch on page load
//         fetchPlacesDataFromAPI();
//     } else {
//       //   fetchPlacesDataFromAPI();

//       // <h2>loading...</h2>
//       fetchPlacesData();
//     }
//   }, [currentNeighborhood, mapFiltersData, coordinatesData]);

//   //   useEffect(() => {
//   //     if (!coordinatesData?.lat || !coordinatesData?.lng) {
//   //       console.log("Coordinates not available.");
//   //       return;
//   //     }

//   //     const location = encodeURIComponent(
//   //       `${coordinatesData.lat},${coordinatesData.lng}`
//   //     );
//   //     console.log("Location:", location);
//   //   }, [coordinatesData]);

//   //   useEffect(() => {
//   //     console.log("mapFiltersData after update:", mapFiltersData);
//   //   }, [mapFiltersData]);

//   const priceLevelMap = {
//     PRICE_LEVEL_INEXPENSIVE: 1,
//     PRICE_LEVEL_MODERATE: 2,
//     PRICE_LEVEL_EXPENSIVE: 3,
//     PRICE_LEVEL_VERY_EXPENSIVE: 4,
//   };

//   if (!currentNeighborhood) {
//     return <h2>Loading...</h2>;
//   }

//   if (!nHData) {
//     return <h2>Loading...</h2>;
//   }

//   if (!coordinatesData) {
//     return <h2>Loading...</h2>;
//   }

//   if (!placesData) {
//     return <h2>Loading...</h2>;
//   }

//   if (!mapFiltersData) {
//     return <h2>Loading...</h2>;
//   }

//   console.log(placesData);

  return (
    <></>
    // <div className='neighborhoodPage'>
    //   <div
    //     className='heroContainer w-screen bg-cover h-[700px] relative top-0 -z-10 -ml-8 -mt-16 pl-8'
    //     style={{
    //       backgroundImage: heroBGImageUrl ? `url(${heroBGImageUrl})` : "none",
    //     }}
    //   >
    //     <div className='absolute inset-0 bg-black opacity-50' />
    //     <div className='heroText absolute bottom-0 pb-14'>
    //       <h1 className='whitespace-pre-wrap'>
    //         {currentNeighborhood?.neighborhoodName}
    //       </h1>
    //       <p className='subtitle'>
    //         {currentNeighborhood?.neighborhoodGuide?.neighborhoodTagline}
    //       </p>
    //     </div>
    //   </div>

    //   <div className='infoContainer mt-14 mx-14 grid grid-cols-12 gap-x-10 gap-y-20 mb-28'>
    //     <div className='infoBlock col-end-4 grid col-span-4 row-start-1 row-end-[none]'>
    //       <h2 className='mb-6'>Overall Vibe</h2>
    //       <p className=''>
    //         {currentNeighborhood?.neighborhoodGuide?.overallVibe}
    //       </p>
    //     </div>
    //     <div className='infoBlock col-start-5 col-span-4'>
    //       <h2 className='mb-6'>Highlights</h2>
    //       <ul className='list-none'>
    //         {currentNeighborhood?.neighborhoodGuide?.highlights?.map(
    //           (highlight, index) => (
    //             <li className='p list-none capitalize' key={index}>
    //               - {highlight}
    //             </li>
    //           )
    //         )}
    //       </ul>
    //     </div>
    //     <div className='infoBlock col-start-5 col-span-4 row-start-2'>
    //       <h2 className='mb-6'>
    //         who lives in {currentNeighborhood?.neighborhoodName}
    //       </h2>
    //       <p className=''>
    //         {currentNeighborhood?.neighborhoodGuide?.whoLives?.whoLivesText}
    //       </p>

    //       <div className='stats mt-10 grid grid-cols-2 gap-y-10 gap-x-24'>
    //         <div className='stat'>
    //           <h3 className='text-[48px] mb-4'>
    //             {
    //               currentNeighborhood?.neighborhoodGuide?.whoLives
    //                 ?.whoLivesDataCallouts?.totalPopulation
    //             }
    //           </h3>
    //           <p>Total Population</p>
    //         </div>
    //         <div className='stat'>
    //           <h3 className='text-[48px] mb-4'>
    //             {
    //               currentNeighborhood?.neighborhoodGuide?.whoLives
    //                 ?.whoLivesDataCallouts?.medianAge
    //             }
    //           </h3>
    //           <p>Median Age</p>
    //         </div>
    //         <div className='stat w-max'>
    //           <h3 className='text-[48px] mb-4'>
    //             {
    //               currentNeighborhood?.neighborhoodGuide?.whoLives
    //                 ?.whoLivesDataCallouts?.aII
    //             }
    //           </h3>
    //           <p>Average individual Income</p>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <div className='infoBlock col-end-4 grid col-span-4'>
    //       <h2 className='mb-6'>Living in {currentNeighborhood?.neighborhoodName}</h2>
    //       <p className=''>
    //         {currentNeighborhood?.neighborhoodGuide?.}
    //       </p>
    //     </div> */}
    //   </div>

    //   <div className='mapContainer px-10 mt-2'>
    //     <div className='filters flex justify-between mb-12'>
    //       {currentNeighborhood?.neighborhoodGuide?.mapFilters?.map(
    //         (filter, index) => (
    //           // [1].children[0].lastChild.innerText
    //           <div className='filter justify-items-center' key={index}>
    //             <SwipeButton
    //               key={filter.filterName}
    //               className={`filter_${filter.filterName} ${
    //                 selectedFilters.includes(filter.filterName)
    //                   ? "active-filter"
    //                   : ""
    //               }`}
    //               data-filter-type={filter.filterName} // Add data attribute for easy reference
    //               //   onClick={(event) => {
    //               //     const filterType = event.currentTarget.dataset.filterType;
    //               //     if (filterType) {
    //               //       handleFilterClick(filterType); // Trigger the click handler
    //               //     } else {
    //               //       console.error("Filter type is undefined or missing.");
    //               //     }
    //               //   }}
    //               firstClass=''
    //               firstText={
    //                 <div
    //                   className='filter justify-items-center'
    //                   //   onClick={() =>
    //                   //     handleFilterClick(filter.filterName, filter.emoji)
    //                   //   }
    //                 >
    //                   <h3 className='text-[34.87px] leading-[34.87px] mb-6'>
    //                     {filter.emoji}
    //                   </h3>
    //                   <h4 className='text-casperWhite'>{filter.filterTitle}</h4>
    //                 </div>
    //               }
    //               secondClass='bg-crimsonRed text-casperWhite'
    //               secondText={
    //                 <div className='filter justify-items-center'>
    //                   <h3 className='text-[34.87px] leading-[34.87px] mb-6'>
    //                     {filter.emoji}
    //                   </h3>
    //                   <h4 className='text-casperWhite'>{filter.filterTitle}</h4>
    //                 </div>
    //               }
    //             />

    //             {/* <h3 className='text-[34.87px] leading-[34.87px] mb-6'>
    //               {filter?.emoji}
    //             </h3>
    //             <h4>{filter?.filterTitle}</h4> */}
    //           </div>
    //         )
    //       )}
    //     </div>
    //     <div className='mapBoxContainer -ml-16'>
    //       <APIProvider apiKey={API_KEY}>
    //         {coordinatesData ? (
    //           <Map
    //             style={{ width: "100vw", height: "70vh" }}
    //             defaultCenter={{
    //               lat: coordinatesData.lat,
    //               lng: coordinatesData.lng,
    //             }}
    //             defaultZoom={15}
    //             gestureHandling={"greedy"}
    //             disableDefaultUI={true}
    //           />
    //         ) : (
    //           <div>Loading map...</div>
    //         )}
    //       </APIProvider>
    //     </div>

    //     <div className='resultsContainer grid grid-cols-12 gap-x-10 gap-y-20 mt-20'>
    //       {placesData && placesData?.length > 0 ? (
    //         placesData.map((place, index) => {
    //           // Extract filters from elements with classes starting with "filter_"
    //         //   const elements = document.querySelectorAll("[class*='filter_']");
    //         //   const extractedFilters: string[] = [];
    //         //   elements.forEach((element) => {
    //         //     const classList = Array.from(element.classList);
    //         //     const filterClass = classList.find((cls) =>
    //         //       cls.startsWith("filter_")
    //         //     );
    //         //     if (filterClass) {
    //         //       const filterText = filterClass.split("_")[1];
    //         //       if (filterText) {
    //         //         extractedFilters.push(filterText.toLowerCase());
    //         //       }
    //         //     }
    //         //   });

    //           // Check if any filter matches the place's types
    //           // Check if any filter matches the place's types
    //         //   const matchingFilter = extractedFilters.find((filter) => {
    //         //     const primaryType = place?.primaryType;

    //         //     // Ensure `primaryType` is treated as an array
    //         //     const primaryTypesArray = Array.isArray(primaryType)
    //         //       ? primaryType
    //         //       : [primaryType];

    //         //     // Use `.some` on the normalized array
    //         //     return primaryTypesArray.some((t) =>
    //         //       t?.toLowerCase().includes(filter)
    //         //     );
    //         //   });

    //           // Add emojis for specific types
    //           const emojiMap: { [key: string]: string } = {
    //             cafe: "☕",
    //             coffee_shop: "☕",
    //             restaurant: "🥩",
    //             diner: "🥩",
    //             fine_dining_restaurant: "🥩",
    //             bakery: "🥩",
    //             steak: "🥩",
    //             bagel_shop: "🥩",
    //             ice_cream_shop: "🥩",
    //             dessert_shop: "🥩",
    //             deli: "🥩",
    //             donut_shop: "🥩",
    //             steak_house: "🥩",
    //             sandwich_shop: "🥩",
    //             bar: "🍸",
    //             pub: "🍸",
    //             school: "✏️",
    //             park: "🌳",
    //             beach: "🌳",
    //             dog_park: "🌳",
    //             garden: "🌳",
    //             national_park: "🌳",
    //             zoo: "🌳",
    //             gym: "💪",
    //             yoga_studio: "💪",
    //             fitness_center: "💪",
    //             sports_coaching: "💪",
    //             store: "🛍️",
    //             shopping_mall: "🛍️",
    //             market: "🛍️",
    //             supermarket: "🛍️",
    //             convenience_store: "🛍️",
    //             pharmacy: "🛍️",
    //             museum: "🌐",
    //             art_gallery: "🌐",
    //             auditorium: "🌐",
    //             art_studio: "🌐",
    //             cultural_landmark: "🌐",
    //             historical_place: "🌐",
    //             monument: "🌐",
    //             performing_arts_theater: "🌐",
    //             sculpture: "🌐",
    //             library: "🌐",
    //             night_club: "🪩",
    //             event_venue: "🪩",
    //             concert_hall: "🪩",
    //             movie_theater: "🪩",
    //             tourist_attraction: "🪩",
    //             aquarium: "🪩",
    //             bowling_alley: "🪩",
    //           };

    //           //   console.log(
    //           //     place?.displayName,
    //           //     place?.primaryTypeDisplayName?.text
    //           //   );

    //           const matchingEmoji = Array.isArray(place.primaryType)
    //             ? place.primaryType
    //                 .map((type) => {
    //                   // Find a match in emojiMap where the key is part of the type
    //                   const matchingKey = Object.keys(emojiMap).find((key) =>
    //                     type.toLowerCase().includes(key)
    //                   );
    //                   return emojiMap[matchingKey] || "";
    //                 })
    //                 .find((emoji) => emoji !== "") || "" // Return the first non-empty emoji
    //             : (() => {
    //                 // Handle single type case
    //                 const matchingKey = Object.keys(emojiMap).find((key) =>
    //                   place.primaryType?.toLowerCase().includes(key)
    //                 );
    //                 return emojiMap[matchingKey] || "";
    //               })();

    //           const name = place?.displayName;

    //           const activePriceLevel = priceLevelMap[place.priceLevel] || 0;
    //           {
    //             // console.log(place?.rating);
    //           }

    //           return (
    //             // <SwipeButton
    //             //   className='second'
    //             //   firstClass=''
    //             //   firstText={
    //             //     <div className='resultBlock col-span-4 flex' key={index}>
    //             //       <h3 className='text-[48px] mr-4'>{matchingEmoji}</h3>
    //             //       <div>
    //             //         <h2 className='mb-6'>{name?.text || "Unknown"}</h2>
    //             //         <p
    //             //           dangerouslySetInnerHTML={{
    //             //             __html:
    //             //               place.shortFormattedAddress?.replace(
    //             //                 /, /g,
    //             //                 ",<br />"
    //             //               ) || "",
    //             //           }}
    //             //         ></p>
    //             //         <div className='priceLevel flex' key={activePriceLevel}>
    //             //           {[1, 2, 3, 4].map(
    //             //             (level) =>
    //             //               activePriceLevel !== 0 ? (
    //             //                 <p
    //             //                   key={level}
    //             //                   className={
    //             //                     level <= activePriceLevel
    //             //                       ? "text-casperWhite"
    //             //                       : "text-shadowGrey"
    //             //                   }
    //             //                 >
    //             //                   $
    //             //                 </p>
    //             //               ) : (
    //             //                 <></>
    //             //               ) // Return null if level is undefined
    //             //           )}
    //             //         </div>

    //             //         <p className='mt-2 underline flex gap-[4px] decoration-[.8px]  underline-offset-[.1rem]'>
    //             //           <Star
    //             //             strokeWidth={1}
    //             //             fill='#f7f7ff'
    //             //             className='h-5'
    //             //           />
    //             //           {place?.rating}
    //             //         </p>

    //             //         <p className='mt-2'>
    //             //           {place?.primaryTypeDisplayName?.text}
    //             //         </p>
    //             //         <p className='mt-2'>
    //             //           {place?.editorialSummary?.text ||
    //             //             place?.generativeSummary?.overview?.text ||
    //             //             ""}
    //             //         </p>
    //             //       </div>
    //             //     </div>
    //             //   }
    //             //   secondClass='bg-crimsonRed text-casperWhite'
    //             //   secondText={
    //             //     <div className='resultBlock col-span-4 flex' key={index}>
    //             //       <h3 className='text-[48px] mr-4'>{matchingEmoji}</h3>
    //             //       <div>
    //             //         <h2 className='mb-6'>{name?.text || "Unknown"}</h2>
    //             //         <p
    //             //           dangerouslySetInnerHTML={{
    //             //             __html:
    //             //               place.shortFormattedAddress?.replace(
    //             //                 /, /g,
    //             //                 ",<br />"
    //             //               ) || "",
    //             //           }}
    //             //         ></p>
    //             //         <div className='priceLevel flex' key={activePriceLevel}>
    //             //           {[1, 2, 3, 4].map(
    //             //             (level) =>
    //             //               activePriceLevel !== 0 ? (
    //             //                 <p
    //             //                   key={level}
    //             //                   className={
    //             //                     level <= activePriceLevel
    //             //                       ? "text-casperWhite"
    //             //                       : "text-shadowGrey"
    //             //                   }
    //             //                 >
    //             //                   $
    //             //                 </p>
    //             //               ) : (
    //             //                 <></>
    //             //               ) // Return null if level is undefined
    //             //           )}
    //             //         </div>

    //             //         <p className='mt-2 underline flex gap-[4px] decoration-[.8px]  underline-offset-[.1rem]'>
    //             //           <Star
    //             //             strokeWidth={1}
    //             //             fill='#f7f7ff'
    //             //             className='h-5'
    //             //           />
    //             //           {place?.rating}
    //             //         </p>

    //             //         <p className='mt-2'>
    //             //           {place?.primaryTypeDisplayName?.text}
    //             //         </p>
    //             //         <p className='mt-2'>
    //             //           {place?.editorialSummary?.text ||
    //             //             place?.generativeSummary?.overview?.text ||
    //             //             ""}
    //             //         </p>
    //             //       </div>
    //             //     </div>
    //             //   }
    //             // />
    //             <div
    //               className='resultBlock col-span-4 flex transform transition-transform duration-300 ease-in-out hover:-translate-y-2 group'
    //               key={index}
    //             >
    //               <Link
    //                 href={place?.websiteUri || place?.googleMapsLinks?.placeUri}
    //                 target='#'
    //                 className='flex'
    //               >
    //                 <h3 className='text-[48px] mr-4'>{matchingEmoji}</h3>
    //                 <div>
    //                   <h2 className='mb-6 decoration-[.8px] underline-offset-[.15rem] group-hover:underline'>
    //                     {name?.text || "Unknown"}
    //                   </h2>
    //                   <p
    //                     //    className="mb-2"
    //                     dangerouslySetInnerHTML={{
    //                       __html:
    //                         place.shortFormattedAddress?.replace(
    //                           /, /g,
    //                           ",<br />"
    //                         ) || "",
    //                     }}
    //                   ></p>
    //                   <div
    //                     className='priceLevel flex mt-1'
    //                     key={activePriceLevel}
    //                   >
    //                     {[1, 2, 3, 4].map((level) =>
    //                       activePriceLevel !== 0 ? (
    //                         <p
    //                           key={level}
    //                           className={
    //                             level <= activePriceLevel
    //                               ? "text-casperWhite"
    //                               : "text-shadowGrey"
    //                           }
    //                         >
    //                           $
    //                         </p>
    //                       ) : (
    //                         <></>
    //                       )
    //                     )}
    //                   </div>

    //                   {place?.rating !== undefined ? (
    //                     <p className='mt-2 underline flex gap-[4px] decoration-[.8px] underline-offset-[.1rem]'>
    //                       <Star
    //                         strokeWidth={1}
    //                         fill='#f7f7ff'
    //                         className='h-5'
    //                       />
    //                       {place?.rating}
    //                     </p>
    //                   ) : (
    //                     <></>
    //                   )}

    //                   <p className='mt-2'>
    //                     {place?.primaryTypeDisplayName?.text}
    //                   </p>
    //                   {name?.text !== "Starbucks" &&
    //                   name?.text !== "The Coffee Bean & Tea Leaf" ? (
    //                     <p className='mt-8'>
    //                       {place?.editorialSummary?.text ||
    //                         place?.generativeSummary?.overview?.text ||
    //                         ""}
    //                     </p>
    //                   ) : (
    //                     <></>
    //                   )}
    //                 </div>
    //               </Link>
    //             </div>
    //           );
    //         })
    //       ) : (
    //         <h2>Loading...</h2>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
