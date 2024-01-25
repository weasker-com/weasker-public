"use client";
import type { User } from "../../payload/payload-types";
import kebabCase from "lodash/kebabCase";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./types";
import axios from "axios";
const EXTERNAL_SERVER_URL =
  process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL ||
  process.env.NEXT_PUBLIC_SITE_URL;
const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>();

  async function login(email: string, password: string): Promise<any> {
    try {
      const res = await axios({
        method: "POST",
        url: `${EXTERNAL_SERVER_URL}/api/users/login?depth=2`,
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

  async function register(
    email: string,
    password: string,
    userName: string
  ): Promise<any> {
    try {
      console.log(email, password, userName);
      const res = await axios({
        method: "POST",
        url: `${EXTERNAL_SERVER_URL}/api/users/`,
        withCredentials: true,
        data: {
          email,
          password,
          userName,
          seo: { slug: userName },
        },
      });

      if (res.data.user) {
        const registeredUser = res.data.user;
        setUser(registeredUser);
        return registeredUser;
      } else {
        return res;
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response.data.errors[0].data[0].message
      );
    }
  }

  async function refreshAuthentication() {
    try {
      const res = await axios({
        method: "GET",
        url: `${EXTERNAL_SERVER_URL}/api/users/me`,
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
        url: `${EXTERNAL_SERVER_URL}/api/users/logout`,
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
        logout,
        login,
        register,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
