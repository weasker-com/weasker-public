import { ValidationError } from "payload/errors";
import { FieldHook } from "payload/types";

export const validateFileSize: FieldHook = ({ value, field, siblingData }) => {
  const maxImageSize = 2 * 1024 * 1024;
  const maxVideoSize = 500 * 1024 * 1024;

  let maximumSize;
  if (siblingData.mimeType.includes("image")) {
    maximumSize = maxImageSize;
  } else if (siblingData.mimeType.includes("video")) {
    maximumSize = maxVideoSize;
  }

  if (value && maximumSize && value > maximumSize) {
    const sizeInMb = value / (1024 * 1024);
    throw new ValidationError([
      {
        message: `File is bigger than allowed. File size: ${sizeInMb.toFixed(
          2
        )}MB`,
        field: field.name,
      },
    ]);
  }
};
