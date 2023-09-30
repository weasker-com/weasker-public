import HeroBadge from "@/components/Hero-badge";
import { getBadgePage } from "../../../../../sanity/sanity-utils";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import logo from "@/../public/logo/tl-logo-17-09.svg";

type Props = {
  params: { badge: string };
};

async function getData(badgeParam: string) {
  const res = await getBadgePage(badgeParam);
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function Badge({ params }: Props) {
  const data = await getData(params.badge);

  if (!data) {
    return "no data";
  }

  const metaTitle = data.badgeDetails.seoTitle;
  const metaDescription = data.badgeDetails.seoDescription;
  const badgeName = data.badgeDetails.name;
  const badgeSingularName = data.badgeDetails.singularName;
  const usersAmount = data.usersDetails.length;
  const badgeImage = data.badgeDetails.image;

  return (
    <>
      <Head>
        <title className="capitalize">
          {metaTitle
            ? metaTitle
            : `We interviewed the ${usersAmount} best ${badgeName}`}
        </title>
        <meta
          name="description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${usersAmount} of the best ${badgeName} the same set of questions, read what each ${badgeSingularName} had to say.`
          }
          key="desc"
        />
        <meta
          property="og:title"
          className="capitalize"
          content={
            metaTitle
              ? metaTitle
              : `We interviewed the ${usersAmount} best ${badgeName}`
          }
        />
        <meta
          property="og:description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${usersAmount} ${badgeName} the same questions and compared their answers, read what each ${badgeSingularName} had to say.`
          }
        />
        <meta property="og:image" content={badgeImage || logo} />
      </Head>
      <div className="flex flex-col gap-5 sm:gap-10">
        <HeroBadge
          h1={data.badgeDetails.singularName}
          excerpt={data.badgeDetails.excerpt}
          featuredImageSrc={data.badgeDetails.image}
          featuredImageAlt={data.badgeDetails.name}
        />
        <div className="flex flex-col gap-5 sm:w-[70%] sm:mx-auto">
          <h2 className="capitalize">{data.badgeDetails.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.usersDetails.map((item, index) => (
              <div
                key={index}
                className="flex flex-row gap-3 sm:gap-5 items-center"
              >
                <Link href={`/user/${item.slug}`}>
                  <div className="w-[65px]">
                    <Image
                      width={65}
                      height={65}
                      src={item.image}
                      alt={item.name}
                      className="rounded-full"
                      style={{
                        objectFit: "cover",
                        width: "65px",
                        height: "65px",
                      }}
                    />
                  </div>
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={`/user/${item.slug}`}
                    className="text-base sm:text-xl font-semibold text-tl-dark-blue"
                  >
                    {item.name}
                  </Link>
                  <Link
                    className="flex flex-row text-tl-dark-blue"
                    href={item.services[0].url}
                  >
                    <div>{data.badgeDetails.singularName}</div>
                    &nbsp;at&nbsp;
                    <span className="text-tl-light-blue">
                      {item.services[0].name}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5 sm:w-[70%] sm:mx-auto">
          <h2 className="capitalize">we asked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.questions.map((item, index) => (
              <Link
                key={index}
                className="flex flex-row gap-3 sm:gap-5 items-center"
                href={`/question/${data.badgeDetails.slug}/${item.slug}`}
              >
                <Image
                  width={65}
                  height={65}
                  src={item.image}
                  alt={item.shortQuestion}
                  className="rounded-full"
                  style={{ objectFit: "cover", width: "65px", height: "65px" }}
                />
                <div className="flex flex-col">
                  <span className="text-tl-dark-blue text-xs font-light">
                    {data.badgeDetails.name}
                  </span>
                  <p>{item.shortQuestion}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
