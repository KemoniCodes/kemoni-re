// import { groq } from "next-sanity";
import { client } from "./lib/client";

export async function getHero() {
  try {
    const result = await client.fetch(`
              *[_type == "hero"][0]{
                bgImg,
                heroText
              }
          `);

    return result;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    throw error;
  }
}

// export async function getProperties() {
//   try {
//     const result = await client.fetch(`
//               *[_type == "properties"][0]{
//                 property
//               }
//           `);

//     return result;
//   } catch (error) {
//     console.error("Error fetching featured listings data:", error);
//     throw error;
//   }
// }

export async function getforSaleProperties() {
  try {
    const result = await client.fetch(`
              *[_type == "properties" && property[0].propertyType == "for-sale"][0]
              {
                property
              }
          `);

    return result;
  } catch (error) {
    console.error("Error fetching for sale properties data:", error);
    throw error;
  }
}

export async function getforLeaseProperties() {
  try {
    const result = await client.fetch(`
              *[_type == "properties" && property[0].propertyType == "for-lease"]
              {
                property
              }
          `);

    return result;
  } catch (error) {
    console.error("Error fetching for sale properties data:", error);
    throw error;
  }
}

export async function getMeetMe() {
  try {
    const result = await client.fetch(`
                  *[_type == "meetMe"][0]{
                    shortBio,
                    portrait
                  }
              `);

    return result;
  } catch (error) {
    console.error("Error fetching meet me data:", error);
    throw error;
  }
}

export async function getNeighborhoods() {
  try {
    const result = await client.fetch(`
                *[_type == "neighborhoods"][0]{
                  mapFilters,
                  neighborhood,
                }
            `);

    return result;
  } catch (error) {
    console.error("Error fetching neighborhoods data:", error);
    throw error;
  }
}

export async function getBlog() {
  try {
    const result = await client.fetch(`
                *[_type == "blog"][0]{
                  title,
                  subTitle,
                  allFilters,
                  articles,
                }
            `);

    return result;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    throw error;
  }
}
