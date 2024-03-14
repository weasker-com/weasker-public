import { availableAtIcon, externalLinkIcon } from "@/utils/defaultIcons";
import { WhiteBox } from "../ui/boxes";
import ExternalLink from "../links/ExternalLink";
import { parse } from "tldts";

interface LinkObject {
  [key: string]: string | null;
}

interface ContactCompProps {
  userName: string;
  links: LinkObject;
}

const ContactComp = ({ userName, links }: ContactCompProps) => {
  const linkComponents = Object.entries(links)
    // eslint-disable-next-line
    .filter(([_, url]) => url !== null)
    .map(([key, url], index) => (
      <li key={index}>
        <ExternalLink
          href={url}
          key={key}
          className="plausible-event-name=service-click"
          element={
            <div className="flex flex-row items-center content-center gap-2 text-lg text-tl-light-blue hover:underline underline-offset-4 decoration-inherit decoration-2">
              <div>{parse(url).domainWithoutSuffix}</div>
              <div>{externalLinkIcon(15)}</div>
            </div>
          }
        />
      </li>
    ));

  return (
    <WhiteBox>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="flex flex-row gap-3 items-center text-lg font-extrabold text-tl-dark-blue">
            {availableAtIcon(40)} {userName} Available at
          </h1>
          <span className="text-xs font-light text-weasker-grey">
            By clicking on our links and making a purchase, you might be
            supporting us through a commission at no extra cost to you.
          </span>
        </div>
        <ul className="flex flex-col flex-wrap gap-3">{linkComponents}</ul>
      </div>
    </WhiteBox>
  );
};

export default ContactComp;
