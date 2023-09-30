import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type HeroProps = {
  h1a: string;
  h1b: string | React.JSX.Element[] | JSX.Element;
  excerpt: string | JSX.Element;
};

const HeroHP = ({ h1a, h1b, excerpt }: HeroProps) => {
  return (
    <div className="md:max-w-[60%] flex flex-col gap-2.5 mx-auto mt-5 sm:mt-10">
      <h1 className="capitalize flex flex-col gap-2.5">
        <span className="text-xl sm:text-2xl font-semibold">{h1a}</span>
        <span className="text-2xl sm:text-5xl">{h1b}</span>
      </h1>
      <div className="font-normal">
        <span>{excerpt}</span>
      </div>
    </div>
  );
};

export default HeroHP;
