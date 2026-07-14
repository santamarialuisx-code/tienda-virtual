import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "tienda-virtual",
  title: "Tienda Virtual — Admin",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemas,
  },
  // Custom branding
  studio: {
    components: {
      // Logo and name are handled by Sanity Studio defaults
      // Custom layout would go here if needed
    },
  },
});
