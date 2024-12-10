import { defineField, defineType } from "sanity";

export const heroType = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "bgImg",
      title: "Background Image",
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
        name: "heroText",
        title: "Hero Text",
        type: "text"
    })
  ],
});
