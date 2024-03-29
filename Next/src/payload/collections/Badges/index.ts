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
    {
      name: "users",
      label: "Users",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        readOnly: false,
      },
    },
    {
      name: "interviews",
      label: "Interviews",
      type: "relationship",
      relationTo: "interviews",
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "terms",
      label: "Badge terms",
      type: "textarea",
      admin: {
        description:
          "The criteria to determine user eligibility for this badge. Displayed on the badge application form",
      },
      required: true,
    },
    seo,
  ],
};
