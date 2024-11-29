import { type SchemaTypeDefinition } from "sanity";
import { featuredListingsType } from "./featuredListings";
import { neighborhoodsType } from "./neighborhoods";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [featuredListingsType, neighborhoodsType],
};
