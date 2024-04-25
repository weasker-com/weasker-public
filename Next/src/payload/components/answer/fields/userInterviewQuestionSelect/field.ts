import { Field } from "payload/types";
import { CustomSelectComponent } from "./component";
import { countBy } from "lodash";

export const userInterviewQuestionSelect: Field = {
  name: "questionSlug",
  label: "question slug",
  validate: (value, { data }) => {
    if (!value) return `Must have a value`;
    const chosenQuestions = data.answers
      .map((item) => {
        return item.answer?.userInterviewQuestionSelect;
      })
      .filter((item) => {
        return item !== undefined;
      });

    const counts = countBy(chosenQuestions);

    if (counts[value] > 1)
      return `The question "${value}" was already chosen once.`;
  },
  type: "text",
  admin: {
    components: {
      Field: CustomSelectComponent,
    },
  },
};
