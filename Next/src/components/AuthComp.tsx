"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import LoginComp from "./LoginComp";
import RegisterComp from "./RegisterComp";
import ForgotPasswordComp from "./ForgotPasswordComp";

interface AuthCompProps {
  location: "modal" | "page";
  setAuthCompOpen?: Dispatch<SetStateAction<boolean>>;
  title?: string;
}

const AuthComp: React.FC<AuthCompProps> = ({ location, setAuthCompOpen }) => {
  const [logInModalIsOpen, setLogInModalIsOpen] = useState(true);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] =
    useState(false);
  return (
    <>
      {logInModalIsOpen && (
        <LoginComp
          pageOrModal={location}
          setLogInModalIsOpen={setLogInModalIsOpen}
          setSignUpModalIsOpen={setSignUpModalIsOpen}
          setForgotPasswordModalIsOpen={setForgotPasswordModalIsOpen}
          setAuthCompOpen={setAuthCompOpen}
        />
      )}
      {signUpModalIsOpen && (
        <RegisterComp
          location={location}
          setLogInModalIsOpen={setLogInModalIsOpen}
          setSignUpModalIsOpen={setSignUpModalIsOpen}
          setAuthCompOpen={setAuthCompOpen}
        />
      )}
      {forgotPasswordModalIsOpen && (
        <ForgotPasswordComp
          location={location}
          setLogInModalIsOpen={setLogInModalIsOpen}
          setSignUpModalIsOpen={setSignUpModalIsOpen}
          setForgotPasswordModalIsOpen={setForgotPasswordModalIsOpen}
        />
      )}
    </>
  );
};

export default AuthComp;
