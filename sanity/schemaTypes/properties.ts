import { defineField, defineType } from "sanity";

export const propertiesType = defineType({
  name: "properties",
  title: "Properties",
  type: "document",
  fields: [
    defineField({
      name: "property",
      title: "Featured Listing",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              title: "Home Thumbnail",
              name: "homeThumbnail",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "ALT",
                },
              ],
            },
            {
              title: "Gallery",
              name: "gallery",
              type: "array",
              of: [
                {
                  type: "object",
                  title: "Gallery Image",
                  name: "galleryImg",
                  fields: [
                    {
                      name: "image",
                      type: "image",
                      title: "Image",
                      options: {
                        hotspot: true,
                      },
                    },
                    {
                      name: "alt",
                      type: "string",
                      title: "ALT",
                    },
                  ],
                },
              ],
            },
            {
              title: "Address",
              name: "address",
              type: "object",
              fields: [
                { name: "line1", type: "string", title: "Line 1" },
                { name: "line2", type: "string", title: "Line 2" },
              ],
            },
            {
              title: "Area",
              name: "area",
              type: "string",
              options: {
                list: [
                  { title: "Beverly Hills", value: "beverly-hills" },
                  { title: "Santa Monica", value: "santa-monica" },
                  { title: "West Hollywood", value: "west-hollywood" },
                  { title: "Beverly Grove", value: "beverly-grove" },
                  { title: "Hollywood Hills", value: "hollywood-hills" },
                  { title: "Los Feliz", value: "los-feliz" },
                  { title: "Brentwood", value: "brentwood" },
                  { title: "Studio City", value: "studio-city" },
                  { title: "Culver City", value: "culver-city" },
                ],
              },
            },
            {
              title: "Bedrooms",
              name: "bedrooms",
              type: "number",
            },
            {
              title: "Bathrooms",
              name: "bathrooms",
              type: "number",
            },
            {
              title: "SQFT",
              name: "sqft",
              type: "string",
            },
            {
              title: "Price",
              name: "price",
              type: "string",
            },
            {
              title: "Home URL",
              name: "homeURL",
              type: "slug",
              options: {
                source: (
                  _,
                  { parent }: { parent: { address?: { line1?: string } } }
                ) => parent?.address?.line1 || "",
                slugify: (input) =>
                  input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
              },
              validation: (rule) => rule.required(),
            },
            {
              title: "Property Type",
              name: "propertyType",
              type: "string",
              options: {
                list: [
                  { title: "For Sale", value: "for-sale" },
                  { title: "For Lease", value: "for-lease" },
                ],
              },
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    }),
  ],
});
