import { availableAtIcon, externalLinkIcon } from "@/utils/defaultIcons";
import { WhiteBox } from "../ui/boxes";
import ExternalLink from "../links/ExternalLink";
import { parse } from "tldts";
import { Media, User } from "@/payload/payload-types";
import { CldImage } from "next-cloudinary";

interface LinkObject {
  [key: string]: string | null;
}

interface ContactCompProps {
  user?: User;
  userName: string;
  links: LinkObject;
}

const ContactComp = ({ userName, links, user }: ContactCompProps) => {
  const domainCounts = {};

  const linkComponents = Object.entries(links)
    // eslint-disable-next-line
    .filter(([_, url]) => url !== null && url !== "")

    .map(([key, url], index) => {
      const domain = parse(url).domainWithoutSuffix;

      domainCounts[domain] = (domainCounts[domain] || 0) + 1;

      const label =
        domainCounts[domain] > 1 ? `${domain} ${domainCounts[domain]}` : domain;

      return (
        <li key={index}>
          <ExternalLink
            href={url}
            key={key}
            className="plausible-event-name=service-click"
            element={
              <div className="flex flex-row items-center content-center gap-2 text-lg text-tl-light-blue hover:underline underline-offset-4 decoration-inherit decoration-2">
                <div>{label}</div>
                <div>{externalLinkIcon(15)}</div>
              </div>
            }
          />
        </li>
      );
    });

  const userHasLinks = Object.values(links).some(
    (item) => item !== null && item !== ""
  );

  return (
    <WhiteBox>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-2 items-center text-lg font-semibold">
            {user && user.seo?.image ? (
              <CldImage
                width={100}
                height={100}
                src={((user as User).seo.image as Media).filename}
                alt={user.userName}
                className="w-[40px] h-[40px] cover rounded-full border-2"
              />
            ) : (
              availableAtIcon(40)
            )}{" "}
            {userName} &#8226; Contact
          </div>
        </div>
        {userHasLinks ? (
          <ul className="flex flex-col flex-wrap gap-3">{linkComponents}</ul>
        ) : (
          "User didn't add any links."
        )}
        <span className="text-xs font-light text-weasker-grey">
          By clicking on our links and making a purchase, you might be
          supporting us through a commission at no extra cost to you.
        </span>
      </div>
    </WhiteBox>
  );
};

export default ContactComp;
