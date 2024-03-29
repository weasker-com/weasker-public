"use client";
import { defaultImages } from "@/utils/defaultImages";
import { CldImage } from "next-cloudinary";
import React, { ReactNode, useState, useEffect } from "react";

type HeroProps = {
  title: string | React.JSX.Element;
  preTitle?: string | React.JSX.Element;
  image: string | null;
  alt?: string;
  cta?: ReactNode;
  about?: string | React.JSX.Element;
  longTitle?: boolean;
};

const Hero = ({
  title,
  preTitle,
  image,
  alt,
  cta,
  about,
  longTitle,
}: HeroProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="h-max sm:mx-0 sm:py-10 bg-white my-2 rounded rounded-t-lg shadow max-w-[1000px] group w-full">
      <div className="flex flex-col items-start sm:items-center lg:flex-row gap-2 sm:gap-5 items-start sm:ml-2 lg:mx-auto max-w-[1000px] mr-auto p-3 sm:p-0 sm:px-5 rounded rounded-t-lg bg-white w-full">
        <div
          className={`flex flex-row gap-2 sm:gap-5 items-center sm:max-w-[70%]`}
        >
          <CldImage
            src={image || defaultImages.weaskerLogo}
            alt={alt || ""}
            crop="fill"
            width={200}
            height={200}
            className="w-[50px] h-[50px] sm:w-[150px] sm:h-[150px] object-cover rounded-full border border-tl-dark-blue border-[2px] sm:border-[5px] group-hover:border-tl-light-blue transition-border ease-in-out duration-300"
          />
          <div className="flex flex-col">
            <div className="flex flex-col text-left gap-1">
              {preTitle && (
                <span
                  className={`text-xs font-normal sm:text-sm sm:font-medium text-weasker-grey`}
                >
                  {preTitle}&nbsp;
                </span>
              )}
              {(!isMobile || !longTitle) && (
                <h1 className="text-lg sm:text-xl capitalize sm:my-2">
                  {title}
                </h1>
              )}
              {!isMobile && about && (
                <span className="text-sm text-left font-normal w-full">
                  {about}
                </span>
              )}
            </div>
          </div>
        </div>
        {isMobile && longTitle && (
          <h1 className="text-lg sm:text-xl capitalize sm:my-2">{title}</h1>
        )}
        {isMobile && about && (
          <div className="text-xs text-left w-full p-1">{about}</div>
        )}
        {cta && <div className="sm:mx-auto my-2">{cta}</div>}
      </div>
    </div>
  );
};

export default Hero;
