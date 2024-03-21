"use client";

import { CldImage } from "next-cloudinary";
import { InternalLink } from "./links/InternalLink";
import { usePathname } from "next/navigation";

const NoAuth = () => {
  const pathname = usePathname();

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
          You must be logged in to view this page
        </h1>
        <div className="flex flex-row gap-2">
          <span>
            <InternalLink
              href={`/login?dest=${pathname}`}
              element="Log in"
              style="blue"
            />
          </span>
          <>&#xb7;</>
          <span>
            <InternalLink href={`/register`} element="Sign up" style="blue" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoAuth;
