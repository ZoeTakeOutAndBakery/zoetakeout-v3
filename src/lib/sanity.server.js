import { createClient } from "@sanity/client";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let cachedClient;

export function getSanityWriteClient() {
  if (!cachedClient) {
    cachedClient = createClient({
      projectId: requireEnv("SANITY_PROJECT_ID"),
      dataset: requireEnv("SANITY_DATASET"),
      apiVersion: requireEnv("SANITY_API_VERSION"),
      token: requireEnv("SANITY_API_TOKEN"),
      useCdn: false,
    });
  }

  return cachedClient;
}
