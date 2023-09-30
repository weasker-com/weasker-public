import { RuleType } from "../../../types/rule-type";

export const excerptSchema = {
  name: "excerpt",
  title: "Excerpt",
  type: "string",
  validation: (Rule: RuleType) => Rule.required(),
};
