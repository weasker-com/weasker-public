import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";

export const Badges: CollectionConfig = {
  slug: "badges",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
  },
  access: {
    read: () => true,
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
