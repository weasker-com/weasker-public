import {
  getInterviewPage,
  getInterviewPageMeta,
} from "../../../../../../../sanity/sanity-utils";
import { PortableText, toPlainText } from "@portabletext/react";
import Link from "next/link";
import Hero from "@/components/Hero";
import UserServices from "@/components/UserServices";
import QAndA from "@/components/QAndA";
import Image from "next/image";
import SidebarInterviewPage from "@/components/Sidebar-interviewPage";
import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { FAQPage, WithContext } from "schema-dts";

type Props = {
  params: { badge: string; user: string; interview: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = await getInterviewPageMeta(params.user, params.interview);
  console.log(meta.interview);
  const metaTitle = capitalize(
    meta.interview.seoTitle
      ? meta.interview.seoTitle
      : `Interview with ${meta.interview.badgeSingularName} ${meta.user.name} - ${meta.interview.name}`
  );

  const metaDescription = meta.interview.seoDescription
    ? meta.interview.seoDescription
    : `${meta.interview.badgeSingularName} ${meta.user.name} took the interview ${meta.interview.name} for ${meta.interview.badgeName}`;

  const ogImage = meta.user.ogImage || meta.interview.ogImage;
  const slugA = params.badge;
  const slugB = params.user;
  const slugC = params.interview;

  const author = {
    name: meta.user.name,
    url: `https://www.weasker.com/user/${slugB}`,
  };

  return {
    title: metaTitle,
    description: metaDescription,
    authors: author,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/interview/${slugA}/${slugB}/${slugC}/`,
      title: metaTitle,
      description: metaDescription,
      siteName: "weasker",
    },
  };
}

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
  const badgeSlug = data.user.badges[0].slug;
  const userName = data.user.name;
  const userSlug = data.user.slug;
  const userBadge = data.user.badges[0].singularName;
  const interviewTitle = data.interview.name;
  const bio = data.user.userBio;
  const otherUsers = data.otherUsers;
  const otherUsersAmount = data.otherUsers.length;

  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.questions.map((item, index) => {
      return {
        "@type": "Question",
        name: item.mediumQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: toPlainText(item.answer.answers.interviewAnswer),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        featuredImageAlt="weasker logo"
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
