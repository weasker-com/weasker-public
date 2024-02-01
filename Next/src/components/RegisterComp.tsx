"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { InternalLink } from "./links/InternalLink";
import Loading from "../app/(site)/loading";

interface RegisterCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  goToPath?: string;
  goBack?: boolean;
  location: "modal" | "page";
}

const RegisterComp: React.FC<RegisterCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  goToPath,
  goBack,
  location,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [password, setPassword] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [userName, setUserName] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<
    string | null | ReactNode
  >(null);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState<
    string | null
  >(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);
  const { register, login, user } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
    setUserName(usernameRef.current.value);
  }, []);

  useEffect(() => {
    setEmailErrorMessage(null);
  }, [email]);

  useEffect(() => {
    setUserNameErrorMessage(null);
  }, [userName]);

  useEffect(() => {
    setPasswordErrorMessage(null);
  }, [password]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user && isLoggingIn) {
      setTimeout(() => {
        router.push("/account");
        setSignUpModalIsOpen && setSignUpModalIsOpen(false);
        setIsLoggingIn(false);
        setIsLoading(false);
      }, 500);
    }
  }, [user, isLoggingIn]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {}, 10000);
    try {
      const res = await register(email, password, userName);
      if ("email" in res) {
        setIsLoggingIn(true);
      } else if (
        res.response.data.errors[0].name &&
        res.response.data.errors[0].name == "ValidationError"
      ) {
        res.response.data.errors[0].data[0].field == "email" &&
          setEmailErrorMessage(
            <>
              Email already registered. &nbsp;
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
                    handleLogInClick(e);
                  }}
                  className="font-bold text-tl-light-blue hover:cursor-pointer"
                >
                  LOG IN
                </span>
              )}
            </>
          );
        if (res.response.data.errors[0].data[0].field == "userName") {
          res.response.data.errors[0].data[0].message == "Value must be unique"
            ? setUserNameErrorMessage("This username is taken, try another")
            : setUserNameErrorMessage(
                res.response.data.errors[0].data[0].message
              );
        }
        res.response.data.errors[0].data[0].field == "password" &&
          setPasswordErrorMessage(res.response.data.errors[0].data[0].message);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.response.data.errors[0].data[0].message);
      setIsLoggingIn(false);
      setIsLoading(false);
    }
  }
  async function handleLogInClick(e) {
    e.preventDefault();
    setLogInModalIsOpen && setLogInModalIsOpen(true);
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
          <span className="text-red-600 text-sm">{userNameErrorMessage}</span>
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
          <span className="text-red-600 text-sm">{emailErrorMessage}</span>
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
          <span className="text-red-600 text-sm">{passwordErrorMessage}</span>
        </div>
        <button
          disabled={
            isLoading || email === "" || password === "" || userName === ""
          }
          className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
        >
          {isLoading ? <Loading /> : "CONTINUE"}
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
                handleLogInClick(e);
              }}
              className="font-bold text-tl-light-blue hover:cursor-pointer"
            >
              LOG IN
            </span>
          )}
        </span>
      </form>
    </div>
  );
};

export default RegisterComp;
