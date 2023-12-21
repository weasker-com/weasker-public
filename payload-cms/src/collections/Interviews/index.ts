import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
import { question } from "../../components/question/question";

export const Interviews: CollectionConfig = {
  slug: "interviews",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      label: "Interview name",
      type: "text",
      required: true,
    },
    {
      name: "badge",
      label: "Badge",
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "questions",
      label: "Questions",
      type: "array",
      fields: [question],
      required: true,
    },
    seo,
  ],
};
