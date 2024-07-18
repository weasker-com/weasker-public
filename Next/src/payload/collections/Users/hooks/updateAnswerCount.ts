import { CollectionBeforeChangeHook } from "payload/types";

export const updateAnswerCount: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.answers && originalDoc?.answers) {
    const originalAnswersLength = originalDoc.answers.length;
    const newAnswersLength = data.answers.length;

    if (originalAnswersLength !== newAnswersLength) {
      data.answerCount = newAnswersLength;
    }
  } else if (data.answers) {
    data.answerCount = data.answers.length;
  }
  return data;
};
