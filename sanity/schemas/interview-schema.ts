import { RuleType } from "../../types/rule-type";
import { badgeRefSchema } from "./miniSchemas/badgeRef-schema";
import { imageSchema as imageSchemaBase } from "./miniSchemas/image-schema";
import { nameSchema } from "./miniSchemas/name-Schema";
import { openGraphImageSchema } from "./miniSchemas/openGraphImage-schema";
import { slugSchema } from "./miniSchemas/slug-schema";

const imageSchema = imageSchemaBase(true);

const interview = {
  name: "interview",
  title: "Interviews",
  type: "document",
  fields: [
    nameSchema,
    badgeRefSchema,
    imageSchema,
    openGraphImageSchema,
    slugSchema,
    {
      name: "question",
      type: "array",
      title: "Questions",
      of: [
        {
          name: "questionRef",
          validation: (Rule: RuleType) => Rule.required(),
          title: "Question Reference",
          type: "reference",
          to: [{ type: "question" }],
        },
      ],
    },
  ],
};

export default interview;
