import { RuleType } from "../../../types/rule-type";

export const interviewRefSchema = {
  name: "interview",
  title: "Interview",
  type: "reference",
  to: [{ type: "interview" }],
  description: "Reference to an interview",
  // validation: (Rule: RuleType) => Rule.required(),
};
