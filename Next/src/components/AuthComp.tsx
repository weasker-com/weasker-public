"use client";

import React, { useState } from "react";
import LoginComp from "./LoginComp";
import RegisterComp from "./RegisterComp";
import ForgotPasswordComp from "./ForgotPasswordComp";

interface AuthCompProps {
  location: "modal" | "page";
  title?: string;
}

const AuthComp: React.FC<AuthCompProps> = ({ location }) => {
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
        />
      )}
      {signUpModalIsOpen && (
        <RegisterComp
          location={location}
          setLogInModalIsOpen={setLogInModalIsOpen}
          setSignUpModalIsOpen={setSignUpModalIsOpen}
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
