"use client";
import type { User } from "../../payload/payload-types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<any>(undefined);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<any>(undefined);
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<any>(undefined);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState<any>(undefined);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadImageError, setUploadImageError] = useState<any>(undefined);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState<any>(undefined);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<any>(undefined);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] =
    useState<any>(undefined);

  const login = useCallback(
    async (email: string, password: string): Promise<any> => {
      try {
        setLoginLoading(true);
        const res = await axios({
          method: "POST",
          url: `${EXTERNAL_SERVER_URL}/api/users/login`,
          withCredentials: true,
          data: {
            email,
            password,
          },
        });

        if (res.data.user) {
          setLoginLoading(false);
          const loginUser = res.data.user;
          setUser(loginUser);
          return loginUser;
        }
      } catch (error) {
        setLoginLoading(false);
        setLoginError(error);
      }
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      userName: string
    ): Promise<User | ErrorResponse> => {
      try {
        setRegisterLoading(true);
        setRegisterError(undefined);
        const res = await axios({
          method: "POST",
          url: `${EXTERNAL_SERVER_URL}/api/users/`,
          withCredentials: true,
          data: {
            email,
            password,
            userName,
            seo: { slug: userName.toLowerCase() },
          },
        });

        if (res.data.doc) {
          setRegisterLoading(false);
          const registeredUser: User = res.data.doc;
          setUser(registeredUser);
          return registeredUser;
        }
      } catch (error) {
        setRegisterLoading(false);
        setRegisterError(error);
      }
    },
    []
  );

  const refreshAuthentication = useCallback(async () => {
    try {
      setLoginLoading(true);
      const res = await axios({
        method: "GET",
        url: `${EXTERNAL_SERVER_URL}/api/users/me`,
        withCredentials: true,
      });

      if (res.data?.user) {
        setLoginLoading(false);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        setLoginLoading(false);
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      setLoginLoading(false);
      console.error("Failed to refresh authentication:", error);
    }
  }, []);

  useEffect(() => {
    refreshAuthentication();
  }, [refreshAuthentication]);

  const logout = useCallback(async () => {
    try {
      setLogOutLoading(true);
      await axios({
        method: "POST",
        url: `${EXTERNAL_SERVER_URL}/api/users/logout`,
        withCredentials: true,
        data: user.id,
      });
      setUser(null);
      setLogOutLoading(false);
      refreshAuthentication();
      location.reload();
    } catch (error) {
      setLogoutError(error);
      setLogOutLoading(false);
    }
  }, [refreshAuthentication, user?.id]);

  const updateUser = useCallback(
    async (user: User, data: any): Promise<any> => {
      try {
        setUpdateUserLoading(true);
        const res = await axios({
          method: "PATCH",
          url: `${EXTERNAL_SERVER_URL}/api/users/${user.id}`,
          withCredentials: true,
          data,
        });

        if (res.data.doc) {
          setUpdateUserLoading(false);
          const updatedPassword = res.data.doc;
          return updatedPassword;
        }
      } catch (error) {
        setUpdateUserLoading(false);
        setUpdateUserError(error);
      }
    },
    []
  );

  const uploadImage = useCallback(async (body: any): Promise<any> => {
    try {
      setUploadImageLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/media",
        data: body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res) {
        setUploadImageLoading(false);
        return res;
      }
    } catch (error) {
      setUploadImageLoading(false);
      setUploadImageError(error);
    }
  }, []);

  const deleteUser = useCallback(async (user: User): Promise<any> => {
    try {
      setDeleteUserLoading(true);
      const res = await axios({
        method: "DELETE",
        url: `${EXTERNAL_SERVER_URL}/api/users/${user.id}`,
        withCredentials: true,
      });

      if (res) {
        setDeleteUserLoading(false);
        const deletedUser = res;
        return deletedUser;
      }
    } catch (error) {
      setDeleteUserLoading(false);
      setDeleteUserError(error);
    }
  }, []);

  const resetPassword = useCallback(
    async (token: String, password: String): Promise<any> => {
      try {
        setResetPasswordLoading(true);
        const res = await axios({
          method: "POST",
          url: `${EXTERNAL_SERVER_URL}/api/users/reset-password`,
          withCredentials: true,
          data: {
            token,
            password,
          },
        });

        if (res) {
          setResetPasswordLoading(false);
          return res;
        }
      } catch (error) {
        setResetPasswordLoading(false);
        setResetPasswordError(error);
      }
    },
    []
  );

  const forgotPassword = useCallback(async (email: String): Promise<any> => {
    try {
      setForgotPasswordLoading(true);
      const res = await axios({
        method: "POST",
        url: `${EXTERNAL_SERVER_URL}/api/users/forgot-password`,
        withCredentials: true,
        data: {
          email,
        },
      });

      if (res) {
        setForgotPasswordLoading(false);
        return res;
      }
    } catch (error) {
      setForgotPasswordLoading(false);
      setForgotPasswordError(error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      logout,
      login,
      register,
      refreshAuthentication,
      updateUser,
      uploadImage,
      deleteUser,
      resetPassword,
      forgotPassword,
      loginLoading,
      loginError,
      registerLoading,
      registerError,
      logoutError,
      logOutLoading,
      updateUserLoading,
      updateUserError,
      uploadImageLoading,
      uploadImageError,
      deleteUserLoading,
      deleteUserError,
      resetPasswordLoading,
      resetPasswordError,
      forgotPasswordLoading,
      forgotPasswordError,
    }),
    [
      user,
      loginLoading,
      loginError,
      registerLoading,
      registerError,
      logoutError,
      logOutLoading,
      updateUserLoading,
      updateUserError,
      uploadImageLoading,
      uploadImageError,
      deleteUserLoading,
      deleteUserError,
      resetPasswordLoading,
      resetPasswordError,
      logout,
      forgotPasswordLoading,
      forgotPasswordError,
      deleteUser,
      forgotPassword,
      login,
      refreshAuthentication,
      register,
      resetPassword,
      updateUser,
      uploadImage,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

type UseAuth = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
