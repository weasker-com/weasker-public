import { RuleType } from "../../types/rule-type";
import { imagesSchema } from "./miniSchemas/images-schema";
import { interviewRefSchema } from "./miniSchemas/interviewRef-schema";
import { questionRefSchema } from "./miniSchemas/questionRef-schem";
import { seoDescriptionSchema } from "./miniSchemas/seoDescriptionSchema";
import { seoTitleSchema } from "./miniSchemas/seoTitleSchema";
import { userRefSchema } from "./miniSchemas/userRef-schema";
import { video } from "./miniSchemas/video-schema";

const answer = {
  name: "answer",
  title: "Answers",
  type: "document",
  fields: [
    userRefSchema,
    interviewRefSchema,
    seoTitleSchema,
    seoDescriptionSchema,
    {
      name: "answers",
      title: "Answers",
      type: "array",
      of: [
        {
          type: "object",
          name: "individualAnswer",
          title: "Answer",
          preview: {
            select: {
              title: "questionRef.number",
              subtitle: "questionRef.slug.current",
            },
          },
          fields: [
            questionRefSchema,
            {
              name: "interviewAnswer",
              title: "Answer",
              type: "array",
              of: [
                {
                  type: "block",
                },
              ],
              description: "The answer to the question",
              validation: (Rule: RuleType) => Rule.required(),
            },
            imagesSchema,
            video,
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "user.name",
      subtitle: "interview.name",
    },
  },
};

export default answer;
