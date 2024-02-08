import type { Access } from "payload/config";

export const anyone: Access = () => {
  return true;
};
