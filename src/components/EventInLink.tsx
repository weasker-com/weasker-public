"use client";
import { track } from "@vercel/analytics";
import Link from "next/link";

interface EventInLinkProps {
  text: string;
  eventName: string;
  location: string;
  href: string;
  className: string;
}

const EventInLink: React.FC<EventInLinkProps> = ({
  text,
  eventName,
  location,
  href,
  className,
}) => {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
        track(eventName, { location });
      }}
    >
      {text}
    </Link>
  );
};

export default EventInLink;
