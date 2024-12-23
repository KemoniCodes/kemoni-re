import { defineField, defineType } from "sanity";

export const neighborhoodsType = defineType({
  name: "neighborhoods",
  title: "Neighborhoods",
  type: "document",
  fields: [
    defineField({
      name: "neighborhood",
      title: "Neighborhood",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "nHMainImg",
              title: "Neighborhood Main Image",
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
              title: "Neighborhood Name",
              name: "neighborhoodName",
              type: "string",
            },
            {
              title: "Neighborhood Link",
              name: "neighborhoodLink",
              type: "slug",
              options: {
                source: "neighborhoodName",
                options: {
                  source: "neighborhoodName",
                },
              },
            },
          ],
        },
      ],
    }),
  ],
});
