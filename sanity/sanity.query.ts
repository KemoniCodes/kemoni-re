import { groq } from "next-sanity";
import { client } from "./lib/client";

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

export async function getNeighborhoods() {
  try {
    const result = await client.fetch(`
                *[_type == "neighborhoods"][0]{
                  neighborhood
                }
            `);

    return result;
  } catch (error) {
    console.error("Error fetching neighborhoods data:", error);
    throw error;
  }
}
