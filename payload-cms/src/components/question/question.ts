import type { Field } from "payload/types";
import { seo } from "../seo";
import { answer } from "../answer/answer";

export const question: Field = {
  name: "question",
  label: "Question",
  type: "group",
  fields: [
    {
      name: "index",
      label: "Index",
      type: "number",
      required: true,
      min: 1,
      max: 99,
    },
    {
      name: "shortQuestion",
      label: "Short question",
      type: "text",
      required: true,
    },
    {
      name: "mediumQuestion",
      label: "Medium question",
      type: "text",
      required: true,
    },
    {
      name: "longQuestion",
      label: "Long question",
      type: "textarea",
      required: true,
    },
    seo,
    {
      name: "answers",
      label: "Answers",
      type: "array",
      fields: [
        {
          name: "user",
          label: "User",
          type: "relationship",
          relationTo: "users",
          required: true,
        },

        answer,
      ],
    },
  ],
};
