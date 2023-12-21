"use client";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import Link from "next/link";

interface InternalLinkProps {
  element: string | React.ReactElement;
  href: string;
  className?: string;
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
  target: string;
  locationOnPage: string;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  element,
  className,
  href,
  eventName,
  target,
  locationOnPage,
}) => {
  const pathname = usePathname();
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
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
