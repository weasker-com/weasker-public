import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import {
  questionPageRes,
  questionSeoRes,
} from "../../../../../../../types/Responses";
import { fetchData } from "@/utils/payloadFetch";
import { defaultImages } from "@/utils/defaultImages";
const { convert } = require("html-to-text");
import { notFound } from "next/navigation";
import QuestionPage from "@/components/pages/QuestionPage";

type Props = {
  params: { badge: string; interview: string; question: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `
  {
    BadgeInterview(badgeSlug:"${params.badge}" interviewSlug:"${params.interview}")  {
      docs {
        name
        seo{image{url filename}}
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

  const data: questionSeoRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Questions",
    mustHave: ["BadgeInterview"],
  });

  if (!data) {
    return {};
  }

  const relevantQuestion = data.data.BadgeInterview.docs[0].questions.filter(
    (item) => item.question.seo.slug == params.question
  )[0];

  if (!relevantQuestion) {
    return {};
  }

  const seoTitle = relevantQuestion.question.seo.title;
  const seoDescription = relevantQuestion.question.seo.description;
  const interviewImageUrl = data.data.BadgeInterview.docs[0].seo.image?.url;
  const answersAmount = relevantQuestion.question.answers.length;
  const badgePluralName = data.data.BadgeInterview.docs[0].badge.pluralName;
  const shortQuestion = relevantQuestion.question.shortQuestion;
  const longQuestion = relevantQuestion.question.longQuestion;
  const questionImage =
    relevantQuestion.question.seo.image?.url ||
    interviewImageUrl ||
    defaultImages.weaskerLogoUrl;
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

  const ogImage = `/api/og?img=${questionImage}&preTitle=question for ${badgePluralName}&title=${shortQuestion}`;

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
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      siteId: "1743914690978164736",
      creator: process.env.SITE_NAME,
      creatorId: "1743914690978164736",
      images: [ogImage],
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
              index
              shortQuestion
              mediumQuestion
              longQuestion
              seo {
                slug
                image{url filename}
              }
              answers {
                user {
                  userName
                  seo {
                    slug
                    image{url filename}
                  }
                  userBadges{badge{seo{slug}}  services{name url}}
                }
                answer {
                  updatedAt
                  richText_html
                  images {
                    image {
                      filename
                      url
                    }
                  }
                  video {
                    filename
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

  const data: questionPageRes | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
    mustHave: ["BadgeInterview"],
  });

  if (!data) {
    return null;
  }

  return data;
}

export default async function Question({ params }: Props) {
  const data = await getData(params.badge, params.interview);

  if (!data) {
    notFound();
  }

  return <QuestionPage data={data} params={params} />;
}
