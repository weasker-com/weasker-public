import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import HeroUser from "@/components/Hero-user";
import { User } from "../../../../../types/user-type";
import { getUserPage } from "../../../../../sanity/sanity-utils";
import UserServices from "@/components/UserServices";
import Head from "next/head";
import logo from "@/../public/logo/tl-logo-17-09.svg";

type Props = {
  params: { user: string };
};

async function getData(userParam: string) {
  const res = await getUserPage(userParam);
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function User({ params }: Props) {
  const userParam = params.user;

  const data = await getData(userParam);

  if (!data) {
    return "no question";
  }

  const metaTitle = data.seoTitle;
  const metaDescription = data.seoDescription;

  const userBadges = data.badges.map((item, index) => (
    <Link
      href={`/badge/${item.slug}`}
      className="flex flex-row items-center gap-1 text-tl-dark-blue"
      key={index}
    >
      <Image
        alt={item.name}
        className="w-[25px] sm:w-[35px]"
        width={35}
        height={35}
        src={item.image}
        style={{
          width: "35px",
          height: "35px",
          borderRadius: "100px",
        }}
      ></Image>
      {item.singularName}
    </Link>
  ));

  const userInterviews = data.interviews.map((item, index) => (
    <Link
      className="flex flex-row w-full gap-2 sm:gap-5 my-5 items-center capitalize"
      href={`/interview/${data.badges[0].slug}/${userParam}/${item.interview.slug}`}
    >
      <Image
        className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]"
        src={item.interview.image}
        alt={item.interview.name}
        width={65}
        height={65}
        style={{
          borderRadius: "100px",
        }}
      ></Image>

      <div className="flex flex-col">
        <span className="text-tl-dark-blue">{data.name}</span>
        <p>{item.interview.name}</p>
      </div>
    </Link>
  ));

  const userName = data.name;
  const badgeName = data.badges[0].name;
  const badgeSingularName = data.badges[0].singularName;
  const pfp = data.pfp;

  return (
    <>
      <Head>
        <title className="capitalize">
          {metaTitle
            ? metaTitle
            : `${badgeSingularName}, ${userName} answered our questions`}
        </title>
        <meta
          name="description"
          content={
            metaDescription
              ? metaDescription
              : `We interviewed ${badgeSingularName}, ${userName}. Click here to read his answers.`
          }
          key="desc"
        />
        <meta
          property="og:title"
          className="capitalize"
          content={
            metaTitle
              ? metaTitle
              : `${badgeSingularName}, ${userName} answered our questions`
          }
        />
        <meta
          property="og:description"
          content={
            metaDescription
              ? metaDescription
              : `We interviewed ${badgeSingularName}, ${userName}. Click here to read his answers.`
          }
        />
        <meta property="og:image" content={pfp || logo} />
      </Head>
      <HeroUser
        h1={data.name}
        badges={userBadges}
        services={<UserServices services={data.services} />}
        excerpt={<PortableText value={data.bio} />}
        featuredImageSrc={data.pfp}
        featuredImageAlt={data.name}
      />
      <div className="sm:w-[70%]">
        <h2>Interviews</h2>
        {userInterviews}
      </div>
    </>
  );
}
