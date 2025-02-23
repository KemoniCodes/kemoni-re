import { defineField, defineType } from "sanity";

export const neighborhoodsType = defineType({
  name: "neighborhoods",
  title: "Neighborhoods",
  type: "document",
  fields: [
    defineField({
      title: "Map Filters",
      name: "mapFilters",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "emoji",
              title: "Emoji",
              type: "string",
            },
            {
              name: "filterTitle",
              title: "Filter Title",
              type: "string",
            },
          ],
        },
      ],
    }),
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
                source: (_, { parent }) =>
                  (parent as { neighborhoodName?: string })?.neighborhoodName ||
                  "",
                slugify: (input) =>
                  input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
              },
            },
            {
              title: "Neighborhood Guide",
              name: "neighborhoodGuide",
              type: "object",
              fields: [
                {
                  title: "Neighborhood Tagline",
                  name: "neighborhoodTagline",
                  type: "text",
                },
                {
                  title: "Overall Vibe",
                  name: "overallVibe",
                  type: "text",
                },
                {
                  title: "Highlights",
                  name: "highlights",
                  type: "array",
                  of: [
                    {
                      title: "Highlight",
                      name: "highlight",
                      type: "string",
                    },
                  ],
                },
                {
                  name: "whoLives",
                  title: "Who Lives In",
                  type: "object",
                  fields: [
                    {
                      title: "Who Lives In Text",
                      name: "whoLivesText",
                      type: "text",
                    },
                    {
                      title: "Who Lives In Data Callouts",
                      name: "whoLivesDataCallouts",
                      type: "object",
                      fields: [
                        {
                          title: "Total Population",
                          name: "totalPopulation",
                          type: "string",
                        },
                        {
                          title: "Median Age",
                          name: "medianAge",
                          type: "number",
                        },
                        {
                          title: "Average Individual Income",
                          name: "aII",
                          type: "string",
                        },
                      ],
                    },
                  ],
                },
                // {
                //   title: "Map Filters",
                //   name: "mapFilters",
                //   type: "array",
                //   of: [
                //     {
                //       type: "object",
                //       fields: [
                //         {
                //           name: "emoji",
                //           title: "Emoji",
                //           type: "string",
                //         },
                //         {
                //           name: "filterTitle",
                //           title: "Filter Title",
                //           type: "string",
                //         },
                //       ],
                //     },
                //   ],
                // },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
