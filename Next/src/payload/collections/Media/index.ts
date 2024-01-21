import path from "path";
import type { CollectionConfig } from "payload/types";
import { isAdmin, isAdminFieldLevel } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { checkRole } from "../../access/checkRole";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(__dirname, "../../media"),
    disableLocalStorage: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
    },
  ],
};
