"use client";

import { useEffect, useRef, useState } from "react";
import { InternalLink } from "./links/InternalLink";
import Modal from "./Modal";
import SignInComp from "./SignIn";
import { useAuth } from "../providers/Auth/Auth";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CldImage } from "next-cloudinary";
import { defaultImages } from "@/utils/defaultImages";
import { Media } from "@/payload/payload-types";
import { PiSignIn } from "react-icons/pi";
import { PiSignOut } from "react-icons/pi";
import { PiUserCircle } from "react-icons/pi";

const Navbar = () => {
  const router = useRouter();
  const ref = useRef(null);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const { logout } = useAuth();
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignInClick = () => {
    setSignInModalIsOpen(true);
  };

  useEffect(() => {
    setShowDropdown(false);
  }, [!user, ref]);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (menuRef.current?.contains(event.target)) {
        setShowDropdown((prevState) => !prevState);
      } else if (!ref.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutSideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref, menuRef]);

  const handleLogOutClick = async () => {
    await logout();
  };

  return (
    <div className="h-max border-b border-zinc-100 bg-white">
      <div className="relative max-w-[1000px] lg:mx-auto m-auto mx-3">
        <div className=" flex flex-row justify-between items-center my-auto py-1 ">
          <InternalLink
            element={<>Weasker</>}
            className="text-4xl font-extrabold smallCaps text-tl-dark-blue "
            href="/"
            eventName="ClickInnerPage"
            target="HP"
            locationOnPage="Navbar"
          />
          {user ? (
            <div>
              <div
                ref={menuRef}
                className="flex flex-row items-center justify-between hover:cursor-pointer hover:text-tl-light-blue border p-2 w-28 sm:w-40 rounded-t"
              >
                <div className="flex flex-row gap-1 items-center">
                  <CldImage
                    width={50}
                    height={50}
                    src={
                      (user.seo.image as Media)?.cloudinary?.public_id ||
                      defaultImages.defaultUserImage
                    }
                    alt={user.userName}
                    className="w-[30px] h-[30px] cover rounded-full border-2 "
                  />
                  <div className="font-bold">{user?.userName}</div>
                </div>
                <MdOutlineKeyboardArrowDown className="" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                handleSignInClick();
              }}
            >
              <div className=" flex flex-row items-center gap-1 hover:text-tl-light-blue border p-2 w-28 sm:w-40 rounded-t">
                <PiSignIn />
                Sign-in
              </div>
            </button>
          )}
        </div>
        {showDropdown && (
          <div
            className="absolute right-0 bg-white border rounded w-28 sm:w-40 p-3 mt-2"
            ref={ref}
          >
            <ul className="flex flex-col gap-2">
              <li
                className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-tl-light-blue"
                onClick={() => {
                  console.log("account");
                }}
              >
                <PiUserCircle />
                Account
              </li>
              <li
                className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-tl-light-blue"
                onClick={() => {
                  handleLogOutClick();
                }}
              >
                <PiSignOut />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      {signInModalIsOpen && (
        <Modal onclick={() => setSignInModalIsOpen(false)}>
          <SignInComp setSignInModalIsOpen={setSignInModalIsOpen} />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
