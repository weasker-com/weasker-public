"use client";
import { defaultImages } from "@/utils/defaultImages";
import { CldImage } from "next-cloudinary";
import React from "react";

type HeroProps = {
  title: string;
  preTitle?: string | React.JSX.Element;
  image: string | null;
  alt?: string;
  location: "hp" | "page" | "interview" | "question" | "badge" | "user";
};

const Hero = ({ title, preTitle, image, alt }: HeroProps) => {
  return (
    <div className="h-max sm:py-10 border-b border-zinc-100 bg-white w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center sm:ml-2 lg:mx-auto max-w-[1000px] mr-auto p-2 sm:p-0">
        <CldImage
          src={image || defaultImages.weaskerLogo}
          alt={alt || title}
          width={200}
          height={200}
          className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-cover rounded-full border border-tl-dark-blue border-[2px] sm:border-[5px]"
        />
        <h1 className="flex flex-col gap-1 sm:max-w-[70%] text-center sm:text-left">
          {preTitle && (
            <span
              className={`text-base sm:text-lg font-medium text-weasker-grey`}
            >
              {preTitle}&nbsp;
            </span>
          )}
          <span className="capitalize my-2 sm:my-o">{title}</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
