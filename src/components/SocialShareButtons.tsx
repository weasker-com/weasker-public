"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IoLinkOutline } from "react-icons/io5";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditIcon,
  RedditShareButton,
} from "next-share";

const SocialShareButtons = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://weasker.com${pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-row sm:flex-col gap-5">
      <div className="text-lg font-semibold">Share</div>
      <div className="flex flex-row gap-1">
        <FacebookShareButton
          url={`https://weasker.com${pathname}`}
          hashtag={"#weasker"}
        >
          <FacebookIcon size={25} round />
        </FacebookShareButton>
        <LinkedinShareButton url={`https://weasker.com${pathname}`}>
          <LinkedinIcon size={25} round />
        </LinkedinShareButton>
        <RedditShareButton url={`https://weasker.com${pathname}`}>
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
