import { RuleType } from "../../../types/rule-type";

export const imageSchema = (isRequired: boolean) => ({
  name: "image",
  type: "image",
  title: "Image",
  validation: (Rule: RuleType) => (isRequired ? Rule.required() : Rule),
  options: {
    hotspot: true,
  },
});
