import { FieldHook } from "payload/types";
import { isEqual, pick } from "lodash";

export const updateAnswerDate: FieldHook = ({
  originalDoc,
  operation,
  value,
}) => {
  if (operation == "update") {
    const originalAnswer = originalDoc.answers.find(
      (answer) => answer.answer.questionSlug === value.questionSlug
    )?.answer;

    if (!originalAnswer) {
      return value;
    }

    const keysToCompare = Object.keys(value);
    const originalAnswerSubset = pick(originalAnswer, keysToCompare);

    if (originalAnswerSubset?.images.length > 0) {
      originalAnswerSubset.images = originalAnswerSubset.images.map((item) => {
        return { image: item.image };
      });
    }

    const hasChanges = !isEqual(originalAnswerSubset, value);

    if (hasChanges) {
      value.updatedAt = new Date();
    }

    return value;
  }
};
