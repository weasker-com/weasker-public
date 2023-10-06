"use client";
import { track } from "@vercel/analytics";

interface EventOutLinkProps {
  text: string;
  eventName: string;
  location: string;
  href: string;
}

const EventOutLink: React.FC<EventOutLinkProps> = ({
  text,
  eventName,
  location,
  href,
}) => {
  return (
    <a
      href={href}
      onClick={() => {
        track(eventName, { location });
      }}
    >
      {text}
    </a>
  );
};

export default EventOutLink;
