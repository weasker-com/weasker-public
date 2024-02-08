"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { InternalLink } from "./links/InternalLink";
import Loading from "@/app/(site)/loading";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface LoginCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setForgotPasswordModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  location: "modal" | "page";
}

const LoginComp: React.FC<LoginCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  setForgotPasswordModalIsOpen,
  location,
}) => {
  const router = useRouter();
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
      console.log("destAfterLogin", destAfterLogin);
      if (location == "page") {
        destAfterLogin ? router.push(destAfterLogin) : router.push("/");
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
    <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
      <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        Log in
      </h1>
      <span className="text-sm font-light text-weasker-grey">
        By logging in, you agree to our&nbsp;
        {
          <InternalLink
            href="/"
            element="User Agreement"
            className="underline"
          />
        }
        &nbsp;and acknowledge that you understand the&nbsp;
        {
          <InternalLink
            href="/"
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
        <button
          disabled={email === "" || password === ""}
          className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
        >
          {loginLoading ? <Loading /> : "LOG IN"}
        </button>
        {errorMessage && (
          <div className="text-sm text-red-600">{errorMessage}</div>
        )}
        <span className="text-sm font-light text-weasker-grey">
          {location == "page" && (
            <InternalLink
              href="/forgot-password"
              element="Forgot your password?"
            />
          )}
          {location == "modal" && (
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
          {location == "page" && (
            <InternalLink
              href="/register"
              element="SIGN UP"
              style="blue"
              className="font-bold"
            />
          )}
          {location == "modal" && (
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
    </div>
  );
};

export default LoginComp;
