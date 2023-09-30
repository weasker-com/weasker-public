import Image, { StaticImageData } from "next/image";

type HeroBadgePorps = {
  h1: string;
  excerpt: string | JSX.Element;
  featuredImageSrc: string | StaticImageData;
  featuredImageAlt: string;
};

const HeroBadge = ({
  h1,
  excerpt,
  featuredImageSrc,
  featuredImageAlt,
}: HeroBadgePorps) => {
  return (
    <div className="flex flex-col mx-auto gap-2 sm:w-[70%] ">
      <div className="flex flex-col sm:flex-row sm:items-center border rounded-xl shadow px-5 my-5">
        <div className="flex flex-row items-center gap-5 py-5 sm:py-10 ">
          <Image
            className="w-[80px] sm:w-[130px]"
            width={130}
            height={130}
            src={featuredImageSrc}
            alt={featuredImageAlt}
            style={{
              borderRadius: "100px",
            }}
          />

          <div className="flex flex-col gap-1 capitalize">
            <h1 className="capitalize flex flex-col sm:gap-2.5">
              <span className="text-lg sm:text-2xl font-semibold">Badge</span>
              <span className="text-xl sm:text-5xl">{h1}</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="">
        <p>{excerpt}</p>
      </div>
    </div>
  );
};

export default HeroBadge;
