import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      initialValue: 5,
      options: {
        list: [1, 2, 3, 4, 5].map((value) => ({ title: `${value} Star${value > 1 ? "s" : ""}`, value })),
      },
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
