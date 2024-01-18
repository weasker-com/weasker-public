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
import { AuthContext } from "./types";
import axios from "axios";

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

    const method = "POST";
    const response = await gql({ query, method });
    const loginUser = response?.data?.loginUser?.user;
    setUser(loginUser);
    localStorage.setItem("user", loginUser);
    return loginUser;
  };

  async function loginNEW(email: string, password: string): Promise<any> {
    try {
      const res = await axios({
        method: "POST",
        url: `http://localhost:4000/api/users/login?depth=2`,
        withCredentials: true,
        data: {
          email,
          password,
        },
      });

      if (res.data.user) {
        const loginUser = res.data.user;
        setUser(loginUser);
        return loginUser;
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async function refreshAuthentication() {
    try {
      const res = await axios({
        method: "GET",
        url: `http://localhost:4000/api/users/me`,
        withCredentials: true,
      });

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to refresh authentication:", error);
    }
  }

  useEffect(() => {
    refreshAuthentication();
  }, []);

  async function logout() {
    try {
      await axios({
        method: "POST",
        url: `http://localhost:4000/api/users/logout`,
        withCredentials: true,
        data: user,
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loginNEW,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
