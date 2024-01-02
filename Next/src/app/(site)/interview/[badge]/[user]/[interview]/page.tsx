import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { FAQPage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import { fetchData } from "@/utils/payloadFetch";
import {
  interviewPageRes,
  interviewSeoRes,
} from "../../../../../../../types/Responses";
import { defaultImages } from "@/utils/defaultImages";
import Answer from "@/components/Answer";
import SidebarBox from "@/components/SidebarBox";
import Hero from "@/components/Hero";
import { IoLinkOutline } from "react-icons/io5";
import SocialShareButtons from "@/components/SocialShareButtons";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { PiShareFatThin } from "react-icons/pi";
import { LiaUserCheckSolid } from "react-icons/lia";
import { BsFileText } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import SubMenu from "@/components/SubMenu";
import { notFound } from "next/navigation";

const { convert } = require("html-to-text");

type Props = {
  params: { badge: string; user: string; interview: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    BadgeInterview(badgeSlug:"${params.badge}" interviewSlug:"${params.interview}") {
      docs {
        name
        badge {singularName pluralName seo{image{url filename}}}
        seo {title description image{url filename}}
      }
    }
    InterviewUser(slug:"${params.user}") {
      docs {
        userName
      }
    }
    }
  `;

  const data: interviewSeoRes | null = await fetchData(
    query,
    "POST",
    "Interviews",
    "BadgeInterview"
  );

  if (!data) {
    return {};
  }

  const interview = data.data.BadgeInterview.docs[0];
  const user = data.data.InterviewUser.docs[0];
  const seoTitle = interview.seo.title;
  const seoDescription = interview.seo.description;
  const userName = user.userName;
  const interviewName = interview.name;
  const badgeSingularName = interview.badge.singularName;
  const badgePluralName = interview.badge.pluralName;
  const interviewImage = interview.seo.image;

  const metaTitle = capitalize(
    seoTitle ? seoTitle : `${userName} ${interviewName}`
  );

  const metaDescription = seoDescription
    ? seoDescription
    : `${badgeSingularName} ${userName} took the interview ${interviewName} for ${badgePluralName}`;

  const ogImage = defaultImages.defaultOgImage;
  const slugA = params.badge;
  const slugB = params.user;
  const slugC = params.interview;

  const author = {
    name: userName,
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
      siteName: process.env.SITE_NAME,
    },
  };
}

async function getData(
  userParam: string,
  interviewParam: string,
  badgeParam: string
) {
  const query = `{
    BadgeInterview(
      badgeSlug: "${badgeParam}"
      interviewSlug: "${interviewParam}"
    ) {
      docs {
        name
        badge {
          singularName
          pluralName
          seo {
            image {
              filename
              url
            }
          }
        }
        seo {
          slug
          image {
            filename
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug image{url filename}}
            answers {
              user {
                userName
                seo{slug  image {url filename}}
              }
              answer {
                richText_html
                images {image{url filename}}
                video{url filename}
              }
            }
            seo {
              slug
            }
          }
        }
      }
    }
    InterviewUser(slug: "${userParam}") {
      docs {
        userName
        seo {
          slug
          image {
            filename
            url
          }
        }
        userBadges {
          services {
            name
            url
          }
          bio
          badge {
            singularName
            seo{
              slug
            }
          }
        }
      }
    }
  }`;

  const data: interviewPageRes | null = await fetchData(
    query,
    "POST",
    "Interviews",
    "BadgeInterview"
  );

  if (!data) {
    return null;
  }

  return data;
}

export default async function Interview({ params }: Props) {
  const data = await getData(params.user, params.interview, params.badge);

  if (!data) {
    notFound();
  }

  const interview = data.data.BadgeInterview.docs[0];
  const user = data.data.InterviewUser.docs[0];
  const userBadge = data.data.InterviewUser.docs[0].userBadges.filter(
    (item) => item.badge.seo.slug == params.badge
  )[0];
  const pfp = user.seo.image?.url || null;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const userName = user.userName;
  const userSlug = params.user;
  const badgePluralName = interview.badge.pluralName;
  const badgeSingularName = userBadge.badge.singularName;
  const badgeImage = interview.badge.seo.image?.url || null;
  const interviewTitle = interview.name;
  const bio = userBadge.bio;
  const questions = interview.questions;

  const uniqueUsers = new Set();
  const otherUsers = questions.flatMap((question) => {
    return question.question.answers
      .filter(
        (answer) =>
          !uniqueUsers.has(answer.user.seo.slug) &&
          answer.user.seo.slug !== params.user
      )
      .map((answer) => {
        uniqueUsers.add(answer.user.seo.slug);
        return {
          name: answer.user.userName,
          slug: answer.user.seo.slug,
          pfp: answer.user.seo.image.filename,
          userBadgeSlug: badgeSlug,
        };
      });
  });

  const subMenuArray = [
    {
      name: (
        <>
          <MdOutlineFormatListBulleted /> Questions
        </>
      ),
      slug: "questions",

      modal: (
        <SidebarBox
          title={"Questions"}
          array={questions.map((item) => {
            return {
              name: item.question.shortQuestion,
              url: `#${item.question.seo.slug}`,
              image:
                item.question.seo.image?.url ||
                data.data.BadgeInterview.docs[0].seo.image?.url ||
                defaultImages.defaultQuestionImage,
              eventName: "ClickQuestionPage",
            };
          })}
          itemsAmount={8}
        />
      ),
    },
    {
      name: (
        <>
          <PiShareFatThin /> Share
        </>
      ),
      slug: "share",

      modal: <SidebarBox title={"Share"} element={<SocialShareButtons />} />,
    },
    {
      name: (
        <>
          <LiaUserCheckSolid /> Contact
        </>
      ),
      slug: "contact",
      modal: (
        <SidebarBox
          title={`Contact ${userName}`}
          linkStyle="blue"
          array={userBadge.services.map((item) => {
            return {
              name: item.name,
              url: item.url,
              icon: <IoLinkOutline size={20} />,
              eventName: "ClickQuestionPage",
            };
          })}
        />
      ),
    },
    {
      name: (
        <>
          <BsFileText /> Bio
        </>
      ),
      slug: "bio",
      modal: (
        <SidebarBox
          title={"Bio"}
          element={
            <>
              {bio}
              <InternalLink
                style="blue"
                element={`${userName} user page`}
                href={`/user/${userSlug}`}
                eventName={"ClickUserName"}
                target={userName}
                locationOnPage={"bio box"}
              />
            </>
          }
        />
      ),
    },
    {
      name: (
        <>
          <MdOutlineAdd /> More
        </>
      ),
      slug: "more",
      modal: (
        <SidebarBox
          title={"More users answered this interview"}
          array={otherUsers.map((item) => {
            return {
              name: item.name,
              url: `/interview/${params.badge}/${item.slug}/${params.interview}/`,
              image: item.pfp || defaultImages.defaultQuestionImage,
              eventName: "ClickQuestionPage",
            };
          })}
          itemsAmount={8}
        />
      ),
    },
  ];

  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions
      .filter((item) => item.question.answers.length > 0)
      .map((item) => ({
        "@type": "Question",
        name: item.question.mediumQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: convert(
            item.question.answers.filter(
              (answer) => answer.user.seo.slug == params.user
            )[0].answer.richText_html
          ),
        },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        title={interviewTitle}
        preTitle={
          <>
            {badgeSingularName},&nbsp;
            <InternalLink
              element={userName}
              style={"inherit"}
              href={`/user/${userSlug}`}
              eventName={"ClickUserName"}
              target={userName}
              locationOnPage={"subTitle"}
            />
          </>
        }
        image={pfp}
        location={"interview"}
      />
      <SubMenu menu={subMenuArray} location={"interview"} />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
        <div className="lg:w-[70%] flex flex-col">
          {questions.map((item, index) => {
            const question = item.question;
            const relevantAnswer = question.answers.filter(
              (answer) => answer.user.seo.slug == params.user
            )[0].answer;
            return (
              <Answer
                index={index + 1}
                interviewSlug={params.interview}
                badgeSingularName={badgeSingularName}
                badgePluralName={badgePluralName}
                badgeSlug={badgeSlug}
                badgeImage={badgeImage}
                location={"interview"}
                questionText={item.question.shortQuestion}
                answerText={relevantAnswer.richText_html}
                images={relevantAnswer.images}
                video={relevantAnswer.video}
                questionSlug={question.seo.slug}
                otherUsersAmount={question.answers.length - 1}
                userName={userName}
                userSlug={params.user}
                services={userBadge.services}
                pfp={pfp}
              />
            );
          })}
        </div>
        <div className="lg:block hidden flex flex-col gap-2 w-[30%] text-sm">
          <SidebarBox
            title={"Bio"}
            element={
              <>
                {bio}
                <InternalLink
                  style="blue"
                  element={`${userName} user page`}
                  href={`/user/${userSlug}`}
                  eventName={"ClickUserName"}
                  target={userName}
                  locationOnPage={"bio box"}
                />
              </>
            }
          />
          <SidebarBox
            title={"Contact"}
            linkStyle="blue"
            array={userBadge.services.map((item) => {
              return {
                name: item.name,
                url: item.url,
                icon: <IoLinkOutline size={20} />,
                eventName: "ClickQuestionPage",
              };
            })}
          />
          <SidebarBox
            title={"Questions"}
            array={questions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `#${item.question.seo.slug}`,
                image:
                  item.question.seo.image?.url ||
                  data.data.BadgeInterview.docs[0].seo.image?.url ||
                  defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
          <SidebarBox
            title={"Also answered"}
            array={otherUsers.map((item) => {
              return {
                name: item.name,
                url: `/interview/${params.badge}/${item.slug}/${params.interview}/`,
                image: item.pfp || defaultImages.defaultQuestionImage,
                eventName: "ClickQuestionPage",
              };
            })}
            itemsAmount={8}
          />
        </div>
      </div>
    </>
  );
}
