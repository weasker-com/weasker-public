import type { BeforeChangeHook } from "payload/dist/collections/config/types";

export const populateUpdatedAt: BeforeChangeHook = ({
  data,
  req,
  operation,
}) => {
  if (operation === "create" || operation === "update") {
    if (req.body && !req.body.updatedAt) {
      const now = new Date();
      return {
        ...data,
        updatedAt: now,
      };
    }
  }

  return data;
};
