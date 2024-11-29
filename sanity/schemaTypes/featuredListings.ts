import { defineField, defineType } from "sanity";

export const featuredListingsType = defineType({
  name: "featuredListings",
  title: "Featured Listings",
  type: "document",
  fields: [
    defineField({
      name: "featuredListing",
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
              title: "Address",
              name: "address",
              type: "object",
              fields: [
                { name: "line1", type: "string", title: "Line 1" },
                { name: "line2", type: "string", title: "Line 2" },
              ],
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
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    }),
  ],
});
