import * as React from "react";
import { SelectInput, useField, useFormFields } from "payload/components/forms";
import axios from "axios";
import { Interview } from "../../../../payload-types";

export const CustomSelectComponent: React.FC<{ path: string }> = ({ path }) => {
  const interviewIdField = useFormFields(([fields]) => fields.interview);
  const interviewId = interviewIdField?.value as string;

  const { value, setValue } = useField<string>({ path });
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (!interviewId) {
      return;
    }

    const fetchOptions = async () => {
      try {
        const result = await axios({
          method: "GET",
          url: `/api/interviews/${interviewId}?depth=2`,
          withCredentials: true,
        });

        const interview: Interview = result.data;

        const questionOptions = interview.questions.map((question) => {
          return {
            label: `${question.question.seo.slug} - ${question.question.shortQuestion}`,
            value: question.question.seo.slug,
          };
        });

        setOptions(questionOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOptions();
  }, [interviewId]);

  return (
    <div>
      <label className="field-label">Question Slug</label>
      <SelectInput
        path={path}
        name={path}
        options={options}
        value={value}
        onChange={(e) => setValue(e.value)}
      />
    </div>
  );
};
