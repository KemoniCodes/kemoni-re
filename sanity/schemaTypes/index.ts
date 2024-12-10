import { type SchemaTypeDefinition } from "sanity";
import { featuredListingsType } from "./featuredListings";
import { meetMeType } from "./meetMe";
import { neighborhoodsType } from "./neighborhoods";
import { heroType } from "./hero";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroType, featuredListingsType, meetMeType, neighborhoodsType],
};
