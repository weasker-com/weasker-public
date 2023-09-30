import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import SocialShareButtons from "./SocialShareButtons";

type HeroProps = {
  h1a?: string | React.JSX.Element[] | JSX.Element;
  h1b: string;
  excerpt: string | JSX.Element;
  featuredImageSrc: string | StaticImageData;
  featuredImageAlt: string;
  services?: React.ReactNode;
  featuredImageUrl?: string;
};

const Hero = ({
  h1a,
  h1b,
  excerpt,
  featuredImageSrc,
  featuredImageAlt,
  services,
  featuredImageUrl,
}: HeroProps) => {
  return (
    <div className="flex flex-row sm:pt-10 pt-5">
      <div className="md:max-w-[70%] flex flex-col gap-2.5">
        <h1 className="capitalize flex flex-col gap-2.5">
          <span className="flex sm:flex-row flex-row sm:items-center sm:gap-2 text-base sm:text-xl font-medium flex-wrap">
            {h1a}
          </span>
          <span className="font-bold sm:text-5xl text-xl">{h1b}</span>
        </h1>
        <div className="font-normal sm:w-[90%]">
          <span>{excerpt}</span>
        </div>
        <div className="flex sm:hidden">
          <SocialShareButtons />
        </div>
      </div>
      <div className="hidden md:flex my-auto mx-auto flex-col items-center gap-2 align-center border rounded-xl p-5 shadow">
        <Link href={featuredImageUrl || "/"}>
          <Image
            width={130}
            height={130}
            src={featuredImageSrc}
            alt={featuredImageAlt}
            style={{
              borderRadius: "100px",
              objectFit: "cover",
              width: "130px",
              height: "130px",
            }}
          />
        </Link>
        <span>{services}</span>
      </div>
    </div>
  );
};

export default Hero;
