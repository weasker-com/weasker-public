import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isUser: Access<any, User> = ({ req: { user } }) => {
  return Boolean(user);
};

export const isUserFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  return Boolean(user);
};
