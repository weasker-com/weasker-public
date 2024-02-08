import path from "path";
import type { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(__dirname, "../../media"),
    disableLocalStorage: true,
    mimeTypes: ["image/*", "video/*"],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
    },
  ],
};
