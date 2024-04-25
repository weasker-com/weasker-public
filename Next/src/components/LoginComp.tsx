"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { InternalLink } from "./links/InternalLink";
import { useSearchParams } from "next/navigation";
import { WhiteBox } from "./ui/boxes";
import { BigButton } from "./ui/buttons";

interface LoginCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setForgotPasswordModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setAuthCompOpen?: Dispatch<SetStateAction<boolean>>;
  pageOrModal: "modal" | "page";
  title?: string;
}

const LoginComp: React.FC<LoginCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  setForgotPasswordModalIsOpen,
  setAuthCompOpen,
  pageOrModal,
  title,
}) => {
  const searchParams = useSearchParams();

  const destAfterLogin: string | null = searchParams.get("dest");
  const [password, setPassword] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const { login, loginError, loginLoading } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  useEffect(() => {
    setErrorMessage(null);
  }, [password, email]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);
    const res = await login(email, password);
    if (res) {
      setLogInModalIsOpen && setLogInModalIsOpen(false);
      setAuthCompOpen && setAuthCompOpen(false);
      if (pageOrModal == "page") {
        destAfterLogin
          ? location.replace(destAfterLogin)
          : location.replace("/");
      }
    }
  }

  useEffect(() => {
    if (loginError) {
      if (loginError.response.status == 401) {
        setErrorMessage(
          "There was an error with the credentials provided. Please try again."
        );
      }
      if (loginError.response.status == 500) {
        setErrorMessage("An error ocurred. Please try again.");
      }
    }
  }, [loginError]);

  async function handleSignUpClick(e) {
    e.preventDefault();
    setLogInModalIsOpen && setLogInModalIsOpen(false);
    setSignUpModalIsOpen && setSignUpModalIsOpen(true);
  }

  async function handleForgotPasswordClick(e) {
    e.preventDefault();
    setLogInModalIsOpen && setLogInModalIsOpen(false);
    setForgotPasswordModalIsOpen && setForgotPasswordModalIsOpen(true);
  }
  return (
    <WhiteBox>
      <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        {title ? title : "Log in"}
      </h1>
      <span className="text-sm font-light text-weasker-grey">
        By logging in, you agree to our&nbsp;
        {
          <InternalLink
            href="/user-agreement"
            element="User Agreement"
            className="underline"
          />
        }
        &nbsp;and acknowledge that you understand the&nbsp;
        {
          <InternalLink
            href="/privacy-policy"
            element="Privacy Policy"
            className="underline"
          />
        }
        .
      </span>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="flex flex-col gap-3 w-full"
      >
        <div className="flex flex-col gap-1">
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border rounded"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <div className="relative w-full">
            <input
              type={passwordIsVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="PASSWORD"
              className="pl-3 pr-10 py-2 border rounded w-full"
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password !== "" && (
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
        <BigButton
          text="LOG IN"
          loading={loginLoading}
          disabled={email === "" || password === ""}
          className="mt-3 bg-tl-dark-blue"
        />
        {errorMessage && (
          <div className="text-sm text-red-600">{errorMessage}</div>
        )}
        <span className="text-sm font-light text-weasker-grey">
          {pageOrModal == "page" && (
            <InternalLink
              href="/forgot-password"
              element="Forgot your password?"
            />
          )}
          {pageOrModal == "modal" && (
            <span
              onClick={(e) => {
                handleForgotPasswordClick(e);
              }}
              className="hover:cursor-pointer"
            >
              Forgot your password?
            </span>
          )}
        </span>
        <span className="text-sm font-light text-weasker-grey">
          New to Weasker?&nbsp;
          {pageOrModal == "page" && (
            <InternalLink
              href="/register"
              element="SIGN UP"
              style="blue"
              className="font-bold"
            />
          )}
          {pageOrModal == "modal" && (
            <span
              onClick={(e) => {
                handleSignUpClick(e);
              }}
              className="hover:cursor-pointer text-tl-light-blue"
            >
              SIGN UP
            </span>
          )}
        </span>
      </form>
    </WhiteBox>
  );
};

export default LoginComp;
