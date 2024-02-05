"use client";
import type { User } from "../../payload/payload-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, ErrorResponse } from "./types";
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
  ): Promise<User | ErrorResponse> {
    try {
      const res = await axios({
        method: "POST",
        url: `${EXTERNAL_SERVER_URL}/api/users/`,
        withCredentials: true,
        data: {
          email,
          password,
          userName,
          seo: { slug: userName },
          validate: true,
        },
      });

      if (res.data.doc) {
        const registeredUser: User = res.data.doc;
        setUser(res.data.doc);
        return registeredUser;
      } else {
        throw new Error("Registration did not return a user object.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      return error;
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

  async function updatePassword(user: User, password: string): Promise<any> {
    try {
      const res = await axios({
        method: "UPDATE",
        url: `${EXTERNAL_SERVER_URL}/api/users/`,
        withCredentials: true,
        data: {
          user,
          password,
        },
      });

      if (res.data.doc) {
        const updatedPassword = res.data.doc;
        return updatedPassword;
      } else {
        throw new Error("Password update failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      return error;
    }
  }

  interface ResetPasswordInterface {
    password: string;
  }

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
        login,
        register,
        updatePassword,
        refreshAuthentication,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
