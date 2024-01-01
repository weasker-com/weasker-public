"use client";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoLinkOutline } from "react-icons/io5";
import {
  LinkedinShareButton,
  LinkedinIcon,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";

const SocialShareButtons = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [ogTitle, setOgTitle] = useState<string>("");
  const [ogDescription, setOgDescription] = useState<string>("");

  useEffect(() => {
    const metaOgTitle = document.querySelector("meta[property='og:title']");
    if (metaOgTitle) {
      setOgTitle(metaOgTitle.getAttribute("content") || "");
    }

    const metaOgDescription = document.querySelector(
      "meta[property='og:description']"
    );
    if (metaOgTitle) {
      setOgDescription(metaOgTitle.getAttribute("content") || "");
    }
  }, []);

  const handleCopy = () => {
    track("ClickCopyLinkButton", {
      location: pathname,
      locationOnPage: "sidebar",
    });
    navigator.clipboard.writeText(`https://weasker.com${pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-row sm:flex-col gap-2">
      <div className="flex flex-row gap-3">
        <TwitterShareButton
          url={`https://www.weasker.com${pathname}`}
          title={ogTitle}
          via={"weasker"}
          onClick={() => {
            track("ClickTwitterShareButton", {
              location: pathname,
              locationOnPage: "sidebar",
            });
          }}
        >
          <TwitterIcon size={25} round />
        </TwitterShareButton>
        <LinkedinShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
          summary={ogDescription}
          onClick={() => {
            track("ClickLinkedinShareButton", {
              location: pathname,
              locationOnPage: "sidebar",
            });
          }}
        >
          <LinkedinIcon size={25} round />
        </LinkedinShareButton>
        <RedditShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
          onClick={() => {
            track("ClickRedditShareButton", {
              location: pathname,
              locationOnPage: "sidebar",
            });
          }}
        >
          <RedditIcon size={25} round />
        </RedditShareButton>
        <button onClick={handleCopy} className="focus:outline-none">
          <IoLinkOutline size={20} />
        </button>
      </div>
      {copied && <div className="text-tl-light-blue text-sm">Link Copied</div>}
    </div>
  );
};

export default SocialShareButtons;
