import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo";
import { isAdminFieldLevel } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { checkRole } from "../../access/checkRole";
import { loginAfterCreate } from "./hooks/loginAfterCreate";
import generateForgotPasswordEmail from "../../email/generateForgotPasswordEmail";
import { validatePassword } from "./hooks/validatePassword";
import { validateUserName } from "./hooks/validateUserName";
import { validateUrl } from "./hooks/validateUrl";
import { handleBadgeRemoval } from "./hooks/handleBadgeRemoval";
import { updateBadgeAndInterviews } from "./hooks/updateBadgeAndInterviews";
import { updateBadgeUsers } from "./hooks/updateBadgeUsers";
import { countBy } from "lodash";

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    forgotPassword: {
      generateEmailSubject: () => "Reset your Weasker password",
      generateEmailHTML: generateForgotPasswordEmail,
    },
    maxLoginAttempts: 6,
    lockTime: 60 * 60 * 24,
  },
  hooks: {
    beforeValidate: [validatePassword, validateUserName],
    afterChange: [loginAfterCreate, updateBadgeUsers, handleBadgeRemoval],
    afterDelete: [updateBadgeAndInterviews],
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
    create: () => true,
    delete: isAdminOrSelf,
    update: isAdminOrSelf,
    admin: ({ req: { user } }) => checkRole(["admin"], user),
  },
  fields: [
    {
      name: "displayName",
      label: "Display name",
      type: "text",
      required: false,
      maxLength: 30,
    },
    {
      name: "userName",
      label: "User name",
      type: "text",
      required: true,
      unique: true,
      maxLength: 20,
    },
    {
      name: "roles",
      saveToJWT: true,
      type: "select",
      hasMany: true,
      defaultValue: ["endUser"],
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "End user",
          value: "endUser",
        },
        {
          label: "QA user",
          value: "qa",
        },
      ],
    },
    {
      name: "userBadges",
      label: "User badges",
      type: "array",
      required: false,

      fields: [
        {
          name: "badge",
          label: "Badge",
          type: "relationship",
          relationTo: "badges",
          required: true,
          validate: (value, { data }) => {
            if (!value) return `Must have a value`;
            const chosenBadges = data?.userBadges
              ? data.userBadges
                  .map((item) => {
                    return item.badge?.id ? item.badge.id : item.badge;
                  })
                  .filter((item) => {
                    return item !== undefined;
                  })
              : [];

            const counts = countBy(chosenBadges);

            if (counts[value] > 1)
              return `The badge "${value}" was already chosen once.`;
          },
        },
        {
          name: "bio",
          label: "Bio",
          type: "text",
          required: false,
        },
        {
          name: "links",
          label: "Links",
          type: "group",
          fields: [
            {
              name: "linkOne",
              label: "Link one",
              type: "text",
              hooks: {
                beforeValidate: [validateUrl],
              },
            },
            {
              name: "linkTwo",
              label: "Link two",
              type: "text",
              hooks: {
                beforeValidate: [validateUrl],
              },
            },
            {
              name: "linkThree",
              label: "Link three",
              type: "text",
              hooks: {
                beforeValidate: [validateUrl],
              },
            },
            {
              name: "linkFour",
              label: "Link four",
              type: "text",
              hooks: {
                beforeValidate: [validateUrl],
              },
            },
            {
              name: "linkFive",
              label: "Link five",
              type: "text",
              hooks: {
                beforeValidate: [validateUrl],
              },
            },
          ],
        },
      ],
    },
    {
      name: "userInterviews",
      label: "User interviews",
      type: "relationship",
      relationTo: "users-interviews",
      hasMany: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "userApplications",
      label: "User applications",
      type: "relationship",
      relationTo: "applications",
      hasMany: true,
      admin: {
        readOnly: true,
        description: "List of all the user's application to join badges",
      },
    },
    seo,
  ],
};

export default Users;
