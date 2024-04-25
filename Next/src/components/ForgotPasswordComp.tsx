"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "@/app/(site)/loading";
import { HiOutlineMail } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/Auth/Auth";
import { find } from "@/utils/payloadClientReq";

interface ForgotPasswordCompProps {
  setLogInModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setSignUpModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  setForgotPasswordModalIsOpen?: Dispatch<SetStateAction<boolean>>;
  location: "modal" | "page";
}

const ForgotPasswordComp: React.FC<ForgotPasswordCompProps> = ({
  setLogInModalIsOpen,
  setSignUpModalIsOpen,
  setForgotPasswordModalIsOpen,
  location,
}) => {
  const router = useRouter();
  const { forgotPassword, forgotPasswordError, forgotPasswordLoading } =
    useAuth();
  const [email, setEmail] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [findEmailLoading, setFindEmailLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    setEmail(emailRef.current.value);
  }, []);

  useEffect(() => {
    setErrorMessage(null);
  }, [email]);

  async function handleSubmit(e) {
    setErrorMessage(null);
    setFindEmailLoading(true);
    e.preventDefault();
    const isEmailRegistered = await find("users", { email: { equals: email } });
    if (isEmailRegistered.docs.length > 0) {
      setFindEmailLoading(false);
      const res = await forgotPassword(email);
      if (res) {
        setSuccess(true);
      }
    } else {
      setFindEmailLoading(false);
      setErrorMessage(
        "The email address you provided isn't registered with us"
      );
    }
  }

  useEffect(() => {
    if (forgotPasswordError) {
      setErrorMessage(
        "There was an error with the email provided. Please try again."
      );
    }
  }, [forgotPasswordError]);

  async function handleLogInClick(e) {
    e.preventDefault(),
      location == "modal" &&
        (setLogInModalIsOpen && setLogInModalIsOpen(true),
        setForgotPasswordModalIsOpen && setForgotPasswordModalIsOpen(false));

    location == "page" && router.push("/login");
  }

  async function handleSignUpClick(e) {
    e.preventDefault();
    location == "modal" &&
      (setSignUpModalIsOpen && setSignUpModalIsOpen(true),
      setForgotPasswordModalIsOpen && setForgotPasswordModalIsOpen(false));

    location == "page" && router.push("/register");
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <HiOutlineMail className="text-emerald-500" size={50} />
        <span className="text-lg">Check your inbox</span>
        <span className="text-center">
          You&apos;ll get a password recovery email from us
        </span>
        <span className="text-center text-xs">
          Didn&apos;t get an email? <br />
          Make sure to check your spam
          <br />
          or try a{" "}
          <span
            className="text-tl-light-blue hover:cursor-pointer"
            onClick={() => {
              setSuccess(false), setErrorMessage(null);
            }}
          >
            different email address
          </span>
        </span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Reset your password
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Tell us the email address associated with your account, and we’ll send
          you an email with a link to reset your password.
        </span>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex flex-col gap-3 w-full"
        >
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
          <div className="flex flex-row justify-start gap-1 text-tl-light-blue text-sm">
            <button onClick={handleSignUpClick}>Sign up</button>
            <>&#xb7;</>
            <button onClick={handleLogInClick}>Log in</button>
          </div>
          <button
            disabled={
              email == "" || errorMessage !== null || findEmailLoading == true
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {forgotPasswordLoading || findEmailLoading ? (
              <Loading />
            ) : (
              "RESET PASSWORD"
            )}
          </button>
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
        </form>
      </div>
    );
  }
};

export default ForgotPasswordComp;
