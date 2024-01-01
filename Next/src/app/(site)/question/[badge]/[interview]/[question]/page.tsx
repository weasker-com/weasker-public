import { Metadata } from "next";
import capitalize from "@/helpers/capitalize";
import { QAPage, WithContext } from "schema-dts";
import { InternalLink } from "@/components/links/InternalLink";
import {
  questionPageRes,
  questionSeoRes,
} from "../../../../../../../types/Responses";
import { fetchData } from "@/utils/payloadFetch";
import { defaultImages } from "@/utils/defaultImages";
import Answer from "@/components/Answer";
import SidebarBox from "@/components/SidebarBox";
import Hero from "@/components/Hero";
import SocialShareButtons from "@/components/SocialShareButtons";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { PiShareFatThin } from "react-icons/pi";
import { BsFileText } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import SubMenu from "@/components/SubMenu";
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

  const otherQuestions = interview.questions.filter(
    (item) => item.question.seo.slug !== params.question
  );

  const answersAmount = relevantQuestion.answers.length;
  const interviewSlug = params.interview;
  const badgeSlug = params.badge;
  const badgePluralName = interview.badge.pluralName;
  const badgeSingularName = interview.badge.singularName;
  const badgeImage = interview.badge.seo.image?.url || null;
  const interviewImage = interview.seo.image?.filename || null;
  const questionIndex = relevantQuestion.index;
  const questionImage = relevantQuestion.seo.image?.filename || null;
  const shortQuestion = relevantQuestion.shortQuestion;
  const mediumQuestion = relevantQuestion.mediumQuestion;
  const longQuestion = relevantQuestion.longQuestion;

  const answersList = relevantQuestion.answers.map((item) => {
    const userName = item.user.userName;
    const userSlug = item.user.seo.slug;
    const userBadge = item.user.userBadges.filter(
      (item) => item.badge.seo.slug == params.badge
    )[0];
    const userServices = userBadge.services;
    const userPfp = item.user.seo.image.filename;
    const answerText = item.answer.richText_html;
    const answerImages = item.answer.images;
    const answerVideo = item.answer.video;
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

  const subMenuArray = [
    {
      name: (
        <>
          <MdOutlineFormatListBulleted /> Answers
        </>
      ),
      slug: "answers",
      modal: (
        <SidebarBox
          title={`Answers`}
          array={answersList.map((item) => {
            return {
              name: item.user.name,
              url: `#${item.user.slug}`,
              image: item.user.pfp || defaultImages.defaultUserImage,
              eventName: "ClickUserName",
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
          <BsFileText /> Excerpt
        </>
      ),
      slug: "excerpt",
      modal: <SidebarBox title={"Excerpt"} element={<>{longQuestion}</>} />,
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
          title={`More questions`}
          array={otherQuestions.map((item) => {
            return {
              name: item.question.shortQuestion,
              url: `/question/${params.badge}/${params.interview}//${item.question.seo.slug}/`,
              image:
                item.question.seo.image?.url ||
                interview.seo.image?.url ||
                defaultImages.defaultQuestionImage,
              eventName: "ClickQuestionPage",
            };
          })}
          itemsAmount={8}
        />
      ),
    },
  ];

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
        title={mediumQuestion}
        preTitle={
          <>
            Question for&nbsp;
            <InternalLink
              element={badgePluralName}
              style={"inherit"}
              href={`/badge/${badgeSlug}`}
              eventName={"ClickBadgeName"}
              target={badgePluralName}
              locationOnPage={"subTitle"}
            />
            &nbsp;
          </>
        }
        image={questionImage || interviewImage}
        location={"interview"}
      />
      <SubMenu menu={subMenuArray} location={"question"} />
      <div className="flex flex-col sm:flex-row gap-3 max-w-[1000px] mt-2">
        <div className="lg:w-[70%] flex flex-col">
          {answersList.map((item, index) => {
            return (
              <Answer
                index={index}
                interviewSlug={params.interview}
                badgeSingularName={badgeSingularName}
                badgePluralName={badgePluralName}
                badgeSlug={badgeSlug}
                badgeImage={badgeImage}
                location={"question"}
                questionText={shortQuestion}
                answerText={item.answer.text}
                images={item.answer.images}
                video={item.answer.video}
                questionSlug={params.question}
                otherUsersAmount={answersAmount}
                userName={item.user.name}
                userSlug={item.user.slug}
                services={item.user.services}
                pfp={item.user.pfp}
              />
            );
          })}
        </div>
        <div className="lg:block hidden lg:w-[30%] text-sm">
          <SidebarBox title={"Excerpt"} element={<>{longQuestion}</>} />
          <SidebarBox
            title={`Answers`}
            array={answersList.map((item) => {
              return {
                name: item.user.name,
                url: `#${item.user.slug}`,
                image: item.user.pfp || defaultImages.defaultUserImage,
                eventName: "ClickUserName",
              };
            })}
            itemsAmount={8}
          />
          <SidebarBox
            title={`Similar questions`}
            array={otherQuestions.map((item) => {
              return {
                name: item.question.shortQuestion,
                url: `/question/${params.badge}/${params.interview}//${item.question.seo.slug}/`,
                image:
                  item.question.seo.image?.url ||
                  interview.seo.image?.url ||
                  defaultImages.defaultQuestionImage,
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
