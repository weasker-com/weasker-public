import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
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
  },
  fields: [
    {
      name: "name",
      label: "H1 Page title",
      type: "text",
      required: true,
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
