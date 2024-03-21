import { CollectionConfig } from "payload/types";
import { isAdmin } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { checkRole } from "../../access/checkRole";
import { answer } from "../../components/answer/answer";
import { isUser } from "../../access/isUser";
import { populateUserSlug } from "./hooks/populateUserSlug";
import { populateInterviewSlug } from "./hooks/populateInterviewSlug";
import { populateBadgeSlug } from "./hooks/populateBadgeSlug";
import { updateUserInterviews } from "./hooks/updateUserInterviews";
import { updateUserInterviewsAfterDelete } from "./hooks/updateUserInterviewsAfterDelete";
import { updateInterviewUsers } from "./hooks/updateInterviewUsers";
import { updateInterviewUsersAfterDelete } from "./hooks/updateInterviewUsersAfterDelete";

const UsersInterviews: CollectionConfig = {
  slug: "users-interviews",
  admin: {
    useAsTitle: "documentTitle",
  },
  hooks: {
    beforeChange: [populateUserSlug, populateInterviewSlug, populateBadgeSlug],
    afterChange: [updateUserInterviews, updateInterviewUsers],
    afterDelete: [
      updateUserInterviewsAfterDelete,
      updateInterviewUsersAfterDelete,
    ],
  },
  access: {
    read: () => true,
    create: isUser,
    delete: isAdmin,
    update: isAdminOrSelf,
    admin: ({ req: { user } }) => checkRole(["admin"], user),
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "badge",
      label: "Badge",
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "interview",
      label: "Interview",
      type: "relationship",
      relationTo: "interviews",
      required: true,
      filterOptions: ({ data }) => {
        if (data.badge) {
          return {
            badge: {
              equals: data.badge,
            },
          };
        }
        return {};
      },
    },
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
      required: true,
      filterOptions: ({ data }) => {
        if (data.badge) {
          return {
            "userBadges.badge": {
              equals: data.badge,
            },
          };
        }
        return {};
      },
    },
    {
      name: "badgeSlug",
      label: "Badge slug",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "interviewSlug",
      label: "Interview slug",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "userSlug",
      label: "User slug",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "answersAmount",
      label: "Answers amount",
      type: "number",
      admin: {
        description: "The amount of questions the user answered",
      },
      access: {
        create: () => false,
        update: () => false,
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            return data.answers.filter((answer) => {
              return (
                answer.answer.video ||
                answer.answer.images.length !== 0 ||
                (answer.answer.textAnswer && answer.answer.textAnswer !== "")
              );
            }).length;
          },
        ],
      },
    },
    {
      name: "answers",
      label: "Answers",
      type: "array",
      fields: [answer],
    },

    {
      name: "documentTitle",
      type: "text",
      admin: {
        hidden: true,
      },
      access: {
        create: () => false,
        update: () => false,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData["documentTitle"];
          },
        ],
        afterRead: [
          ({ data }) => {
            return `${data.userSlug}: ${data.interviewSlug}`;
          },
        ],
      },
    },
  ],
};

export default UsersInterviews;
