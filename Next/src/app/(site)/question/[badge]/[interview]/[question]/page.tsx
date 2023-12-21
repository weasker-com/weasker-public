import Hero from "@/components/Hero";
import AnswersList from "@/components/AnswersList";
import SidebarQuestionPage from "@/components/Sidebar-questionPage";
import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { QAPage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import {
  questionPageRes,
  questionSeoRes,
} from "../../../../../../../types/PageRes";
import { fetchData } from "@/utils/payloadFetch";
import { defaultImages } from "@/utils/defaultImages";
const { convert } = require("html-to-text");

type Props = {
  params: { badge: string; interview: string; question: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    BadgeInterview(badgeSlug:"${params.badge}" interviewSlug:"${params.interview}")  {
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
          image {
            url
          }
        }
        questions {
          question {
            shortQuestion
            longQuestion
            answers{user{userName seo{slug}}}
            seo {
              title
              description
              slug
              image {
                url
              }
            }
          }
        }
      }
    }
    }
  `;

  const data: questionSeoRes | null = await fetchData(
    query,
    "POST",
    "Questions",
    "BadgeInterview"
  );

  if (!data) {
    return {};
  }

  const relevantQuestion = data.data.BadgeInterview.docs[0].questions.filter(
    (item) => item.question.seo.slug == params.question
  )[0];
  const seoTitle = relevantQuestion.question.seo.title;
  const seoDescription = relevantQuestion.question.seo.description;
  const answersAmount = relevantQuestion.question.answers.length;
  const badgePluralName = data.data.BadgeInterview.docs[0].badge.pluralName;
  const shortQuestion = relevantQuestion.question.shortQuestion;
  const longQuestion = relevantQuestion.question.longQuestion;
  const questionImage = relevantQuestion.question.seo.image;
  const users = relevantQuestion.question.answers.map((item) => {
    const name = item.user.userName;
    const slug = item.user.seo.slug;
    return {
      name,
      slug,
    };
  });

  const metaTitle = capitalize(
    seoTitle
      ? seoTitle
      : `${answersAmount} ${badgePluralName}: ${shortQuestion}`
  );

  const metaDescription = seoDescription ? seoDescription : `${longQuestion}`;

  const ogImage = defaultImages.defaultOgImage;

  const authors = users.map((item, index) => {
    return { name: item.name, url: `https://www.weasker/user/${item.slug}` };
  });

  return {
    title: metaTitle,
    description: metaDescription,
    authors: authors,
    openGraph: {
      images: [ogImage],
      type: "website",
      url: `https://www.weasker.com/question/${params.badge}/${params.interview}/${params.question}`,
      title: metaTitle,
      description: metaDescription,
      siteName: process.env.SITE_NAME,
    },
  };
}

async function getData(badgeParam: string, interviewParam: string) {
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
              index
              shortQuestion
              mediumQuestion
              longQuestion
              seo {
                slug
                image{url}
              }
              answers {
                user {
                  userName
                  seo {
                    slug
                    image{url}
                  }
                  userBadges{badge{seo{slug}}  services{name url}}
                }
                answer {
                  richText_html
                  images {
                    image {
                      url
                    }
                  }
                  video {
                    url
                  }
                }
              }
              seo {
                slug
              }
            }
          }
        }
      }
    }
    `;

  const data: questionPageRes | null = await fetchData(
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

export default async function Question({ params }: Props) {
  const data = await getData(params.badge, params.interview);

  if (!data) {
    return "no question";
  }

  const interview = data.data.BadgeInterview.docs[0];
  const relevantQuestion = interview.questions.filter(
    (item) => item.question.seo.slug == params.question
  )[0].question;

  const answersAmount = relevantQuestion.answers.length;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const badgePLuralName = interview.badge.pluralName;
  const badgeSingularName = interview.badge.singularName;
  const badgeImage = interview.badge.seo.image?.url;
  const interviewImage = interview.seo.image?.url;
  const questionIndex = relevantQuestion.index;
  const shortQuestion = relevantQuestion.shortQuestion;
  const mediumQuestion = relevantQuestion.mediumQuestion;
  const longQuestion = relevantQuestion.longQuestion;
  const questionSlug = params.question;

  const answersList = relevantQuestion.answers.map((item) => {
    const userName = item.user.userName;
    const userSlug = item.user.seo.slug;
    const userBadge = item.user.userBadges.filter(
      (item) => item.badge.seo.slug == params.badge
    )[0];
    const userServices = userBadge.services;
    const userPfp = item.user.seo.image.url;
    const answerText = item.answer.richText_html;
    const answerImages = item.answer.images;
    const answerVideo = item.answer.video?.url;
    return {
      user: {
        name: userName,
        slug: userSlug,
        services: userServices,
        pfp: userPfp,
        singularName: badgeSingularName,
        badgeSlug: badgeSlug,
      },
      answer: {
        text: answerText,
        images: answerImages,
        number: questionIndex,
        video: answerVideo,
      },
    };
  });

  const otherUsers = relevantQuestion.answers.map((item) => {
    const name = item.user.userName;
    const slug = item.user.seo.slug;
    const pfp = item.user.seo.image.url;
    const userBadge = item.user.userBadges.filter(
      (item) => item.badge.seo.slug == params.badge
    )[0];
    const services = userBadge.services;

    return {
      name,
      slug,
      pfp,
      services,
    };
  });

  const siblingQuestions = interview.questions.map((item) => {
    const shortQuestion = item.question.shortQuestion;
    const slug = item.question.seo.slug;
    const image =
      item.question.seo.image?.url || interviewImage || badgeImage || null;

    return {
      shortQuestion,
      slug,
      image,
      badgeSlug,
      interviewSlug,
    };
  });

  const jsonLd: WithContext<QAPage> = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: mediumQuestion,
      text: longQuestion,
      answerCount: answersAmount,
      suggestedAnswer: relevantQuestion.answers.map((item, index) => {
        return {
          "@type": "Answer",
          text: convert(item.answer.richText_html),
          url: `https://www.weasker.com/question/${params.badge}/${interviewSlug}/${params.question}#${item.user.seo.slug}`,
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        services={badgePLuralName}
        h1a={
          <div className="flex flex-row items-center flex-wrap">
            we asked&nbsp;{answersAmount}&nbsp;
            <InternalLink
              element={answersAmount == 1 ? badgeSingularName : badgePLuralName}
              className="flex flex-rox items-center"
              href={`/badge/${badgeSlug}`}
              eventName="ClickBadgeName"
              target={badgePLuralName}
              locationOnPage="hero"
            />
          </div>
        }
        h1b={mediumQuestion}
        excerpt={longQuestion}
        featuredImageSrc={badgeImage || defaultImages.defaultQuestionImage}
        featuredImageAlt={`${badgePLuralName} answer: ${shortQuestion}`}
        featuredImageUrl={`/badge/${badgeSlug}`}
      />
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-20">
        <div className="md:max-w-[70%] flex flex-col gap-10">
          <AnswersList
            answers={answersList}
            questionSlug={questionSlug}
            interviewSlug={interviewSlug}
          />
        </div>
        <div>
          <SidebarQuestionPage
            users={otherUsers}
            otherQuestions={siblingQuestions}
          />
        </div>
      </div>
    </>
  );
}
