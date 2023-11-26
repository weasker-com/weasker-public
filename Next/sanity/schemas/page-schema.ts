import contentSchema from "./miniSchemas/content-schema";
import { imageSchema as imageSchemaBase } from "./miniSchemas/image-schema";
import { nameSchema } from "./miniSchemas/name-Schema";
import { openGraphImageSchema } from "./miniSchemas/openGraphImage-schema";
import { seoDescriptionSchema } from "./miniSchemas/seoDescriptionSchema";
import { seoTitleSchema } from "./miniSchemas/seoTitleSchema";
import { slugSchema } from "./miniSchemas/slug-schema";
import { excerptSchema } from "./miniSchemas/excerpt-Schema";

const imageSchema = imageSchemaBase(false);

const page = {
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    nameSchema,
    slugSchema,
    excerptSchema,
    imageSchema,
    contentSchema,
    seoTitleSchema,
    seoDescriptionSchema,
    openGraphImageSchema,
  ],
};

export default page;
