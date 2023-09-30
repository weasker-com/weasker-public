import { getInterviewPage } from "../../../../../../../sanity/sanity-utils";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Hero from "@/components/Hero";
import UserServices from "@/components/UserServices";
import QAndA from "@/components/QAndA";
import Image from "next/image";
import SidebarInterviewPage from "@/components/Sidebar-interviewPage";
import Head from "next/head";
import logo from "@/../public/logo/tl-logo-17-09.svg";

type Props = {
  params: { badge: string; user: string; interview: string };
};

async function getData(userParam: string, interviewParam: string) {
  const res = await getInterviewPage(userParam, interviewParam);
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res;
}

export default async function Interview({ params }: Props) {
  const userParam = params.user;
  const interviewParam = params.interview;

  const data = await getData(userParam, interviewParam);

  if (!data) {
    return "no answers";
  }

  const featuredImage = data.user.pfp;
  const interviewSlug = interviewParam;
  const badgeImage = data.user.badges[0].image;
  const badgeSlug = data.user.badges[0].slug;
  const userName = data.user.name;
  const userSlug = data.user.slug;
  const userBadge = data.user.badges[0].singularName;
  const interviewTitle = data.interview.name;
  const bio = data.user.userBio;
  const pfp = data.user.pfp;
  const service = data.user.services[0].name;
  const serviceUrl = data.user.services[0].url;
  const otherUsers = data.otherUsers;
  const otherUsersAmount = data.otherUsers.length;
  const metaTitle = null;
  const metaDescription = null;

  return (
    <>
      <Head>
        <title className="capitalize">
          {metaTitle ? metaTitle : interviewTitle}
        </title>
        <meta
          name="description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${userBadge}, ${userName}, ${interviewTitle}`
          }
          key="desc"
        />
        <meta
          property="og:title"
          className="capitalize"
          content={metaTitle ? metaTitle : interviewTitle}
        />
        <meta
          property="og:description"
          content={
            metaDescription
              ? metaDescription
              : `We asked ${userBadge}, ${userName}, ${interviewTitle}`
          }
        />
        <meta property="og:image" content={pfp || logo} />
      </Head>
      <Hero
        h1a={
          <>
            <div className="md:flex flex-rox items-center flex-wrap hidden ">
              we asked&nbsp;
              <Link
                className="flex flex-rox items-center text-tl-dark-blue"
                href={`/badge/${badgeSlug}`}
              >
                {userBadge}
              </Link>
              &nbsp;
              <Link
                className="flex flex-rox items-center"
                href={`/user/${userSlug}`}
              >
                {userName}
              </Link>
            </div>
            <div className="flex flex-col md:hidden">
              <div>we asked</div>
              <div className="flex flex-row items-center gap-1 border rounded-xl shadow p-2 mt-2 ">
                {" "}
                <div className="min-w-[50px]">
                  <Link href={`/user/${userSlug}`}>
                    <Image
                      className="rounded-full"
                      src={featuredImage}
                      width={50}
                      height={50}
                      alt={userName}
                      style={{
                        objectFit: "cover",
                        width: "50px",
                        height: "50px",
                      }}
                    ></Image>
                  </Link>
                </div>
                <UserServices
                  services={data.user.services}
                  name={userName}
                  badgeName={userBadge}
                />
              </div>
            </div>
          </>
        }
        h1b={interviewTitle}
        excerpt={<PortableText value={bio} />}
        featuredImageSrc={featuredImage}
        featuredImageAlt="thelessen logo"
        services={
          <UserServices
            services={data.user.services}
            name={userName}
            badgeName={userBadge}
          />
        }
        featuredImageUrl={`/user/${userSlug}`}
      />
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-20">
        <div className="md:max-w-[70%] flex flex-col">
          <QAndA
            questions={data.questions}
            userDetails={data.user}
            interviewSlug={interviewSlug}
            otherUsersAmount={otherUsersAmount}
          />
        </div>
        <div>
          <SidebarInterviewPage
            questions={data.questions}
            otherUsers={otherUsers}
            interviewSlug={interviewSlug}
          />
        </div>
      </div>
    </>
  );
}
