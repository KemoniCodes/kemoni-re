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
    defineField({
      name: "myCommitment",
      title: "My Commitment",
      type: "array",
      of: [
        {
          type: "string",
          name: "commitments",
          title: "Commitments",
        },
      ],
    }),
    defineField({
      name: "buyersJourney",
      title: "Buyers Journey",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "buyerStep",
              title: "Buyer Step",
              type: "string",
            },
            {
              name: "buyerStepDesc",
              title: "Buyer Step Description",
              type: "text",
            },
          ],
        },
      ],
    }),
  ],
});
