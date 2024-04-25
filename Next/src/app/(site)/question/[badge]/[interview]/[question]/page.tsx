import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { fetchData } from "@/utils/payloadFetch";
import { notFound } from "next/navigation";
import QuestionPage from "@/app/(site)/question/[badge]/[interview]/[question]/QuestionPage";
import {
  Interview,
  Media,
  User,
  UsersInterview,
} from "@/payload/payload-types";
import { defaultImages } from "@/utils/defaultImages";

type Props = {
  params: { badge: string; interview: string; question: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `{
    Interviews(
      where: {
        AND: [
          { seo__slug: {equals:"${params.interview}"} }
        ]
      }
    ) {
    docs {
            name
            id
            badge {
              terms
              id
              singularName
              pluralName
              seo {
                slug
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
                seo {
                  slug
                  image {
                    url
                    filename
                  }
                }
                seo {
                  slug
                }
              }
            }
          }
    }
    UsersInterviews(
      where: {
        AND: [
          {
            interviewSlug: {equals:"${params.interview}"},
          },
          {
            badgeSlug: {equals:"${params.badge}"},
          },
        ],
      }
    ) {
      docs {
          id
        interview{
          createdAt
          id
          name 
           seo {
              slug
              image {
                filename
                url
              }
            }
          questions{
            question{
               shortQuestion
                mediumQuestion
                longQuestion
                seo {
                  slug
                  image{url filename}
                }
            }
          }
        }
         badge {
              singularName
              pluralName
              seo {
                slug
                image {
                  filename
                  url
                }
              }
            }
        user {
          id
          userName
          seo {
            slug
            image {
              filename
              url
            }
          }
          userBadges {
            links {
              linkOne
              linkTwo
              linkThree
              linkFour
              linkFive
            }
            bio
            badge {
              singularName
              seo {
                slug
              }
            }
          }
        }
        answers {
          answer {
            updatedAt
            questionSlug
            images {
              image {
                id
                filename
                url
              }
            }
            textAnswer
            video{id filename url}
          }
        }
      }
    }
  }
  
    `;

  const data: {
    data: {
      UsersInterviews: { docs: UsersInterview[] };
      Interviews: { docs: Interview[] };
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "UsersInterviews",
    mustHave: ["Interviews"],
  });

  if (!data) {
    return {};
  }

  const interview = data.data.Interviews.docs[0];

  const relevantQuestion = interview.questions.filter((item) => {
    return item.question.seo.slug == params.question;
  })[0].question;

  const answers = data.data.UsersInterviews.docs.filter((item) => {
    return item.answers.some((item) => {
      return item.answer.questionSlug == params.question;
    });
  });

  if (!relevantQuestion) {
    return {};
  }

  const metaTitle =
    answers.length > 1
      ? capitalize(
          relevantQuestion.seo.title
            ? relevantQuestion.seo.title
            : `${relevantQuestion.mediumQuestion} | ${answers.length} Answers`
        )
      : capitalize(
          relevantQuestion.seo.title
            ? relevantQuestion.seo.title
            : `${relevantQuestion.mediumQuestion}`
        );

  const metaDescription = relevantQuestion.seo.description
    ? relevantQuestion.seo.description
    : `${relevantQuestion.longQuestion}`;

  const ogImage = `${process.env.SITE_URL}/api/og?img=${
    (relevantQuestion.seo?.image as Media)?.url ||
    (interview.seo.image as Media).url ||
    defaultImages.defaultQuestionImage
  }&title=${metaTitle}`;

  const authors = answers.map((item) => {
    const user = item.user as User;

    return {
      name: user.displayName || user.userName,
      url: `https://www.weasker/user/${item.userSlug}`,
    };
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
    Interviews(
      where: {
        AND: [
          { seo__slug: {equals:"${interviewParam}"} }
        ]
      }
    ) {
    docs {
            name
            id
            badge {
              terms
              id
              singularName
              pluralName
              seo {
                slug
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
                seo {
                  slug
                  image {
                    url
                    filename
                  }
                }
                seo {
                  slug
                }
              }
            }
          }
    }
    UsersInterviews(
      where: {
        AND: [
          {
            interviewSlug: {equals:"${interviewParam}"},
          },
          {
            badgeSlug: {equals:"${badgeParam}"},
          },
        ],
      }
    ) {
      docs {
          id
        interview{
          createdAt
          id
          name 
           seo {
              slug
              image {
                filename
                url
              }
            }
          questions{
            question{
               shortQuestion
                mediumQuestion
                longQuestion
                seo {
                  slug
                  image{url filename}
                }
            }
          }
        }
         badge {
              singularName
              pluralName
              seo {
                slug
                image {
                  filename
                  url
                }
              }
            }
        user {
          id
          userName
          seo {
            slug
            image {
              filename
              url
            }
          }
          userBadges {
            links {
              linkOne
              linkTwo
              linkThree
              linkFour
              linkFive
            }
            bio
            badge {
              singularName
              seo {
                slug
              }
            }
          }
        }
        answers {
          answer {
            updatedAt
            questionSlug
            images {
              image {
                id
                filename
              }
            }
            textAnswer
            video{id filename}
          }
        }
      }
    }
  }
    `;

  const data: {
    data: {
      UsersInterviews: { docs: UsersInterview[] };
      Interviews: { docs: Interview[] };
    };
  } | null = await fetchData({
    query,
    method: "POST",
    collection: "Interviews",
    mustHave: ["Interviews"],
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
