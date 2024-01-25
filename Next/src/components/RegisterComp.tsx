"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { InternalLink } from "./links/InternalLink";

interface RegisterCompProps {
  setSignInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  goToPath?: string;
  goBack?: boolean;
  location: "modal" | "page";
}

const RegisterComp: React.FC<RegisterCompProps> = ({
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
  const [userName, setUserName] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, login } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
    setUserName(usernameRef.current.value);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const registeredUser = await register(email, password, userName);
    if (registeredUser) {
      try {
        await login(email, password);
        router.push("/account");
        setSignUpModalIsOpen && setSignUpModalIsOpen(false);
      } catch (_) {
        setErrorMessage(
          "There was an error with the credentials provided. Please try again."
        );
      }
    } else
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
  }
  async function handleSignInClick(e) {
    e.preventDefault();
    setSignInModalIsOpen && setSignInModalIsOpen(true);
    setSignUpModalIsOpen && setSignUpModalIsOpen(false);
  }
  return (
    <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
      <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        Sign up
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
            type="text"
            id="username"
            name="username"
            placeholder="USERNAME"
            className="w-full p-2 border rounded"
            onChange={(e) => setUserName(e.target.value)}
            ref={usernameRef}
          />
        </div>
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
            type="text"
            id="password"
            name="password"
            placeholder="PASSWORD"
            className="p-2 border rounded"
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="rounded px-5 py-1 mt-3 bg-tl-light-blue text-white">
          CONTINUE
        </button>
        {errorMessage && <div className="text-sm">{errorMessage}</div>}
        <span className="text-sm font-light text-weasker-grey">
          Already have an account? &nbsp;
          {location == "page" && (
            <InternalLink
              href="/login"
              element="LOG IN"
              className="font-bold"
              style="blue"
            />
          )}
          {location == "modal" && (
            <span
              onClick={(e) => {
                handleSignInClick(e);
              }}
              className="font-bold text-tl-light-blue hover:cursor-pointer"
            >
              SIGN IN
            </span>
          )}
        </span>
      </form>
    </div>
  );
};

export default RegisterComp;
