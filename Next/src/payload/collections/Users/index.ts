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

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    forgotPassword: {
      generateEmailSubject: () => "Reset your Weasker password",
      generateEmailHTML: generateForgotPasswordEmail,
    },
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
    seo,
  ],
};

export default Users;
