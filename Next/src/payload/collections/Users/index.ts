import { CollectionBeforeValidateHook, CollectionConfig } from "payload/types";
import { seo } from "../../components/seo";
import { isAdminFieldLevel } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { checkRole } from "../../access/checkRole";
import { ValidationError } from "payload/errors";
import { loginAfterCreate } from "./hooks/loginAfterCreate";
import generateForgotPasswordEmail from "../../email/generateForgotPasswordEmail";

const validatePassword: CollectionBeforeValidateHook = ({
  data: { password },
}) => {
  if (typeof password !== "string") {
    return;
  }

  let errorMessages = [];

  if (password.length < 8) {
    errorMessages.push("Password must be at least 8 characters long. ");
  }

  if (password.length > 50) {
    errorMessages.push("Password must be less than 50 characters long. ");
  }

  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    errorMessages.push("Password must have lowercase letters. ");
  }

  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    errorMessages.push("Password must have uppercase letters. ");
  }

  const hasSymbols = /[$-/:-?{-~!"^_`[\]]/.test(password);
  if (!hasSymbols) {
    errorMessages.push("Password must include at least one symbol. ");
  }

  if (errorMessages.length > 0) {
    const message = errorMessages.join(" ");
    throw new ValidationError([{ message, field: "password" }]);
  }
};

const validateUserName: CollectionBeforeValidateHook = ({
  operation,
  data: { userName },
}) => {
  if (operation !== "create") {
    return;
  }
  let message: string;
  if (userName.length < 3 || userName.length > 20)
    message = "Username must be between 3 and 20 characters";

  const isValidUserName = /^[A-Za-z0-9_-]+$/.test(userName);
  if (!isValidUserName)
    message =
      "Username can only contain English letters, numbers, hyphens ('-'), or underscores ('_')";

  if (message) throw new ValidationError([{ message, field: "userName" }]);
};

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // maxLoginAttempts: 10,
    // lockTime: 60 * 1000 * 60 * 12,
    forgotPassword: {
      generateEmailSubject: () => "Reset your Weasker password",
      generateEmailHTML: generateForgotPasswordEmail,
    },
  },
  hooks: {
    beforeValidate: [validatePassword, validateUserName],
    afterChange: [loginAfterCreate],
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
          required: true,
        },
        {
          name: "services",
          label: "Services",
          type: "array",
          required: false,
          fields: [
            {
              name: "name",
              label: "Name",
              type: "text",
              required: true,
            },
            {
              name: "url",
              label: "URL",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    seo,
  ],
};

export default Users;
