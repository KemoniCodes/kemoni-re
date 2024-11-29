import { defineField, defineType } from "sanity";

export const featuredListingsType = defineType({
  name: "featuredListings",
  title: "Featured Listings",
  type: "document",
  fields: [
    defineField({
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
    }),
    defineField({
      title: "Address",
      name: "address",
      type: "object",
      fields: [
        { name: "line1", type: "string", title: "Line 1" },
        { name: "line2", type: "string", title: "Line 2" },
      ],
    }),
    defineField({
      title: "Home URL",
      name: "homeURL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
});
