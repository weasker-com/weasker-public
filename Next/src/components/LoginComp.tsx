"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { InternalLink } from "./links/InternalLink";

interface LoginCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setForgotPasswordModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  goToPath?: string;
  goBack?: boolean;
  location: "modal" | "page";
}

const LoginComp: React.FC<LoginCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  setForgotPasswordModalIsOpen,
  goToPath,
  goBack,
  location,
}) => {
  const router = useRouter();
  const [password, setPassword] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  useEffect(() => {
    setErrorMessage(null);
  }, [password, email]);

  async function handleSubmit(e) {
    e.preventDefault();
    const loginUser = await login(email, password);
    if (loginUser) {
      setLogInModalIsOpen && setLogInModalIsOpen(false);
      goToPath && router.push(goToPath);
      goBack && router.back();
    } else
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
  }

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
          <input
            type="password"
            id="password"
            name="password"
            placeholder="PASSWORD"
            className="p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
          />
        </div>
        <button
          disabled={email === "" || password === ""}
          className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
        >
          LOG IN
        </button>
        {errorMessage && <div className="text-sm">{errorMessage}</div>}
        <span className="text-sm font-light text-weasker-grey">
          Forgot your&nbsp;
          {location == "page" && (
            <InternalLink href="/password" element="password?" style="blue" />
          )}
          {location == "modal" && (
            <span
              onClick={(e) => {
                handleForgotPasswordClick(e);
              }}
              className="hover:cursor-pointer text-tl-light-blue"
            >
              password?
            </span>
          )}
        </span>
        <span className="text-sm font-light text-weasker-grey">
          New to Weasker?&nbsp;
          {location == "page" && (
            <InternalLink href="/register" element="SIGN UP" style="blue" />
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
