import { seoDescriptionSchema } from "./miniSchemas/seoDescriptionSchema";
import { seoTitleSchema } from "./miniSchemas/seoTitleSchema";
import { numbering } from "./miniSchemas/numbering-schema";
import { interviewRefSchema } from "./miniSchemas/interviewRef-schema";
import { RuleType } from "../../types/rule-type";
import { isUniqueForSameInterview } from "../lib/isUniqueForSameInterview";

interface Selection {
  questionSlug: string;
  number: number;
  interviewSlug: string;
}

const question = {
  name: "question",
  title: "Questions",
  type: "document",
  fields: [
    numbering,
    interviewRefSchema,
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: "shortQuestion",
      title: "Short question",
      type: "string",
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: "longQuestion",
      title: "Long question",
      type: "string",
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "question", isUnique: isUniqueForSameInterview },
      validation: (Rule: RuleType) => Rule.required(),
    },
    seoTitleSchema,
    seoDescriptionSchema,
  ],
  preview: {
    select: {
      questionSlug: "slug.current",
      number: "number",
      interviewSlug: "interview.badge.slug.current",
    },
    prepare(value: Record<string, any>) {
      const { interviewSlug, number, questionSlug } = value;
      return {
        title: `${number}. ${questionSlug}`,
        subtitle: interviewSlug,
      };
    },
  },
};

export default question;
