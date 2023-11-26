import { RuleType } from "../../../types/rule-type";

export const badgeRefSchema = {
  name: "badge",
  title: "Choose a badge",
  type: "reference",
  to: { type: "badge" },
  validation: (Rule: RuleType) => Rule.required(),
};
