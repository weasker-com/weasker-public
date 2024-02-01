"use client";

import { changeEmail } from "@/utils/profileCRUD";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/Auth/Auth";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface ChangeEmailCompProps {
  setEmailModalIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const ChangeEmailComp: React.FC<ChangeEmailCompProps> = ({
  setEmailModalIsOpen,
}) => {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [newEmail, setNewEmail] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { user, login } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const loginUser = await login(email, password);
    if (loginUser) {
      const changedEmail = await changeEmail({ email: newEmail, user });
      if (changedEmail) {
        setIsLoading(false);
        setSuccess(true);
      } else
        setErrorMessage("Email address change didn't work. Please try again.");
    } else setIsLoading(false);
    setErrorMessage(
      "There was an error with the credentials provided. Please try again."
    );
  }

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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              id="password"
              name="password"
              className="w-full p-2 border rounded"
              placeholder="PASSWORD"
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <button
            disabled={newEmail === "" || email == "" || password == ""}
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {isLoading ? <Loading /> : "SAVE EMAIL"}
          </button>
          {errorMessage && <div className="text-sm">{errorMessage}</div>}
        </form>
      </div>
    );
  }
};

export default ChangeEmailComp;
