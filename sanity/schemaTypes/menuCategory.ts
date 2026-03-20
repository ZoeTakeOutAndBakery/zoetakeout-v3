import { defineField, defineType } from "sanity";

export default defineType({
  name: "menuCategory",
  title: "Menu Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "menuItem" }] }],
    }),
  ],
});
