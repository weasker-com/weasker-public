"use client";
import { useRouter } from "next/navigation";
import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "../providers/Auth/Auth";
import { Dispatch, SetStateAction } from "react";
import { InternalLink } from "./links/InternalLink";
import Loading from "../app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface RegisterCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setAuthCompOpen?: Dispatch<SetStateAction<boolean>>;
  location: "modal" | "page";
}

const RegisterComp: React.FC<RegisterCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  setAuthCompOpen,
  location,
}) => {
  const router = useRouter();
  const [password, setPassword] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [userName, setUserName] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<
    string | null | ReactNode
  >(null);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState<
    string | null
  >(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);
  const { register, registerError, registerLoading } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);
    setEmailErrorMessage(null);
    setUserNameErrorMessage(null);
    setPasswordErrorMessage(null);
    const res = await register(email, password, userName);
    if (res && "email" in res) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSignUpModalIsOpen && setSignUpModalIsOpen(false);
        setLogInModalIsOpen(false);
        setAuthCompOpen && setAuthCompOpen(false);
      }, 3000);
      if (location == "modal") {
        router.push("/account");
      }
    }
  }

  const handleLogInClick = useCallback(
    (e) => {
      e.preventDefault();
      if (setLogInModalIsOpen) setLogInModalIsOpen(true);
      if (setSignUpModalIsOpen) setSignUpModalIsOpen(false);
    },
    [setLogInModalIsOpen, setSignUpModalIsOpen]
  );

  useEffect(() => {
    if (registerError) {
      if (registerError.response.status === 400) {
        const errors = registerError.response.data.errors;
        for (let error of errors) {
          if (error.name === "ValidationError") {
            const field = error.data[0].field;
            const message = error.data[0].message;
            if (field === "email") {
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
            } else if (field === "userName") {
              if (message == "Value must be unique") {
                setUserNameErrorMessage("This username is taken, try another");
              } else {
                setUserNameErrorMessage(message);
              }
            } else if (field === "password") {
              setPasswordErrorMessage(message);
            }
          }
        }
      }
      if (registerError.response.status === 500) {
        setErrorMessage("An error occurred. Please try again");
      }
    }
  }, [registerError, handleLogInClick, location]);

  if (success)
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-emerald-500" size={50} />
        <span>Success! You are being redirected to your new account</span>
      </div>
    );
  else
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
              href="/user-agreement"
              element="User Agreement"
              className="underline"
            />
          }
          &nbsp;and&nbsp;
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
            <span className="text-red-600 text-sm">{passwordErrorMessage}</span>
          </div>
          <button
            disabled={
              registerLoading === true ||
              email === "" ||
              password === "" ||
              userName === ""
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {registerLoading ? <Loading /> : "CONTINUE"}
          </button>
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
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
