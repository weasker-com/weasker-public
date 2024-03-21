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
/* eslint-disable no-unused-vars */
export interface AuthContext {
  user?: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User | []>;
  logout: () => Promise<void>;
  refreshAuthentication: () => Promise<void>;
  register: (
    email: string,
    password: string,
    userName: string
  ) => Promise<User | ErrorResponse>;
  updateUser: (user: User, data: any) => Promise<any>;
  uploadImage: (body: any) => Promise<any>;
  deleteUser: (user: User) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<User>;
  loginLoading: boolean;
  loginError: any;
  registerLoading: boolean;
  registerError: any;
  logoutError: any;
  logOutLoading: boolean;
  updateUserLoading: boolean;
  updateUserError: any;
  uploadImageLoading: boolean;
  uploadImageError: any;
  deleteUserLoading: boolean;
  deleteUserError: any;
  resetPasswordLoading: boolean;
  resetPasswordError: any;
  forgotPasswordLoading: boolean;
  forgotPasswordError: any;
}
