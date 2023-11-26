import { RuleType } from "../../../types/rule-type";

export const nameSchema = {
  name: "name",
  title: "Name",
  type: "string",
  validation: (Rule: RuleType) => Rule.required(),
};
