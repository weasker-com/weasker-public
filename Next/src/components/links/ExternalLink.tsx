"use client";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";

interface ExternalLinkProps {
  element: string | React.ReactElement;
  href: string;
  className?: string;
  eventName: "ClickUserService" | "ClickImage";
  target: string;
  style?: "blue" | "inherit";
  locationOnPage: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  style,
  element,
  target,
  href,
  className,
  eventName,
  locationOnPage,
}) => {
  const pathname = usePathname();
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} ${
        style == "blue" && "text-tl-light-blue hover:text-[#0d55a1]"
      }  ${
        style == "inherit" &&
        "hover:underline underline-offset-4 decoration-inherit decoration-2"
      }`}
      href={href}
      onClick={() => {
        track(eventName, { target, location: pathname, locationOnPage });
      }}
    >
      {element}
    </a>
  );
};

export default ExternalLink;
