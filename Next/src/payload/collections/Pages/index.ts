import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
import { isAdmin } from "../../access/isAdmin";

import {
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from "@payloadcms/richtext-lexical";

export const Pages: CollectionConfig = {
  slug: "pages",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
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
      label: "H1 Page title",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: false,
      defaultValue: "noCategory",
      options: [
        {
          label: "Help",
          value: "help",
        },
        {
          label: "No category",
          value: "noCategory",
        },
      ],
    },
    {
      name: "richText",
      label: "Content",
      type: "richText",
      required: false,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
        ],
      }),
    },
    lexicalHTML("richText", {
      name: "richText_html",
    }),
    seo,
  ],
};
