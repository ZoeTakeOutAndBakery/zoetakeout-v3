import { defineField, defineType } from "sanity";

export default defineType({
  name: "cateringInquiry",
  title: "Catering Inquiry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required().min(7).max(30),
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Wedding", value: "Wedding" },
          { title: "Funeral", value: "Funeral" },
          { title: "Birthday", value: "Birthday" },
          { title: "Corporate", value: "Corporate" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guestCount",
      title: "Guest Count",
      type: "number",
      validation: (rule) => rule.integer().min(1).max(10000),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required().min(3).max(4000),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in_progress" },
          { title: "Closed", value: "closed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      date: "submittedAt",
    },
    prepare(selection) {
      const { title, subtitle, date } = selection;
      const submitted = date ? new Date(date).toLocaleString() : "Unknown date";
      return {
        title: title || "Unnamed inquiry",
        subtitle: `${subtitle || "No email"} - ${submitted}`,
      };
    },
  },
});

