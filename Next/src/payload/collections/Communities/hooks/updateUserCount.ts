import { CollectionBeforeChangeHook } from "payload/types";

export const updateUserCount: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  if (data.users && originalDoc?.users) {
    const originalUsersLength = originalDoc.users.length;
    const newUsersLength = data.users.length;

    if (originalUsersLength !== newUsersLength) {
      data.userCount = newUsersLength;
    }
  } else if (data.users) {
    data.userCount = data.users.length;
  }
  return data;
};
