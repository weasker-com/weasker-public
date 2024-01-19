import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo";
import { isAdmin, isAdminFieldLevel } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { anyone } from "../../access/anyone";
import { checkRole } from "../../access/checkRole";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
    create: isAdminOrSelf,
    delete: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  fields: [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      required: false,
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      required: false,
    },
    {
      name: "userName",
      label: "User name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      // Save this field to JWT so we can use from `req.user`
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
          required: true,
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
