import Hero from "@/components/Hero";
import UserServices from "@/components/UserServices";
import QAndA from "@/components/QAndA";
import SidebarInterviewPage from "@/components/Sidebar-interviewPage";
import capitalize from "@/helpers/capitalize";
import { Metadata } from "next";
import { FAQPage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import { fetchData } from "@/utils/payloadFetch";
import {
  interviewPageRes,
  interviewSeoRes,
} from "../../../../../../../types/PageRes";
import { defaultImages } from "@/utils/defaultImages";
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
        badge {singularName pluralName seo{image{url}}}
        seo {title description image{url}}
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
              url
            }
          }
        }
        seo {
          slug
          image {
            url
          }
        }
        questions {
          question {
            shortQuestion
            mediumQuestion
            longQuestion
            seo{slug}
            answers {
              user {
                userName
                seo{slug  image {url}}
              }
              answer {
                richText_html
                images {image{url}}
                video{url}
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
    return "no answers";
  }

  const interview = data.data.BadgeInterview.docs[0];
  const user = data.data.InterviewUser.docs[0];
  const userBadge = data.data.InterviewUser.docs[0].userBadges.filter(
    (item) => item.badge.seo.slug == params.badge
  )[0];
  const pfp = user.seo.image?.url;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const userName = user.userName;
  const userSlug = params.user;
  const badgeSingularName = userBadge.badge.singularName;
  const interviewTitle = interview.name;
  const bio = userBadge.bio;
  const questions = interview.questions;

  const questionsList = questions.map((item) => {
    const question = item.question;
    const relevantAnswer = question.answers.filter(
      (answer) => answer.user.seo.slug == params.user
    )[0].answer;
    return {
      number: question.index,
      question: question.shortQuestion,
      slug: question.seo.slug,
      answer: {
        answers: {
          number: question.index,
          interviewAnswer: relevantAnswer.richText_html,
          images: relevantAnswer.images,
          video: relevantAnswer.video,
          otherUsersAmount: question.answers.length - 1,
        },
        seoTitle: "string",
        seoDescription: "string",
      },
    };
  });

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
          pfp: answer.user.seo.image.url,
          userBadgeSlug: badgeSlug,
        };
      });
  });

  const userDetails = {
    name: userName,
    userBio: userBadge.bio,
    slug: params.user,
    services: userBadge.services,
    pfp: pfp || null,
    singularName: userBadge.badge.singularName,
    badgeSlug: params.badge,
  };

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
        h1a={
          <>
            <div className="flex flex-rox items-center flex-wrap">
              we asked&nbsp;
              <InternalLink
                element={badgeSingularName}
                href={`/badge/${badgeSlug}`}
                target={badgeSingularName}
                eventName="ClickBadgeName"
                locationOnPage="hero"
              />
              &nbsp;
              <InternalLink
                element={`${userName} `}
                className="flex flex-rox items-center"
                href={`/user/${userSlug}`}
                target={userName}
                eventName="ClickUserName"
                locationOnPage="hero"
              />
            </div>
          </>
        }
        h1b={interviewTitle}
        excerpt={bio}
        featuredImageSrc={pfp || defaultImages.defaultUserImage}
        featuredImageAlt={interviewTitle}
        services={
          <UserServices
            services={userBadge.services}
            name={userName}
            badgeName={badgeSingularName}
          />
        }
        featuredImageUrl={`/user/${userSlug}`}
      />
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-20">
        <div className="md:max-w-[70%] flex flex-col">
          <QAndA
            questions={questionsList}
            userDetails={userDetails}
            interviewSlug={interviewSlug}
          />
        </div>
        <div>
          <SidebarInterviewPage
            questions={questionsList}
            otherUsers={otherUsers}
            interviewSlug={interviewSlug}
          />
        </div>
      </div>
    </>
  );
}
