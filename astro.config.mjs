import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
    },
  },
});
