import { type SchemaTypeDefinition } from "sanity";
import { featuredListingsType } from "./featuredListings";
import { meetMeType } from "./meetMe";
import { neighborhoodsType } from "./neighborhoods";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [featuredListingsType, meetMeType, neighborhoodsType],
};
