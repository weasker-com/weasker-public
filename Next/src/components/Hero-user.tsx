import Image, { StaticImageData } from "next/image";

type HeroProps = {
  h1: string;
  badges: string | React.JSX.Element[];
  excerpt: string | JSX.Element;
  services?: React.ReactNode;
  featuredImageSrc: string | StaticImageData;
  featuredImageAlt: string;
};

const HeroUser = ({
  h1,
  badges,
  excerpt,
  services,
  featuredImageSrc,
  featuredImageAlt,
}: HeroProps) => {
  return (
    <div className="flex flex-col mx-auto gap-2 sm:w-[70%]">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex flex-row items-center sm:w-[70%] gap-5 py-5 sm:py-10">
          <div className="w-[80px] h-[80px]  sm:w-[130px] sm:h-[130px]">
            <Image
              width={130}
              height={130}
              src={featuredImageSrc}
              alt={featuredImageAlt}
              style={{
                borderRadius: "100px",
              }}
            />
          </div>
          <div className="flex flex-col gap-1 capitalize">
            <h1 className="text-xl sm:text-5xl">{h1}</h1>
            <span className="flex flex-row items-center gap-2.5 text-1xl font-medium">
              {badges}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span>{services}</span>
        </div>
      </div>
      <div className="sm:max-w-[90%]">
        <span>{excerpt}</span>
      </div>
    </div>
  );
};

export default HeroUser;
