import { isAdmin } from "../../access/isAdmin";
import { isUser } from "../../access/isUser";
import { CollectionConfig } from "payload/types";
import { validateUrlField } from "./hooks/validateUrlField";
import { emailAfterCreate } from "./hooks/emailAfterCreate";
import { actionAfterStatusChange } from "./hooks/actionAfterStatusChange";
import { updateUserAfterCreate } from "./hooks/updateUserAfterCreate";

export const Applications: CollectionConfig = {
  slug: "applications",
  access: {
    read: isUser,
    create: isUser,
    delete: isAdmin,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      emailAfterCreate,
      updateUserAfterCreate,
      actionAfterStatusChange,
    ],
  },
  fields: [
    {
      name: "badge",
      label: "Badge name",
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "user",
      label: "User name",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "about",
      label: "About",
      type: "textarea",
      maxLength: 200,
      required: true,
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
            beforeValidate: [validateUrlField],
          },
        },
        {
          name: "linkTwo",
          label: "Link two",
          type: "text",
          hooks: {
            beforeValidate: [validateUrlField],
          },
        },
        {
          name: "linkThree",
          label: "Link three",
          type: "text",
          hooks: {
            beforeValidate: [validateUrlField],
          },
        },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
  ],
};
