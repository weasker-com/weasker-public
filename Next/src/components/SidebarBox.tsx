"use client";

import { InternalLink } from "./links/InternalLink";
import { CldImage } from "next-cloudinary";

export interface SidebarBoxProps {
  title: string;
  element?: JSX.Element;
  linkStyle?: "blue" | "inherit";
  array?: {
    name: string;
    url: string;
    image?: string;
    icon?: JSX.Element;

    eventName:
      | "ClickUserName"
      | "ClickUserImage"
      | "ClickInterviewPage"
      | "ClickBadgeName"
      | "ClickFeaturedImage"
      | "ClickReadMoreAnswers"
      | "ClickTOC"
      | "ClickQuestionPage"
      | "ClickInnerPage";
  }[];
  itemsAmount?: number;
  onclick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SidebarBox: React.FC<SidebarBoxProps> = ({
  title,
  array,
  element,
  linkStyle,
  itemsAmount,
  onclick,
}) => {
  return (
    <div className="bg-white border border-weasker-light-grey/50 rounded-t mb-3 w-[100%]">
      <div className="border-b border-weasker-light-grey/50 w-full p-3">
        {title}
      </div>
      <div className="flex flex-col gap-5 p-3">
        {!array && element && element}
        {array &&
          !element &&
          array.slice(0, itemsAmount).map((item, index) => {
            return (
              <InternalLink
                key={index}
                onclick={onclick}
                style={linkStyle || "inherit"}
                element={
                  <div className="flex flex-row gap-2 items-center text-sm">
                    {item.icon && item.icon}
                    {item.image && (
                      <CldImage
                        width={70}
                        height={70}
                        src={item.image}
                        alt={item.name}
                        className="rounded-full border-2 border-weasker-grey"
                        style={{
                          objectFit: "cover",
                          width: "34px",
                          height: "34px",
                        }}
                      />
                    )}
                    {item.name}
                  </div>
                }
                href={item.url}
                eventName={item.eventName}
                target={item.name}
                locationOnPage={"sidebar"}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SidebarBox;
