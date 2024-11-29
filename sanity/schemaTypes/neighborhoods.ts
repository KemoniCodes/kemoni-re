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
              title: "Neighborhood Name",
              name: "neighborhoodName",
              type: "string",
            },
          ],
        },
      ],
    }),
  ],
});
