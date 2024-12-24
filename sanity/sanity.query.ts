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

export async function getFeaturedListings() {
  try {
    const result = await client.fetch(`
              *[_type == "featuredListings"][0]{
                featuredListing
              }
          `);

    return result;
  } catch (error) {
    console.error("Error fetching featured listings data:", error);
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
                  neighborhood,
                }
            `);

    return result;
  } catch (error) {
    console.error("Error fetching neighborhoods data:", error);
    throw error;
  }
}
