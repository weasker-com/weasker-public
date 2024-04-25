"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Loading from "@/app/(site)/loading";
import { FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { InternalLink } from "./links/InternalLink";
import { useAuth } from "../providers/Auth/Auth";

interface ResetPasswordCompProps {}

const ResetPasswordComp: React.FC<ResetPasswordCompProps> = () => {
  const { resetPassword, resetPasswordError, resetPasswordLoading } = useAuth();
  const [newPassword, setNewPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [checkMarkIsChecked, setCheckMarkIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | ReactNode | null>(
    null
  );
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const searchParamsToken: string | null = searchParams.get("token");
  const searchParamsUserName: string | null = searchParams.get("user");

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password doesn't match");
    } else setErrorMessage(null);
  }, [newPassword, confirmPassword]);

  async function handleSubmit(e) {
    e.preventDefault();

    const passwordReset = await resetPassword(searchParamsToken, newPassword);
    if (passwordReset) {
      setSuccess(true);
    }
  }

  useEffect(() => {
    if (resetPasswordError) {
      setErrorMessage(
        <span>
          The link you clicked has expired or is invalid.
          <InternalLink
            element={" Please request a password reset again"}
            href={"/forgot-password"}
            style={"blue"}
          />
        </span>
      );
    }
  }, [resetPasswordError]);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <FaCheckCircle className="text-emerald-500" size={50} />
        <span>Password changed successfully</span>
        <InternalLink
          element={
            <button className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey">
              Log in to your account
            </button>
          }
          href={"/login"}
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
        <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
          Reset your password
        </h1>
        <span className="text-sm font-light text-weasker-grey">
          Choose a new password here, then log in to your account. Password
          needs a minimum of 8 characters with upper and lower case letters and
          at least one symbol.
        </span>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex flex-col gap-3 w-full"
        >
          <span className="text-sm text-tl-dark-blue">
            {searchParamsUserName}
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
              placeholder="VERIFY PASSWORD"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              I am aware that updating my password will sign me out of all
              browsers on my devices.
            </label>
            <br></br>
          </div>
          <button
            disabled={
              errorMessage !== null ||
              !checkMarkIsChecked ||
              newPassword === "" ||
              confirmPassword == "" ||
              newPassword !== confirmPassword ||
              resetPasswordLoading == true
            }
            className="rounded px-5 py-1 mt-3 bg-tl-light-blue disabled:bg-slate-100 text-white disabled:text-weasker-grey"
          >
            {resetPasswordLoading ? <Loading /> : "SET PASSWORD"}
          </button>
          {errorMessage && <div className="text-sm">{errorMessage}</div>}
        </form>
      </div>
    );
  }
};

export default ResetPasswordComp;
