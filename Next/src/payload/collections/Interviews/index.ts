import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
import { question } from "../../components/question/question";
import { isAdmin } from "../../access/isAdmin";
import { updateBadgeInterviews } from "./hooks/updateBadgeInterviews";
import { updateBadgeInterviewsAfterDelete } from "./hooks/updateBadgeInterviewsAfterDelete";

export const Interviews: CollectionConfig = {
  slug: "interviews",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
  },
  hooks: {
    afterChange: [updateBadgeInterviews],
    afterDelete: [updateBadgeInterviewsAfterDelete],
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
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
      index: true,
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "userInterviews",
      label: "User interviews",
      type: "relationship",
      relationTo: "users-interviews",
      hasMany: true,
      admin: {
        readOnly: true,
        description: "List of users who took this interview",
      },
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
