import { RuleType } from "../../types/rule-type";
import { excerptSchema } from "./miniSchemas/excerpt-Schema";
import { imageSchema as imageSchemaBase } from "./miniSchemas/image-schema";
import { nameSchema } from "./miniSchemas/name-Schema";
import { openGraphImageSchema } from "./miniSchemas/openGraphImage-schema";
import { seoDescriptionSchema } from "./miniSchemas/seoDescriptionSchema";
import { seoTitleSchema } from "./miniSchemas/seoTitleSchema";
import { slugSchema } from "./miniSchemas/slug-schema";

const imageSchema = imageSchemaBase(true);

const badge = {
  name: "badge",
  title: "Badges",
  type: "document",
  fields: [
    nameSchema,
    {
      name: "singularName",
      title: "Singular name",
      type: "string",
      validation: (Rule: RuleType) => Rule.required(),
    },
    slugSchema,
    excerptSchema,
    imageSchema,
    seoTitleSchema,
    seoDescriptionSchema,
    openGraphImageSchema,
  ],
};

export default badge;
