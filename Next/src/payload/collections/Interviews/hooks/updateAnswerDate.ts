import { CollectionBeforeChangeHook } from "payload/types";
import { isEqual } from "lodash";

export const updateAnswerDate: CollectionBeforeChangeHook = ({
  originalDoc,
  operation,
  data,
}) => {
  if (operation == "update") {
    data.questions.forEach((question) => {
      const originalQuestion = originalDoc.questions.find(
        (q) => q.id === question.id
      );

      if (!originalQuestion) {
        return;
      }
      question.question.answers.forEach((answer) => {
        const originalAnswer = originalQuestion.question.answers.find(
          (a) => a.id === answer.id
        );

        if (!originalAnswer) {
          return;
        }

        if (!isEqual(originalAnswer.answer, answer.answer)) {
          answer.answer.updatedAt = new Date();
        }
      });
    });

    return data;
  }
};
