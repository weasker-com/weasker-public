import type { Field } from "payload/types";

export const updatedAt: Field = {
  name: "updatedAt",
  label: "Last updated",
  type: "date",
  admin: {
    date: {
      pickerAppearance: "dayAndTime",
    },
  },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData._status === "published" && !value) {
          return new Date();
        }
        return value;
      },
    ],
  },
};
