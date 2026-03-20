import { defineField, defineType } from "sanity";

export default defineType({
  name: "hours",
  title: "Hours",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({
      name: "closed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
      description: "If enabled, site displays Closed for this day.",
    }),
    defineField({
      name: "open",
      title: "Open",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.closed) return true;
          return value ? true : "Open time is required when day is not closed.";
        }),
    }),
    defineField({
      name: "close",
      title: "Close",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.closed) return true;
          return value ? true : "Close time is required when day is not closed.";
        }),
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
