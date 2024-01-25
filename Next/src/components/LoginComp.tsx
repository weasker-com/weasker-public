"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { InternalLink } from "./links/InternalLink";

interface LoginCompProps {
  setSignInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  goToPath?: string;
  goBack?: boolean;
  location: "modal" | "page";
}

const LoginComp: React.FC<LoginCompProps> = ({
  setSignInModalIsOpen,
  setSignUpModalIsOpen,
  goToPath,
  goBack,
  location,
}) => {
  const router = useRouter();
  const pathname = usePathname();
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

  async function handleSubmit(e) {
    e.preventDefault();
    const loginUser = await login(email, password);
    if (loginUser) {
      setSignInModalIsOpen && setSignInModalIsOpen(false);
      goToPath && router.push(goToPath);
      goBack && router.back();
    } else
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
  }

  async function handleSignUpClick(e) {
    e.preventDefault();
    setSignInModalIsOpen && setSignInModalIsOpen(false);
    setSignUpModalIsOpen && setSignUpModalIsOpen(true);
  }

  return (
    <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
      <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        Log in
      </h1>
      <span className="text-sm font-light text-weasker-grey">
        By continuing, you are setting up a Weasker account and agree to
        our&nbsp;
        {
          <InternalLink
            href="/"
            element="User Agreement"
            className="underline"
          />
        }
        &nbsp;and&nbsp;
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
        <button className="rounded px-5 py-1 mt-3 bg-tl-light-blue text-white">
          LOG IN
        </button>
        {errorMessage && <div className="text-sm">{errorMessage}</div>}
        <span className="text-sm font-light text-weasker-grey">
          New to Weasker? &nbsp;
          {location == "page" && (
            <InternalLink
              href="/register"
              element="SIGN UP"
              className="font-bold"
              style="blue"
            />
          )}
          {location == "modal" && (
            <span
              onClick={(e) => {
                handleSignUpClick(e);
              }}
              className="font-bold hover:cursor-pointer text-tl-light-blue"
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
