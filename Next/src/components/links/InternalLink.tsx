"use client";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import Link from "next/link";

interface InternalLinkProps {
  element: string | React.ReactElement;
  href: string;
  className?: string;
  style?: "blue" | "inherit";
  eventName:
    | "ClickUserName"
    | "ClickUserImage"
    | "ClickInterviewPage"
    | "ClickBadgeName"
    | "ClickFeaturedImage"
    | "ClickReadMoreAnswers"
    | "ClickTOC"
    | "ClickQuestionPage"
    | "ClickInnerPage"
    | "ClickSubMenu";
  target: string;
  locationOnPage: string;
  onclick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  element,
  className,
  href,
  eventName,
  style,
  target,
  locationOnPage,
  onclick,
}) => {
  const pathname = usePathname();
  return (
    <Link
      className={`${className} ${
        style == "blue" && "text-tl-light-blue hover:text-[#0d55a1]"
      }  ${
        style == "inherit" &&
        "hover:underline underline-offset-4 decoration-inherit decoration-2"
      }`}
      href={href}
      onClick={(e) => {
        if (onclick) {
          onclick(e);
        }

        track(eventName, {
          target,
          location: pathname,
          locationOnPage,
        });
      }}
    >
      {element}
    </Link>
  );
};
