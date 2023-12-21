import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
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
