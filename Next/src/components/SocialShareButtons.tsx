"use client";
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
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  PinterestShareButton,
  PinterestIcon,
  EmailShareButton,
  EmailIcon,
  TumblrShareButton,
  TumblrIcon,
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

    if (metaOgDescription) {
      setOgDescription(metaOgTitle.getAttribute("content") || "");
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://weasker.com${pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <span className="text-lg font-extrabold smallCaps text-tl-dark-blue">
        Share
      </span>
      <button onClick={handleCopy} className="focus:outline-none">
        <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
          <IoLinkOutline size={20} />
          <>Copy link</>
        </div>
      </button>
      {copied && (
        <div className="text-tl-light-blue text-sm">
          Link copied to clipboard
        </div>
      )}
      <div className="flex flex-row flex-wrap gap-3 font-bold">
        <TwitterShareButton
          url={`https://www.weasker.com${pathname}`}
          title={ogTitle}
          via={"weasker_com"}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <TwitterIcon size={25} round />
            <>Twitter</>
          </div>
        </TwitterShareButton>

        <LinkedinShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
          summary={ogDescription}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <LinkedinIcon size={25} round />
            <>Linkedin</>
          </div>
        </LinkedinShareButton>
        <RedditShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <RedditIcon size={25} round />
            <>Reddit</>
          </div>
        </RedditShareButton>

        <TelegramShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <TelegramIcon size={25} round />
            <>Telegram</>
          </div>
        </TelegramShareButton>
        <WhatsappShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
          separator=":: "
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <WhatsappIcon size={25} round />
            <>WhatsApp</>
          </div>
        </WhatsappShareButton>
        <FacebookShareButton
          url={`https://weasker.com${pathname}`}
          quote={ogTitle}
          hashtag={"#weasker"}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <FacebookIcon size={25} round />
            <>Facebook</>
          </div>
        </FacebookShareButton>

        <LineShareButton url={`https://weasker.com${pathname}`} title={ogTitle}>
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <LineIcon size={25} round />
            <>Line</>
          </div>
        </LineShareButton>

        <PinterestShareButton
          url={`https://weasker.com${pathname}`}
          media={ogTitle}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <PinterestIcon size={25} round />
            <>Pinterest</>
          </div>
        </PinterestShareButton>
        <EmailShareButton
          url={`https://weasker.com${pathname}`}
          subject={ogTitle}
          body={ogDescription}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <EmailIcon size={25} round />
            <>Email</>
          </div>
        </EmailShareButton>
        <TumblrShareButton
          url={`https://weasker.com${pathname}`}
          title={ogTitle}
        >
          <div className="flex flex-row items-center gap-1 hover:text-tl-light-blue">
            <TumblrIcon size={25} round />
            <>Tumblr</>
          </div>
        </TumblrShareButton>
      </div>
    </div>
  );
};

export default SocialShareButtons;
