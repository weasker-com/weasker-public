import type { User } from "../../payload/payload-types";

export type ErrorResponse = {
  response: {
    data: {
      errors: {
        name: string;
        data: { message: string; field: string }[];
        message: string;
      }[];
    };
  };
};

export type UserResponse = {
  response: {
    data: {
      errors: {
        name: string;
        data: { message: string; field: string }[];
        message: string;
      }[];
    };
  };
};

export type UserData = {
  data: { loginUser: { user: User } };
};

export type ForgotPassword = (args: { email: string }) => Promise<User>;
export type UpdatePassword = (user: User, password: string) => Promise<any>;

export type Create = (args: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => Promise<User>;

export type Login = (email: string, password: string) => Promise<User | []>;

export type Register = (
  email: string,
  password: string,
  userName: string
) => Promise<User | ErrorResponse>;

export type Logout = () => Promise<void>;
export type RefreshAuthentication = () => Promise<void>;

export interface AuthContext {
  user?: User | null;
  setUser: (user: User | null) => void;
  login: Login;
  logout: Logout;
  register: Register;
  updatePassword: UpdatePassword;
  refreshAuthentication: RefreshAuthentication;
}
