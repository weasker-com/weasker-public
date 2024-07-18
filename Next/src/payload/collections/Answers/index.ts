import { CollectionConfig } from "payload/types";
import { isAdmin } from "../../access/isAdmin";
import { updateUpvotesSum } from "./hooks/updateUpvotesSum";

export const Answers: CollectionConfig = {
  slug: "answers",
  auth: false,
  admin: {
    useAsTitle: "id",
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  hooks: {
    beforeChange: [updateUpvotesSum],
  },
  fields: [
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "question",
      label: "Question",
      type: "relationship",
      relationTo: "questions",
    },
    {
      name: "textAnswer",
      label: "Text Answer",
      type: "textarea",
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
        // readOnly: true,
      },
    },
  ],
};
