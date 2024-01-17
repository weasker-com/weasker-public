"use client";

import { useState } from "react";
import { InternalLink } from "./links/InternalLink";
import Modal from "./Modal";
import SignInComp from "./SignIn";

const Navbar = () => {
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const handleSignInClick = () => {
    setSignInModalIsOpen(true);
  };
  return (
    <div className="h-max py-1 border-b border-zinc-100 bg-white">
      <div className="flex flex-row justify-between items-center my-auto mx-3 max-w-[1000px] lg:mx-auto m-auto">
        <InternalLink
          element={<>Weasker</>}
          className="text-4xl font-extrabold smallCaps text-tl-dark-blue"
          href="/"
          eventName="ClickInnerPage"
          target="HP"
          locationOnPage="Navbar"
        />
        <button
          onClick={() => {
            handleSignInClick();
          }}
        >
          Enter
        </button>
      </div>
      {signInModalIsOpen && (
        <Modal onclick={() => setSignInModalIsOpen(false)}>
          <SignInComp />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
