"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/Auth/Auth";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface UpdatePasswordCompProps {}

const UpdatePasswordComp: React.FC<UpdatePasswordCompProps> = () => {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [newPassword, setNewPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [newPasswordIsVisible, setNewPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const {
    user,
    login,
    updateUser,
    loginLoading,
    loginError,
    updateUserLoading,
    updateUserError,
  } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password doesn't match");
    } else setErrorMessage(null);
  }, [newPassword, confirmPassword]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);
    const loginUser = await login(email, password);
    if (loginUser) {
      const updatedPassword = await updateUser(user, { password: newPassword });
      if (updatedPassword) {
        setSuccess(true);
      }
    }
  }

  useEffect(() => {
    if (updateUserError) {
      if (updateUserError.response.status === 400) {
        const errors = updateUserError.response.data.errors;
        for (let error of errors) {
          if (error.name === "ValidationError") {
            const field = error.data[0].field;
            const message = error.data[0].message;
            if (field === "password") {
              setErrorMessage(message);
            }
          }
        }
      }
      if (updateUserError.response.status === 500) {
        setErrorMessage("An error occurred. Please try again");
      }
    }
  }, [updateUserError]);

  useEffect(() => {
    if (loginError) {
      if (loginError.response.status == 401) {
        setErrorMessage(
          "There was an error with the login credentials provided. Please try again."
        );
      } else {
        setErrorMessage("An error ocurred. Please try again.");
      }
    }
  }, [loginError]);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-emerald-500" size={50} />
        <span>Password changed successfully</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Update your password
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Password needs a minimum of 8 characters with upper and lower case
          letters and at least one symbol.
        </span>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex flex-col gap-3 w-full"
        >
          <span className="text-sm font-extrabold smallCaps text-tl-dark-blue">
            Verify your identity
          </span>
          <div className="flex flex-col gap-1">
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded"
              placeholder="EMAIL"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative w-full">
              <input
                type={passwordIsVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="OLD PASSWORD"
                className="pl-3 pr-10 py-2 border rounded w-full"
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {passwordIsVisible ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>
          <span className="text-sm font-extrabold smallCaps text-tl-dark-blue">
            Set new password
          </span>
          <div className="flex flex-col gap-1">
            <div className="relative w-full">
              <input
                type={newPasswordIsVisible ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="NEW PASSWORD"
                className="pl-3 pr-10 py-2 border rounded w-full"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword.length > 0 && (
                <button
                  type="button"
                  onClick={() => setNewPasswordIsVisible(!newPasswordIsVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {newPasswordIsVisible ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative w-full">
              <input
                type={confirmPasswordIsVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="CONFIRM NEW PASSWORD"
                className="pl-3 pr-10 py-2 border rounded w-full"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setConfirmPasswordIsVisible(!confirmPasswordIsVisible)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {confirmPasswordIsVisible ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>

          <button
            disabled={
              email == "" ||
              password == "" ||
              newPassword === "" ||
              confirmPassword == "" ||
              newPassword !== confirmPassword
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {updateUserLoading || loginLoading ? <Loading /> : "SAVE PASSWORD"}
          </button>
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
        </form>
      </div>
    );
  }
};

export default UpdatePasswordComp;
