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
  about?: string;
};

const Hero = ({ title, preTitle, image, alt, cta, about }: HeroProps) => {
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
    <div className="h-max sm:mx-0 sm:py-10 bg-white my-2 rounded rounded-t-lg shadow w-full max-w-[1000px] group">
      <div className="flex flex-col items-center lg:flex-row gap-2 sm:gap-5 items-start sm:ml-2 lg:mx-auto max-w-[1000px] w-full mr-auto p-5 sm:p-0 sm:px-5 rounded rounded-t-lg bg-white">
        <div
          className={`flex flex-row gap-2 sm:gap-5 items-center sm:max-w-[70%] `}
        >
          <CldImage
            src={image || defaultImages.weaskerLogo}
            alt={alt || ""}
            crop="fill"
            width={200}
            height={200}
            className="w-[70px] h-[70px] sm:w-[150px] sm:h-[150px] object-cover rounded-full border border-tl-dark-blue border-[2px] sm:border-[5px] group-hover:border-tl-light-blue transition-border ease-in-out duration-300"
          />
          <div className="flex flex-col">
            <h1 className="flex flex-col text-left gap-1">
              {preTitle && (
                <span
                  className={`text-xs sm:text-sm font-medium text-weasker-grey`}
                >
                  {preTitle}&nbsp;
                </span>
              )}
              <span className="text-base sm:text-xl capitalize sm:my-2">
                {title}
              </span>
              {!isMobile && about && (
                <span className="text-sm text-left font-normal">{about}</span>
              )}
            </h1>
          </div>
        </div>
        {isMobile && about && (
          <div className="text-xs text-center w-full">{about}</div>
        )}
        {cta && <div className="mx-auto my-2">{cta}</div>}
      </div>
    </div>
  );
};

export default Hero;
