import { isValidUrl } from "../../../../helpers/validateUrl";
import { ValidationError } from "payload/errors";
import { FieldHook } from "payload/types";

export const validateUrl: FieldHook = ({ value, field }) => {
  if (value && !isValidUrl(value)) {
    throw new ValidationError([
      {
        message: "This URL isn't valid.",
        field: field.name,
      },
    ]);
  }
};
