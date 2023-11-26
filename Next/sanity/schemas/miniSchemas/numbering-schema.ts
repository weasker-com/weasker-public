import { RuleType } from "../../../types/rule-type";

export const numbering = {
  name: "number",
  title: "Number",
  type: "number",
  validation: (Rule: RuleType) =>
    Rule.min(1)
      .required()
      .max(100)
      .integer()
      .error("Please enter a number between 1 and 100"),
};
