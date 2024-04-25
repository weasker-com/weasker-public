import { ValidationError } from "payload/errors";
import { CollectionBeforeValidateHook } from "payload/types";

export const validateUserName: CollectionBeforeValidateHook = ({
  operation,
  data: { userName },
}) => {
  if (operation !== "create") {
    return;
  }
  let message: string;
  if (userName.length < 3 || userName.length > 20)
    message = "Username must be between 3 and 20 characters";

  const isValidUserName = /^[A-Za-z0-9_-]+$/.test(userName);
  if (!isValidUserName)
    message =
      "Username can only contain English letters, numbers, hyphens ('-'), or underscores ('_')";

  if (message) throw new ValidationError([{ message, field: "userName" }]);
};
