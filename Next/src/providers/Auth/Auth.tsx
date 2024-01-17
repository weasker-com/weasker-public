//CONTINUE HERE

"use client";
import type { User } from "../../payload/payload-types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { USER, gql } from "./gql";
import {
  AuthContext,
  Create,
  ForgotPassword,
  Login,
  Logout,
  ResetPassword,
} from "./types";

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>();

  const login = async (email: string, password: string) => {
    const query = `
      mutation {
        loginUser(email: "${email}", password: "${password}") {
          user {
            ${USER}
          }
          exp
        }
      }
    `;

    const response = await gql(query);
    const loginUser = response?.loginUser;
    setUser(loginUser?.user);
    return loginUser?.user;
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
