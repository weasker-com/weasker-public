"use client";
import Link from "next/link";
import React from "react";

interface InternalLinkProps {
  element: string | React.ReactElement;
  href: string;
  className?: string;
  newTab?: boolean;
  style?: "blue" | "inherit" | "blue-hover";
  // eslint-disable-next-line
  onclick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  element,
  className,
  href,
  style,
  newTab,
  // eslint-disable-next-line
  onclick,
}) => {
  return (
    <Link
      className={`${className} ${
        style == "blue-hover" &&
        "hover:text-tl-light-blue transition-text ease-in-out duration-300"
      } ${style == "blue" && "text-tl-light-blue hover:text-[#0d55a1]"}   ${
        style == "inherit" &&
        "hover:underline underline-offset-4 decoration-inherit decoration-2"
      }`}
      href={href}
      rel={newTab ? "noopener noreferrer" : null}
      target={newTab ? "_blank" : null}
    >
      {element}
    </Link>
  );
};
