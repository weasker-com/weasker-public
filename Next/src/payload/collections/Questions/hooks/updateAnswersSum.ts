import { CollectionBeforeChangeHook } from "payload/types";

export const updateAnswersSum: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.answers && originalDoc?.answers) {
    const originalAnswersLength = originalDoc.answers.length;
    const newAnswersLength = data.answers.length;

    if (originalAnswersLength !== newAnswersLength) {
      data.answersSum = newAnswersLength;
    }
  } else if (data.answers) {
    data.answersSum = data.answers.length;
  }
  return data;
};
