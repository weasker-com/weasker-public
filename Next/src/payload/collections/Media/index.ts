import path from "path";
import type { CollectionConfig } from "payload/types";
import { validateFileSize } from "./hooks/validateFileSize";

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
    {
      name: "filesize",
      label: "File size",
      type: "number",
      hooks: {
        beforeValidate: [validateFileSize],
      },
    },
  ],
};
