"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../providers/Auth/Auth";
import { useRouter } from "next/navigation";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";

interface ChangePasswordCompProps {
  setDeleteAccountModalIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const DeleteAccountComp: React.FC<ChangePasswordCompProps> = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [checkMarkIsChecked, setCheckMarkIsChecked] = useState(false);
  const {
    user,
    setUser,
    login,
    deleteUser,
    deleteUserError,
    loginError,
    deleteUserLoading,
  } = useAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrorMessage(null);
  }, [password, email]);

  async function handleSubmit(e) {
    e.preventDefault();
    const loginUser = await login(email, password);
    if (loginUser) {
      const deletedAccount = await deleteUser(user);
      if (deletedAccount) {
        setUser(null);
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }
  }

  useEffect(() => {
    if (deleteUserError) {
      setErrorMessage("An error occurred. Please try again");
    }
  }, [deleteUserError]);

  useEffect(() => {
    if (loginError) {
      if (loginError.response.status == 401) {
        setErrorMessage(
          "There was an error with the login credentials provided. Please try again."
        );
      } else {
        setErrorMessage("An error ocurred. Please try again.");
      }
    }
  }, [loginError]);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-red-600" size={50} />
        <span>Account deleted successfully</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Delete account
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Once you delete your account, your profile and username are
          permanently removed from Weasker and your badges, interviews, and
          answers are disassociated (not deleted) from your account unless you
          delete them beforehand.
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
            />
          </div>
          <div className="flex flex-row gap-2 items-start">
            <input
              type="checkbox"
              id="checkbox"
              name="checkbox"
              className="p-2 border rounded"
              onChange={() => setCheckMarkIsChecked(!checkMarkIsChecked)}
            />
            <label htmlFor="checkbox" className="text-xs">
              I understand that deleted accounts cannot be restored
            </label>
            <br></br>
          </div>
          <button
            disabled={password === "" || email === "" || !checkMarkIsChecked}
            className="rounded px-5 py-1 mt-3 bg-red-600 disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {deleteUserLoading ? <Loading /> : "DELETE ACCOUNT"}
          </button>
          {errorMessage && <div className="text-sm">{errorMessage}</div>}
        </form>
      </div>
    );
  }
};
export default DeleteAccountComp;
