"use client";
import { useEffect, useRef, useState } from "react";
import { InternalLink } from "./links/InternalLink";
import { usePathname } from "next/navigation";
import Modal from "./Modal";
import LoginComp from "./LoginComp";
import { useAuth } from "../providers/Auth/Auth";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CldImage } from "next-cloudinary";
import { defaultImages } from "@/utils/defaultImages";
import { Media } from "@/payload/payload-types";
import { PiSignIn } from "react-icons/pi";
import { PiSignOut } from "react-icons/pi";
import { PiUserCircle } from "react-icons/pi";
import RegisterComp from "./RegisterComp";
import ForgotPasswordComp from "./ForgotPasswordComp";
import Loading from "@/app/(site)/loading";

const Navbar = () => {
  const pathname = usePathname();
  const ref = useRef(null);
  const menuRef = useRef(null);
  const { user, loginLoading, logOutLoading, registerLoading } = useAuth();
  const { logout } = useAuth();
  const [logInModalIsOpen, setLogInModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] =
    useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignInClick = () => {
    setLogInModalIsOpen(true);
  };

  useEffect(() => {
    setShowDropdown(false);
    // eslint-disable-next-line
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
      <div className="relative max-w-[1000px] lg:mx-auto m-auto mx-3 z-10">
        <div className="flex flex-row gap-5 justify-between items-center my-auto py-1 ">
          <div className="flex flex-col items-center">
            <InternalLink
              element={<>Weasker</>}
              className="text-4xl leading-none font-extrabold smallCaps text-tl-dark-blue"
              href="/"
              eventName="ClickInnerPage"
              target="HP"
              locationOnPage="Navbar"
            />
            <span className="text-xs text-tl-dark-blue pb-1">
              Interviewing Experts
            </span>
          </div>
          {pathname !== "/login" &&
          pathname !== "/register" &&
          pathname !== "/forgot-password" ? (
            user ? (
              <div>
                <div
                  ref={menuRef}
                  className="flex flex-row items-center justify-between hover:cursor-pointer hover:text-tl-light-blue border p-2 min-w-28 sm:min-w-40 w-full rounded-t"
                >
                  {loginLoading || logOutLoading || registerLoading ? (
                    <Loading />
                  ) : (
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
                      <div className="max-w-5 w-full">
                        <span
                          className={`font-bold sm:max-w-5 ${
                            user?.userName.length > 10 &&
                            "text-xs break-all line-clamp-6"
                          }`}
                        >
                          {user?.userName}
                        </span>
                      </div>
                    </div>
                  )}

                  <MdOutlineKeyboardArrowDown />
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleSignInClick();
                }}
              >
                <div className="hover:text-tl-light-blue border p-2 w-28 sm:w-40 rounded-t smallCaps">
                  {loginLoading || logOutLoading || registerLoading ? (
                    <Loading />
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <PiSignIn />
                      Log in
                    </div>
                  )}
                </div>
              </button>
            )
          ) : null}
        </div>
        {showDropdown && (
          <div
            className="absolute right-0 bg-white border rounded w-28 sm:w-40 p-3 mt-2"
            ref={ref}
          >
            <ul className="flex flex-col gap-2">
              <li className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-tl-light-blue">
                <PiUserCircle />
                <InternalLink element={"Account"} href={"/account"} />
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
      {logInModalIsOpen && (
        <Modal onclick={() => setLogInModalIsOpen(false)}>
          <LoginComp
            location={"modal"}
            setLogInModalIsOpen={setLogInModalIsOpen}
            setSignUpModalIsOpen={setSignUpModalIsOpen}
            setForgotPasswordModalIsOpen={setForgotPasswordModalIsOpen}
          />
        </Modal>
      )}
      {signUpModalIsOpen && (
        <Modal onclick={() => setSignUpModalIsOpen(false)}>
          <RegisterComp
            location={"modal"}
            setLogInModalIsOpen={setLogInModalIsOpen}
            setSignUpModalIsOpen={setSignUpModalIsOpen}
          />
        </Modal>
      )}
      {forgotPasswordModalIsOpen && (
        <Modal onclick={() => setForgotPasswordModalIsOpen(false)}>
          <ForgotPasswordComp
            location={"modal"}
            setLogInModalIsOpen={setLogInModalIsOpen}
            setSignUpModalIsOpen={setSignUpModalIsOpen}
            setForgotPasswordModalIsOpen={setForgotPasswordModalIsOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
