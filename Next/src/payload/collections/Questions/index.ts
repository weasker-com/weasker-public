import { CollectionConfig } from "payload/types";
import { isAdmin } from "../../access/isAdmin";
import { populatePathField } from "./hooks/populatePathField";
import { updateUpvotesSum } from "./hooks/updateUpvotesSum";
import { updateAnswersSum } from "./hooks/updateAnswersSum";

export const Questions: CollectionConfig = {
  slug: "questions",
  auth: false,
  admin: {
    useAsTitle: "path",
  },
  hooks: {
    beforeChange: [populatePathField, updateUpvotesSum, updateAnswersSum],
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: "questionSlug",
      label: "Question Slug",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "communitiesSlug",
      label: "Communities Slug",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "question",
      label: "Question",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "communities",
      label: "Communities",
      type: "relationship",
      relationTo: "communities",
      hasMany: true,
      admin: {
        description: "List of communities the user chose to ask",
      },
    },
    {
      name: "images",
      label: "Images",
      type: "array",
      required: false,
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: false,
        },
      ],
    },
    {
      name: "video",
      label: "Video",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "answersSum",
      label: "Answers sum",
      type: "number",
      defaultValue: 1,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "answers",
      label: "Answers",
      type: "relationship",
      relationTo: "answers",
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "upvotesSum",
      label: "Upvotes sum",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "upvotes",
      label: "Upvotes",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "path",
      label: "Path",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
  ],
};
