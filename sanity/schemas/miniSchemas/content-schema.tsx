import { RuleType } from "../../../types/rule-type";

const contentSchema = {
  name: "content",
  title: "Content",
  type: "array",
  validation: (Rule: RuleType) => Rule.required(),
  of: [
    {
      type: "block",
    },
  ],
  description: "The content of the page",
};

export default contentSchema;
