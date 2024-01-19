import { CollectionConfig } from "payload/types";
import { seo } from "../../components/seo/index";
import { question } from "../../components/question/question";
import { isEqual } from "lodash";
import { isAdmin, isAdminFieldLevel } from "../../access/isAdmin";
import { isAdminOrSelf } from "../../access/isAdminOrSelf";
import { checkRole } from "../../access/checkRole";
import { anyone } from "../../access/anyone";

export const Interviews: CollectionConfig = {
  slug: "interviews",
  auth: false,
  admin: {
    useAsTitle: "seo.slug",
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: anyone,
  },
  fields: [
    {
      name: "name",
      label: "Interview name",
      type: "text",
      required: true,
    },
    {
      name: "badge",
      label: "Badge",
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "questions",
      label: "Questions",
      type: "array",
      fields: [question],
      required: true,
    },
    seo,
  ],
  hooks: {
    beforeChange: [
      ({ originalDoc, data }) => {
        // If there is no originalDoc, then this is a new document, so we don't need to do anything
        if (!originalDoc) {
          return;
        }

        // Loop through all the questions in the new data
        data.questions.forEach((question) => {
          // For each question, get the original question
          const originalQuestion = originalDoc.questions.find(
            (q) => q.id === question.id
          );

          // If there is no original question, then this is a new question, so we don't need to do anything
          if (!originalQuestion) {
            return;
          }

          question.question.answers.forEach((answer) => {
            const originalAnswer = originalQuestion.question.answers.find(
              (a) => a.id === answer.id
            );

            // If there is no original answer, then this is a new answer, so we don't need to do anything
            if (!originalAnswer) {
              return;
            }

            // If the answer has changed, then update the updatedAt field. Use isEqual to deeply compare the two objects
            if (!isEqual(originalAnswer.answer, answer.answer)) {
              answer.answer.updatedAt = new Date();
            }
          });
        });

        return data;
      },
    ],
  },
};
