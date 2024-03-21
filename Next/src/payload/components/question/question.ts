import type { GroupField } from "payload/types";
import { seo } from "../seo";

export const question: GroupField = {
  name: "question",
  type: "group",
  label: "question",
  fields: [
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
  ],
};
