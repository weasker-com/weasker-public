import { CollectionConfig } from "payload/types";
import { isAdmin } from "../../access/isAdmin";
import { populateCommunitySlugAndPath } from "./hooks/populateCommunitySlugAndPath";

export const Communities: CollectionConfig = {
  slug: "communities",
  auth: false,
  admin: {
    useAsTitle: "singularName",
  },
  hooks: {
    beforeChange: [populateCommunitySlugAndPath],
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: "image",
      label: "Featured image",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      unique: true,
    },
    {
      name: "path",
      label: "Path",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "singularName",
      label: "Community singular name",
      type: "text",
      required: true,
    },
    {
      name: "pluralName",
      label: "Community plural name",
      type: "text",
      required: true,
    },
    {
      name: "userCount",
      label: "Users count",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
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
      name: "questionCount",
      label: "Questions count",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "questions",
      label: "Questions",
      type: "relationship",
      relationTo: "questions",
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "terms",
      label: "Community terms",
      type: "textarea",
      admin: {
        description:
          "The criteria to determine user eligibility for this community. Displayed on the community application form",
      },
      required: true,
    },
    {
      name: "description",
      label: "Community description",
      type: "textarea",
      required: true,
    },
  ],
};
