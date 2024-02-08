import type { Field } from "payload/types";
import {
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from "@payloadcms/richtext-lexical";

export const answer: Field = {
  name: "answer",
  label: "Answer",
  type: "group",
  fields: [
    {
      name: "richText",
      label: "Text answer",
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
    {
      name: "images",
      label: "Images",
      type: "array",
      required: false,
      fields: [
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
          required: false,
        },
      ],
    },
    {
      name: "video",
      label: "Video",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "updatedAt",
      label: "Updated at",
      type: "date",
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        date: {
          displayFormat: "PPpp",
        },
      },
    },
  ],
};
