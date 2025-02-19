import { defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      title: "title",
      name: "title",
      type: "string",
    }),
    defineField({
      title: "Subtitle",
      name: "subTitle",
      type: "string",
    }),
    defineField({
      name: "articles",
      title: "Articles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              title: "Article Thumbnail",
              name: "articleThumbnail",
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
              title: "Article Date",
              name: "articleDate",
              type: "date",
              options: {
                dateFormat: "DD-MMMM-YYYY",
              },
            },
            {
              title: "Article Title",
              name: "articleTitle",
              type: "string",
            },
            {
              title: "Filters",
              name: "filters",
              type: "array",
              of: [
                {
                  type: "string",
                  options: {
                    list: [
                      { title: "🏡 Buyers", value: "🏡 Buyers" },
                      { title: "💰 Sellers", value: "💰 Sellers" },
                      { title: "💳 Finance", value: "💳 Finance" },
                      { title: "📈 Market", value: "📈 Market" },
                      { title: "🍸 Lifestyle", value: "🍸 Lifestyle" },
                      { title: "🖼️ Design", value: "🖼️ Design" },
                      { title: "📰 News", value: "📰 News" },
                      { title: "🪩 Events", value: "🪩 Events" },
                      { title: "💻 Tech", value: "💻 Tech" },
                    ],
                  },
                },
              ],
            },
            {
              title: "Article Text",
              name: "articleText",
              type: "array",
              of: [{ type: "block" }],
            },
          ],
        },
      ],
    }),
  ],
});
