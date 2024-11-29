import { createClient } from "next-sanity";

// import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId: "jxt52tqs",
  dataset: "production",
  apiVersion: "2024-11-29",
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});
