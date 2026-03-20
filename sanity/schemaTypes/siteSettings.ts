import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "heroSubhead", title: "Hero Subhead", type: "text" }),
    defineField({ name: "primaryCtaText", title: "Primary CTA Text", type: "string" }),
    defineField({ name: "primaryCtaUrl", title: "Primary CTA URL", type: "url" }),
    defineField({ name: "secondaryCtaText", title: "Secondary CTA Text", type: "string" }),
    defineField({ name: "secondaryCtaUrl", title: "Secondary CTA URL", type: "url" }),
    defineField({ name: "contactPhone", title: "Contact Phone", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "addressLine1", title: "Address Line 1", type: "string" }),
    defineField({ name: "addressLine2", title: "Address Line 2", type: "string" }),
    defineField({ name: "mapEmbedUrl", title: "Map Embed URL", type: "url" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
  ],
});
