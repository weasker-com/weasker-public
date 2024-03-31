import { InternalLink } from "./links/InternalLink";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-white absolute w-full z-10 mt-10 border-t-2 border-tl-dark-blue/80">
      <div className="flex flex-col gap-3 justify-between sm:flex-row max-w-[1000px] sm:mx-auto m-2 sm:my-5 ">
        <div className="flex flex-col items-start sm:gap-5">
          {" "}
          <div className="flex flex-col items-center select-none">
            <InternalLink
              element={<>Weasker</>}
              className="text-4xl leading-none font-extrabold smallCaps text-tl-dark-blue"
              href="/"
            />
            <span className="text-xs text-tl-dark-blue pb-1">
              Interviewing Experts
            </span>
          </div>
          <div className="text-sm select-none">
            © {currentYear} All rights reserved weasker.com
          </div>
        </div>
        <div className="flex flex-row gap-20">
          <div className="flex flex-row flex-col items-start justify-start">
            <InternalLink element="Home" href="/" style="blue-hover" />
            <InternalLink
              element="Badges"
              href="/?tab=badges"
              style="blue-hover"
            />
            <InternalLink
              element="Interviews"
              href="/?tab=interviews"
              style="blue-hover"
            />
            <InternalLink
              element="Experts"
              href="/?tab=users"
              style="blue-hover"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <InternalLink element="About" href="/about" style="blue-hover" />
            <InternalLink
              element="Privacy Policy"
              href="/privacy-policy"
              style="blue-hover"
            />
            <InternalLink
              element="User Agreement"
              href="/user-agreement"
              style="blue-hover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
