import { defineField, defineType } from "sanity";

export const meetMeType = defineType({
  name: "meetMe",
  title: "Meet Me",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
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
  ],
});
