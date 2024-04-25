"use client";

import { CldImage } from "next-cloudinary";
import React, { ReactNode, useEffect, useState } from "react";

interface ImageAndTextProps {
  image?: string;
  defaultImage?: string;
  alt?: string;
  number?: number;
  preTitle?: string | ReactNode;
  title?: string | ReactNode;
  about?: string | ReactNode;
  imageClassName?: string;
  selected?: boolean;
}

export const ImageAndText: React.FC<ImageAndTextProps> = ({
  image,
  defaultImage,
  alt,
  preTitle,
  title,
  about,
  imageClassName,
  number,
  selected,
}) => {
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
    <div className="flex flex-col">
      <div className={`group flex flex-row gap-2 text-left items-center`}>
        {number && (
          <div className={`w-11 h-11`}>
            <div
              className={`flex flex-row items-center justify-center border-2 border-tl-dark-blue rounded-full p-3 text-base text-tl-dark-blue group-hover:border-tl-light-blue transition-border ease-in-out duration-300 h-11 w-11`}
            >
              {number}
            </div>
          </div>
        )}
        {(image || defaultImage) && (
          <CldImage
            src={image || defaultImage}
            alt={alt || "weasker.com"}
            width={400}
            height={400}
            crop="fill"
            className={`rounded-full border-[2px] border-tl-dark-blue group-hover:border-tl-light-blue transition-border ease-in-out duration-300  ${imageClassName} ${
              selected && "ring-offset-2 ring-2 ring-offset-tl-light-blue"
            }`}
          />
        )}
        {(preTitle || title || about) && (
          <div className="flex flex-col">
            <div className="flex flex-col gap-1 text-left sm:text-left">
              {preTitle && preTitle}
              {title && title}
            </div>
            {about && !isMobile && about}
          </div>
        )}
      </div>
      {about && isMobile && <div className="p-2">{about}</div>}
    </div>
  );
};
