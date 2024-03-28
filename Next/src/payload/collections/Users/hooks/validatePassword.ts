import { ValidationError } from "payload/errors";
import { CollectionBeforeValidateHook } from "payload/types";

export const validatePassword: CollectionBeforeValidateHook = ({
  data: { password },
}) => {
  if (typeof password !== "string") {
    return;
  }

  let errorMessages = [];

  if (password.length < 8) {
    errorMessages.push("Password must be at least 8 characters long. ");
  }

  if (password.length > 50) {
    errorMessages.push("Password must be less than 50 characters long. ");
  }

  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    errorMessages.push("Password must have lowercase letters. ");
  }

  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    errorMessages.push("Password must have uppercase letters. ");
  }

  const hasSymbols = /[$-/:-?{-~!"^_`[\]#@%&*()+=.;,<>']/.test(password);
  if (!hasSymbols) {
    errorMessages.push("Password must include at least one symbol. ");
  }

  if (errorMessages.length > 0) {
    const message = errorMessages.join(" ");
    throw new ValidationError([{ message, field: "password" }]);
  }
};
