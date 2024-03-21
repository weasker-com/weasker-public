"use client";
import React from "react";

interface ExternalLinkProps {
  element: string | React.ReactElement;
  href: string;
  className?: string;
  style?: "blue" | "inherit";
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  style,
  element,
  href,
  className,
}) => {
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
    >
      {element}
    </a>
  );
};

export default ExternalLink;
