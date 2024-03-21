import type { Field } from "payload/types";
import { updateAnswerDate } from "./hooks/updateAnswerDate";
import { userInterviewQuestionSelect } from "./fields/userInterviewQuestionSelect/field";

export const answer: Field = {
  name: "answer",
  label: "Answer",
  type: "group",
  hooks: { beforeChange: [updateAnswerDate] },
  fields: [
    userInterviewQuestionSelect,
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
