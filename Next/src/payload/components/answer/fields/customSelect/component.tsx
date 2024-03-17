import * as React from "react";
import { SelectInput, useField } from "payload/components/forms";
// import { getPayloadClient } from "@/payload/payload-client";

export const CustomSelectComponent: React.FC<{ path: string; data }> = ({
  path,
}) => {
  const { value, setValue } = useField<string>({ path });
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        // const payload = await getPayloadClient();

        setOptions([{ label: `test`, value: "test" }]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      <label className="field-label">Custom Select</label>
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
