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

export async function getForSaleProperties() {
  try {
    const result = await client.fetch(`
      *[_type == "properties"][0] {
  property[propertyType == "for-sale"]{
    ...,
    neighborhoodMapFilters[0]->{
    _id,
    mapFilters[]{
      emoji,
      filterTitle
    }
  }
  }
}
    `);
    return result;
  } catch (error) {
    console.error("Error fetching for sale properties data:", error);
    throw error;
  }
}

export async function getForLeaseProperties() {
  try {
    const result = await client.fetch(`
     *[_type == "properties"][0] {
  property[propertyType == "for-lease"]{
    ...,
    neighborhoodMapFilters[0]->{
    _id,
    mapFilters[]{
      emoji,
      filterTitle
    }
  }
  }
}
    `);

    return result;
  } catch (error) {
    console.error("Error fetching for lease properties data:", error);
    throw error;
  }
}

export async function getMeetMe() {
  try {
    const result = await client.fetch(`
                  *[_type == "meetMe"][0]{
                    shortBio,
                    portrait,
                    myCommitment,
                    buyersJourney,
                    sellersJourney
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
