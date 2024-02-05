"use client";

import { forgotPassword } from "@/utils/profileCRUD";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Loading from "@/app/(site)/loading";
import { HiOutlineMail } from "react-icons/hi";

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
  const [email, setEmail] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    setEmail(emailRef.current.value);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const resetPassword = await forgotPassword(email);
    if (resetPassword) {
      setSuccess(true);
    } else setIsLoading(false);
    setErrorMessage(
      "There was an error with the email provided. Please try again."
    );
  }

  async function handleLogInClick(e) {
    e.preventDefault();
    setLogInModalIsOpen && setLogInModalIsOpen(true);
    setForgotPasswordModalIsOpen && setForgotPasswordModalIsOpen(false);
  }

  async function handleSignUpClick(e) {
    e.preventDefault();
    setSignUpModalIsOpen && setSignUpModalIsOpen(true);
    setForgotPasswordModalIsOpen && setForgotPasswordModalIsOpen(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <HiOutlineMail className="text-emerald-500" size={50} />
        <span className="text-lg">Check your inbox</span>
        <span className="text-center">
          You'll get a password recovery email if the address you provided has
          been verified.
        </span>
        <span className="text-center text-xs">
          Didn't get an email? Make sure to check your spam or{" "}
          <span
            className="text-tl-light-blue hover:cursor-pointer"
            onClick={() => {
              setSuccess(false), setIsLoading(false), setErrorMessage(null);
            }}
          >
            try a different email address
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
            disabled={email == ""}
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {isLoading ? <Loading /> : "RESET PASSWORD"}
          </button>
          {errorMessage && <div className="text-sm">{errorMessage}</div>}
        </form>
      </div>
    );
  }
};

export default ForgotPasswordComp;
