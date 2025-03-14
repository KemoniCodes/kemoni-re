import { type SchemaTypeDefinition } from "sanity";
import { blogType } from "./blog";
import { propertiesType } from "./properties";
import { meetMeType } from "./meetMe";
import { neighborhoodsType } from "./neighborhoods";
import { heroType } from "./hero";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroType, propertiesType, meetMeType, neighborhoodsType, blogType],
};
