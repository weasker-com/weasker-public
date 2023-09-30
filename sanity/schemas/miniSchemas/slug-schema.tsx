import { RuleType } from "../../../types/rule-type";

export const slugSchema = {
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "name" },
  validation: (Rule: RuleType) => Rule.required(),
};
