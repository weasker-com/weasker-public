import { RuleType } from "../../../types/rule-type";

export const openGraphImageSchema = {
  name: "openGraphImage",
  type: "image",
  title: "Open Graph Image",
  description: "Social share image 1200 x 630 px",
  validation: (Rule: RuleType) => Rule.required(),
  options: {
    hotspot: true,
  },
};
