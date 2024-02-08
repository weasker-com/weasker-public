import { Access } from "payload/config";

export const isAdminOrSelfPasswordVerified: Access = ({ req: { user } }) => {
  if (user) {
    if (user.roles?.includes("admin")) {
      return true;
    }
    return {
      id: {
        equals: user.id,
      },
      password: {
        equals: user.password,
      },
    };
  }

  return false;
};
