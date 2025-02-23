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
                          title: "Average Household Income",
                          name: "aII",
                          type: "string",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "gettingAround",
                  title: "Getting Around",
                  type: "object",
                  fields: [
                    {
                      title: "Getting Around Text",
                      name: "gettingAroundText",
                      type: "text",
                    },
                    {
                      name: "walkabilityScore",
                      title: "Walkability Score",
                      type: "number",
                    },
                    {
                      name: "transitScore",
                      title: "Transit Score",
                      type: "number",
                    },
                  ],
                },
                {
                  name: "realEstate",
                  title: "Real Estate Snapshot",
                  type: "object",
                  fields: [
                    {
                      title: "Real Estate Text",
                      name: "realEstateText",
                      type: "text",
                    },
                    {
                      name: "averageHomePrice",
                      title: "Average Home Price",
                      type: "string",
                    },
                    {
                      name: "averageRentPrice",
                      title: "Average Rent Price",
                      type: "string",
                    },
                    {
                      name: "architecturalStyle",
                      title: "Architectural Style",
                      type: "array",
                      of: [
                        {
                          type: "string",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
