import { createClient } from "@sanity/client";

const projectId = import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || "production";
const apiVersion = import.meta.env.SANITY_API_VERSION || process.env.SANITY_API_VERSION || "2025-01-01";
const useCdnEnv = import.meta.env.SANITY_USE_CDN || process.env.SANITY_USE_CDN;
const useCdn = String(useCdnEnv ?? "false").toLowerCase() === "true";

if (!projectId) {
  throw new Error("Missing SANITY_PROJECT_ID. Add it to your environment variables.");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]{
    title,
    description,
    heroHeading,
    heroSubhead,
    primaryCtaText,
    primaryCtaUrl,
    secondaryCtaText,
    secondaryCtaUrl,
    contactPhone,
    contactEmail,
    addressLine1,
    addressLine2,
    mapEmbedUrl,
    socialLinks[]
  }`,
  hours: `*[_type == "hours"]|order(order asc){label, "closed": coalesce(closed, false), open, close, order}`,
  menuCategories: `*[_type == "menuCategory"]|order(order asc){
    title,
    description,
    order,
    image{asset->{url}, alt},
    items[]->{name, description, price, isOutOfStock, tags}
  }`,
  testimonials: `*[_type == "testimonial"]|order(order asc){quote, author, rating, order}`,
  deliveryLinks: `*[_type == "deliveryLink"]|order(order asc){label, url, order, logo{asset->{url}, alt}}`,
};

export async function getSiteSettings() {
  return sanityClient.fetch(queries.siteSettings);
}

export async function getHours() {
  return sanityClient.fetch(queries.hours);
}

export async function getMenuCategories() {
  return sanityClient.fetch(queries.menuCategories);
}

export async function getTestimonials() {
  return sanityClient.fetch(queries.testimonials);
}

export async function getDeliveryLinks() {
  return sanityClient.fetch(queries.deliveryLinks);
}
