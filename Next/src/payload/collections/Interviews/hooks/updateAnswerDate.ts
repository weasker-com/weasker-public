import { CollectionBeforeChangeHook } from "payload/types";
import { isEqual } from "lodash";

export const updateAnswerDate: CollectionBeforeChangeHook = ({
  originalDoc,
  operation,
  data,
}) => {
  if (operation == "update") {
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
  }
};
