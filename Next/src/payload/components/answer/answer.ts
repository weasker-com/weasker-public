import type { Field } from "payload/types";
// import { updateAnswerDate } from "./hooks/updateAnswerDate";

export const answer: Field = {
  name: "answer",
  label: "Answer",
  type: "group",
  // hooks: { beforeChange: [updateAnswerDate] },
  fields: [
    {
      name: "questionSlug",
      label: "Question Slug",
      type: "text",
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
      name: "updatedAt",
      label: "Updated at",
      type: "date",
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        date: {
          displayFormat: "PPpp",
        },
      },
    },
  ],
};
