import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
import { isAdmin } from "../../access/isAdmin";

export const Badges: CollectionConfig = {
  slug: "badges",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: "singularName",
      label: "Badge singular name",
      type: "text",
      required: true,
    },
    {
      name: "pluralName",
      label: "Badge plural name",
      type: "text",
      required: true,
    },
    seo,
  ],
};
