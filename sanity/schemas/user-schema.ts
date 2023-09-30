import { RuleType } from "../../types/rule-type";
import { badgeRefSchema } from "./miniSchemas/badgeRef-schema";
import { imageSchema as imageSchemaBase } from "./miniSchemas/image-schema";
import { nameSchema } from "./miniSchemas/name-Schema";
import { openGraphImageSchema } from "./miniSchemas/openGraphImage-schema";
import { seoDescriptionSchema } from "./miniSchemas/seoDescriptionSchema";
import { seoTitleSchema } from "./miniSchemas/seoTitleSchema";
import { slugSchema } from "./miniSchemas/slug-schema";

const imageSchema = imageSchemaBase(true);

export const user = {
  name: "user",
  title: "Users",
  type: "document",
  fields: [
    nameSchema,
    {
      name: "badges",
      type: "array",
      title: "Badges",
      description: "Reference to user badges",
      of: [
        {
          name: "badgeRefSchema",
          validation: (Rule: RuleType) => Rule.required(),
          title: "Badge Reference",
          type: "reference",
          to: [{ type: "badge" }],
        },
      ],
    },

    imageSchema,
    {
      name: "services",
      title: "Services",
      validation: (Rule: RuleType) => Rule.required(),
      type: "array",
      of: [
        {
          name: "BOX",
          title: "Boxes",
          type: "object",
          preview: {
            select: {
              title: "name",
              subtitle: "link",
            },
          },
          fields: [
            {
              name: "name",
              title: "Service name",
              type: "string",
              validation: (Rule: RuleType) => Rule.required(),
            },
            {
              name: "link",
              title: "Link to service",
              type: "url",
              validation: (Rule: RuleType) => Rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      validation: (Rule: RuleType) => Rule.required(),
      of: [
        {
          type: "block",
        },
      ],
    },
    slugSchema,
    seoTitleSchema,
    seoDescriptionSchema,
    openGraphImageSchema,
  ],
};
