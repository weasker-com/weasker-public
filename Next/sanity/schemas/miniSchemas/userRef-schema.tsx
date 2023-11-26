import { RuleType } from "../../../types/rule-type";

export const userRefSchema = {
  name: "user",
  title: "User",
  type: "reference",
  to: [{ type: "user" }],
  description: "Reference to the user",
  validation: (Rule: RuleType) => Rule.required(),
};
