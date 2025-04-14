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
          type: "object",
          fields: [
            {
              name: "commitmentTtile",
              title: "Commitment Ttile",
              type: "string",
            },
            {
              name: "commitmentDesc",
              title: "Commitment Description",
              type: "text",
            },
          ],
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
    defineField({
      name: "sellersJourney",
      title: "Sellers Journey",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "sellerStep",
              title: "Seller Step",
              type: "string",
            },
            {
              name: "sellerStepDesc",
              title: "Seller Step Description",
              type: "text",
            },
          ],
        },
      ],
    }),
  ],
});
