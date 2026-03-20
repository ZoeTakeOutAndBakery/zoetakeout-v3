import { defineField, defineType } from "sanity";

export default defineType({
  name: "deliveryLink",
  title: "Delivery Link",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
  ],
});
