"use client";

import { login } from "@/utils/login";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/Auth/Auth"; //CONTINUE HERE

const SignInComp = () => {
  const [user, setUser] = useState<any | null>();
  const router = useRouter();
  const [password, setPassword] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    setEmail(emailRef.current.value);
    setPassword(passwordRef.current.value);
  }, []);

  async function handleSubmitNEW(e) {
    e.preventDefault();
    const loginUser = await Auth.signin;

    if (!loginUser?.data?.loginUser?.user) {
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
    }

    router.push("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const loginUser = await login(`mutation {
        loginUser(email: "${email}", password: "${password}") {
          user {
            id
            email
          }
        }
      }`);

    if (!loginUser?.data?.loginUser?.user) {
      setErrorMessage(
        "There was an error with the credentials provided. Please try again."
      );
    }

    router.push("/");
  }

  return (
    <div className="flex flex-col items-start gap-5 bg-white p-5 rounded-t">
      <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        Weasker
      </h1>
      <h2 className="text-xl font-extrabold text-tl-dark-blue">
        Log in to your account
      </h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-96 h-12 border pl-2"
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-96 h-12 border pl-2"
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
          />
        </div>
        <button className="rounded w-min px-5 py-1 mt-3 bg-tl-light-blue text-white">
          Login
        </button>
        {errorMessage && <div className="text-sm">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default SignInComp;
