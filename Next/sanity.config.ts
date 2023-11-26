import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import schemas from "./sanity/schemas/schemasIndex";
import { visionTool } from "@sanity/vision";

const config = defineConfig({
  projectId: "86a07a92",
  dataset: "production",
  title: "weasker",
  schema: { types: schemas },
  apiVersion: "2023-09-06",
  basePath: "/studio",
  plugins: [deskTool(), visionTool()],
});

export default config;
