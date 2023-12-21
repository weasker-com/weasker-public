import { RuleType } from "../../../types/rule-type";

export const questionRefSchema = {
  name: "questionRef",
  title: "Question Reference",
  type: "reference",
  validation: (Rule: RuleType) => Rule.required(),
  to: [{ type: "question" }],
  options: {
    filter: ({ document }: { document: any }) => {
      const interviewId = document?.interview?._ref;

      if (interviewId) {
        return {
          filter: "interview._ref == $interviewId",
          params: { interviewId },
        };
      } else {
        return {
          filter: '_type == "question"',
        };
      }
    },
  },
};
