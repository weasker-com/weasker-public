"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/Auth/Auth";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface UpdateEmailCompProps {}

const UpdateEmailComp: React.FC<UpdateEmailCompProps> = () => {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [newEmail, setNewEmail] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const {
    user,
    login,
    loginError,
    updateUser,
    updateUserError,
    updateUserLoading,
  } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const loginUser = await login(email, password);
    if (loginUser) {
      const updatedEmail = await updateUser(user, { email: newEmail });
      if (updatedEmail) {
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
            if (field === "email" && message === "Value must be unique") {
              setErrorMessage("This Email address is already registered");
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
      }
      if (loginError.response.status == 500) {
        setErrorMessage("An error ocurred. Please try again.");
      }
    }
  }, [loginError]);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-emerald-500" size={50} />
        <span>Email address changed successfully</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Update your email
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Update your email below. A verification email will be sent to the new
          address
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
              onChange={(e) => {
                setEmail(e.target.value), setErrorMessage(null);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              id="password"
              name="password"
              className="w-full p-2 border rounded"
              placeholder="PASSWORD"
              onChange={(e) => {
                setPassword(e.target.value), setErrorMessage(null);
              }}
              ref={passwordRef}
            />
          </div>
          <span className="text-sm font-extrabold smallCaps text-tl-dark-blue">
            Set new email
          </span>
          <div className="flex flex-col gap-1">
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              className="w-full p-2 border rounded"
              placeholder="NEW EMAIL"
              onChange={(e) => {
                setNewEmail(e.target.value), setErrorMessage(null);
              }}
            />
          </div>

          <button
            disabled={
              errorMessage !== null ||
              newEmail === "" ||
              email == "" ||
              password == ""
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {updateUserLoading ? <Loading /> : "SAVE EMAIL"}
          </button>
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
        </form>
      </div>
    );
  }
};

export default UpdateEmailComp;
