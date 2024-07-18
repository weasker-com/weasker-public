import { CollectionBeforeChangeHook } from "payload/types";

export const updateQuestionCount: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.questions && originalDoc?.questions) {
    const originalQuestionsLength = originalDoc.questions.length;
    const newQuestionsLength = data.questions.length;

    if (originalQuestionsLength !== newQuestionsLength) {
      data.questionCount = newQuestionsLength;
    }
  } else if (data.questions) {
    data.questionCount = data.questions.length;
  }
  return data;
};
