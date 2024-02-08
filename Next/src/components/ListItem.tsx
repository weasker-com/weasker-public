"use client";

import { CldImage } from "next-cloudinary";
import { InternalLink } from "./links/InternalLink";
import React from "react";

interface InterviewProps {
  location: "hp" | "page" | "interview" | "question" | "badge" | "user";
  name: string;
  slugs?: string;
  image?: string;
  excerpt?: string;
  preTitle?: string;
  links?: React.JSX.Element[];
}

const ListItem: React.FC<InterviewProps> = ({
  name,
  slugs,
  image,
  excerpt,
  preTitle,
  links,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-2 mx-2 lg:mx-0 bg-white p-5 border rounded-t border-weasker-light-grey/50">
      {slugs ? (
        <InternalLink
          element={
            <div className="flex flex-row items-center content-center gap-3">
              {image && (
                <CldImage
                  width={200}
                  height={200}
                  src={image}
                  alt={name}
                  className="h-[50px] w-[50px] sm:w-[70px] sm:h-[70px] cover  rounded-full border-2 border-weasker-grey"
                />
              )}
              <div>
                <span className=" text-weasker-grey">{preTitle}</span>
                <h2>{name}</h2>
              </div>
            </div>
          }
          href={slugs}
          eventName={"ClickQuestionPage"}
          target={name}
          locationOnPage={"main"}
        />
      ) : (
        <h2>{name}</h2>
      )}

      <div className="flex flex-col gap-2">
        <span>{excerpt}</span>
        <div className="mt-3 flex flex-row gap-5 flex-wrap items-center">
          {links}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
