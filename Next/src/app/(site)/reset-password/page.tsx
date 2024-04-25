"use client";

import ResetPasswordComp from "@/components/ResetPasswordComp";
import { useAuth } from "../../../providers/Auth/Auth";
import { defaultImages } from "@/utils/defaultImages";
import { Media } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { InternalLink } from "@/components/links/InternalLink";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const searchParamsToken: string | null = searchParams.get("token");
  const { user } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogOutClick = async () => {
    await logout();
  };

  const handleAccountClick = () => {
    router.push("/account");
  };

  if (user && !searchParamsToken) {
    return (
      <div className="flex flex-col items-center gap-5 py-5 px-10 bg-white mt-10 text-base w-4/5">
        <div className="flex flex-row gap-1 items-center">
          <CldImage
            width={100}
            height={100}
            src={
              (user.seo.image as Media)?.cloudinary?.public_id ||
              defaultImages.defaultUserImage
            }
            alt={user.userName}
            className="w-[50px] h-[50px] cover rounded-full border-2 "
          />
          <div className="font-bold">{user?.userName}</div>
        </div>
        <span className="text-base">You are logged in</span>
        <div className="flex flex-row gap-2">
          <button
            className="border rounded py-2 px-3"
            onClick={() => {
              handleLogOutClick();
            }}
          >
            LOGOUT
          </button>
          <button
            className="border rounded py-2 px-3"
            onClick={() => {
              handleAccountClick();
            }}
          >
            YOUR ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  if (!user && !searchParamsToken) {
    return (
      <div className="flex flex-row max-w-[1000px] w-full h-screen bg-white mt-10">
        <CldImage
          width={500}
          height={1000}
          src={"weasker-painting_pvyoay"}
          alt="weasker-painting_pvyoay"
          className="hidden sm:block h-screen w-full max-w-[150px] cover"
        />
        <div className="flex flex-col items-start gap-5 bg-white p-10 rounded-t max-w-[500px]">
          <h1 className="text-lg font-extrabold smallCaps text-tl-dark-blue">
            To reset your password use the link we sent you over email.
          </h1>
          <div className="flex flex-row justify-start gap-1 text-tl-light-blue text-sm">
            <InternalLink element={"Log in"} href="/login" />
            <>&#xb7;</>
            <InternalLink element={"Sign up"} href="/register" />
          </div>
        </div>
      </div>
    );
  }

  if (!user && searchParamsToken) {
    return (
      <div className="flex flex-row max-w-[1000px] w-full h-screen bg-white mt-10">
        <CldImage
          width={500}
          height={1000}
          src={"weasker-painting_pvyoay"}
          alt="weasker-painting_pvyoay"
          className="hidden sm:block h-screen w-full max-w-[150px] cover"
        />

        <ResetPasswordComp />
      </div>
    );
  }

  if (user && searchParamsToken) {
    return router.push("/");
  }
}
