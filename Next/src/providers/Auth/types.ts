import type { User } from "../../payload/payload-types";

// eslint-disable-next-line no-unused-vars
export type ResetPassword = (args: {
  password: string;
  passwordConfirm: string;
  token: string;
}) => Promise<User>;

export type UserData = {
  data: { loginUser: { user: User } };
};

export type ForgotPassword = (args: { email: string }) => Promise<User>; // eslint-disable-line no-unused-vars

export type Create = (args: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => Promise<User>; // eslint-disable-line no-unused-vars

export type Login = (email: string, password: string) => Promise<User>;

export type Logout = () => Promise<void>;

export interface AuthContext {
  user?: User | null;
  setUser: (user: User | null) => void; // eslint-disable-line no-unused-vars
  login: Login;
  logout: Logout;
  loginNEW: Login;
}
