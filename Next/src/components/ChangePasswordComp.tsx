"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { updatePassword } from "@/utils/profileCRUD";
import { useAuth } from "../providers/Auth/Auth";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface ChangePasswordCompProps {
  setPasswordModalIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const ChangePasswordComp: React.FC<ChangePasswordCompProps> = ({
  setPasswordModalIsOpen,
}) => {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [newPassword, setNewPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { user, login } = useAuth();

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password doesn't match");
    } else setErrorMessage(null);
  }, [newPassword, confirmPassword]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const loginUser = await login(email, password);
    if (loginUser) {
      const changedPassword = await updatePassword(user, newPassword);
      if (changedPassword) {
        setSuccess(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMessage(
          "A Password needs a minimum of 8 characters with upper and lower case letters and at least one symbol."
        );
      }
    } else {
      setIsLoading(false);
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-emerald-500" size={50} />
        <span>Password changed successfully</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Update your password
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Password needs a minimum of 8 characters with upper and lower case
          letters and at least one symbol.
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
              placeholder="OLD PASSWORD"
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
            />
          </div>
          <span className="text-sm font-extrabold smallCaps text-tl-dark-blue">
            Set new password
          </span>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              id="newPassword"
              name="newPassword"
              className="w-full p-2 border rounded"
              placeholder="NEW PASSWORD"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full p-2 border rounded"
              placeholder="CONFIRM NEW PASSWORD"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={
              email == "" ||
              password == "" ||
              newPassword === "" ||
              confirmPassword == "" ||
              newPassword !== confirmPassword
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {isLoading ? <Loading /> : "SAVE PASSWORD"}
          </button>
          {errorMessage && <div className="text-sm">{errorMessage}</div>}
        </form>
      </div>
    );
  }
};

export default ChangePasswordComp;
